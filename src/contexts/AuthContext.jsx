// src/contexts/AuthContext.jsx - ULTRA SIMPLIFIED
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
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
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

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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

