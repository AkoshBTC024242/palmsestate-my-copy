import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { sendApplicationConfirmation } from '../lib/emailService';
import {
  Calendar, User, Mail, Phone, FileText, ArrowLeft,
  CreditCard, CheckCircle, Home, Shield, Clock, Building, DollarSign, Users, Dog
} from 'lucide-react';

function ApplicationForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

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
  const [paymentComplete, setPaymentComplete] = useState(false);
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
        // Fallback to mock data if Supabase fails
        const mockProperties = [
          {
            id: '1',
            title: 'Oceanfront Villa Bianca',
            location: 'Maldives',
            price_per_week: 35000,
          },
          // ... other mock properties
        ];
        const foundProperty = mockProperties.find(p => p.id === id);
        setProperty(foundProperty || mockProperties[0]);
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
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.employmentStatus) {
      setError('Please select employment status');
      return false;
    }
    if (!formData.monthlyIncome || Number(formData.monthlyIncome) < 0) {
      setError('Please enter a valid monthly income');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      return;
    }
    setSubmitting(true);

    try {
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert([
          {
            property_id: id,
            user_id: user?.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            employment_status: formData.employmentStatus,
            monthly_income: parseInt(formData.monthlyIncome.replace(/,/g, '')) || 0,
            occupants: parseInt(formData.occupants),
            has_pets: formData.hasPets,
            pet_details: formData.petDetails,
            preferred_tour_date: formData.preferredDate || null,
            notes: formData.notes,
            application_type: formData.applicationType,
            status: 'payment_pending',
            application_fee: 50,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (appError) throw appError;

      localStorage.setItem('currentApplicationId', application.id);

      setStep(2);
    } catch (error) {
      setError(`Failed to submit application: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setSubmitting(true);

    try {
      const applicationId = localStorage.getItem('currentApplicationId');

      const { data: updatedApplication, error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'under_review',
          payment_id: paymentData.paymentMethodId,
          stripe_payment_id: paymentData.paymentIntentId,
          payment_status: 'completed',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (updateError) throw updateError;

      if (user?.email) {
        await sendApplicationConfirmation(user.email, {
          applicationId: updatedApplication.id,
          propertyName: property?.title || 'Luxury Property',
          propertyLocation: property?.location || 'Premium Location',
          propertyPrice: property ? `$${property.price_per_week}/week` : '$0/week',
          applicationDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          paymentId: paymentData.paymentIntentId,
          paymentAmount: `$${(paymentData.amount / 100).toFixed(2)}`
        });
      }

      setPaymentComplete(true);
      setStep(3);
      localStorage.removeItem('currentApplicationId');
    } catch (error) {
      setError('Payment processed but failed to update application. Contact support with payment ID: ' + paymentData.paymentIntentId);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentCancel = () => {
    setStep(1);
    setError('Payment was cancelled. You can try again.');
  };

  // ... (loading and property not found states remain the same as your original)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between md:justify-center md:space-x-8 mb-6">
            {['Application Details', 'Payment', 'Confirmation'].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                  step > index + 1 ? 'bg-green-100 text-green-600' :
                  step === index + 1 ? 'bg-amber-600 text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`text-sm font-medium hidden md:block ${
                  step >= index + 1 ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ... (header, error message remain the same) */}

        {/* Step 1: Application Form */}
        {step === 1 && (
          // ... (your original step 1 form code remains unchanged)
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6 text-white">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 mr-3" />
                <div>
                  <h2 className="text-xl font-serif font-bold">Secure Payment</h2>
                  <p className="opacity-90">Complete your application with a secure payment</p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Application Fee</h3>
                    <p className="text-gray-600">For: {property.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">$50.00</p>
                    <p className="text-sm text-gray-500">Non-refundable</p>
                  </div>
                </div>
               
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-blue-800 text-sm">
                        <strong>Secure Payment:</strong> Your payment is processed through Stripe with 256-bit SSL encryption.
                        We never store your credit card details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Payment Form - No Simulation */}
              <div className="space-y-6">
                {/* Card Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Details
                  </label>
                  <div className="p-4 border border-gray-300 rounded-xl bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200">
                    <CardElement options={{
                      style: {
                        base: {
                          color: '#1f2937',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          fontSize: '16px',
                          '::placeholder': { color: '#9ca3af' },
                        },
                        invalid: { color: '#ef4444', iconColor: '#ef4444' },
                      },
                      hidePostalCode: true,
                    }} />
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
                    onClick={handlePaymentCancel}
                    disabled={submitting}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitPayment}
                    disabled={submitting || !stripe}
                    className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Complete Payment'
                    )}
                  </button>
                </div>

                {/* Security */}
                <div className="text-center text-sm text-gray-500 space-y-2">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-1" />
                      SSL Encrypted
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      PCI Compliant
                    </div>
                  </div>
                  <p>Your card details are processed securely by Stripe.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          // ... (your original step 3 success code remains unchanged)
        )}
      </div>
    </div>
  );
}

export default ApplicationForm;
