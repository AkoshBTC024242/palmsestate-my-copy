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
