// src/pages/SignUp.jsx - COMPLETE UPDATED VERSION
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, ChevronLeft, Building2, Loader2 } from 'lucide-react';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { signUp, user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get property ID from URL if coming from property page
  const propertyId = searchParams.get('propertyId');
  const fromProperty = !!propertyId;

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User already logged in, redirecting...');
      if (propertyId) {
        navigate(`/properties/${propertyId}/apply`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate, propertyId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const userData = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone || '',
      };
      
      console.log('Creating account for:', formData.email);
      console.log('From property:', fromProperty ? `Yes (ID: ${propertyId})` : 'No');
      
      // Pass propertyId to signUp function for email redirect
      const result = await signUp(formData.email, formData.password, userData, propertyId);
      
      if (result.success) {
        // ALWAYS redirect to verification-sent page (email confirmation required)
        navigate('/verification-sent', { 
          state: { 
            email: formData.email,
            name: userData.full_name,
            propertyId: propertyId || null
          },
          replace: true 
        });
      } else {
        setError(result.error || 'Failed to create account. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user already logged in, let useEffect handle redirect
  if (user && !authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-4 group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          {fromProperty && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Create Account to Apply
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Create an account to complete your property application
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sign Up Card */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur opacity-20"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl"></div>

          <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-white/20">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                {fromProperty ? 'Apply for Property' : 'Join Palms Estate'}
              </h1>
              <p className="text-center text-gray-600">
                {fromProperty 
                  ? 'Create an account to complete your application'
                  : 'Create your account for exclusive access'
                }
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 outline-none disabled:bg-gray-100"
                        placeholder="John"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 outline-none disabled:bg-gray-100"
                        placeholder="Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 outline-none disabled:bg-gray-100"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 outline-none disabled:bg-gray-100"
                      placeholder="+1 (555) 123-4567"
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 outline-none disabled:bg-gray-100"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
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
                  <p className="mt-2 text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 outline-none disabled:bg-gray-100"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 mr-3 w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2 disabled:bg-gray-200"
                    disabled={isLoading}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-amber-600 hover:text-amber-700 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-amber-600 hover:text-amber-700 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Creating Account...
                    </span>
                  ) : (
                    fromProperty ? 'Create Account & Apply' : 'Create Account'
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300/50"></div>
                <span className="px-4 text-sm text-gray-500">Already have an account?</span>
                <div className="flex-1 border-t border-gray-300/50"></div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <Link
                  to={fromProperty ? `/signin?propertyId=${propertyId}` : '/signin'}
                  className="inline-block w-full border-2 border-gray-300/70 hover:border-amber-500 text-gray-700 hover:text-amber-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {fromProperty ? 'Sign In & Apply' : 'Sign In Instead'}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
