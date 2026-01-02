// src/lib/supabase.js - FIXED VERSION
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.error('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  // Provide sample values for debugging
  console.info('Expected format:');
  console.info('VITE_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co');
  console.info('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
}

// CORRECT Supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'palmsestate-auth-token',
    signUp: {
      confirm: true,
      emailRedirectTo: window.location.origin + '/dashboard',
    },
  }
  // DO NOT set global headers! Let Supabase handle auth headers automatically
});

// Test function to verify authentication
export const testAuthConnection = async () => {
  try {
    console.log('🔍 Testing auth connection...');
    
    // Get current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('Session data:', sessionData);
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return { success: false, error: sessionError.message };
    }
    
    if (!sessionData.session) {
      console.warn('⚠️ No active session found');
      return { success: false, error: 'No active session' };
    }
    
    console.log('✅ Active session found for user:', sessionData.session.user.email);
    
    // Test RLS by trying to access profiles
    console.log('🔍 Testing RLS access...');
    
    const testData = {
      id: sessionData.session.user.id,
      email: sessionData.session.user.email,
      first_name: 'RLS Test',
      last_name: 'User',
      updated_at: new Date().toISOString()
    };
    
    console.log('Attempting to save test profile...');
    
    const { data: upsertData, error: upsertError } = await supabase
      .from('profiles')
      .upsert(testData, { 
        onConflict: 'id',
        returning: 'minimal'
      });
    
    if (upsertError) {
      console.error('❌ RLS test failed:', upsertError);
      console.error('Error code:', upsertError.code);
      console.error('Error message:', upsertError.message);
      console.error('Error details:', upsertError.details);
      console.error('Error hint:', upsertError.hint);
      
      return { 
        success: false, 
        error: upsertError.message,
        code: upsertError.code,
        details: upsertError.details
      };
    }
    
    console.log('✅ RLS test passed! Profile saved successfully.');
    console.log('Upsert result:', upsertData);
    
    return { 
      success: true, 
      message: 'Auth and RLS working correctly',
      user: sessionData.session.user
    };
    
  } catch (error) {
    console.error('❌ Test auth connection crashed:', error);
    return { 
      success: false, 
      error: error.message,
      stack: error.stack 
    };
  }
};

// ============ PROFILE FUNCTIONS ============
export const saveUserProfile = async (userId, profileData) => {
  try {
    console.log('💾 Saving profile for user:', userId);
    
    const updates = {
      id: userId,
      email: profileData.email || '',
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
      phone: profileData.phone || null,
      address: profileData.address || null,
      date_of_birth: profileData.date_of_birth || null,
      avatar_url: profileData.avatar_url || null,
      updated_at: new Date().toISOString()
    };
    
    console.log('Profile updates:', updates);
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert(updates, { 
        onConflict: 'id',
        returning: 'representation'
      });
    
    if (error) {
      console.error('❌ Profile save error:', error);
      throw error;
    }
    
    console.log('✅ Profile saved successfully:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Profile save failed:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};

export const loadUserProfile = async (userId) => {
  try {
    console.log('📥 Loading profile for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No profile found (new user)');
        return { success: true, data: null, isNew: true };
      }
      throw error;
    }
    
    console.log('✅ Profile loaded:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Profile load failed:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};

// ============ APPLICATION FUNCTIONS ============
export const submitApplication = async (applicationData) => {
  console.log('📝 Submitting application:', applicationData);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id || null;
    
    const requiredFields = ['property_id', 'full_name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const propertyId = parseInt(applicationData.property_id);
    if (isNaN(propertyId)) {
      throw new Error(`Invalid property ID: ${applicationData.property_id}. Must be a number.`);
    }
    
    const referenceNumber = 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const payload = {
      property_id: propertyId,
      full_name: applicationData.full_name || '',
      email: applicationData.email || '',
      phone: applicationData.phone || '',
      user_id: currentUserId,
      property_title: applicationData.property_title || null,
      message: applicationData.message || applicationData.notes || null,
      preferred_date: applicationData.preferred_tour_date || applicationData.preferred_date || null,
      application_type: applicationData.application_type || 'rental',
      status: applicationData.status || 'submitted',
      application_fee: 50.00,
      fee_status: 'unpaid',
      payment_status: 'pending',
      notes: applicationData.notes || applicationData.message || null,
      employment_status: applicationData.employment_status || 'not_specified',
      monthly_income: parseInt(applicationData.monthly_income) || 0,
      has_pets: Boolean(applicationData.has_pets) || false,
      pet_details: applicationData.pet_details || '',
      occupants: parseInt(applicationData.occupants) || 1,
      preferred_tour_date: applicationData.preferred_tour_date || applicationData.preferred_date || null,
      first_name: applicationData.first_name || '',
      last_name: applicationData.last_name || '',
      reference_number: referenceNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('applications')
      .insert([payload])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database error:', error);
      
      const minimalPayload = {
        property_id: propertyId,
        full_name: applicationData.full_name || '',
        email: applicationData.email || '',
        phone: applicationData.phone || '',
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: minimalData, error: minimalError } = await supabase
        .from('applications')
        .insert([minimalPayload])
        .select()
        .single();
        
      if (minimalError) {
        throw new Error(`RLS blocked: ${minimalError.message}`);
      }
      
      return { success: true, data: minimalData, minimal: true };
    }
    
    return { success: true, data, referenceNumber };
    
  } catch (error) {
    console.error('❌ Application submission failed:', error);
    return { 
      success: false, 
      error: error.message,
      userMessage: 'Please check your information and try again.'
    };
  }
};

// ... keep the rest of your existing functions (fetchProperties, etc.) ...

// ============ UTILITY FUNCTIONS ============
export const checkCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    hasSession: !!session,
    user: session?.user || null,
    userId: session?.user?.id || null
  };
};

export const refreshAuthSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('❌ Session refresh failed:', error);
    return { success: false, error: error.message };
  }
};
