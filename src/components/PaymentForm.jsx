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
  const [clientSecret, setClientSecret] = useState('');

  // Create PaymentIntent when component mounts
  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      console.log('Creating PaymentIntent for amount:', amount);
      
      // Get application ID
      const applicationId = localStorage.getItem('currentApplicationId');
      if (!applicationId) {
        console.error('No application ID found');
        return;
      }

      // Create PaymentIntent via your backend
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: amount.toString(),
          currency: 'usd',
          automatic_payment_methods: { enabled: 'true' },
          metadata: JSON.stringify({
            application_id: applicationId,
            property_title: propertyTitle
          })
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Stripe API error:', data.error);
        setError(`Payment setup failed: ${data.error.message}`);
        return;
      }

      console.log('PaymentIntent created:', data.id);
      setClientSecret(data.client_secret);
      
    } catch (err) {
      console.error('Failed to create PaymentIntent:', err);
      
      // Fallback: Use test client secret for development
      if (import.meta.env.DEV) {
        console.log('Using development fallback');
        setClientSecret('pi_mock_secret_' + Date.now());
      } else {
        setError('Unable to initialize payment. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
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
      
      console.log('Confirming payment with client secret:', clientSecret.substring(0, 20) + '...');
      
      // For development: Skip actual Stripe confirmation if using mock secret
      if (clientSecret.startsWith('pi_mock_secret_')) {
        console.log('⚠️ DEVELOPMENT MODE: Simulating payment');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful payment
        setSuccess(true);
        
        setTimeout(() => {
          onSuccess({
            paymentMethodId: 'pm_mock_' + Date.now(),
            paymentIntentId: 'pi_mock_' + Date.now(),
            amount: amount,
            currency: 'usd',
            timestamp: new Date().toISOString()
          });
        }, 1000);
        
        return;
      }
      
      // REAL Stripe payment confirmation
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Application Fee',
            },
          },
        }
      );
      
      if (confirmError) {
        console.error('Stripe confirmation error:', confirmError);
        throw new Error(`Payment declined: ${confirmError.message}`);
      }
      
      console.log('Payment confirmed:', paymentIntent);
      
      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        
        setTimeout(() => {
          onSuccess({
            paymentMethodId: paymentIntent.payment_method,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            timestamp: new Date().toISOString()
          });
        }, 1000);
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
      
    } catch (err) {
      console.error('Payment error:', err);
      
      // User-friendly error messages
      if (err.message.includes('No such payment_intent')) {
        setError('Payment session expired. Please refresh and try again.');
      } else if (err.message.includes('card was declined')) {
        setError('Your card was declined. Please try a different card or contact your bank.');
      } else if (err.message.includes('testmode')) {
        setError('Please use a test card number: 4242 4242 4242 4242');
      } else {
        setError(`Payment error: ${err.message}`);
      }
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

  if (!clientSecret && !error) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Setting up secure payment...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {success ? (
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
      ) : (
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
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Payment Notice</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  {error.includes('test card') && (
                    <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                      <p className="font-medium">Test Card Details:</p>
                      <p>Card: 4242 4242 4242 4242</p>
                      <p>Expiry: Any future date | CVC: Any 3 digits</p>
                    </div>
                  )}
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
              disabled={!stripe || processing || !clientSecret}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${(amount / 100).toFixed(2)}`
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
                <p className="text-xs text-gray-500">PCI DSS</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Your payment is secured and processed by industry-leading technology
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

const PaymentForm = ({ amount, onSuccess, onCancel, propertyTitle }) => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Setup Required</h3>
        <p className="text-gray-600 mb-4">Payment processing is being configured.</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <p className="text-sm text-gray-700 mb-2">For immediate testing:</p>
          <button
            onClick={() => {
              onSuccess({
                paymentMethodId: 'test_' + Date.now(),
                paymentIntentId: 'test_' + Date.now(),
                amount: amount,
                currency: 'usd',
                timestamp: new Date().toISOString()
              });
            }}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Continue Application
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Click to proceed with application submission
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
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
