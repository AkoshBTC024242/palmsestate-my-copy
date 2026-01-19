// src/contexts/AuthContext.jsx - COMPLETE UPDATED VERSION
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          
          if (currentSession?.user) {
            const email = currentSession.user.email || '';
            const adminStatus = email.toLowerCase().includes('admin') || 
                               email === 'koshbtc@gmail.com';
            
            setIsAdmin(adminStatus);
            setUser({
              ...currentSession.user,
              isAdmin: adminStatus,
              role: adminStatus ? 'admin' : 'user'
            });
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      console.log('🔐 Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Sign in API success:', data.user.email);
      
      // Force immediate session persistence
      if (data.session) {
        await supabase.auth.setSession(data.session);
      }

      const adminStatus = email.toLowerCase().includes('admin') || 
                         email === 'koshbtc@gmail.com';
      
      setIsAdmin(adminStatus);
      setUser({
        ...data.user,
        isAdmin: adminStatus,
        role: adminStatus ? 'admin' : 'user'
      });
      setSession(data.session);

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
  }, []);

  const signUp = useCallback(async (email, password, userData = {}, propertyId = null) => {
    try {
      console.log('📝 Creating account for:', email);
      console.log('Property ID for redirect:', propertyId);
      
      // Build redirect URL with property ID if provided
      const siteUrl = window.location.origin;
      let redirectUrl = `${siteUrl}/email-confirmed`;
      
      if (propertyId) {
        redirectUrl += `?propertyId=${propertyId}`;
      }
      
      console.log('Email redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || '',
            phone: userData.phone || '',
            role: 'user'
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      console.log('✅ Sign up response:', data);

      return {
        success: true,
        user: data.user,
        session: data.session,
        requiresEmailConfirmation: true, // ALWAYS require email confirmation
        message: 'Verification email sent! Please check your inbox.'
      };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return {
        success: false,
        error: error.message.includes('User already registered') 
          ? 'An account with this email already exists. Please sign in instead.'
          : error.message
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      setSession(newSession);
      
      if (newSession?.user) {
        const email = newSession.user.email || '';
        const adminStatus = email.toLowerCase().includes('admin') || 
                           email === 'koshbtc@gmail.com';
        
        setIsAdmin(adminStatus);
        setUser({
          ...newSession.user,
          isAdmin: adminStatus,
          role: adminStatus ? 'admin' : 'user'
        });
      }
      
      return newSession;
    } catch (error) {
      console.error('Refresh session error:', error);
      return null;
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isAuthenticated: !!user,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
