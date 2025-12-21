import { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentFormComponent = ({ amount, onSuccess, onCancel, propertyTitle }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = 
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: 'Application Fee Payment',
          },
        });
      
      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }
      
      console.log('Payment method created:', paymentMethod.id);
      
      // Simulate API call to create payment intent
      // In production, you would call your backend here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate payment confirmation
      setSuccess(true);
      
      // Call success callback with payment data
      setTimeout(() => {
        onSuccess({
          paymentMethodId: paymentMethod.id,
          amount: amount,
          timestamp: new Date().toISOString(),
          currency: 'usd'
        });
      }, 2000);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
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

  return (
    <div className="w-full">
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 mb-6">
            Your application fee of ${(amount / 100).toFixed(2)} has been processed.
          </p>
          <div className="animate-pulse text-sm text-green-600">
            Processing your application...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Amount Display */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm font-medium text-gray-600">Application Fee</p>
                <p className="text-2xl font-serif font-bold text-gray-800">
                  ${(amount / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">for {propertyTitle}</p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <Lock className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-700">Secure</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-700">Encrypted</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Non-refundable • Required for all applications • Processed via Stripe
            </p>
          </div>

          {/* Card Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Credit Card Details
            </label>
            <div className="bg-white border border-gray-300 rounded-xl p-4 hover:border-amber-400 transition-colors">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <div className="flex items-center mt-3 text-sm text-gray-500">
              <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>We accept Visa, MasterCard, American Express, and Discover</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Application fee:</span>
                <span className="font-medium">${(amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Processing fee:</span>
                <span className="font-medium text-green-600">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total amount:</span>
                <span className="text-xl font-bold text-gray-800">${(amount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Test Card Information (for development) */}
          {import.meta.env.DEV && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Test Card Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700">
                <div>
                  <span className="font-medium">Card number:</span> 4242 4242 4242 4242
                </div>
                <div>
                  <span className="font-medium">Expiry:</span> Any future date
                </div>
                <div>
                  <span className="font-medium">CVC:</span> Any 3 digits
                </div>
                <div>
                  <span className="font-medium">ZIP:</span> Any 5 digits
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || processing}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </span>
              ) : (
                `Pay $${(amount / 100).toFixed(2)} Now`
              )}
            </button>
          </div>

          {/* Security Badges */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-4">
              Your payment is secure and encrypted
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-xs text-gray-500">256-bit SSL</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🛡️</div>
                <p className="text-xs text-gray-500">PCI Compliant</p>
              </div>
              <div className="text-center">
                <img 
                  src="https://stripe.com/img/v3/home/twitter.png" 
                  alt="Stripe" 
                  className="h-6 w-auto mx-auto mb-1 opacity-70"
                />
                <p className="text-xs text-gray-500">Powered by Stripe</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <p className="text-xs text-gray-500">No Card Storage</p>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By proceeding, you agree to our{' '}
              <a href="/terms" className="text-amber-600 hover:text-amber-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

// Wrapper component with Stripe Elements
const PaymentForm = ({ amount, onSuccess, onCancel, propertyTitle = 'Property' }) => {
  // Check if Stripe is configured
  const isStripeConfigured = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_');
  
  if (!isStripeConfigured) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">
          Payment System Not Configured
        </h3>
        <p className="text-gray-600 mb-6">
          Stripe payment gateway is not set up. Please configure your Stripe publishable key.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-left max-w-md mx-auto">
          <p className="text-sm text-gray-700 mb-2">To fix this:</p>
          <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
            <li>Sign up at <a href="https://stripe.com" className="text-blue-600 underline">stripe.com</a></li>
            <li>Get your test publishable key (starts with pk_test_)</li>
            <li>Add it to your .env.local file: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key</li>
            <li>Restart your development server</li>
          </ol>
        </div>
        <button
          onClick={onCancel}
          className="mt-6 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

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
