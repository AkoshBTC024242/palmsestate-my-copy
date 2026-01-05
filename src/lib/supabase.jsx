// src/lib/supabase.js - UPDATED
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
});

// ============ TABLE EXISTENCE CHECK ============

export const checkTableExists = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        return { exists: false, error: `Table "${tableName}" does not exist` };
      }
      throw error;
    }
    
    return { exists: true };
  } catch (error) {
    console.error(`❌ Error checking table "${tableName}":`, error);
    return { exists: false, error: error.message };
  }
};

export const setupRequiredTables = async () => {
  console.log('🔧 Checking required tables...');
  
  const requiredTables = ['saved_properties', 'profiles', 'applications', 'properties'];
  const results = {};
  
  for (const table of requiredTables) {
    const result = await checkTableExists(table);
    results[table] = result;
    
    if (!result.exists) {
      console.warn(`⚠️ Table "${table}" is missing. Please create it in Supabase.`);
    }
  }
  
  return results;
};

// ============ SAVED PROPERTIES FUNCTIONS (UPDATED) ============

export const saveProperty = async (userId, propertyId) => {
  try {
    if (!userId || !propertyId) {
      throw new Error('User ID and Property ID are required');
    }

    console.log('💾 Attempting to save property:', { userId, propertyId });

    // Check if table exists
    const tableCheck = await checkTableExists('saved_properties');
    if (!tableCheck.exists) {
      console.log('📋 saved_properties table does not exist. Please create it.');
      
      // Store in localStorage as fallback
      try {
        const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
        const userSaved = saved[userId] || [];
        
        if (!userSaved.includes(propertyId)) {
          userSaved.push(propertyId);
          saved[userId] = userSaved;
          localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
          console.log('📱 Saved to localStorage fallback');
        }
        
        return { 
          success: true, 
          fallback: true,
          message: 'Saved locally (database table not available)' 
        };
      } catch (localError) {
        console.error('LocalStorage fallback failed:', localError);
      }
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle();

    if (existing) {
      console.log('✅ Property already saved');
      return { success: true, data: existing, alreadySaved: true };
    }

    // Save to database
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
      // Handle unique constraint
      if (error.code === '23505') {
        return { success: true, alreadySaved: true };
      }
      throw error;
    }
    
    console.log('✅ Property saved successfully');
    return { success: true, data };

  } catch (error) {
    console.error('❌ Save property failed:', error);
    
    // Ultimate fallback to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
      const userSaved = saved[userId] || [];
      
      if (!userSaved.includes(propertyId)) {
        userSaved.push(propertyId);
        saved[userId] = userSaved;
        localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
        console.log('📱 Saved to localStorage (error recovery)');
        
        return { 
          success: true, 
          fallback: true 
        };
      }
    } catch (localStorageError) {
      console.error('❌ localStorage fallback also failed:', localStorageError);
    }
    
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

    console.log('🗑️ Attempting to unsave property:', { userId, propertyId });

    // Check table first
    const tableCheck = await checkTableExists('saved_properties');
    if (!tableCheck.exists) {
      // Remove from localStorage fallback
      try {
        const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
        const userSaved = saved[userId] || [];
        const filtered = userSaved.filter(id => id !== propertyId);
        saved[userId] = filtered;
        localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
        console.log('📱 Removed from localStorage fallback');
        return { success: true, fallback: true };
      } catch (localError) {
        console.error('LocalStorage fallback failed:', localError);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) throw error;
    
    console.log('✅ Property removed successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ Unsave property failed:', error);
    
    // Try localStorage fallback
    try {
      const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
      const userSaved = saved[userId] || [];
      const filtered = userSaved.filter(id => id !== propertyId);
      saved[userId] = filtered;
      localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
      console.log('📱 Removed from localStorage (error recovery)');
      return { success: true, fallback: true };
    } catch (localStorageError) {
      console.error('❌ localStorage fallback also failed:', localStorageError);
    }
    
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
      // Check localStorage as fallback
      try {
        const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
        const userSaved = saved[userId] || [];
        const isSavedLocal = userSaved.includes(propertyId);
        return { success: true, isSaved: isSavedLocal, fallback: true };
      } catch {
        return { success: true, isSaved: false };
      }
    }

    // Check table exists
    const tableCheck = await checkTableExists('saved_properties');
    if (!tableCheck.exists) {
      // Check localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
        const userSaved = saved[userId] || [];
        const isSavedLocal = userSaved.includes(propertyId);
        return { success: true, isSaved: isSavedLocal, fallback: true };
      } catch {
        return { success: true, isSaved: false };
      }
    }

    // Check database
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
    
    // Fallback to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
      const userSaved = saved[userId] || [];
      const isSavedLocal = userSaved.includes(propertyId);
      return { 
        success: true, 
        isSaved: isSavedLocal, 
        fallback: true,
        error: error.message 
      };
    } catch (localError) {
      return { 
        success: false, 
        error: error.message,
        isSaved: false 
      };
    }
  }
};

// ============ OTHER FUNCTIONS (KEEP YOUR EXISTING CODE) ============
// ... [KEEP ALL YOUR EXISTING FUNCTIONS BELOW AS THEY ARE]

export const fetchSavedProperties = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Check table exists
    const tableCheck = await checkTableExists('saved_properties');
    if (!tableCheck.exists) {
      // Return from localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
        const userSaved = saved[userId] || [];
        const properties = userSaved.map(id => ({ property_id: id }));
        return { 
          success: true, 
          data: properties,
          fallback: true,
          count: properties.length
        };
      } catch (error) {
        return { 
          success: false, 
          error: error.message,
          data: [],
          count: 0
        };
      }
    }

    // Fetch from database
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
    // Add this function at the end of your supabase.js file, before the closing }
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
