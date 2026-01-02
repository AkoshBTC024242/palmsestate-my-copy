-- Migration: Create user_roles table
-- Purpose: Manage user roles and permissions for RBAC
-- Created: 2026-01-02 23:38

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    test_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_role CHECK (role IN ('user', 'admin', 'moderator'))
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own role
CREATE POLICY "Users can view own role"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Only admins can insert roles
CREATE POLICY "Admins can insert roles"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- RLS Policy: Only admins can update roles
CREATE POLICY "Admins can update roles"
    ON public.user_roles
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id 
    ON public.user_roles(user_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_role 
    ON public.user_roles(role);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_roles_updated_at_trigger
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_roles_updated_at();

-- Grant permissions
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

COMMENT ON TABLE public.user_roles IS 'Stores user roles and permissions for role-based access control';

-- Verification query
SELECT 
    'user_roles table created successfully' as status,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_name = 'user_roles';
