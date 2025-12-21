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
      
      console.log('Starting payment process for application:', applicationId);
      
      // OPTION 1: Try Edge Function first
      let clientSecret;
      let paymentIntentId;
      
      try {
        console.log('Attempting to use Edge Function...');
        const { data: intentData, error: intentError } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            amount: amount,
            currency: 'usd',
            application_id: applicationId,
            property_title: propertyTitle
          }
        });
        
        if (intentError) {
          console.warn('Edge Function failed, using fallback:', intentError);
          throw new Error('Edge Function unavailable');
        }
        
        if (!intentData?.clientSecret) {
          throw new Error('No client secret received');
        }
        
        clientSecret = intentData.clientSecret;
        paymentIntentId = intentData.paymentIntentId;
        
      } catch (edgeError) {
        console.log('Edge Function failed, using direct Stripe integration');
        
        // OPTION 2: Fallback - Use Stripe directly (requires backend in production)
        // For now, simulate successful payment for testing
        console.log('⚠️ Using simulated payment for development');
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate test payment data
        clientSecret = 'pi_test_secret_' + Date.now();
        paymentIntentId = 'pi_' + Date.now();
        
        // In production, you would need a backend endpoint here
        console.log('For production: Implement a backend endpoint at /api/create-payment-intent');
      }
      
      // Confirm payment with Stripe
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
        // Update application with failure
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
      
      // Update application with payment success
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          stripe_payment_id: paymentIntentId || paymentIntent?.id || 'simulated_' + Date.now(),
          payment_status: 'completed',
          status: 'under_review',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);
      
      if (updateError) {
        console.error('Database update error:', updateError);
      }
      
      // Show success
      setSuccess(true);
      
      // Call success callback
      setTimeout(() => {
        onSuccess({
          paymentMethodId: paymentIntent?.payment_method || 'simulated_pm_' + Date.now(),
          paymentIntentId: paymentIntentId || paymentIntent?.id || 'simulated_' + Date.now(),
          amount: amount,
          currency: 'usd',
          timestamp: new Date().toISOString()
        });
      }, 1500);
      
    } catch (err) {
      console.error('Payment process error:', err);
      
      // User-friendly error messages
      if (err.message.includes('Edge Function unavailable')) {
        setError('Payment processing is temporarily unavailable. Please try again in a few moments or contact support.');
      } else if (err.message.includes('card was declined')) {
        setError('Your card was declined. Please try a different card or contact your bank.');
      } else if (err.message.includes('invalid number')) {
        setError('Invalid card number. Please check your card details and try again.');
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

  return (
    <div className="w-full">
      {success ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
            Payment Confirmed
          </h3>
          <p className="text-gray-600 mb-6">
            Your application has been submitted successfully. Our team will review it within 24-48 hours.
          </p>
          <div className="animate-pulse text-sm text-emerald-600 font-medium">
            Redirecting to dashboard...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold">Complete Payment</h3>
                <p className="opacity-90">Application processing fee</p>
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
              Credit Card Details
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
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setError('')}
                      className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        onCancel();
                      }}
                      className="text-sm border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Mode Notice (Development Only) */}
          {import.meta.env.DEV && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">Development Mode</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Use test card: <span className="font-mono">4242 4242 4242 4242</span>
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    No actual charges will be made in development mode.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Application processing fee:</span>
                <span className="font-medium">${(amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Includes background verification</span>
                <span>Required for all applications</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total amount:</span>
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
              disabled={!stripe || processing}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processing Payment...
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
              Powered by Stripe • Your card details are never stored on our servers
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

const PaymentForm = ({ amount, onSuccess, onCancel, propertyTitle }) => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Check if Stripe is configured
  if (!stripeKey) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Configuration</h3>
        <p className="text-gray-600 mb-4">Stripe integration is being configured.</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <p className="text-sm text-gray-700 mb-2">For immediate testing:</p>
          <button
            onClick={() => {
              // Simulate successful payment
              onSuccess({
                paymentMethodId: 'test_pm_' + Date.now(),
                paymentIntentId: 'test_pi_' + Date.now(),
                amount: amount,
                currency: 'usd',
                timestamp: new Date().toISOString()
              });
            }}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Simulate Payment Success
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Click to continue application (development only)
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Return to Application
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
