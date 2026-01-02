// src/lib/supabase.js - COMPLETE VERSION WITH ALL FUNCTIONS
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.error('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
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

// ============ AUTH & PROFILE FUNCTIONS ============

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
      
      return { 
        success: false, 
        error: upsertError.message,
        code: upsertError.code,
      };
    }
    
    console.log('✅ RLS test passed! Profile saved successfully.');
    
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

// ============ SAVED PROPERTIES FUNCTIONS ============

export const saveProperty = async (userId, propertyId) => {
  try {
    if (!userId || !propertyId) {
      throw new Error('User ID and Property ID are required');
    }

    const { data: existing } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();

    if (existing) {
      return { success: true, data: existing, alreadySaved: true };
    }

    const { data, error } = await supabase
      .from('saved_properties')
      .insert({
        user_id: userId,
        property_id: propertyId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
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

export const unsaveProperty = async (userId, propertyId) => {
  try {
    if (!userId || !propertyId) {
      throw new Error('User ID and Property ID are required');
    }

    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) throw error;
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

export const isPropertySaved = async (userId, propertyId) => {
  try {
    if (!userId || !propertyId) {
      return { success: true, isSaved: false };
    }

    const { data, error } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const isSaved = !!data;
    return { success: true, isSaved };

  } catch (error) {
    console.error('❌ Check saved status failed:', error);
    return { 
      success: false, 
      error: error.message,
      isSaved: false
    };
  }
};

export const fetchSavedProperties = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // ONLY select columns that ACTUALLY exist in your database
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
          bedrooms,
          bathrooms,
          sqft,
          image_url,
          status,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
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

export const getSavedPropertiesCount = async (userId) => {
  try {
    if (!userId) {
      return { success: true, count: 0 };
    }

    const { count, error } = await supabase
      .from('saved_properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
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

export const fetchUserApplications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error('Error in fetchUserApplications:', error);
    return [];
  }
};

export const fetchApplicationById = async (applicationId, userId) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .or(`user_id.eq.${userId},user_id.is.null`)
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error('Error in fetchApplicationById:', error);
    return null;
  }
};

export const submitApplicationWithFallback = async (applicationData) => {
  try {
    const result = await submitApplication(applicationData);
    if (result.success) return result;
    
    const dataWithoutUserId = { ...applicationData };
    delete dataWithoutUserId.user_id;
    
    const { data: data1, error: error1 } = await supabase
      .from('applications')
      .insert([dataWithoutUserId])
      .select()
      .single();
      
    if (!error1 && data1) {
      return { success: true, data: data1, anonymous: true };
    }
    
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
      return { success: true, data: data2, minimal: true };
    }
    
    return { 
      success: false, 
      error: 'Unable to submit application. Please contact support.'
    };
    
  } catch (error) {
    console.error('Fallback submission error:', error);
    return { success: false, error: error.message };
  }
};

// ============ PROPERTY FUNCTIONS ============

export const fetchProperties = async () => {
  console.log('📡 Starting properties fetch...');
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Fetch error:', error);
      return getSampleProperties();
    }
    
    console.log(`✅ Successfully fetched ${data?.length || 0} properties`);
    
    if (!data || data.length === 0) {
      console.log('⚠️ No properties found in database. Using sample data.');
      return getSampleProperties();
    }
    
    return transformProperties(data);
    
  } catch (error) {
    console.error('❌ Critical error fetching properties:', error);
    return getSampleProperties();
  }
};

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

// Transform based on ACTUAL database columns
const transformProperties = (data) => {
  return data.map(property => {
    // Determine category based on price (since category column doesn't exist)
    const price = property.price || property.price_per_week || 35000;
    const category = price > 50000 ? 'Exclusive' : 
                     price > 35000 ? 'Premium' : 'Luxury';
    
    // Handle square footage - try multiple possible column names
    const squareFootage = property.square_feet || property.sqft || 
                         property.square_feet || property.area || 5000;
    
    return {
      id: property.id,
      title: property.title || 'Luxury Residence',
      description: property.description || 'Premium property with exceptional features',
      location: property.location || 'Premium Location',
      price: price,
      price_per_week: price,
      bedrooms: property.bedrooms || 3,
      bathrooms: property.bathrooms || 3,
      square_feet: squareFootage,
      sqft: squareFootage,
      image_url: property.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
      status: property.status || 'available',
      category: category, // Generated, not from database
      created_at: property.created_at || new Date().toISOString()
    };
  });
};

const transformProperty = (property) => {
  const price = property.price || property.price_per_week || 35000;
  const category = price > 50000 ? 'Exclusive' : 
                   price > 35000 ? 'Premium' : 'Luxury';
  
  const squareFootage = property.square_feet || property.sqft || 
                       property.square_feet || property.area || 5000;
  
  return {
    id: property.id,
    title: property.title || 'Luxury Residence',
    description: property.description || 'Premium property with exceptional features',
    location: property.location || 'Premium Location',
    price: price,
    price_per_week: price,
    bedrooms: property.bedrooms || 3,
    bathrooms: property.bathrooms || 3,
    square_feet: squareFootage,
    sqft: squareFootage,
    image_url: property.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
    status: property.status || 'available',
    category: category,
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
      sqft: 12500,
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
      sqft: 8500,
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      status: 'available',
      category: 'Premium'
    }
  ];
};

// ============ OTHER FUNCTIONS ============

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

export const testConnection = async () => {
  try {
    const { data: authData } = await supabase.auth.getSession();
    
    const { data: apps, error: appsError } = await supabase
      .from('applications')
      .select('count')
      .limit(1);
    
    const { data: properties } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
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

export const validatePropertyId = (propertyId) => {
  const id = parseInt(propertyId);
  return !isNaN(id) && id > 0;
};

export const testApplicationSubmission = async () => {
  const testData = {
    property_id: "1",
    full_name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    employment_status: "employed",
    monthly_income: "3000",
    occupants: "2"
  };
  
  return await submitApplication(testData);
};

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
