// src/pages/VerificationSuccess.jsx - UPDATED WITH ORANGE THEME
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Mail, CheckCircle, ArrowRight, Shield, Clock, Home,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function VerificationSuccess() {
  const location = useLocation();
  const { resendVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const email = location.state?.email || '';
  const name = location.state?.name || '';

  const handleResendVerification = async () => {
    if (!email) return;
    
    try {
      setResending(true);
      setResendError('');
      setResendSuccess(false);
      
      const result = await resendVerification(email);
      
      if (result.success) {
        setResendSuccess(true);
      } else {
        setResendError(result.error || 'Failed to resend verification email.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setResendError('An error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-8 group transition-colors"
        >
          <Home className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Success Card */}
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl blur-2xl opacity-10"></div>
          
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Header */}
            <div className="p-8 text-center border-b border-gray-100">
              <div className="relative inline-block mb-6">
                {/* Animated Circles */}
                <div className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 bg-orange-300/30 rounded-full animate-pulse"></div>
                
                {/* Main Icon */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <Mail className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Check Your Email!
              </h1>
              <p className="text-gray-600">
                We've sent a verification link to your inbox
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Steps */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center">
                      <span className="text-orange-600 font-bold">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Open Your Email</h3>
                    <p className="text-gray-600 text-sm">
                      Look for an email from <span className="font-medium text-orange-600">Palms Estate</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center">
                      <span className="text-orange-600 font-bold">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Click Verification Link</h3>
                    <p className="text-gray-600 text-sm">
                      Click the "Verify Email" button or link in the email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center">
                      <span className="text-orange-600 font-bold">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Access Your Account</h3>
                    <p className="text-gray-600 text-sm">
                      Return here to sign in with your verified account
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Important Tips</h4>
                    <ul className="space-y-2 text-sm text-amber-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Check your spam or junk folder if you don't see the email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>The verification link expires in 24 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Make sure you entered the correct email address: <strong>{email}</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Resend Verification Button */}
              <div className="mb-6">
                <button
                  onClick={handleResendVerification}
                  disabled={resending || !email}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {resending ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Resend Verification Email
                    </>
                  )}
                </button>
                
                {resendSuccess && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm text-center">
                      ✅ Verification email sent successfully!
                    </p>
                  </div>
                )}
                
                {resendError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm text-center">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      {resendError}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Link
                  to="/signin"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Go to Sign In
                </Link>
                
                <Link
                  to="/"
                  className="w-full border-2 border-gray-300/70 hover:border-orange-300 text-gray-700 hover:text-orange-700 font-medium py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                >
                  Return to Homepage
                </Link>
              </div>

              {/* Support */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Need help? Contact{' '}
                  <a href="mailto:admin@palmsestate.org" className="text-orange-600 hover:text-orange-700 font-medium">
                    admin@palmsestate.org
                  </a>
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
