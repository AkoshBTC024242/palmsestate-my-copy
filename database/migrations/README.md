
# PALMS ESTATE SETTINGS FIX GUIDE
========================================

## 🔍 ISSUE IDENTIFIED

Your Settings pages (both user and admin) are trying to access database tables that don't exist yet:
- `user_settings` table (for user dashboard settings)
- `system_settings` table (for admin configuration)

## ✅ THE FIX

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard/project/hnruxtddkfxsoulskbyr
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Migration SQL

Copy and paste the contents of `00_complete_setup.sql` into the SQL editor and click "Run".

This will create:
- ✅ user_settings table with proper columns
- ✅ system_settings table with proper columns
- ✅ Row Level Security (RLS) policies for both tables
- ✅ Indexes for performance
- ✅ Auto-update triggers for timestamps
- ✅ Default system settings row

### Step 3: Verify the Setup

Run these verification queries in Supabase SQL Editor:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_settings', 'system_settings');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_settings', 'system_settings');

-- Verify system_settings has default row
SELECT * FROM public.system_settings;
```

### Step 4: Test Your Application

1. Log in to your application
2. Go to Dashboard → Settings
3. Try changing a setting and save
4. If you're an admin, go to Admin → Settings
5. Verify settings are saved and loaded correctly

## 📋 DATABASE SCHEMA CREATED

### user_settings table:
```
- user_id (uuid, PRIMARY KEY, references auth.users)
- email_notifications (boolean, default: true)
- push_notifications (boolean, default: false)
- marketing_emails (boolean, default: false)
- dark_mode (boolean, default: false)
- language (text, default: 'en')
- two_factor_auth (boolean, default: false)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### system_settings table:
```
- id (integer, PRIMARY KEY, always = 1)
- settings (jsonb) - stores all system configuration
- test_mode (jsonb) - stores test mode settings
- created_at (timestamptz)
- updated_at (timestamptz)
- updated_by (text)
```

## 🔒 SECURITY

RLS (Row Level Security) is enabled with these policies:

**user_settings:**
- Users can only see/edit their own settings
- Uses auth.uid() to enforce user isolation

**system_settings:**
- All authenticated users can view
- Only admins can insert/update
- Checks user_roles table for admin status

## 🚨 TROUBLESHOOTING

### Issue: "relation user_settings does not exist"
→ Run the migration SQL in Step 2

### Issue: "permission denied for table user_settings"
→ Check RLS policies are created correctly

### Issue: "Admin settings not saving"
→ Ensure your user has admin role in user_roles table

### Issue: "Settings page loading forever"
→ Check browser console for errors
→ Verify Supabase environment variables are set

## 📝 NOTES

- The system_settings table is designed for a single row (id=1) to store global configuration
- Test mode settings allow admins to bypass payments for testing
- All timestamps are automatically managed with triggers
- Settings are JSONB for flexibility in adding new configurations

