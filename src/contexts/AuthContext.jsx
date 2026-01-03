// src/contexts/AuthContext.jsx - COMPLETE FIXED VERSION
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { saveUserProfile, resendVerificationEmail } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user profile from database
  const loadUserProfile = async (userId) => {
    try {
      console.log('📥 Loading profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No profile found for user (this is normal for new users)');
          return null;
        }
        console.error('Error loading user profile:', error);
        return null;
      }

      console.log('✅ Profile loaded:', data);
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Check if user is admin
  const checkAdminStatus = (currentUser, profile = null) => {
    if (!currentUser) return false;
    
    // Check multiple possible admin indicators
    const adminStatus = (
      currentUser.email?.toLowerCase() === 'koshbtc@gmail.com' ||
      currentUser.email?.toLowerCase() === 'admin@palmsestate.org' ||
      currentUser.email?.toLowerCase().includes('admin') ||
      currentUser.user_metadata?.role === 'admin' ||
      currentUser.user_metadata?.is_admin === true ||
      profile?.role === 'admin' ||
      profile?.is_admin === true
    );
    
    console.log('Admin check:', {
      email: currentUser.email,
      isAdmin: adminStatus,
      profileRole: profile?.role,
      userMetadata: currentUser.user_metadata
    });
    
    return adminStatus;
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Get current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
        }
        
        console.log('Current session:', currentSession);
        
        if (isMounted) {
          setSession(currentSession);

          if (currentSession?.user) {
            console.log('User found in session:', currentSession.user.email);
            
            // Load user profile
            const profile = await loadUserProfile(currentSession.user.id);
            
            // Check admin status with profile
            const adminStatus = checkAdminStatus(currentSession.user, profile);
            setIsAdminUser(adminStatus);
            
            const enhancedUser = {
              ...currentSession.user,
              isAdmin: adminStatus,
              role: adminStatus ? 'admin' : 'user'
            };

            setUser(enhancedUser);
            console.log('✅ Auth initialized with user:', enhancedUser.email, 'Admin:', adminStatus);
          } else {
            console.log('No user in session');
            setUser(null);
            setIsAdminUser(false);
            setUserProfile(null);
          }
          
          setIsInitialized(true);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log('Auth state changed:', event, newSession?.user?.email);
          
          if (!isMounted) return;
          
          setSession(newSession);

          if (newSession?.user) {
            console.log('New user session:', newSession.user.email);
            
            // Load user profile
            const profile = await loadUserProfile(newSession.user.id);
            
            // Check admin status with profile
            const adminStatus = checkAdminStatus(newSession.user, profile);
            setIsAdminUser(adminStatus);
            
            const enhancedUser = {
              ...newSession.user,
              isAdmin: adminStatus,
              role: adminStatus ? 'admin' : 'user'
            };

            setUser(enhancedUser);
            console.log('✅ User set:', enhancedUser.email, 'Admin:', adminStatus);
          } else {
            console.log('User signed out');
            setUser(null);
            setIsAdminUser(false);
            setUserProfile(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setIsInitialized(true);
          setLoading(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

      console.log('✅ Sign in successful:', data.user.email);
      
      // The auth state change listener will automatically update the user state
      // Wait a bit for the state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { 
        success: true, 
        user: data.user, 
        session: data.session 
      };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Sign up function (simplified - don't try to create profile immediately)
  const signUp = async (email, password, userData = {}) => {
    try {
      console.log('📝 Starting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || '',
            phone: userData.phone || '',
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('❌ Sign up auth error:', error);
        throw error;
      }

      console.log('✅ Sign up response:', data);

      if (!data.user) {
        throw new Error('No user data returned from sign up');
      }

      // IMPORTANT: Don't try to save profile here - let the database trigger do it
      // or handle it in a separate process
      // The profiles table might have a database trigger to auto-create profiles
      
      // Return success - the profile will be created by a trigger or on first login
      return {
        success: true,
        user: data.user,
        requiresEmailConfirmation: !data.session,
        confirmationSentAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Resend verification
  const resendVerification = async (email) => {
    try {
      const result = await resendVerificationEmail(email);
      return result;
    } catch (error) {
      console.error('Resend verification error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdminUser(false);
      setUserProfile(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    userProfile,
    signIn,
    signUp,
    signOut,
    resendVerification,
    isAdmin: isAdminUser,
    isAuthenticated: !!user && isInitialized,
    refreshSession: async () => {
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      setSession(newSession);
      return newSession;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
