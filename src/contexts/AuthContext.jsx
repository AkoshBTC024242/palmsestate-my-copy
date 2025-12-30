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

  const refreshSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
        if (refreshedSession) {
          setSession(refreshedSession);
        }
      }
    } catch (error) {
      console.error('Refresh session failed:', error);
    }
  };

  useEffect(() => {
    const handleAuthState = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        setSession(currentSession);

        if (currentSession?.user) {
          const currentUser = currentSession.user;

          // Skip user_roles query — use email fallback
          const isAdmin = currentUser.email?.includes('admin') || currentUser.email === 'admin@palmsestate.org';

          const enhancedUser = {
            ...currentUser,
            role: isAdmin ? 'admin' : 'user',
            isAdmin: isAdmin,
            testMode: false
          };

          setUser(enhancedUser);
          setUserRole(isAdmin ? 'admin' : 'user');
          setTestMode(false);

          await loadUserProfile(currentUser.id);
        } else {
          setUser(null);
          setUserRole(null);
          setTestMode(false);
        }

        supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession);

          if (newSession?.user) {
            const currentUser = newSession.user;
            const isAdmin = currentUser.email?.includes('admin') || currentUser.email === 'admin@palmsestate.org';

            const enhancedUser = {
              ...currentUser,
              role: isAdmin ? 'admin' : 'user',
              isAdmin: isAdmin,
              testMode: false
            };

            setUser(enhancedUser);
            setUserRole(isAdmin ? 'admin' : 'user');
            setTestMode(false);
            await loadUserProfile(currentUser.id);
          } else {
            setUser(null);
            setUserRole(null);
            setUserProfile(null);
            setTestMode(false);
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

  const isAdmin = () => {
    return user?.isAdmin === true || userRole === 'admin';
  };

  const canUseTestMode = () => {
    return false; // disable for now
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

      const isAdmin = data.user.email?.includes('admin') || data.user.email === 'admin@palmsestate.org';

      const enhancedUser = {
        ...data.user,
        role: isAdmin ? 'admin' : 'user',
        isAdmin: isAdmin,
        testMode: false
      };

      setUser(enhancedUser);
      setUserRole(isAdmin ? 'admin' : 'user');
      setSession(data.session);

      await loadUserProfile(data.user.id);

      return { user: enhancedUser, session: data.session };
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setUserProfile(null);
    setTestMode(false);
    window.location.href = '/';
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    userProfile,
    testMode,
    signIn,
    signOut,
    isAdmin: isAdmin(),
    canUseTestMode: canUseTestMode(),
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
