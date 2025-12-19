import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50 py-20 px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-sans font-medium mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Sign In Card */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur opacity-20"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl"></div>

          <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-white/20">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-center text-gray-800 mb-2">
                Welcome Back
              </h1>
              <p className="text-center text-gray-600 font-sans">
                Sign in to your Palms Estate account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 outline-none"
                      placeholder="concierge@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-sans text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-xs font-medium text-amber-600 hover:text-amber-700"
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
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 outline-none"
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
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-sans font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300/50"></div>
                <span className="px-4 font-sans text-sm text-gray-500">Don't have an account?</span>
                <div className="flex-1 border-t border-gray-300/50"></div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link
                  to="/signup"
                  className="inline-block w-full border-2 border-gray-300/70 hover:border-amber-500 text-gray-700 hover:text-amber-700 font-sans font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md"
                >
                  Create New Account
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