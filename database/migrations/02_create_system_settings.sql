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
