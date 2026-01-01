// src/lib/supabase.js - UPDATED VERSION
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set (hidden)' : 'Missing');
}

// Create Supabase client with proper configuration FOR EMAIL VERIFICATION
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
      emailRedirectTo: 'https://palmsestate.org/dashboard',
    },
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
});

// UPDATED: Function to submit application with proper data type handling
export const submitApplication = async (applicationData) => {
  console.log('📝 Submitting application:', applicationData);
  
  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id || null;
    
    console.log('Current user ID:', currentUserId);
    
    // Validate required fields
    const requiredFields = ['property_id', 'full_name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // CRITICAL FIX: Convert property_id to number
    const propertyId = parseInt(applicationData.property_id);
    if (isNaN(propertyId)) {
      throw new Error(`Invalid property ID: ${applicationData.property_id}. Must be a number.`);
    }
    
    // Generate a reference number
    const referenceNumber = 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Build the data object with proper data types
    const applicationPayload = {
      // CRITICAL: property_id must be a number (bigint)
      property_id: propertyId,
      
      // User info
      user_id: currentUserId,
      full_name: applicationData.full_name || '',
      email: applicationData.email || '',
      phone: applicationData.phone || '',
      
      // Optional fields with defaults
      first_name: applicationData.first_name || '',
      last_name: applicationData.last_name || '',
      employment_status: applicationData.employment_status || 'not_specified',
      monthly_income: parseInt(applicationData.monthly_income) || 0,
      occupants: parseInt(applicationData.occupants) || 1,
      has_pets: Boolean(applicationData.has_pets) || false,
      pet_details: applicationData.pet_details || '',
      preferred_tour_date: applicationData.preferred_tour_date || null,
      notes: applicationData.notes || '',
      
      // Application metadata
      status: 'submitted',
      reference_number: referenceNumber,
      application_fee: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 Prepared application payload:', applicationPayload);
    console.log('property_id type:', typeof applicationPayload.property_id);
    console.log('property_id value:', applicationPayload.property_id);
    
    // Insert the application
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationPayload])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (error.message.includes('row-level security')) {
        throw new Error('Security policy error. Please try again or contact support.');
      }
      
      throw error;
    }
    
    console.log('✅ Application submitted successfully! ID:', data.id);
    console.log('Full response:', data);
    
    // Update user profile if logged in
    if (currentUserId) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: currentUserId,
            full_name: applicationData.full_name,
            phone: applicationData.phone,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });
        console.log('✅ User profile updated');
      } catch (profileError) {
        console.warn('⚠️ Could not update profile:', profileError);
        // Not critical, continue
      }
    }
    
    return { 
      success: true, 
      data,
      message: 'Application submitted successfully!',
      referenceNumber: referenceNumber
    };
    
  } catch (error) {
    console.error('❌ Application submission failed:', error);
    return { 
      success: false, 
      error: error.message,
      userMessage: 'Please check your information and try again. If the problem persists, contact support.'
    };
  }
};

// Helper function to check if property_id is valid
export const validatePropertyId = (propertyId) => {
  const id = parseInt(propertyId);
  return !isNaN(id) && id > 0;
};

// Function to fetch applications for current user
export const fetchUserApplications = async (userId) => {
  try {
    console.log('Fetching applications for user:', userId);
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} applications`);
    return data || [];
    
  } catch (error) {
    console.error('Error in fetchUserApplications:', error);
    return [];
  }
};

// Function to fetch single application by ID
export const fetchApplicationById = async (applicationId, userId) => {
  try {
    console.log('Fetching application:', applicationId, 'for user:', userId);
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .or(`user_id.eq.${userId},user_id.is.null`)
      .single();
    
    if (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
    
    return data;
    
  } catch (error) {
    console.error('Error in fetchApplicationById:', error);
    return null;
  }
};

// Rest of your existing functions (keep them as they are)
export const fetchProperties = async () => {
  console.log('📡 Starting properties fetch...');
  
  try {
    const { data: testData, error: testError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Initial connection failed:', testError);
      return getSampleProperties();
    }
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
    
    console.log(`✅ Successfully fetched ${data?.length || 0} properties`);
    
    if (!data || data.length === 0) {
      console.log('⚠️ No properties found in database. Using sample data.');
      return getSampleProperties();
    }
    
    return transformProperties(data);
    
  } catch (error) {
    console.error('❌ Critical error fetching properties:', error);
    console.log('🔄 Returning sample data for development');
    return getSampleProperties();
  }
};

const transformProperties = (data) => {
  return data.map(property => ({
    id: property.id || Math.random(),
    title: property.title || 'Luxury Residence',
    description: property.description || 'Premium property with exceptional features',
    location: property.location || 'Premium Location',
    price_per_week: property.price || property.price_per_week || 35000,
    bedrooms: property.bedrooms || 3,
    bathrooms: property.bathrooms || 3,
    square_feet: property.sqft || property.square_feet || 5000,
    image_url: property.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
    status: property.status || 'available',
    category: 'Premium',
    created_at: property.created_at || new Date().toISOString()
  }));
};

const getSampleProperties = () => {
  return [
    {
      id: 1,
      title: 'Oceanfront Luxury Villa',
      description: 'Exclusive beachfront property with panoramic ocean views and private amenities.',
      location: 'Maldives',
      price_per_week: 35000,
      bedrooms: 5,
      bathrooms: 6,
      square_feet: 12500,
      image_url: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
      status: 'available',
      category: 'Exclusive'
    },
    {
      id: 2,
      title: 'Manhattan Skyline Penthouse',
      description: 'Modern penthouse with 360° city views and premium finishes.',
      location: 'New York, NY',
      price_per_week: 45000,
      bedrooms: 4,
      bathrooms: 5,
      square_feet: 8500,
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      status: 'available',
      category: 'Premium'
    }
  ];
};

export const resendVerificationEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error resending verification email:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Test function
export const testConnection = async () => {
  console.log('🔄 Testing Supabase connection...');
  
  try {
    const { data: authData } = await supabase.auth.getSession();
    console.log('🔐 Auth session:', authData?.session ? 'Exists' : 'None');
    
    // Check applications table
    const { data: apps, error: appsError } = await supabase
      .from('applications')
      .select('count')
      .limit(1);
    
    console.log('📋 Applications table:', appsError ? `Error: ${appsError.message}` : 'Accessible');
    
    // Check properties table
    const { data: properties } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    console.log('🏠 Properties table:', properties ? 'Exists' : 'Missing');
    
    return {
      success: !appsError && properties,
      applications: { accessible: !appsError },
      properties: { exists: !!properties, count: properties?.length || 0 },
      auth: { hasSession: !!authData?.session }
    };
    
  } catch (error) {
    console.error('❌ Connection test crashed:', error);
    return { success: false, error: error.message };
  }
};

// Debug: Test application submission
export const testApplicationSubmission = async () => {
  console.log('🧪 Testing application submission...');
  
  const testData = {
    property_id: "1", // String that will be parsed to number
    full_name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    employment_status: "employed",
    monthly_income: "3000",
    occupants: "2"
  };
  
  return await submitApplication(testData);
};
