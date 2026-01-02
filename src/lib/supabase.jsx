// src/lib/supabase.js - COMPLETE UPDATED FILE
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

// ============ submitApplication FUNCTION ============
// THIS IS THE FUNCTION YOUR FORMS SHOULD USE
export const submitApplication = async (applicationData) => {
  console.log('📝 Submitting application:', applicationData);
  
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('Session error (may be normal for anonymous):', sessionError);
    }
    
    const currentUserId = session?.user?.id || null;
    console.log('Current user ID:', currentUserId);
    
    // Validate required fields
    const requiredFields = ['property_id', 'full_name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Convert property_id to number
    const propertyId = parseInt(applicationData.property_id);
    if (isNaN(propertyId)) {
      throw new Error(`Invalid property ID: ${applicationData.property_id}. Must be a number.`);
    }
    
    // Generate reference number
    const referenceNumber = 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Build payload with ALL required columns from your table
    const payload = {
      // Required columns (NOT NULL)
      property_id: propertyId,
      full_name: applicationData.full_name || '',
      email: applicationData.email || '',
      
      // Optional columns with defaults
      phone: applicationData.phone || '',
      user_id: currentUserId, // Can be null
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
    
    console.log('📋 Final payload:', payload);
    console.log('Payload property_id type:', typeof payload.property_id);
    
    // Try the insert
    const { data, error } = await supabase
      .from('applications')
      .insert([payload])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database error:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      // Try one more time with minimal data
      console.log('🔄 Trying minimal data approach...');
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
        console.error('❌ Minimal data also failed:', minimalError);
        throw new Error(`RLS blocked: ${minimalError.message}`);
      }
      
      console.log('✅ Success with minimal data');
      return { success: true, data: minimalData, minimal: true };
    }
    
    console.log('✅ Application submitted successfully!');
    return { success: true, data, referenceNumber };
    
  } catch (error) {
    console.error('❌ Application submission failed:', error);
    return { 
      success: false, 
      error: error.message,
      userMessage: 'Please check your information and try again. If the problem persists, contact support.'
    };
  }
};
// ============ END submitApplication FUNCTION ============

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

// Function to fetch properties
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

// Function to fetch single property by ID
export const fetchPropertyById = async (propertyId) => {
  console.log('📡 Fetching property by ID:', propertyId);
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
    
    if (error) {
      console.error('❌ Error fetching property:', error);
      throw error;
    }
    
    console.log('✅ Property fetched successfully:', data?.title);
    return transformProperty(data);
    
  } catch (error) {
    console.error('❌ Error fetching property by ID:', error);
    return null;
  }
};

const transformProperties = (data) => {
  return data.map(property => ({
    id: property.id || Math.random(),
    title: property.title || 'Luxury Residence',
    description: property.description || 'Premium property with exceptional features',
    location: property.location || 'Premium Location',
    price: property.price || property.price_per_week || 35000,
    price_per_week: property.price || property.price_per_week || 35000,
    bedrooms: property.bedrooms || 3,
    bathrooms: property.bathrooms || 3,
    square_feet: property.sqft || property.square_feet || 5000,
    image_url: property.image_url || property.main_image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
    status: property.status || 'available',
    category: property.category || 'Premium',
    property_type: property.property_type || 'Luxury Villa',
    created_at: property.created_at || new Date().toISOString()
  }));
};

