-- Palms Estate Database Setup Script
-- Run this in your Supabase SQL Editor to create/update required tables

-- 1. Create user_settings table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT false,
    dark_mode BOOLEAN DEFAULT false,
    language VARCHAR(10) DEFAULT 'en',
    two_factor_auth BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Create system_settings table for admin (if not exists)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    settings JSONB DEFAULT '{}'::jsonb,
    test_mode JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 3. Enable Row Level Security (RLS) on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for user_settings
-- Allow users to read their own settings
CREATE POLICY "Users can read own settings"
ON public.user_settings
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own settings
CREATE POLICY "Users can insert own settings"
ON public.user_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own settings
CREATE POLICY "Users can update own settings"
ON public.user_settings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own settings
CREATE POLICY "Users can delete own settings"
ON public.user_settings
FOR DELETE
USING (auth.uid() = user_id);

-- 5. Create RLS policies for system_settings (admin only)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can read system settings
CREATE POLICY "Admins can read system settings"
ON public.system_settings
FOR SELECT
USING (is_admin());

-- Admin can update system settings
CREATE POLICY "Admins can update system settings"
ON public.system_settings
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- 7. Create trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Insert default system settings if not exists
INSERT INTO public.system_settings (id, settings, test_mode)
VALUES (
    1,
    '{
        "site_name": "Palms Estate",
        "site_description": "Premium Luxury Rentals",
        "contact_email": "admin@palmsestate.org",
        "support_phone": "+1 (828) 623-9765",
        "maintenance_mode": false,
        "enable_registration": true,
        "require_email_verification": true,
        "default_user_role": "user",
        "currency": "USD",
        "timezone": "UTC",
        "date_format": "MM/DD/YYYY"
    }'::jsonb,
    '{
        "enabled": false,
        "skip_payments": false,
        "auto_approve_applications": false,
        "disable_email_notifications": false
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully!' AS status;
