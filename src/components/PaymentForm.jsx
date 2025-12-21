import { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Import your supabase client

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
      
      // STEP 1: Get application ID from localStorage
      const applicationId = localStorage.getItem('currentApplicationId');
      if (!applicationId) {
        throw new Error('Application not found. Please start over.');
      }
      
      // STEP 2: Create a REAL PaymentIntent using Supabase Edge Function
      const { data: intentData, error: intentError } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          amount: amount,
          currency: 'usd',
          application_id: applicationId,
          metadata: {
            application_id: applicationId,
            property_title: propertyTitle
          }
        }
      });
      
      if (intentError) {
        console.error('Edge function error:', intentError);
        throw new Error(`Payment setup failed: ${intentError.message}`);
      }
      
      if (!intentData || !intentData.clientSecret) {
        console.error('Invalid response from edge function:', intentData);
        throw new Error('Payment service configuration error');
      }
      
      console.log('PaymentIntent created:', intentData.paymentIntentId);
      
      // STEP 3: Confirm the card payment with Stripe
      const { error: confirmError, paymentIntent: confirmedPayment } = 
        await stripe.confirmCardPayment(intentData.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Application Fee Payment',
            },
          },
        });
      
      if (confirmError) {
        // Payment failed - log details
        console.error('Stripe confirm error:', confirmError);
        
        // Update application status to payment_failed
        await supabase
          .from('applications')
          .update({
            payment_status: 'failed',
            payment_error: confirmError.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);
        
        throw new Error(`Payment declined: ${confirmError.message}`);
      }
      
      // STEP 4: Verify payment succeeded
      if (confirmedPayment.status === 'succeeded') {
        console.log('✅ Payment confirmed:', confirmedPayment);
        
        // Update application with REAL payment data
        const { error: updateError } = await supabase
          .from('applications')
          .update({
            stripe_payment_id: confirmedPayment.id,
            payment_status: 'completed',
            payment_id: confirmedPayment.payment_method,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);
        
        if (updateError) {
          console.error('Failed to update application:', updateError);
          // Don't throw - payment succeeded but db update failed
        }
        
        setSuccess(true);
        
        // Call success callback with REAL payment data
        onSuccess({
          paymentMethodId: confirmedPayment.payment_method,
          paymentIntentId: confirmedPayment.id,
          amount: confirmedPayment.amount,
          currency: confirmedPayment.currency,
          timestamp: new Date().toISOString()
        });
        
      } else {
        // Payment not succeeded
        console.error('Payment not succeeded, status:', confirmedPayment.status);
        
        await supabase
          .from('applications')
          .update({
            payment_status: confirmedPayment.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);
        
        throw new Error(`Payment status: ${confirmedPayment.status}`);
      }
      
    } catch (err) {
      console.error('Payment process error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      
      // Show specific guidance for common errors
      if (err.message.includes('testmode')) {
        setError('Payment is in test mode. Please use a test card: 4242 4242 4242 4242');
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
            Your application fee of ${(amount / 100).toFixed(2)} has been charged.
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
                  <span className="text-sm font-medium text-green-700">Live Mode</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-700">Real Charge</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Non-refundable • Real credit card charge • Processed via Stripe
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
              <div>
                <span className="text-sm text-red-700 font-medium block mb-1">Payment Error</span>
                <span className="text-sm text-red-600">{error}</span>
              </div>
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
              <div className="flex justify-between items-center text-sm text-red-600">
                <span>⚠️ Real charge:</span>
                <span className="font-medium">${(amount / 100).toFixed(2)} will be charged</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total amount:</span>
                <span className="text-xl font-bold text-gray-800">${(amount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Live Mode Warning */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              ⚠️ LIVE PAYMENT MODE
            </h4>
            <div className="text-sm text-red-700">
              <p className="mb-2">This is a <strong>real payment</strong>. Your card will be charged ${(amount / 100).toFixed(2)}.</p>
              <p>For testing, use Stripe test cards:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2 text-xs">
                <div><span className="font-medium">Success:</span> 4242 4242 4242 4242</div>
                <div><span className="font-medium">Declined:</span> 4000 0000 0000 0002</div>
                <div><span className="font-medium">Expiry:</span> Any future date</div>
                <div><span className="font-medium">CVC:</span> Any 3 digits</div>
              </div>
            </div>
          </div>

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
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
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
                <div className="text-2xl mb-1">💳</div>
                <p className="text-xs text-gray-500">Live Payment</p>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By clicking "Pay Now", you authorize a charge of ${(amount / 100).toFixed(2)} to your card.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              See our{' '}
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
  const isStripeConfigured = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_');
  
  if (!isStripeConfigured) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">
          Stripe Not Configured
        </h3>
        <p className="text-gray-600 mb-4">
          Add your Stripe publishable key to .env.local:
        </p>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
          VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
        </div>
        <button
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
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
