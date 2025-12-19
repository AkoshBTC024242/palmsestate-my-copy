import { supabase } from '../lib/supabase';

export async function runSupabaseTests() {
  console.log('🔧 Starting Supabase Tests...');
  
  // Test 1: Check if we can connect to Supabase
  console.log('1️⃣ Testing basic connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('Auth session:', data?.session ? 'Exists' : 'None');
    console.log('Auth error:', error?.message || 'None');
  } catch (err) {
    console.error('Auth test failed:', err);
  }

  // Test 2: Try to fetch properties
  console.log('2️⃣ Testing properties fetch...');
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .limit(2);
    
    console.log('Properties found:', data?.length || 0);
    console.log('Properties error:', error?.message || 'None');
    
    if (data && data.length > 0) {
      console.log('Sample property:', data[0]);
    }
  } catch (err) {
    console.error('Properties test failed:', err);
  }

  // Test 3: Check table structure
  console.log('3️⃣ Checking database structure...');
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('column_name, data_type')
      .limit(0);
    
    console.log('Structure error:', error?.message || 'None');
  } catch (err) {
    console.error('Structure test failed:', err);
  }

  console.log('✅ Supabase tests completed');
}