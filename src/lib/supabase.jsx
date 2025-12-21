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

// NEW: Function to submit application with better error handling
export const submitApplication = async (applicationData) => {
  console.log('📝 Submitting application:', applicationData);
  
  try {
    // First validate the data
    const requiredFields = ['property_id', 'full_name', 'email', 'phone', 'employment_status', 'monthly_income'];
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Prepare the data with all required columns
    const completeData = {
      property_id: applicationData.property_id,
      user_id: applicationData.user_id || null,
      full_name: applicationData.full_name,
      email: applicationData.email,
      phone: applicationData.phone,
      employment_status: applicationData.employment_status,
      monthly_income: parseInt(applicationData.monthly_income) || 0,
      occupants: parseInt(applicationData.occupants) || 1,
      has_pets: Boolean(applicationData.has_pets) || false,
      pet_details: applicationData.pet_details || '',
      preferred_tour_date: applicationData.preferred_tour_date || null,
      notes: applicationData.notes || '',
      status: 'payment_pending',
      application_fee: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 Prepared application data:', completeData);
    
    // Insert into database
    const { data, error } = await supabase
      .from('applications')
      .insert([completeData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database error:', error);
      
      // Provide specific guidance based on error
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        const columnMatch = error.message.match(/column "([^"]+)" of/);
        if (columnMatch) {
          const missingColumn = columnMatch[1];
          console.log(`💡 Missing column detected: ${missingColumn}`);
          console.log(`📝 SQL to fix: ALTER TABLE applications ADD COLUMN IF NOT EXISTS ${missingColumn} ${getColumnType(missingColumn)};`);
        }
      }
      
      throw error;
    }
    
    console.log('✅ Application submitted successfully:', data.id);
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Application submission failed:', error);
    return { 
      success: false, 
      error: error.message,
      fixSQL: generateFixSQL(error.message)
    };
  }
};

// Helper to determine column type
const getColumnType = (columnName) => {
  const typeMap = {
    'has_pets': 'BOOLEAN DEFAULT FALSE',
    'pet_details': 'TEXT',
    'employment_status': 'TEXT',
    'monthly_income': 'INTEGER',
    'occupants': 'INTEGER DEFAULT 1',
    'preferred_tour_date': 'DATE',
    'notes': 'TEXT',
    'status': 'TEXT DEFAULT \'payment_pending\'',
    'payment_id': 'TEXT',
    'stripe_payment_id': 'TEXT',
    'payment_status': 'TEXT DEFAULT \'pending\'',
    'application_fee': 'INTEGER DEFAULT 50',
    'paid_at': 'TIMESTAMPTZ',
    'updated_at': 'TIMESTAMPTZ DEFAULT NOW()'
  };
  
  return typeMap[columnName] || 'TEXT';
};

// Generate fix SQL based on error
const generateFixSQL = (errorMessage) => {
  if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
    const columnMatch = errorMessage.match(/column "([^"]+)" of/);
    if (columnMatch) {
      const column = columnMatch[1];
      return `ALTER TABLE applications ADD COLUMN IF NOT EXISTS ${column} ${getColumnType(column)};`;
    }
  }
  return `-- Complete table creation SQL:
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  property_id TEXT NOT NULL,
  user_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  employment_status TEXT,
  monthly_income INTEGER,
  occupants INTEGER DEFAULT 1,
  has_pets BOOLEAN DEFAULT FALSE,
  pet_details TEXT,
  preferred_tour_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'payment_pending',
  payment_id TEXT,
  stripe_payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  application_fee INTEGER DEFAULT 50,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`;
};

// Function to check table structure
export const checkApplicationsTable = async () => {
  console.log('🔍 Checking applications table structure...');
  
  try {
    // Try to get table schema by selecting all columns
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .limit(0); // Just get schema, no rows
    
    if (error) {
      console.error('❌ Cannot access applications table:', error.message);
      return { 
        exists: false, 
        error: error.message,
        fixSQL: generateFixSQL(error.message)
      };
    }
    
    // Try to insert a test record to verify all columns exist
    const testData = {
      property_id: 'test-schema-check',
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      employment_status: 'employed',
      monthly_income: 3000,
      occupants: 1,
      has_pets: false,
      pet_details: '',
      status: 'test',
      application_fee: 50,
      created_at: new Date().toISOString()
    };
    
    const { error: testError } = await supabase
      .from('applications')
      .insert([testData]);
    
    if (testError) {
      console.error('❌ Schema mismatch:', testError.message);
      return { 
        exists: true, 
        complete: false, 
        error: testError.message,
        fixSQL: generateFixSQL(testError.message)
      };
    }
    
    // Clean up test record
    await supabase
      .from('applications')
      .delete()
      .eq('property_id', 'test-schema-check');
    
    console.log('✅ Applications table exists with all required columns');
    return { exists: true, complete: true };
    
  } catch (error) {
    console.error('❌ Error checking table:', error);
    return { exists: false, error: error.message };
  }
};

// Rest of your existing functions remain the same...
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
    const tableCheck = await checkApplicationsTable();
    
    // Check properties table
    const { data: properties } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    console.log('🏠 Properties table:', properties ? 'Exists' : 'Missing');
    
    return {
      success: tableCheck.exists && properties,
      applications: tableCheck,
      properties: { exists: !!properties, count: properties?.length || 0 },
      auth: { hasSession: !!authData?.session }
    };
    
  } catch (error) {
    console.error('❌ Connection test crashed:', error);
    return { success: false, error: error.message };
  }
};
