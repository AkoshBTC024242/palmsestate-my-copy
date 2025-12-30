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
  const [testMode, setTestMode] = useState(false);

  // Session refresh function
  const refreshSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('❌ Session refresh error:', error);
          if (error.message.includes('Invalid refresh token')) {
            // Token expired, sign out
            await signOut();
          }
        } else if (refreshedSession) {
          setSession(refreshedSession);
          console.log('🔄 Session refreshed');
        }
      }
    } catch (error) {
      console.error('❌ Refresh session failed:', error);
    }
  };

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
          
          // Check for admin role from user_roles table
          let isAdmin = false;
          let userTestMode = false;
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role, test_mode')
              .eq('user_id', currentUser.id)
              .single();
            
            if (roleData) {
              isAdmin = roleData.role === 'admin';
              userTestMode = roleData.test_mode === true;
              console.log('👑 User role from database:', roleData.role, 'Test mode:', userTestMode);
            } else {
              // Fallback to email check
              isAdmin = 
                currentUser.email?.includes('admin') || 
                currentUser.email === 'admin@palmsestate.org' ||
                currentUser.user_metadata?.role === 'admin';
            }
          } catch (error) {
            console.log('⚠️ Using fallback admin check');
            isAdmin = 
              currentUser.email?.includes('admin') || 
              currentUser.email === 'admin@palmsestate.org' ||
              currentUser.user_metadata?.role === 'admin';
          }
          
          // Also check system settings for global test mode
          try {
            const { data: systemSettings } = await supabase
              .from('system_settings')
              .select('test_mode')
              .single();
            
            if (systemSettings?.test_mode?.enabled && isAdmin) {
              userTestMode = true;
              console.log('⚙️ Global test mode enabled in system settings');
            }
          } catch (error) {
            console.log('No system settings found or error:', error.message);
          }
          
          console.log('👑 Admin check:', isAdmin ? 'Admin user' : 'Regular user');
          console.log('🧪 Test mode:', userTestMode ? 'Enabled' : 'Disabled');
          
          // Create enhanced user object with role
          const enhancedUser = {
            ...currentUser,
            role: isAdmin ? 'admin' : 'user',
            isAdmin: isAdmin,
            testMode: userTestMode
          };
          
          setUser(enhancedUser);
          setUserRole(isAdmin ? 'admin' : 'user');
          setTestMode(userTestMode);
          
          // Load user profile
          await loadUserProfile(currentUser.id);
        } else {
          setUser(null);
          setUserRole(null);
          setTestMode(false);
        }
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('🎯 Auth state changed:', event);
            
            setSession(newSession);
            
            if (newSession?.user) {
              const currentUser = newSession.user;
              
              // Check admin role from database
              let isAdmin = false;
              let userTestMode = false;
              try {
                const { data: roleData } = await supabase
                  .from('user_roles')
                  .select('role, test_mode')
                  .eq('user_id', currentUser.id)
                  .single();
                
                if (roleData) {
                  isAdmin = roleData.role === 'admin';
                  userTestMode = roleData.test_mode === true;
                } else {
                  isAdmin = 
                    currentUser.email?.includes('admin') || 
                    currentUser.email === 'admin@palmsestate.org' ||
                    currentUser.user_metadata?.role === 'admin';
                }
              } catch (error) {
                isAdmin = 
                  currentUser.email?.includes('admin') || 
                  currentUser.email === 'admin@palmsestate.org' ||
                  currentUser.user_metadata?.role === 'admin';
              }
              
              // Check system settings for global test mode
              try {
                const { data: systemSettings } = await supabase
                  .from('system_settings')
                  .select('test_mode')
                  .single();
                
                if (systemSettings?.test_mode?.enabled && isAdmin) {
                  userTestMode = true;
                }
              } catch (error) {
                // Ignore error, use user-specific setting
              }
              
              const enhancedUser = {
                ...currentUser,
                role: isAdmin ? 'admin' : 'user',
                isAdmin: isAdmin,
                testMode: userTestMode
              };
              
              setUser(enhancedUser);
              setUserRole(isAdmin ? 'admin' : 'user');
              setTestMode(userTestMode);
              await loadUserProfile(currentUser.id);
            } else {
              setUser(null);
              setUserRole(null);
              setUserProfile(null);
              setTestMode(false);
            }
          }
        );
        
        // Set up session refresh every 30 minutes
        const refreshInterval = setInterval(refreshSession, 30 * 60 * 1000);
        
        return () => {
          subscription?.unsubscribe();
          clearInterval(refreshInterval);
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
        // Create profile if it doesn't exist
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      const newProfile = {
        id: userId,
        full_name: user?.user_metadata?.full_name || '',
        phone: user?.user_metadata?.phone || '',
        preferences: {
          email_notifications: true,
          sms_notifications: false,
          newsletter: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(newProfile);
      
      if (!error) {
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    return user?.isAdmin === true || userRole === 'admin';
  };

  // Check if user can use test mode
  const canUseTestMode = () => {
    if (!user) return false;
    
    // Only admins can use test mode
    if (!isAdmin()) return false;
    
    // Check if test mode is enabled for this user
    return testMode === true;
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
          data.user.email === 'admin@palmsestate.org';
        
        const enhancedUser = {
          ...data.user,
          role: isAdmin ? 'admin' : 'user',
          isAdmin: isAdmin,
          testMode: false
        };
        
        setUser(enhancedUser);
        setUserRole(isAdmin ? 'admin' : 'user');
        setSession(data.session);
        setTestMode(false);
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
      
      // Check admin role from database
      let isAdmin = false;
      let userTestMode = false;
      try {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role, test_mode')
          .eq('user_id', data.user.id)
          .single();
        
        if (roleData) {
          isAdmin = roleData.role === 'admin';
          userTestMode = roleData.test_mode === true;
        } else {
          isAdmin = 
            data.user.email?.includes('admin') || 
            data.user.email === 'admin@palmsestate.org';
        }
      } catch (error) {
        isAdmin = 
          data.user.email?.includes('admin') || 
          data.user.email === 'admin@palmsestate.org';
      }
      
      // Create enhanced user object
      const enhancedUser = {
        ...data.user,
        role: isAdmin ? 'admin' : 'user',
        isAdmin: isAdmin,
        testMode: userTestMode
      };
      
      setUser(enhancedUser);
      setUserRole(isAdmin ? 'admin' : 'user');
      setTestMode(userTestMode);
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
      setTestMode(false);
      
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

  const updateTestMode = async (enabled) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          test_mode: enabled,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      setTestMode(enabled);
      setUser(prev => ({ ...prev, testMode: enabled }));
      
      return { success: true, testMode: enabled };
    } catch (error) {
      console.error('Error updating test mode:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    userProfile,
    testMode,
    signUp,
    signIn,
    signOut,
    resendVerification,
    updateTestMode,
    isAdmin: isAdmin(),
    canUseTestMode: canUseTestMode(),
    isAuthenticated: !!user,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

