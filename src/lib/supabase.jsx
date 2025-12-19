import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    // Transform data to match UI
    return data.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description,
      location: property.location,
      price_per_week: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.sqft,
      image_url: property.image_url,
      status: property.status || 'available',
      category: property.price > 50000 ? 'Exclusive' : 'Premium',
      created_at: property.created_at
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};