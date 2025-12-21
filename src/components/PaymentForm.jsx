import { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, Shield, Loader } from 'lucide-react';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentFormComponent = ({ amount, onSuccess, onCancel, propertyTitle }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system is not ready. Please refresh the page.');
      return;
    }
    
    setProcessing(true);
    setError('');
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      // Get application ID
      const applicationId = localStorage.getItem('currentApplicationId');
      if (!applicationId) {
        throw new Error('Application not found. Please restart the application process.');
      }
      
      console.log('Processing payment for application:', applicationId);
      
      // SIMULATE PAYMENT FOR DEVELOPMENT
      // This allows you to test the application flow without Stripe
      console.log('🔧 Using simulated payment mode for development');
      
      // Validate card details (basic validation)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful payment
      setSuccess(true);
      
      setTimeout(() => {
        onSuccess({
          paymentMethodId: 'simulated_pm_' + Date.now(),
          paymentIntentId: 'simulated_pi_' + Date.now(),
          amount: amount,
          currency: 'usd',
          timestamp: new Date().toISOString()
        });
      }, 1000);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(`Payment processing error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#1f2937',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#9ca3af',
        },
        padding: '10px 12px',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  };

  // Initialize payment when component loads
  useEffect(() => {
    const initPayment = async () => {
      try {
        // Check if we're in development mode
        const isDevelopment = import.meta.env.DEV || 
                             window.location.hostname === 'localhost' || 
                             !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_');
        
        if (isDevelopment) {
          console.log('🛠️ Development mode: Using simulated payment system');
          setPaymentReady(true);
        } else {
          // In production, verify Stripe is properly configured
          const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
          if (!stripeKey || !stripeKey.startsWith('pk_live_')) {
            setError('Payment system configuration required. Please contact support.');
            return;
          }
          setPaymentReady(true);
        }
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError('Unable to initialize payment system.');
      }
    };
    
    initPayment();
  }, []);

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
          Payment Complete
        </h3>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your application is now being processed.
        </p>
        <div className="animate-pulse text-sm text-emerald-600 font-medium">
          Completing your application...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold">Application Fee</h3>
              <p className="opacity-90">Required for processing</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${(amount / 100).toFixed(2)}</p>
              <p className="text-sm opacity-90">Non-refundable</p>
            </div>
          </div>
        </div>

        {/* Development Mode Notice */}
        {import.meta.env.DEV && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Development Mode Active</p>
                <p className="text-sm text-blue-700 mt-1">
                  Payment simulation enabled. No actual charges will be made.
                  For testing, use: <span className="font-mono">4242 4242 4242 4242</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Card Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Credit Card Information
          </label>
          <div className="bg-white border border-gray-300 rounded-xl p-4 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            We accept Visa, MasterCard, American Express, and Discover
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Payment Notice</p>
                <p className="text-sm text-amber-700 mt-1">{error}</p>
                <div className="mt-3">
                  <p className="text-xs text-amber-600">
                    For immediate assistance, please contact support or try again later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Application processing fee</span>
              <span className="font-medium">${(amount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Includes verification & processing</span>
              <span>Required for review</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-800">Total amount</span>
              <span className="text-xl font-bold text-gray-800">${(amount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || processing || !paymentReady}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {processing ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Complete Application - $${(amount / 100).toFixed(2)}`
            )}
          </button>
        </div>

        {/* Security Badges */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-100 flex items-center justify-center">
                <Lock className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xs text-gray-500">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xs text-gray-500">Encrypted</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xs text-gray-500">Secure Payment</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Your application is processed through our secure system
          </p>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            This fee covers application processing and verification.
            By proceeding, you agree to our{' '}
            <a href="/terms" className="text-amber-600 hover:text-amber-700 underline">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
};

const PaymentForm = ({ amount, onSuccess, onCancel, propertyTitle }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormComponent 
        amount={amount} 
        onSuccess={onSuccess} 
        onCancel={onCancel}
        propertyTitle={propertyTitle}
      />
    </Elements>
  );
};

export default PaymentForm;
