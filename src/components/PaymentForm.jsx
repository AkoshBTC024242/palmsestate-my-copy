import { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, Shield, Loader } from 'lucide-react';

const PaymentForm = ({ amount = 5000, onSuccess, onCancel, propertyTitle }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card input not found.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Step 1: Create PaymentIntent on your Supabase Edge Function
      const applicationId = localStorage.getItem('currentApplicationId');
      if (!applicationId) {
        throw new Error('Application ID not found. Please restart the application.');
      }

      const response = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          applicationId,
          propertyTitle,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Step 2: Confirm the payment on the client
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: propertyTitle ? `Application for ${propertyTitle}` : 'Palms Estate Application',
          },
        },
      });

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        onSuccess({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        });
      } else {
        setError(`Payment status: ${paymentIntent.status}. Please contact support.`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const CARD_OPTIONS = {
    style: {
      base: {
        color: '#1f2937',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  };

  if (succeeded) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Your application is now under review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Application Fee</h3>
            <p className="opacity-90">Non-refundable processing fee</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">${(amount / 100).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-xl bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200">
          <CardElement options={CARD_OPTIONS} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          We accept Visa, MasterCard, American Express, and Discover
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={processing || !stripe}
          className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
        >
          {processing ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay Application Fee'
          )}
        </button>
      </div>

      {/* Security Info */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-1" />
            SSL Encrypted
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            Secure Payment
          </div>
        </div>
        <p>Your card details are never stored on our servers.</p>
      </div>
    </form>
  );
};

export default PaymentForm;