const transformProperty = (property) => {
  return {
    id: property.id || Math.random(),
    title: property.title || 'Luxury Residence',
    description: property.description || 'Premium property with exceptional features',
    location: property.location || 'Premium Location',
    price: property.price || property.price_per_week || 35000,
    price_per_week: property.price || property.price_per_week || 35000,
    bedrooms: property.bedrooms || 3,
    bathrooms: property.bathrooms || 3,
    square_feet: property.sqft || property.square_feet || 5000,
    image_url: property.image_url || property.main_image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
    status: property.status || 'available',
    category: property.category || 'Premium',
    property_type: property.property_type || 'Luxury Villa',
    created_at: property.created_at || new Date().toISOString()
  };
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

// Temporary fix: Try different approaches
export const submitApplicationWithFallback = async (applicationData) => {
  console.log('🔄 Trying submission with fallback...');
  
  try {
    // Try the normal way first
    const result = await submitApplication(applicationData);
    if (result.success) return result;
    
    console.log('First attempt failed, trying fallback...');
    
    // Fallback 1: Try without user_id
    const dataWithoutUserId = { ...applicationData };
    delete dataWithoutUserId.user_id;
    
    const { data: data1, error: error1 } = await supabase
      .from('applications')
      .insert([dataWithoutUserId])
      .select()
      .single();
      
    if (!error1 && data1) {
      console.log('✅ Success with fallback 1 (no user_id)');
      return { success: true, data: data1, anonymous: true };
    }
    
    // Fallback 2: Try with minimal data
    const minimalData = {
      property_id: parseInt(applicationData.property_id) || 1,
      full_name: applicationData.full_name || '',
      email: applicationData.email || '',
      phone: applicationData.phone || '',
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: data2, error: error2 } = await supabase
      .from('applications')
      .insert([minimalData])
      .select()
      .single();
      
    if (!error2 && data2) {
      console.log('✅ Success with fallback 2 (minimal data)');
      return { success: true, data: data2, minimal: true };
    }
    
    // All attempts failed
    console.error('All fallbacks failed:', error1, error2);
    return { 
      success: false, 
      error: 'Unable to submit application. Please contact support.',
      details: { error1, error2 }
    };
    
  } catch (error) {
    console.error('Fallback submission error:', error);
    return { success: false, error: error.message };
  }
};

// ============ SAVED PROPERTIES FUNCTIONS ============

// Save a property to user's saved list
export const saveProperty = async (userId, propertyId) => {
  console.log('💾 Saving property:', { userId, propertyId });
  
  try {
    // Validate input
    if (!userId || !propertyId) {
      throw new Error('User ID and Property ID are required');
    }

    // Check if already saved first
    const { data: existing } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();

    if (existing) {
      console.log('✅ Property already saved');
      return { success: true, data: existing, alreadySaved: true };
    }

    // Save the property
    const { data, error } = await supabase
      .from('saved_properties')
      .insert({
        user_id: userId,
        property_id: propertyId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving property:', error);
      throw error;
    }

    console.log('✅ Property saved successfully');
    return { success: true, data };

  } catch (error) {
    console.error('❌ Save property failed:', error);
    return { 
      success: false, 
      error: error.message,
      userMessage: 'Failed to save property. Please try again.'
    };
  }
};

// Remove a property from saved list
export const unsaveProperty = async (userId, propertyId) => {
  console.log('🗑️ Unsaving property:', { userId, propertyId });
  
  try {
    if (!userId || !propertyId) {
      throw new Error('User ID and Property ID are required');
    }

    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) {
      console.error('❌ Error unsaving property:', error);
      throw error;
    }

    console.log('✅ Property removed from saved list');
    return { success: true };

  } catch (error) {
    console.error('❌ Unsave property failed:', error);
    return { 
      success: false, 
      error: error.message,
      userMessage: 'Failed to remove property. Please try again.'
    };
  }
};

// Fetch user's saved properties with property details
export const fetchSavedProperties = async (userId) => {
  console.log('📥 Fetching saved properties for user:', userId);
  
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data, error } = await supabase
      .from('saved_properties')
      .select(`
        id,
        created_at,
        property_id,
        user_id,
        properties:property_id (
          id,
          title,
          description,
          location,
          price,
          property_type,
          bedrooms,
          bathrooms,
          square_feet,
          image_url,
          main_image_url,
          status,
          category,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching saved properties:', error);
      throw error;
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} saved properties`);
    
    // Filter out any null properties (in case property was deleted)
    const validProperties = data?.filter(item => item.properties !== null) || [];
    
    return { 
      success: true, 
      data: validProperties,
      count: validProperties.length
    };

  } catch (error) {
    console.error('❌ Fetch saved properties failed:', error);
    return { 
      success: false, 
      error: error.message,
      data: [],
      count: 0
    };
  }
};

// Check if a property is already saved by the user
export const isPropertySaved = async (userId, propertyId) => {
  console.log('🔍 Checking if property is saved:', { userId, propertyId });
  
  try {
    if (!userId || !propertyId) {
      return { success: true, isSaved: false }; // Not an error, just return false
    }

    const { data, error } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle(); // Use maybeSingle instead of single to handle no rows

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('❌ Error checking saved status:', error);
      throw error;
    }

    const isSaved = !!data;
    console.log(`✅ Property ${isSaved ? 'is' : 'is not'} saved`);
    return { success: true, isSaved };

  } catch (error) {
    console.error('❌ Check saved status failed:', error);
    return { 
      success: false, 
      error: error.message,
      isSaved: false // Default to false on error
    };
  }
};

// Get count of saved properties for a user
export const getSavedPropertiesCount = async (userId) => {
  console.log('📊 Getting saved properties count for user:', userId);
  
  try {
    if (!userId) {
      return { success: true, count: 0 };
    }

    const { count, error } = await supabase
      .from('saved_properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error getting saved count:', error);
      throw error;
    }

    console.log(`✅ User has ${count || 0} saved properties`);
    return { success: true, count: count || 0 };

  } catch (error) {
    console.error('❌ Get saved count failed:', error);
    return { 
      success: false, 
      error: error.message,
      count: 0 
    };
  }
};

