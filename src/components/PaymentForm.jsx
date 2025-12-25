import { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import { CreditCard, Lock, CheckCircle, AlertCircle, Shield, Loader } from 'lucide-react';

// Load Stripe with your publishable key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentFormComponent = ({ amount, onSuccess, onCancel, propertyTitle }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);

  // Fetch PaymentIntent from Supabase Edge Function with customer data
  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Load customer data from localStorage (set by ApplicationForm)
        const applicantData = JSON.parse(localStorage.getItem('applicantData'));
        const applicationId = localStorage.getItem('currentApplicationId');
        
        if (!applicationId) {
          throw new Error('Application not found. Please restart the application process.');
        }
        
        if (!applicantData) {
          throw new Error('Customer information missing. Please complete the application form.');
        }

        // Validate required customer fields
        if (!applicantData.firstName || !applicantData.lastName) {
          throw new Error('Missing customer name information.');
        }
        if (!applicantData.email) {
          throw new Error('Missing customer email.');
        }
        if (!applicantData.billingAddress?.line1 || !applicantData.billingAddress?.city || 
            !applicantData.billingAddress?.state || !applicantData.billingAddress?.postalCode) {
          throw new Error('Missing billing address information.');
        }

        setCustomerInfo(applicantData);

        console.log('Creating payment intent for:', {
          applicationId,
          customerEmail: applicantData.email,
          customerName: `${applicantData.firstName} ${applicantData.lastName}`
        });

        // Call Supabase Edge Function with customer data
        const { data, error: funcError } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            amount: amount, // $50 = 5000 cents
            applicationId: applicationId,
            propertyTitle: propertyTitle,
            customerEmail: applicantData.email,
            customerName: `${applicantData.firstName} ${applicantData.lastName}`,
            customerPhone: applicantData.phone || '',
            billingAddress: applicantData.billingAddress
          }
        });

        if (funcError) {
          console.error('Edge Function error:', funcError);
          throw new Error(funcError.message || 'Failed to create payment intent');
        }

        if (!data || !data.clientSecret) {
          console.error('No client secret in response:', data);
          throw new Error('Payment server responded without payment details');
        }

        console.log('PaymentIntent created successfully');
        
        setClientSecret(data.clientSecret);
        setPaymentReady(true);
        
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError(`Unable to initialize payment: ${err.message}`);
        setPaymentReady(false);
      }
    };

    initializePayment();
  }, [amount, propertyTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret || !customerInfo) {
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

      const applicationId = localStorage.getItem('currentApplicationId');
      if (!applicationId) {
        throw new Error('Application not found. Please restart the application process.');
      }

      const fullName = `${customerInfo.firstName} ${customerInfo.lastName}`;
      console.log('Processing payment for:', {
        applicationId,
        customerName: fullName,
        customerEmail: customerInfo.email
      });
      
      // Real Stripe payment confirmation with customer data
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: fullName,
              email: customerInfo.email,
              phone: customerInfo.phone || '',
              address: {
                line1: customerInfo.billingAddress.line1 || '',
                line2: customerInfo.billingAddress.line2 || '',
                city: customerInfo.billingAddress.city || '',
                state: customerInfo.billingAddress.state || '',
                postal_code: customerInfo.billingAddress.postalCode || '',
                country: customerInfo.billingAddress.country || 'US',
              },
            },
          }
          // REMOVED shipping parameter - it was causing the secret key error
        }
      );

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update application in Supabase with payment details
        const { error: updateError } = await supabase
          .from('applications')
          .update({
            status: 'under_review',
            payment_intent_id: paymentIntent.id,
            stripe_payment_id: paymentIntent.id,
            payment_status: 'completed',
            payment_amount: paymentIntent.amount,
            payment_currency: paymentIntent.currency,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);

        if (updateError) {
          console.warn('Failed to update application status:', updateError);
        } else {
          console.log('Application status updated to under_review');
        }

        setSuccess(true);
        
        // Call onSuccess callback with real payment data
        setTimeout(() => {
          onSuccess({
            paymentMethodId: paymentIntent.payment_method,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            timestamp: new Date(paymentIntent.created * 1000).toISOString(),
            status: paymentIntent.status
          });
        }, 1500);
        
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(`Payment processing failed: ${err.message}. Please try again or contact support.`);
      
      // Update failed payment status
      try {
        const applicationId = localStorage.getItem('currentApplicationId');
        if (applicationId) {
          await supabase
            .from('applications')
            .update({
              payment_status: 'failed',
              payment_error: err.message
            })
            .eq('id', applicationId);
        }
      } catch (dbError) {
        console.error('Error updating failed payment:', dbError);
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

        {/* Development Mode Notice - Only show in development */}
        {import.meta.env.DEV && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Development Mode Active</p>
                <p className="text-sm text-blue-700 mt-1">
                  Using Stripe test mode. No actual charges will be made.
                  Test card: <span className="font-mono">4242 4242 4242 4242</span>
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Payment Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <div className="mt-3">
                  <p className="text-xs text-red-600">
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
            disabled={!stripe || processing || !paymentReady || !clientSecret || !customerInfo}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {processing ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : !paymentReady ? (
              'Initializing Payment...'
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
            Your payment is processed through Stripe's secure system
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
