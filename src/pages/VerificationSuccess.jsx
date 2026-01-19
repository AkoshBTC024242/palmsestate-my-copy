// src/pages/VerificationSuccess.jsx - UPDATED VERSION
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, Home, ArrowRight, ShieldCheck, Sparkles, Building2, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function VerificationSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshSession } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Check if coming from email confirmation
    const type = searchParams.get('type');
    const confirmedEmail = searchParams.get('email');
    
    if (type === 'signup' && confirmedEmail) {
      setEmail(confirmedEmail);
      setIsVerified(true);
      
      // Refresh auth session to update user state
      refreshSession?.();
      
      // Start countdown for redirect
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // Not from email confirmation, just show regular success
      setEmail(searchParams.get('email') || 'your email');
      setIsVerified(false);
      setLoading(false);
    }
  }, [searchParams, navigate, refreshSession]);

  const handleGoToProperties = () => {
    navigate('/properties');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading && isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Account...</h2>
          <p className="text-gray-600">Please wait while we confirm your email</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-20"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl"></div>

          <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-white/20 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              {isVerified ? (
                <>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Email Verified Successfully!</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome to Palms Estate!
                  </h1>
                  <p className="text-gray-600">
                    Your account has been activated and is ready to use
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">Email Verification Sent</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    One Last Step!
                  </h1>
                  <p className="text-gray-600">
                    Please verify your email to activate your account
                  </p>
                </>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Status Message */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${
                  isVerified 
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200' 
                    : 'bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200'
                } rounded-full mb-4`}>
                  {isVerified ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <Mail className="w-8 h-8 text-orange-600" />
                  )}
                </div>
                
                {isVerified ? (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Account Activated Successfully!
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Your email <span className="font-semibold">{email}</span> has been verified
                    </p>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 inline-block">
                      <p className="text-green-700 font-medium">
                        Redirecting to dashboard in {countdown} seconds...
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Check Your Inbox
                    </h2>
                    <p className="text-gray-600 mb-4">
                      We've sent a verification link to:
                    </p>
                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 inline-block max-w-full">
                      <p className="font-medium text-gray-800 break-all">{email || 'your email address'}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Can't find the email? Check your spam folder
                    </p>
                  </>
                )}
              </div>

              {/* Next Steps */}
              {isVerified ? (
                <div className="space-y-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      <h3 className="font-bold text-gray-800">Ready to Get Started?</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-600 text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">Browse Premium Properties</h4>
                          <p className="text-sm text-gray-600">Explore our curated collection of luxury rentals</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-600 text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">Save Your Favorites</h4>
                          <p className="text-sm text-gray-600">Bookmark properties you're interested in</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-600 text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">Submit Applications</h4>
                          <p className="text-sm text-gray-600">Apply for properties directly from your dashboard</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 mb-8">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck className="w-6 h-6 text-orange-600" />
                      <h3 className="font-bold text-gray-800">Why Verify Your Email?</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Secure your account and personal information</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Receive important updates about your applications</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Access all features of your dashboard</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                {isVerified ? (
                  <>
                    <button
                      onClick={handleGoToDashboard}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <Home className="w-5 h-5" />
                      Go to Your Dashboard
                    </button>
                    
                    <button
                      onClick={handleGoToProperties}
                      className="w-full border-2 border-green-500 hover:border-green-600 text-green-600 hover:text-green-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-3"
                    >
                      <Building2 className="w-5 h-5" />
                      Browse Properties First
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/properties"
                      className="block w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <Building2 className="w-5 h-5" />
                      Browse Properties While You Wait
                    </Link>

                    <Link
                      to="/"
                      className="block w-full border-2 border-gray-300/70 hover:border-orange-500 text-gray-700 hover:text-orange-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-3"
                    >
                      <ArrowRight className="w-5 h-5" />
                      Return to Homepage
                    </Link>
                  </>
                )}
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Need help?{' '}
                  <Link to="/contact" className="text-green-600 hover:text-green-700 font-medium">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationSuccess;
