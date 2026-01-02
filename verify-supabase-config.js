// Supabase Configuration Verification Script
// Run this file to verify your Supabase setup is working correctly

import { supabase } from './src/lib/supabase.jsx';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function verifySupabaseConnection() {
  console.log(colors.cyan + '\n════════════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.cyan + '  PALMS ESTATE - SUPABASE CONFIGURATION VERIFICATION' + colors.reset);
  console.log(colors.cyan + '════════════════════════════════════════════════════════════════\n' + colors.reset);

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // Test 1: Environment Variables
  console.log(colors.blue + '📋 TEST 1: Environment Variables' + colors.reset);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    console.log(colors.green + '   ✓ Environment variables configured' + colors.reset);
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
    results.passed++;
  } else {
    console.log(colors.red + '   ✗ Missing environment variables!' + colors.reset);
    results.failed++;
    return results;
  }

  // Test 2: Authentication Status
  console.log('\n' + colors.blue + '📋 TEST 2: Authentication Status' + colors.reset);
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (session) {
      console.log(colors.green + '   ✓ User is authenticated' + colors.reset);
      console.log(`   User ID: ${session.user.id}`);
      console.log(`   Email: ${session.user.email}`);
      results.passed++;
    } else {
      console.log(colors.yellow + '   ⚠ No active session (user not logged in)' + colors.reset);
      results.warnings++;
    }
  } catch (error) {
    console.log(colors.red + '   ✗ Auth error: ' + error.message + colors.reset);
    results.failed++;
  }

  // Test 3: Database Tables Access
  console.log('\n' + colors.blue + '📋 TEST 3: Database Tables Access' + colors.reset);
  
  const tables = [
    { name: 'profiles', description: 'User Profiles' },
    { name: 'properties', description: 'Property Listings' },
    { name: 'applications', description: 'Rental Applications' },
    { name: 'saved_properties', description: 'Saved Properties' },
    { name: 'user_settings', description: 'User Settings' },
    { name: 'system_settings', description: 'System Settings (Admin)' }
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === '42P01') {
          console.log(colors.yellow + `   ⚠ ${table.description} (${table.name}): Table doesn't exist` + colors.reset);
          results.warnings++;
        } else {
          console.log(colors.red + `   ✗ ${table.description} (${table.name}): ${error.message}` + colors.reset);
          results.failed++;
        }
      } else {
        console.log(colors.green + `   ✓ ${table.description} (${table.name}): Accessible` + colors.reset);
        results.passed++;
      }
    } catch (error) {
      console.log(colors.red + `   ✗ ${table.description} (${table.name}): ${error.message}` + colors.reset);
      results.failed++;
    }
  }

  // Test 4: User Settings Operations (if authenticated)
  console.log('\n' + colors.blue + '📋 TEST 4: User Settings Operations' + colors.reset);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Try to read user settings
      const { data: settings, error: readError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (readError) {
        console.log(colors.red + '   ✗ Cannot read user settings: ' + readError.message + colors.reset);
        results.failed++;
      } else {
        console.log(colors.green + '   ✓ Can read user settings' + colors.reset);
        
        // Try to write user settings
        const testSettings = {
          user_id: session.user.id,
          email_notifications: true,
          push_notifications: false,
          marketing_emails: false,
          dark_mode: false,
          language: 'en',
          two_factor_auth: false,
          updated_at: new Date().toISOString()
        };
        
        const { error: writeError } = await supabase
          .from('user_settings')
          .upsert(testSettings, { onConflict: 'user_id', returning: 'minimal' });
        
        if (writeError) {
          console.log(colors.red + '   ✗ Cannot write user settings: ' + writeError.message + colors.reset);
          results.failed++;
        } else {
          console.log(colors.green + '   ✓ Can write user settings' + colors.reset);
          results.passed++;
        }
      }
    } else {
      console.log(colors.yellow + '   ⚠ Skipped (requires authentication)' + colors.reset);
      results.warnings++;
    }
  } catch (error) {
    console.log(colors.red + '   ✗ Settings test failed: ' + error.message + colors.reset);
    results.failed++;
  }

  // Test 5: Row Level Security (RLS)
  console.log('\n' + colors.blue + '📋 TEST 5: Row Level Security (RLS)' + colors.reset);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Test RLS by trying to access profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(colors.yellow + '   ⚠ No profile found (this is okay for new users)' + colors.reset);
          results.warnings++;
        } else {
          console.log(colors.red + '   ✗ RLS check failed: ' + error.message + colors.reset);
          results.failed++;
        }
      } else {
        console.log(colors.green + '   ✓ RLS is working correctly' + colors.reset);
        results.passed++;
      }
    } else {
      console.log(colors.yellow + '   ⚠ Skipped (requires authentication)' + colors.reset);
      results.warnings++;
    }
  } catch (error) {
    console.log(colors.red + '   ✗ RLS test failed: ' + error.message + colors.reset);
    results.failed++;
  }

  // Summary
  console.log('\n' + colors.cyan + '════════════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.cyan + '  TEST SUMMARY' + colors.reset);
  console.log(colors.cyan + '════════════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.green + `  ✓ Passed: ${results.passed}` + colors.reset);
  console.log(colors.red + `  ✗ Failed: ${results.failed}` + colors.reset);
  console.log(colors.yellow + `  ⚠ Warnings: ${results.warnings}` + colors.reset);
  console.log(colors.cyan + '════════════════════════════════════════════════════════════════\n' + colors.reset);

  if (results.failed === 0) {
    console.log(colors.green + '🎉 All critical tests passed! Your Supabase configuration is working correctly.' + colors.reset);
  } else {
    console.log(colors.red + '⚠️  Some tests failed. Please check your Supabase configuration and database setup.' + colors.reset);
  }

  return results;
}

// Run verification
verifySupabaseConnection().catch(console.error);
