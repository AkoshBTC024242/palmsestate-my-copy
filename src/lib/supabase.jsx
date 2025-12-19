import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ Set' : '❌ Missing',
  key: supabaseAnonKey ? '✅ Set' : '❌ Missing'
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test 1: Basic auth capabilities
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth connection failed:', authError.message);
      return false;
    }
    
    console.log('✅ Auth service connected');
    
    // Test 2: Check if properties table exists
    const { data: tableData, error: tableError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    if (tableError && tableError.code === 'PGRST116') {
      console.log('📝 Properties table does not exist yet - this is OK for now');
    } else if (tableError) {
      console.error('❌ Table access error:', tableError.message);
    } else {
      console.log(`✅ Properties table accessible (${tableData?.length || 0} rows)`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
};
