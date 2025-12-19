import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Config Check:');
console.log('URL exists:', !!supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Debug function to test connection
export const testConnection = async () => {
  console.log('Testing connection to:', supabaseUrl);
  
  try {
    // Test 1: Basic auth capabilities
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('Auth test:', authError ? 'Failed' : 'Success', authData);
    
    // Test 2: Check if properties table exists
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    console.log('Properties test:', propertiesError ? 'Failed' : 'Success');
    console.log('Sample data:', properties);
    
    return {
      success: !authError && !propertiesError,
      authError: authError?.message,
      propertiesError: propertiesError?.message,
      propertiesCount: properties?.length || 0
    };
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Fixed fetchProperties function with proper error handling
export const fetchProperties = async () => {
  console.log('📡 Fetching properties from Supabase...');
  
  try {
    // First, test the connection
    const { data: testData, error: testError } = await supabase
      .from('properties')
      .select('count', { count: 'exact', head: true });
    
    console.log('Table count test:', testData, testError);
    
    if (testError) {
      console.error('❌ Database connection error:', testError);
      throw new Error(`Database error: ${testError.message}`);
    }

    // Fetch actual properties
    const { data, error, count } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching properties:', error);
      throw error;
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} properties`);
    
    // Transform data to match UI expectations
    return data.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description,
      location: property.location,
      price_per_week: property.price, // Your database uses 'price' not 'price_per_week'
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.sqft, // Your database uses 'sqft' not 'square_feet'
      image_url: property.image_url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200',
      status: property.status || 'available',
      category: property.price > 50000 ? 'Exclusive' : 
                property.price > 35000 ? 'Premium' : 'Luxury',
      created_at: property.created_at
    }));
  } catch (error) {
    console.error('❌ Failed to load properties:', error);
    
    // Return mock data for development if database fails
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
      }
    ];
  }
};

// Fetch single property by ID
export const fetchPropertyById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      location: data.location,
      price_per_week: data.price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      square_feet: data.sqft,
      image_url: data.image_url,
      status: data.status || 'available',
      category: data.price > 50000 ? 'Exclusive' : 'Premium'
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};