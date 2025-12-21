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
    detectSessionInUrl: true, // CHANGED: Must be true for email verification
    flowType: 'pkce', // IMPORTANT: Use PKCE for better security
    storage: window.localStorage,
    storageKey: 'palmsestate-auth-token',
    // Add these settings for email verification
    signUp: {
      // Enable email confirmation
      confirm: true,
      // URL to redirect to after email confirmation
      emailRedirectTo: 'https://palmsestate.org/dashboard', // Change to your domain
    },
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
});

// Debug function
export const testConnection = async () => {
  console.log('🔄 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Test 1: Basic auth check
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('🔐 Auth session:', authData?.session ? 'Exists' : 'None');
    console.log('Auth error:', authError?.message || 'None');
    
    // Test 2: Check properties table
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .limit(2);
    
    console.log('🏠 Properties test:', propertiesError ? 'Failed' : 'Success');
    console.log('Properties found:', properties?.length || 0);
    
    if (propertiesError) {
      console.error('Properties error details:', propertiesError);
      
      // Try to get table structure
      try {
        const { data: structure, error: structureError } = await supabase
          .from('properties')
          .select('id')
          .limit(1);
        
        console.log('Table structure test:', structureError ? 'Failed' : 'Success');
      } catch (err) {
        console.error('Structure test error:', err);
      }
    }
    
    return {
      success: !propertiesError,
      auth: {
        hasSession: !!authData?.session,
        error: authError?.message
      },
      database: {
        error: propertiesError?.message,
        count: properties?.length || 0,
        sample: properties?.[0]
      },
      url: supabaseUrl,
      keyPresent: !!supabaseAnonKey
    };
  } catch (error) {
    console.error('❌ Connection test crashed:', error);
    return {
      success: false,
      error: error.message,
      url: supabaseUrl,
      keyPresent: !!supabaseAnonKey
    };
  }
};

// Enhanced fetchProperties with better error handling
export const fetchProperties = async () => {
  console.log('📡 Starting properties fetch...');
  
  try {
    // First, check if we can connect
    const { data: testData, error: testError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Initial connection failed:', testError);
      
      // Try alternative: maybe table name is different
      try {
        const { data: altData, error: altError } = await supabase
          .from('Properties') // Try capitalized
          .select('*')
          .limit(1);
        
        if (!altError) {
          console.log('✅ Found table "Properties" (capitalized)');
          // Fetch all from capitalized table
          const { data, error } = await supabase
            .from('Properties')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          return transformProperties(data);
        }
      } catch (altError) {
        console.log('No capitalized table found');
      }
      
      throw testError;
    }
    
    // Fetch all properties
    const { data, error, count } = await supabase
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

// Helper function to transform properties
const transformProperties = (data) => {
  return data.map(property => {
    // Debug each property
    console.log('Property data:', property);
    
    return {
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
    };
  });
};

// Sample data fallback
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
    },
    {
      id: 3,
      title: 'Mediterranean Estate',
      description: 'Lavish estate featuring vineyard, infinity pool, and guest houses.',
      location: 'Saint-Tropez, France',
      price_per_week: 75000,
      bedrooms: 8,
      bathrooms: 10,
      square_feet: 22000,
      image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      status: 'available',
      category: 'Exclusive'
    }
  ];
};

// Add these new functions for email verification
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
