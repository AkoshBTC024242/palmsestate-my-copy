import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [success, setSuccess] = useState(false);
  const [verificationInfo, setVerificationInfo] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();

  const from = location.state?.redirectTo || '/dashboard';
  const message = location.state?.message;

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
    setSuccess(false);
    setVerificationInfo(null);
    
    try {
      const userData = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
      };
      
      const result = await signUp(formData.email, formData.password, userData);
      
      if (result.requiresEmailConfirmation) {
        // Show verification message
        setVerificationInfo({
          email: formData.email,
          sentAt: result.confirmationSentAt
        });
        setSuccess(true);
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        // Email already confirmed
        navigate(from, { replace: true });
      }
      
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationInfo?.email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await useAuth().resendVerification(verificationInfo.email);
      if (result.success) {
        setSuccess(true);
        setVerificationInfo({
          ...verificationInfo,
          sentAt: new Date().toISOString()
        });
      } else {
        setError('Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success && verificationInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50 py-20 px-4">
        <div className="max-w-md w-full">
          <Link 
            to="/" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-sans font-medium mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="font-serif text-2xl font-bold text-center text-gray-800 mb-4">
                  Check Your Email!
                </h1>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <p className="text-green-800 mb-4">
                    We've sent a verification email to <strong>{verificationInfo.email}</strong>
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-green-700">Click the verification link in the email</p>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-700">Check your spam folder if you don't see it</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-green-700">After verification, you can sign in to your account</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-sans font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                  
                  <Link
                    to="/signin"
                    className="block text-center border-2 border-gray-300/70 hover:border-amber-500 text-gray-700 hover:text-amber-700 font-sans font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    Go to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="font-serif text-3xl font-bold text-center text-gray-800 mb-2">
                Join Palms Estate
              </h1>
              <p className="text-center text-gray-600 font-sans">
                Create your account for exclusive access
              </p>
              
              {message && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700 text-center">{message}</p>
                </div>
              )}
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
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 outline-none"
                        placeholder="John"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 outline-none"
                        placeholder="Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 outline-none"
                      placeholder="concierge@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 outline-none"
                      placeholder="+1 (555) 123-4567"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
                  <p className="mt-2 text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 outline-none"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    className="mt-1 mr-3 w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                    disabled={isLoading}
                  />
                  <label htmlFor="terms" className="font-sans text-sm text-gray-600">
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
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-sans font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300/50"></div>
                <span className="px-4 font-sans text-sm text-gray-500">Already have an account?</span>
                <div className="flex-1 border-t border-gray-300/50"></div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <Link
                  to="/signin"
                  className="inline-block w-full border-2 border-gray-300/70 hover:border-amber-500 text-gray-700 hover:text-amber-700 font-sans font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md"
                >
                  Sign In Instead
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
