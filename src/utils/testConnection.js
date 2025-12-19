import { supabase } from '../lib/supabase';

export async function testSupabaseConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase.from('properties').select('*').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Properties table has', data?.length || 0, 'rows');
    
    // Test 2: Auth capabilities
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (!authError) {
      console.log('✅ Auth service is available');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSupabaseConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}