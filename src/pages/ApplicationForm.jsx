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
        // Fallback mock (your original)
        const mockProperties = [ /* your mock array */ ];
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
    // your validation
    return true; // simplified
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setSubmitting(true);
    try {
      const { data: application, error } = await supabase
        .from('applications')
        .insert([ /* your insert object */ ])
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

    const card = elements.getElement(CardElement);
    const applicationId = localStorage.getItem('currentApplicationId');

    setSubmitting(true);

    try {
      const response = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: APPLICATION_FEE, applicationId, propertyTitle: property.title }),
      });

      const { clientSecret } = await response.json();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (stripeError) throw stripeError;

      if (paymentIntent.status === 'succeeded') {
        // update Supabase, send email, setStep(3)
        // your handlePaymentSuccess logic
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ... rest of your loading, property not found, step 1 form, step 3 success

  return (
    // your full return JSX with step 1, step 2 with CardElement and handlePayment on button
  );
}

export default ApplicationForm;
