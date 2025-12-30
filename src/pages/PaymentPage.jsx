import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, AlertCircle, Loader } from 'lucide-react';

function PaymentPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const APPLICATION_FEE = 5000;

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error || data.user_id !== user.id || data.status !== 'pre_approved') {
        setError('Invalid application or access denied');
      } else {
        setApplication(data);
      }
    } catch (err) {
      setError('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: APPLICATION_FEE,
          applicationId: id,
          propertyTitle: 'Luxury Property'
        }),
      });

      const { clientSecret } = await response.json();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (stripeError) throw stripeError;

      if (paymentIntent.status === 'succeeded') {
        await supabase
          .from('applications')
          .update({ status: 'paid_under_review', payment_id: paymentIntent.id })
          .eq('id', id);

        setSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (success) return <div>Payment Successful! Application under review.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Secure $50 Application Fee Payment</h2>
        <div className="border rounded-xl p-4 mb-6">
          <CardElement />
        </div>
        <button onClick={handlePayment} disabled={submitting}>
          {submitting ? 'Processing...' : 'Pay $50'}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
