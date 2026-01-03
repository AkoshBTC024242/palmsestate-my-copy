// src/pages/VerificationSuccess.jsx
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight, Shield, Clock, Home } from 'lucide-react';

function VerificationSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-8 group transition-colors"
        >
          <Home className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Success Card */}
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-3xl blur-2xl opacity-10"></div>
          
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Header */}
            <div className="p-8 text-center border-b border-gray-100">
              <div className="relative inline-block mb-6">
                {/* Animated Circles */}
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 bg-emerald-300/30 rounded-full animate-pulse"></div>
                
                {/* Main Icon */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <Mail className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
                Check Your Email!
              </h1>
              <p className="text-gray-600 font-sans">
                We've sent a verification link to your inbox
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Steps */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Open Your Email</h3>
                    <p className="text-gray-600 text-sm">
                      Look for an email from <span className="font-medium text-emerald-600">Palms Estate</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">2</span>
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
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">3</span>
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
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
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
                        <span>Make sure you entered the correct email address</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Link
                  to="/signin"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Go to Sign In
                </Link>
                
                <Link
                  to="/"
                  className="w-full border-2 border-gray-300/70 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 font-medium py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                >
                  Return to Homepage
                </Link>
              </div>

              {/* Support */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the email?{' '}
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Resend Verification
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Need help? Contact{' '}
                  <a href="mailto:support@palmsestate.org" className="text-emerald-600 hover:text-emerald-700">
                    support@palmsestate.org
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
