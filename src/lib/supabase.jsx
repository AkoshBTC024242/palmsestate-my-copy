import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to transform database data to match your UI
export const transformPropertyData = (property) => {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    location: property.location,
    // Map your 'price' column to 'price_per_week' for UI consistency
    price_per_week: property.price,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    square_feet: property.sqft,
    image_url: property.image_url,
    status: property.status,
    // Add missing fields with defaults
    features: ['Luxury Finish', 'Concierge Service'], // Default features
    category: property.price > 50000 ? 'Exclusive' : 'Premium',
    created_at: property.created_at
  };
};

// Fetch all properties
export const fetchProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform data to match your UI expectations
    return data.map(transformPropertyData);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
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
    return transformPropertyData(data);
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

// Create new property (for admin)
export const createProperty = async (propertyData) => {
  try {
    // Transform UI data to match database schema
    const dbData = {
      title: propertyData.title,
      description: propertyData.description,
      location: propertyData.location,
      price: propertyData.price_per_week, // Map back to 'price'
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      sqft: propertyData.square_feet,
      image_url: propertyData.image_url,
      status: 'available'
    };
    
    const { data, error } = await supabase
      .from('properties')
      .insert([dbData])
      .select()
      .single();
    
    if (error) throw error;
    return transformPropertyData(data);
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// Test connection
export const testConnection = async () => {
  console.log('Testing connection to:', supabaseUrl);
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Connection successful! Found', data.length, 'properties');
    return { success: true, count: data.length };
  } catch (error) {
    console.error('Connection failed:', error);
    return { success: false, error: error.message };
  }
};