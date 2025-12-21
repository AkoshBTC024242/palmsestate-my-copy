import { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, Shield, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
      
      // Get application ID
      const applicationId = localStorage.getItem('currentApplicationId');
      if (!applicationId) {
        throw new Error('Application not found. Please restart the application process.');
      }
      
      console.log('📝 Creating PaymentIntent for application:', applicationId);
      
      // STEP 1: Create PaymentIntent via Supabase Edge Function
      const { data: intentData, error: intentError } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          amount: amount,
          currency: 'usd',
          application_id: applicationId,
          property_title: propertyTitle
        }
      });
      
      if (intentError) {
        console.error('❌ Edge Function Error:', intentError);
        throw new Error(`Payment setup failed: ${intentError.message}`);
      }
      
      if (!intentData || !intentData.clientSecret) {
        console.error('❌ Invalid Edge Function Response:', intentData);
        throw new Error('Payment service returned invalid data');
      }
      
      console.log('✅ PaymentIntent created:', intentData.paymentIntentId);
      
      // STEP 2: Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
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
        console.error('❌ Stripe Payment Error:', confirmError);
        
        // Update application with failure
        await supabase
          .from('applications')
          .update({
            payment_status: 'failed',
            payment_error: confirmError.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);
        
        throw new Error(`Payment failed: ${confirmError.message}`);
      }
      
      // STEP 3: Check payment status
      console.log('💰 Payment Intent Status:', paymentIntent.status);
      
      if (paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded! ID:', paymentIntent.id);
        
        // Update application with payment success
        const { error: updateError } = await supabase
          .from('applications')
          .update({
            stripe_payment_id: paymentIntent.id,
            payment_status: 'completed',
            status: 'under_review',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);
        
        if (updateError) {
          console.error('⚠️ DB update error (payment succeeded):', updateError);
        }
        
        setSuccess(true);
        
        // Call success callback
        onSuccess({
          paymentMethodId: paymentIntent.payment_method,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          timestamp: new Date().toISOString()
        });
        
      } else {
        // Payment not complete
        console.warn('⚠️ Payment not complete, status:', paymentIntent.status);
        
        await supabase
          .from('applications')
          .update({
            payment_status: paymentIntent.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);
        
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      }
      
    } catch (err) {
      console.error('💥 Payment process error:', err);
      setError(err.message);
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
            Your card has been charged ${(amount / 100).toFixed(2)}.
          </p>
          <div className="animate-pulse text-sm text-green-600">
            Redirecting...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold">Live Payment</h3>
                <p className="opacity-90">Your card will be charged</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${(amount / 100).toFixed(2)}</p>
                <p className="text-sm opacity-90">Application Fee</p>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Credit Card Details *
            </label>
            <div className="bg-white border border-gray-300 rounded-xl p-4 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Payment Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Live Mode Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">⚠️ Live Payment Mode</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This is a <strong>real payment</strong>. ${(amount / 100).toFixed(2)} will be charged to your card.
                </p>
                <div className="mt-2 text-xs text-yellow-600">
                  <p className="font-medium mb-1">For testing (no real charge):</p>
                  <div className="grid grid-cols-2 gap-1">
                    <span>Card: 4242 4242 4242 4242</span>
                    <span>Expiry: Any future date</span>
                    <span>CVC: Any 3 digits</span>
                    <span>ZIP: Any 5 digits</span>
                  </div>
                </div>
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
              disabled={!stripe || processing}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
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

          {/* Security Footer */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="text-center">
                <Shield className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Secure</p>
              </div>
              <div className="text-center">
                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Encrypted</p>
              </div>
              <div className="text-center">
                <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">PCI DSS</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Powered by <span className="font-medium">Stripe</span> • Your card details are never stored
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

const PaymentForm = ({ amount, onSuccess, onCancel, propertyTitle }) => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const isLiveMode = stripeKey?.startsWith('pk_live_');
  
  if (!stripeKey) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Stripe Not Configured</h3>
        <p className="text-gray-600 mb-4">Add to .env.local:</p>
        <code className="block bg-gray-900 text-gray-100 p-3 rounded text-sm mb-4">
          VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
        </code>
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
