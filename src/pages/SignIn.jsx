// src/pages/SignIn.jsx - UPDATED TO MATCH SIGNUP STYLE
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ChevronLeft, Home, Eye, EyeOff, LogIn } from 'lucide-react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is already authenticated, redirecting...');
      const redirectPath = isAdmin ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, isAdmin, navigate]);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Attempting sign in...');
      const result = await signIn(email, password);

      if (result.success) {
        console.log('✅ Sign in successful, waiting for auth state update...');
        setError('✅ Login successful! Redirecting...');
        
        // Wait for auth state to update, then redirect
        setTimeout(() => {
          console.log('🔄 Checking auth state after sign in...');
          const redirectPath = isAdmin ? '/admin' : '/dashboard';
          console.log('Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 1000);
      } else {
        console.error('❌ Sign in failed:', result.error);
        setError(result.error || 'Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setError(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

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
                Welcome Back
              </h1>
              <p className="text-center text-gray-600">
                Sign in to access your Palms Estate dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`mx-8 mt-6 p-4 rounded-xl ${error.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start">
                  {error.includes('✅') ? (
                    <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5" />
                    </svg>
                  )}
                  <p className={`text-sm ${error.includes('✅') ? 'text-green-800' : 'text-red-800'}`}>
                    {error}
                    {error.includes('✅') && (
                      <span className="block text-xs text-green-600 mt-1">
                        Please wait while we redirect you...
                      </span>
                    )}
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
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 outline-none"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 outline-none"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
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
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300/50"></div>
                <span className="px-4 text-sm text-gray-500">Don't have an account?</span>
                <div className="flex-1 border-t border-gray-300/50"></div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link
                  to="/signup"
                  className="inline-block w-full border-2 border-gray-300/70 hover:border-orange-500 text-gray-700 hover:text-orange-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
