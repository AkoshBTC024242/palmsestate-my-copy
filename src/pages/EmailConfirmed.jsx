// src/pages/EmailConfirmed.jsx - SHOWS AFTER CLICKING EMAIL LINK
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Sparkles, Home, ArrowRight, Building2, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function EmailConfirmed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  
  const [countdown, setCountdown] = useState(5);
  const [propertyId, setPropertyId] = useState(null);

  useEffect(() => {
    // Get the property ID if coming from a property application
    const propId = searchParams.get('propertyId');
    const email = searchParams.get('email');
    
    console.log('Email confirmed for:', email);
    
    if (propId) {
      setPropertyId(propId);
    }
    
    // Refresh auth session
    if (refreshSession) {
      refreshSession();
    }
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to property application or properties page
          if (propId) {
            navigate(`/properties/${propId}/apply`);
          } else {
            navigate('/properties');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams, navigate, refreshSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Email Verified!</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Account Activated Successfully
          </h1>
          
          <p className="text-gray-600 mb-4">
            {propertyId ? 
              'Your account is now active. Continuing to your property application...' :
              'Your account is now active. Taking you to browse properties...'
            }
          </p>
          
          <div className="text-lg font-bold text-green-600">
            Redirecting in {countdown} seconds...
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            {propertyId ? (
              <>
                <Target className="w-6 h-6 text-orange-600" />
                <h2 className="font-bold text-gray-800">Continue Your Application</h2>
              </>
            ) : (
              <>
                <Building2 className="w-6 h-6 text-blue-600" />
                <h2 className="font-bold text-gray-800">Browse Available Properties</h2>
              </>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">
            {propertyId
              ? 'Complete your rental application for the property you selected.'
              : 'Explore our premium rental properties and find your perfect home.'
            }
          </p>
          
          <button
            onClick={() => {
              if (propertyId) {
                navigate(`/properties/${propertyId}/apply`);
              } else {
                navigate('/properties');
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
          >
            {propertyId ? 'Go to Application' : 'Browse Properties Now'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Or go to your dashboard instead
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmed;
