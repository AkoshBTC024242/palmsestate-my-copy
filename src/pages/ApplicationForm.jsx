import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { sendApplicationConfirmation } from '../lib/emailService';
import {
  Calendar, User, Mail, Phone, FileText, ArrowLeft,
  CreditCard, CheckCircle, Home, Shield, Clock, Building, DollarSign, Users, Dog, Loader, AlertCircle
} from 'lucide-react';

import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

function ApplicationForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    preferredDate: '',
    notes: '',
    agreeTerms: false,
    employmentStatus: '',
    monthlyIncome: '',
    occupants: '1',
    hasPets: false,
    petDetails: '',
    applicationType: 'rental'
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const APPLICATION_FEE = 5000; // $50 in cents

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (user && !formData.fullName) {
      const userFullName = user.user_metadata?.full_name || '';
      setFormData(prev => ({
        ...prev,
        fullName: userFullName,
        email: user.email || ''
      }));
    }
  }, [user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);

      const { data: supabaseProperty, error: supabaseError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (!supabaseError && supabaseProperty) {
        setProperty(supabaseProperty);
      } else {
        const mockProperties = [
          {
            id: '1',
            title: 'Oceanfront Villa Bianca',
            location: 'Maldives',
            price_per_week: 35000,
          },
          // add your other mock properties
        ];
        const found = mockProperties.find(p => p.id === id);
        setProperty(found || mockProperties[0]);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return false;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return false;
    if (!formData.phone.trim()) return false;
    if (!formData.agreeTerms) return false;
    return true;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) {
      setError('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { data: application, error } = await supabase
        .from('applications')
        .insert([
          {
            property_id: id,
            user_id: user?.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            notes: formData.notes,
            preferred_tour_date: formData.preferredDate || null,
            status: 'payment_pending',
            application_fee: 50,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      localStorage.setItem('currentApplicationId', application.id);
      setStep(2);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const applicationId = localStorage.getItem('currentApplicationId');

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: APPLICATION_FEE,
          applicationId,
          propertyTitle: property.title,
        }),
      });

      const { clientSecret } = await response.json();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) throw stripeError;

      if (paymentIntent.status === 'succeeded') {
        // Update Supabase
        const { error: updateError } = await supabase
          .from('applications')
          .update({ status: 'under_review', payment_status: 'completed', stripe_payment_id: paymentIntent.id })
          .eq('id', applicationId);

        if (updateError) throw updateError;

        // Send email
        await sendApplicationConfirmation(formData.email, { /* your data */ });

        setStep(3);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between">
            <div className={`text-center ${step >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>1. Details</div>
            <div className={`text-center ${step >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>2. Payment</div>
            <div className={`text-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>3. Complete</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-xl mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Your full step 1 form from original code */}
            <form onSubmit={handleStep1Submit}>
              {/* All your input fields, validation, submit button */}
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Continue to Payment'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 - Real Payment */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Secure Payment - $50.00</h2>
            <div className="border rounded-xl p-4 mb-6">
              <CardElement />
            </div>
            <button
              onClick={handlePayment}
              disabled={submitting || !stripe}
              className="w-full bg-amber-600 text-white py-4 rounded-xl"
            >
              {submitting ? 'Processing...' : 'Pay Application Fee'}
            </button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Application Submitted!</h2>
            <p>We'll review and get back to you soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationForm;
