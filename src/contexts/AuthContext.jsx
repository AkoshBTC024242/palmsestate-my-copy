// IN src/contexts/AuthContext.jsx - UPDATE THE signIn FUNCTION ONLY:
const signIn = async (email, password) => {
  try {
    console.log('🔐 Signing in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    console.log('✅ Sign in API success:', data.user.email);
    
    // CRITICAL: Force immediate session persistence
    if (data.session) {
      await supabase.auth.setSession(data.session);
    }

    // Load user profile IMMEDIATELY (don't wait for listener)
    await loadUserProfile(data.user.id);
    
    // Check admin status IMMEDIATELY
    const adminStatus = checkAdminStatus(data.user);
    setIsAdminUser(adminStatus);

    // Create enhanced user object
    const enhancedUser = {
      ...data.user,
      isAdmin: adminStatus,
      role: adminStatus ? 'admin' : 'user'
    };

    console.log('✅ Setting user state immediately:', enhancedUser.email);
    
    // SET USER STATE IMMEDIATELY (this triggers the redirect)
    setUser(enhancedUser);
    setSession(data.session);

    return { 
      success: true, 
      user: enhancedUser, 
      session: data.session, 
      isAdmin: adminStatus 
    };
  } catch (error) {
    console.error('❌ Sign in error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};
