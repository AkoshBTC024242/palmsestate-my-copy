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
      
      // STEP 1: Create a PaymentIntent on your backend
      // This is the crucial missing piece!
      const { paymentIntent, clientSecret, error: intentError } = await createPaymentIntent(amount);
      
      if (intentError) {
        throw new Error(intentError);
      }
      
      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }
      
      // STEP 2: Confirm the card payment
      const { error: confirmError, paymentIntent: confirmedPayment } = 
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Application Fee Payment',
            },
          },
          return_url: window.location.origin + '/application-success',
        });
      
      if (confirmError) {
        throw new Error(confirmError.message);
      }
      
      // STEP 3: Check if payment was successful
      if (confirmedPayment.status === 'succeeded') {
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
        throw new Error(`Payment status: ${confirmedPayment.status}`);
      }
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Function to create payment intent (you need to implement backend)
  const createPaymentIntent = async (amount) => {
    try {
      // Option 1: Call your own backend API
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, currency: 'usd' })
      // });
      // const data = await response.json();
      // return data;
      
      // Option 2: Temporary - Use Supabase Edge Function (recommended)
      // Uncomment and set up when ready
      // const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      //   body: { amount, currency: 'usd' }
      // });
      // if (error) throw error;
      // return data;
      
      // Option 3: FOR TESTING ONLY - Use test mode
      // This creates a test payment intent that will succeed without charging
      console.log('⚠️ TEST MODE: Using mock payment intent');
      return {
        clientSecret: 'pi_mock_secret_test',
        paymentIntent: { id: 'pi_mock_' + Date.now() }
      };
      
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  };

  // ... rest of your component stays the same until the test card section ...
  
  // Update the test card information section:
  {import.meta.env.DEV && (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
        <AlertCircle className="w-4 h-4 mr-2" />
        ⚠️ TEST MODE ACTIVE - No Real Charges
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-yellow-700">
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
          <span className="font-medium">Status:</span> Simulation only - No actual charge
        </div>
      </div>
      <p className="text-xs text-yellow-600 mt-2">
        For real payments, implement a backend endpoint at /api/create-payment-intent
      </p>
    </div>
  )}

  // ... rest of the component remains the same ...
};

// Wrapper component remains the same
const PaymentForm = ({ amount, onSuccess, onCancel, propertyTitle = 'Property' }) => {
  // ... same wrapper code ...
};

export default PaymentForm;
