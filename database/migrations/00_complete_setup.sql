-- Complete Database Setup for Settings
-- Run this in Supabase SQL Editor
-- Created: 2026-01-02 21:07:23

-- ============================================
-- 1. CREATE USER_SETTINGS TABLE
-- ============================================

-- Migration: Create user_settings table
-- Purpose: Store user-specific dashboard settings
-- Created: 2026-01-02 21:07:23

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT false,
    dark_mode BOOLEAN DEFAULT false,
    language TEXT DEFAULT 'en',
    two_factor_auth BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for user_settings
-- Policy: Users can view their own settings
CREATE POLICY "Users can view own settings"
    ON public.user_settings
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own settings  
CREATE POLICY "Users can insert own settings"
    ON public.user_settings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own settings
CREATE POLICY "Users can update own settings"
    ON public.user_settings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own settings
CREATE POLICY "Users can delete own settings"
    ON public.user_settings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id 
    ON public.user_settings(user_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_settings_updated_at_trigger
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_settings_updated_at();

-- Grant permissions
GRANT ALL ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;

COMMENT ON TABLE public.user_settings IS 'Stores user-specific dashboard settings and preferences';


-- ============================================
-- 2. CREATE SYSTEM_SETTINGS TABLE
-- ============================================

-- Migration: Create system_settings table
-- Purpose: Store global system configuration and admin settings
-- Created: 2026-01-02 21:07:23

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    settings JSONB DEFAULT '{
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
        "date_format": "MM/DD/YYYY",
        "enable_test_mode": false,
        "stripe_test_mode": false
    }'::jsonb,
    test_mode JSONB DEFAULT '{
        "enabled": false,
        "skip_payments": false,
        "auto_approve_applications": false,
        "disable_email_notifications": false
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT,
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for system_settings
-- Policy: Everyone can view system settings (for public settings like site name)
CREATE POLICY "Anyone can view system settings"
    ON public.system_settings
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only admins can update system settings
-- Note: You'll need to check user_roles table for admin status
CREATE POLICY "Admins can update system settings"
    ON public.system_settings
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Policy: Only admins can insert system settings
CREATE POLICY "Admins can insert system settings"
    ON public.system_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create index
CREATE INDEX IF NOT EXISTS idx_system_settings_id 
    ON public.system_settings(id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER system_settings_updated_at_trigger
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_system_settings_updated_at();

-- Insert default settings row (only one row allowed due to constraint)
INSERT INTO public.system_settings (id) 
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Grant permissions
GRANT SELECT ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;

COMMENT ON TABLE public.system_settings IS 'Stores global system configuration and admin settings (single row)';


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created successfully
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('user_settings', 'system_settings');

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('user_settings', 'system_settings')
ORDER BY tablename, policyname;

-- Verify system_settings default row
SELECT * FROM public.system_settings;
