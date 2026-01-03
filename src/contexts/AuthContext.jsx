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

  useEffect(() => {
    const handleAuthState = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          const currentUser = currentSession.user;
          
          // Load profile first
          await loadUserProfile(currentUser.id);
          
          // Check admin status
          const adminStatus = checkAdminStatus(currentUser);
          setIsAdminUser(adminStatus);
          
          const enhancedUser = {
            ...currentUser,
            isAdmin: adminStatus,
            role: adminStatus ? 'admin' : 'user'
          };

          setUser(enhancedUser);
        } else {
          setUser(null);
          setIsAdminUser(false);
          setUserProfile(null);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession);

          if (newSession?.user) {
            const currentUser = newSession.user;
            
            // Load profile
            await loadUserProfile(currentUser.id);
            
            // Check admin status
            const adminStatus = checkAdminStatus(currentUser);
            setIsAdminUser(adminStatus);
            
            const enhancedUser = {
              ...currentUser,
              isAdmin: adminStatus,
              role: adminStatus ? 'admin' : 'user'
            };

            setUser(enhancedUser);
          } else {
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
      } finally {
        setLoading(false);
      }
    };

    handleAuthState();
  }, []);

  const checkAdminStatus = (currentUser) => {
    // Check multiple possible admin indicators
    return (
      // Check email (case-insensitive)
      currentUser.email?.toLowerCase() === 'koshbtc@gmail.com' ||
      currentUser.email?.toLowerCase() === 'admin@palmsestate.org' ||
      currentUser.email?.toLowerCase().includes('admin') ||
      
      // Check user metadata
      currentUser.user_metadata?.role === 'admin' ||
      currentUser.user_metadata?.is_admin === true ||
      
      // Check loaded profile
      userProfile?.role === 'admin' ||
      userProfile?.is_admin === true
    );
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUserProfile(data);
        
        // Update admin status based on profile
        if (data.role === 'admin' || data.is_admin === true) {
          setIsAdminUser(true);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Force persist session
      if (data.session) {
        await supabase.auth.setSession(data.session);
      }

      // Load user profile
      await loadUserProfile(data.user.id);
      
      // Check admin status
      const adminStatus = checkAdminStatus(data.user);
      setIsAdminUser(adminStatus);

      const enhancedUser = {
        ...data.user,
        isAdmin: adminStatus,
        role: adminStatus ? 'admin' : 'user'
      };

      setUser(enhancedUser);
      setSession(data.session);

      return { 
        success: true, 
        user: enhancedUser, 
        session: data.session, 
        isAdmin: adminStatus 
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // NEW: Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      console.log('Starting sign up process for:', email);
      
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
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up response:', data);

      if (data.user) {
        // Save user profile to profiles table
        try {
          const profileResult = await saveUserProfile(data.user.id, {
            email: email,
            first_name: userData.full_name?.split(' ')[0] || '',
            last_name: userData.full_name?.split(' ').slice(1).join(' ') || '',
            phone: userData.phone || null,
          });

          if (!profileResult.success) {
            console.error('Failed to save profile:', profileResult.error);
          }
        } catch (profileError) {
          console.error('Profile save error:', profileError);
        }

        // Return appropriate response
        if (data.session) {
          // User is immediately confirmed (email confirmation disabled)
          const adminStatus = checkAdminStatus(data.user);
          setIsAdminUser(adminStatus);
          
          const enhancedUser = {
            ...data.user,
            isAdmin: adminStatus,
            role: adminStatus ? 'admin' : 'user'
          };

          setUser(enhancedUser);
          setSession(data.session);

          return { 
            success: true, 
            user: enhancedUser,
            session: data.session,
            requiresEmailConfirmation: false 
          };
        } else {
          // Email confirmation required
          return {
            success: true,
            user: data.user,
            requiresEmailConfirmation: true,
            confirmationSentAt: new Date().toISOString()
          };
        }
      }

      return { 
        success: false, 
        error: 'Sign up failed - no user data returned' 
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // NEW: Resend verification function
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

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    session,
    loading,
    userProfile,
    signIn,
    signUp, // Now properly added
    signOut,
    resendVerification, // Now properly added
    updateUserProfile,
    isAdmin: isAdminUser,
    isAuthenticated: !!user,
    refreshSession: async () => {
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      setSession(newSession);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
