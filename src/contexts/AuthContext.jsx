import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...');
    
    const handleAuthState = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('📊 Session found:', currentSession ? 'Yes' : 'No');
        console.log('👤 User email:', currentSession?.user?.email);
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          const currentUser = currentSession.user;
          
          // Check for admin role (email contains 'admin' or specific admin emails)
          const isAdmin = 
            currentUser.email?.includes('admin') || 
            currentUser.email === 'admin@palmsestate.org' ||
            currentUser.user_metadata?.role === 'admin';
          
          console.log('👑 Admin check:', isAdmin ? 'Admin user' : 'Regular user');
          
          // Create enhanced user object with role
          const enhancedUser = {
            ...currentUser,
            role: isAdmin ? 'admin' : 'user',
            isAdmin: isAdmin
          };
          
          setUser(enhancedUser);
          setUserRole(isAdmin ? 'admin' : 'user');
          
          // Load user profile
          await loadUserProfile(currentUser.id);
        } else {
          setUser(null);
          setUserRole(null);
        }
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('🎯 Auth state changed:', event);
            
            setSession(newSession);
            
            if (newSession?.user) {
              const currentUser = newSession.user;
              const isAdmin = 
                currentUser.email?.includes('admin') || 
                currentUser.email === 'admin@palmsestate.org' ||
                currentUser.user_metadata?.role === 'admin';
              
              const enhancedUser = {
                ...currentUser,
                role: isAdmin ? 'admin' : 'user',
                isAdmin: isAdmin
              };
              
              setUser(enhancedUser);
              setUserRole(isAdmin ? 'admin' : 'user');
              await loadUserProfile(currentUser.id);
            } else {
              setUser(null);
              setUserRole(null);
              setUserProfile(null);
            }
          }
        );
        
        // Restore session logic remains...
        
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
          console.log('✅ AuthProvider initialized');
        }, 300);
      }
    };

    handleAuthState();

    return () => {};
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    return user?.isAdmin === true || userRole === 'admin';
  };

  // Check if user can access test mode
  const canUseTestMode = () => {
    return isAdmin();
  };

  // Original signUp, signIn, signOut functions remain the same...
  const signUp = async (email, password, userData) => {
    // ... existing signUp code ...
  };

  const signIn = async (email, password) => {
    // ... existing signIn code ...
  };

  const signOut = async () => {
    // ... existing signOut code ...
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    userProfile,
    signUp,
    signIn,
    signOut,
    isAdmin: isAdmin(),
    canUseTestMode: canUseTestMode(),
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
