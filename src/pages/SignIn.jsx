// src/pages/SignIn.jsx - UPDATED WITH PROPERTY REDIRECT
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ChevronLeft, Eye, EyeOff, LogIn, Home } from 'lucide-react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get redirect parameters from URL
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const propertyId = searchParams.get('propertyId');
  const fromProperty = !!propertyId; // Check if coming from property page

  // Handle redirect after successful login
  useEffect(() => {
    if (user && !authLoading && !redirecting) {
      console.log('✅ User authenticated, determining redirect path...');
      setRedirecting(true);
      
      // Determine where to redirect
      let targetPath = '/dashboard';
      
      if (isAdmin) {
        targetPath = '/admin';
      } else if (propertyId) {
        // If coming from property page, go to application page
        targetPath = `/properties/${propertyId}/apply`;
      } else if (redirectTo && redirectTo !== '/dashboard') {
        // Use custom redirect if provided
        targetPath = redirectTo;
      }
      
      console.log('🎯 Redirecting to:', targetPath);
      
      // Small delay for better UX
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 500);
    }
  }, [user, authLoading, redirecting, navigate, isAdmin, propertyId, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting sign in for:', email);
      const result = await signIn(email, password);

      if (result.success) {
        console.log('✅ Sign in successful!');
        // The useEffect will handle the redirect
      } else {
        console.error('❌ Sign in failed:', result.error);
        
        // User-friendly error messages
        let errorMessage = result.error || 'Invalid email or password';
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email address before signing in.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Show redirecting state
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50">
        <div className="text-center max-w-md mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {fromProperty ? 'Taking you to the application...' : 'Login Successful!'}
          </h2>
          <p className="text-gray-600">
            {fromProperty 
              ? `Redirecting to property application...`
              : 'Redirecting you to your dashboard...'
            }
          </p>
        </div>
      </div>
    );
  }

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user exists but we're still here, let useEffect handle it
  if (user && !redirecting) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header with context */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4 group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          {fromProperty && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <Home className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Continue Your Property Application
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Sign in to complete your application for this property
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sign In Card */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-20"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl"></div>

          <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-white/20">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                {fromProperty ? 'Sign In to Apply' : 'Welcome Back'}
              </h1>
              <p className="text-center text-gray-600">
                {fromProperty 
                  ? 'Sign in to complete your property application'
                  : 'Sign in to access your Palms Estate dashboard'
                }
              </p>
            </div>

            {/* Error Message */}
            {error && !error.includes('✅') && (
              <div className="mx-8 mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5" />
                  </svg>
                  <p className="text-sm text-red-800">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 outline-none disabled:bg-gray-100"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 outline-none disabled:bg-gray-100"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || redirecting}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    fromProperty ? 'Sign In & Continue Application' : 'Sign In'
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300/50"></div>
                <span className="px-4 text-sm text-gray-500">Don't have an account?</span>
                <div className="flex-1 border-t border-gray-300/50"></div>
              </div>

              {/* Sign Up Link - With property context */}
              <div className="text-center">
                <Link
                  to={fromProperty ? `/signup?propertyId=${propertyId}` : '/signup'}
                  className="inline-block w-full border-2 border-gray-300/70 hover:border-orange-500 text-gray-700 hover:text-orange-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {fromProperty ? 'Create Account & Apply' : 'Create Account'}
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
            <p className="font-mono">Property ID: {propertyId || 'None'}</p>
            <p className="font-mono">Redirect to: {redirectTo}</p>
            <p className="font-mono">From Property: {fromProperty ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;
