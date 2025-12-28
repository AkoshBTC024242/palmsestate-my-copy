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
          
          // Check for admin role
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
        
        return () => {
          subscription?.unsubscribe();
        };
        
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
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
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

  const signUp = async (email, password, userData = {}) => {
    try {
      console.log('📝 Signing up user:', email);
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            full_name: userData.full_name || '',
            phone: userData.phone || '',
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        throw error;
      }

      console.log('✅ Sign up successful:', data.user?.email);
      
      // If we have a session immediately, user is confirmed
      if (data.session) {
        const isAdmin = 
          data.user.email?.includes('admin') || 
          data.user.email === 'admin@palmsestate.org' ||
          data.user.user_metadata?.role === 'admin';
        
        const enhancedUser = {
          ...data.user,
          role: isAdmin ? 'admin' : 'user',
          isAdmin: isAdmin
        };
        
        setUser(enhancedUser);
        setUserRole(isAdmin ? 'admin' : 'user');
        setSession(data.session);
        await loadUserProfile(data.user.id);
      }
      
      return {
        user: data.user,
        session: data.session,
        requiresEmailConfirmation: !data.session,
        confirmationSentAt: data.user?.confirmation_sent_at
      };
      
    } catch (error) {
      console.error('❌ Sign up failed:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('🔐 Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

      console.log('✅ Sign in successful:', data.user?.email);
      
      // Check if user is admin
      const isAdmin = 
        data.user.email?.includes('admin') || 
        data.user.email === 'admin@palmsestate.org' ||
        data.user.user_metadata?.role === 'admin';
      
      // Create enhanced user object
      const enhancedUser = {
        ...data.user,
        role: isAdmin ? 'admin' : 'user',
        isAdmin: isAdmin
      };
      
      setUser(enhancedUser);
      setUserRole(isAdmin ? 'admin' : 'user');
      setSession(data.session);
      
      // Load user profile
      await loadUserProfile(data.user.id);
      
      return { user: enhancedUser, session: data.session };
      
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setUserRole(null);
      setSession(null);
      setUserProfile(null);
      
      console.log('✅ Sign out successful');
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      throw error;
    }
  };

  const resendVerification = async (email) => {
    try {
      console.log('📧 Resending verification email to:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        console.error('❌ Resend verification error:', error);
        throw error;
      }
      
      console.log('✅ Verification email resent');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Failed to resend verification:', error);
      return { success: false, error: error.message };
    }
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
    resendVerification,
    isAdmin: isAdmin(),
    canUseTestMode: canUseTestMode(),
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
