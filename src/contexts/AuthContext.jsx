// src/contexts/AuthContext.jsx - FIXED VERSION
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleAuthState = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          const currentUser = currentSession.user;
          
          // Load profile first to check admin status
          await loadUserProfile(currentUser.id);
          
          // Check admin status from multiple sources
          const adminStatus = checkAdminStatus(currentUser);
          setIsAdmin(adminStatus);
          
          const enhancedUser = {
            ...currentUser,
            isAdmin: adminStatus,
            role: adminStatus ? 'admin' : 'user'
          };

          setUser(enhancedUser);
        } else {
          setUser(null);
          setIsAdmin(false);
          setUserProfile(null);
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession);

          if (newSession?.user) {
            const currentUser = newSession.user;
            
            // Load profile
            await loadUserProfile(currentUser.id);
            
            // Check admin status
            const adminStatus = checkAdminStatus(currentUser);
            setIsAdmin(adminStatus);
            
            const enhancedUser = {
              ...currentUser,
              isAdmin: adminStatus,
              role: adminStatus ? 'admin' : 'user'
            };

            setUser(enhancedUser);
          } else {
            setUser(null);
            setIsAdmin(false);
            setUserProfile(null);
          }
        });
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
      // 1. Check email
      currentUser.email === 'koshbtc@gmail.com' || // Lowercase
      currentUser.email === 'Koshbtc@gmail.com' || // Original case
      currentUser.email === 'admin@palmsestate.org' ||
      currentUser.email?.includes('admin') ||
      
      // 2. Check user metadata
      currentUser.user_metadata?.role === 'admin' ||
      currentUser.user_metadata?.is_admin === true ||
      
      // 3. Check loaded profile
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
          setIsAdmin(true);
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
      setIsAdmin(adminStatus);

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

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
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
    signOut,
    updateUserProfile,
    isAdmin: isAdmin, // This is now a proper boolean
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
