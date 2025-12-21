import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...');
    
    // Function to handle auth state
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
        console.log('✅ Email confirmed:', currentSession?.user?.email_confirmed_at ? 'Yes' : 'No');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('🎯 Auth state changed:', event);
            console.log('👤 New user:', newSession?.user?.email || 'No user');
            
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            // Store in localStorage for persistence
            if (newSession) {
              localStorage.setItem('palmsestate-session', JSON.stringify({
                access_token: newSession.access_token,
                refresh_token: newSession.refresh_token,
                expires_at: newSession.expires_at
              }));
            } else {
              localStorage.removeItem('palmsestate-session');
            }
          }
        );
        
        // Try to restore session from localStorage if Supabase doesn't have it
        if (!currentSession) {
          console.log('🔄 No Supabase session, checking localStorage...');
          const storedSession = localStorage.getItem('palmsestate-session');
          if (storedSession) {
            console.log('📦 Found stored session, attempting to restore...');
            try {
              const sessionData = JSON.parse(storedSession);
              const { data: { session: restoredSession }, error: restoreError } = 
                await supabase.auth.setSession({
                  access_token: sessionData.access_token,
                  refresh_token: sessionData.refresh_token
                });
              
              if (!restoreError && restoredSession) {
                console.log('✅ Session restored from localStorage');
                setSession(restoredSession);
                setUser(restoredSession.user);
              }
            } catch (restoreError) {
              console.error('❌ Failed to restore session:', restoreError);
              localStorage.removeItem('palmsestate-session');
            }
          }
        }
        
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        // Small delay to ensure everything is loaded
        setTimeout(() => {
          setLoading(false);
          console.log('✅ AuthProvider initialized');
        }, 300);
      }
    };

    handleAuthState();

    // Cleanup
    return () => {
      // Note: We don't unsubscribe here because we want the listener to persist
    };
  }, []);

  const signUp = async (email, password, userData) => {
    console.log('📝 Signing up:', email);
    console.log('📍 Redirect URL:', `${window.location.origin}/dashboard`);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/dashboard`, // FIXED: Added full URL
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        throw error;
      }
      
      console.log('✅ Sign up successful');
      console.log('📧 Email confirmation required:', data.user?.confirmation_sent_at ? 'Yes' : 'No');
      console.log('✅ Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
      
      // Create user profile - only if we need to store additional data
      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: userData.full_name,
            phone: userData.phone,
            updated_at: new Date().toISOString()
          });
          console.log('✅ User profile created');
        } catch (profileError) {
          console.error('⚠️ Could not create profile (table might not exist):', profileError);
          // Don't throw error - this is optional
        }
      }
      
      return {
        success: true,
        user: data.user,
        requiresEmailConfirmation: !data.user?.email_confirmed_at,
        confirmationSentAt: data.user?.confirmation_sent_at
      };
      
    } catch (error) {
      console.error('❌ Sign up failed:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    console.log('🔑 Signing in:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }
      
      console.log('✅ Sign in successful');
      console.log('👤 User:', data.user?.email);
      console.log('✅ Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
      
      // Check if email is verified
      if (!data.user?.email_confirmed_at) {
        console.warn('⚠️ User email not verified');
        throw new Error('Please verify your email address before signing in. Check your email for the verification link.');
      }
      
      console.log('🔐 Session:', data.session ? 'Valid' : 'Invalid');
      
      // Force a session refresh
      if (data.session) {
        // Store in localStorage immediately
        localStorage.setItem('palmsestate-session', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }));
        
        // Trigger auth state change
        setSession(data.session);
        setUser(data.user);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    
    try {
      // Clear localStorage first
      localStorage.removeItem('palmsestate-session');
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('✅ Sign out successful');
      
      // Clear state
      setUser(null);
      setSession(null);
      
      return true;
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  // NEW: Resend verification email
  const resendVerification = async (email) => {
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
      console.error('Resend verification error:', error);
      return { success: false, error: error.message };
    }
  };

  // NEW: Check if email is verified
  const isEmailVerified = () => {
    return user?.email_confirmed_at !== null;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resendVerification,
    isEmailVerified,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
