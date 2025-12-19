import { createClient } from '@supabase/supabase-js';

// Your credentials
const supabaseUrl = 'https://hnruxtddkfxsoulskbyr.supabase.co';
const supabaseAnonKey = 'sb_publishable_g6SzJNCLu-LLmk3oKXWmkw_rnvEgK8U';

console.log('🔧 Initializing Supabase client...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);

// Create Supabase client with minimal config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

// SIMPLE test function
export const testConnection = async () => {
  console.log('🔄 Testing Supabase connection...');
  
  try {
    // Test 1: Can we connect to Supabase?
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    // Test 2: Can we access properties table?
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    return {
      success: !authError && !propertiesError,
      auth: {
        hasSession: !!authData?.session,
        error: authError?.message
      },
      database: {
        error: propertiesError?.message,
        hasProperties: !propertiesError,
        sample: properties?.[0]
      }
    };
  } catch (error) {
    console.error('❌ Connection test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// SIMPLE fetch properties function
export const fetchProperties = async () => {
  console.log('📡 Fetching properties...');
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Database error:', error);
      // Return empty array but log the error
      return [];
    }
    
    console.log(`✅ Found ${data?.length || 0} properties`);
    
    // If no data, return sample data
    if (!data || data.length === 0) {
      console.log('⚠️ No properties in database, using sample data');
      return getSampleProperties();
    }
    
    // Transform data to match our UI
    return data.map(property => ({
      id: property.id,
      title: property.title || 'Luxury Property',
      description: property.description || 'Premium residence',
      location: property.location || 'Prime Location',
      price_per_week: property.price || 35000,
      bedrooms: property.bedrooms || 3,
      bathrooms: property.bathrooms || 3,
      square_feet: property.sqft || 5000,
      image_url: property.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
      status: property.status || 'available',
      category: 'Premium'
    }));
    
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    return getSampleProperties();
  }
};

// Sample data for when database is empty or fails
function getSampleProperties() {
  return [
    {
      id: 1,
      title: 'Oceanfront Luxury Villa',
      description: 'Exclusive beachfront property with panoramic ocean views',
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
      title: 'Manhattan Penthouse',
      description: 'Modern penthouse with 360° city views',
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
      description: 'Lavish estate featuring vineyard and infinity pool',
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
}