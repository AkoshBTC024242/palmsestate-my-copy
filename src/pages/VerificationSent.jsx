// src/pages/VerificationSent.jsx
import { Link } from 'react-router-dom';
import { Mail, Clock, Home, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

function VerificationSent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Mail className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email</h1>
          <p className="text-gray-600">We've sent a verification link to your email address</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="font-bold text-gray-800">What to do next:</h2>
          </div>
          <ol className="text-left space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">1</span>
              <span>Open your email inbox</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">2</span>
              <span>Click the verification link in the email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">3</span>
              <span>Your account will be activated</span>
            </li>
          </ol>
        </div>
        
        <div className="space-y-3">
          <Link
            to="/properties"
            className="block w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
          >
            Browse Properties While Waiting
          </Link>
          <Link
            to="/"
            className="block w-full border-2 border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerificationSent;
