// src/contexts/AuthContext.jsx - MINIMAL WORKING VERSION
import { createContext, useContext, useState, useEffect } from 'react';
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
    
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          if (session?.user) {
            const email = session.user.email || '';
            const admin = email.toLowerCase().includes('admin') || 
                         email === 'koshbtc@gmail.com';
            setIsAdmin(admin);
            setUser({
              ...session.user,
              isAdmin: admin,
              role: admin ? 'admin' : 'user'
            });
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

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const admin = email.toLowerCase().includes('admin') || 
                   email === 'koshbtc@gmail.com';
      
      setIsAdmin(admin);
      setUser({
        ...data.user,
        isAdmin: admin,
        role: admin ? 'admin' : 'user'
      });
      setSession(data.session);

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || '',
            phone: userData.phone || '',
            role: 'user'
          }
        }
      });

      if (error) throw error;

      // If user is immediately signed in (no email confirmation)
      if (data.session) {
        const admin = email.toLowerCase().includes('admin') || 
                     email === 'koshbtc@gmail.com';
        
        setIsAdmin(admin);
        setUser({
          ...data.user,
          isAdmin: admin,
          role: admin ? 'admin' : 'user'
        });
        setSession(data.session);
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        requiresEmailConfirmation: !data.session
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp, // INCLUDED
    signOut,
    isAdmin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

