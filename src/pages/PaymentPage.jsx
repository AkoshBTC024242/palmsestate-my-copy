// src/pages/PaymentPage.jsx - ENHANCED VERSION
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  ArrowLeft,
  Shield,
  Lock,
  DollarSign,
  Calendar,
  Home,
  FileText,
  Check,
  XCircle,
  Send
} from 'lucide-react';
import { sendApplicationConfirmation } from '../lib/emailService';

function PaymentPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const APPLICATION_FEE = 5000; // $50.00 in cents

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch application with property details
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*, property:properties(*)')
        .eq('id', id)
        .single();

      if (appError) throw new Error('Failed to load application: ' + appError.message);
      
      // Check if user is authorized
      if (!user || appData.user_id !== user.id) {
        throw new Error('Unauthorized access to this application');
      }

      // Check if application is eligible for payment
      if (appData.status !== 'pre_approved' && appData.status !== 'payment_pending') {
        throw new Error('This application is not ready for payment. Please wait for pre-approval.');
      }

      // Check if already paid
      if (appData.payment_status === 'paid' || appData.status === 'paid_under_review') {
        throw new Error('Payment already completed for this application');
      }

      setApplication(appData);
      
      if (appData.property) {
        setProperty(appData.property);
      }

    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setError('Stripe is not loaded yet');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Create payment intent
      const response = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/create-payment-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
        },
        body: JSON.stringify({
          amount: APPLICATION_FEE,
          applicationId: id,
          propertyTitle: property?.title || application.property_title || 'Property',
          applicationReference: application.reference_number,
          customerEmail: application.email,
          customerName: application.full_name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error('No client secret received from server');
      }

      // 2. Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: application.full_name,
            email: application.email,
            phone: application.phone,
          }
        },
        receipt_email: application.email,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Update application in database
        const updateData = {
          status: 'paid_under_review',
          payment_status: 'paid',
          stripe_payment_id: paymentIntent.id,
          payment_intent_id: paymentIntent.id,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_status_change: new Date().toISOString(),
          application_fee: APPLICATION_FEE / 100 // Store in dollars
        };

        const { error: updateError } = await supabase
          .from('applications')
          .update(updateData)
          .eq('id', id);

        if (updateError) {
          console.error('Failed to update application:', updateError);
          throw new Error('Payment succeeded but failed to update application. Please contact support.');
        }

        // 4. Log status change
        try {
          await supabase.from('application_status_logs').insert({
            application_id: id,
            from_status: application.status,
            to_status: 'paid_under_review',
            note: 'Application fee paid',
            changed_by: 'user',
            created_at: new Date().toISOString()
          });
        } catch (logError) {
          console.warn('Could not log status change:', logError);
        }

        // 5. Send confirmation email
        try {
          await sendApplicationConfirmation(application.email, {
            fullName: application.full_name,
            referenceNumber: application.reference_number,
            applicationId: application.id,
            propertyName: property?.title || application.property_title || 'Property',
            propertyLocation: property?.location || 'Location',
            status: 'paid_under_review',
            statusNote: 'Application fee has been paid. Your application is now under final review.',
            paymentAmount: `$${(APPLICATION_FEE / 100).toFixed(2)}`,
            paymentId: paymentIntent.id,
            paymentDate: new Date().toLocaleDateString()
          });
        } catch (emailError) {
          console.warn('Failed to send confirmation email:', emailError);
        }

        // 6. Also notify admin
        try {
          await sendApplicationConfirmation('admin@palmsestate.org', {
            fullName: application.full_name,
            referenceNumber: application.reference_number,
            applicationId: application.id,
            propertyName: property?.title || application.property_title || 'Property',
            status: 'paid_under_review',
            statusNote: `Application fee paid by ${application.full_name}. Payment ID: ${paymentIntent.id}`,
            paymentAmount: `$${(APPLICATION_FEE / 100).toFixed(2)}`
          });
        } catch (adminEmailError) {
          console.warn('Failed to send admin notification:', adminEmailError);
        }

        setPaymentDetails({
          paymentId: paymentIntent.id,
          amount: `$${(APPLICATION_FEE / 100).toFixed(2)}`,
          date: new Date().toLocaleString(),
          receiptUrl: paymentIntent.receipt_url
        });

        setSuccess(true);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
        <div className="max-w-md mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
                <button
                  onClick={() => navigate('/dashboard/applications')}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your application fee has been paid successfully. Your application is now under final review.
              </p>

              {/* Payment Details */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-bold text-gray-900">{formatCurrency(APPLICATION_FEE)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {paymentDetails?.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm text-gray-900">{paymentDetails.paymentId.substring(0, 12)}...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">What happens next?</h3>
                <ol className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <span className="text-sm text-gray-700">Final review of your application (2-3 business days)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <span className="text-sm text-gray-700">Background and reference checks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <span className="text-sm text-gray-700">Final decision notification via email</span>
                  </li>
                </ol>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard/applications')}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Applications
                </button>
                <button
                  onClick={() => navigate('/properties')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Application
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pay Application Fee</h1>
          <p className="text-gray-600">
            Complete your application by paying the non-refundable application fee
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Application Fee</h2>
              <p className="text-gray-600">Secure payment processed by Stripe</p>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">Secure</span>
            </div>
          </div>

          {/* Application Details */}
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Application Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reference Number</span>
                <span className="font-medium">#{application.reference_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Applicant</span>
                <span className="font-medium">{application.full_name}</span>
              </div>
              {property && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Property</span>
                  <span className="font-medium">{property.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Amount */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-3xl font-bold text-blue-600">{formatCurrency(APPLICATION_FEE)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Non-refundable application fee</p>
            </div>
          </div>

          {/* Card Form */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Card Details</h3>
            <div className="border border-gray-300 rounded-xl p-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                  },
                  hidePostalCode: true,
                }}
                onChange={handleCardChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Your payment is secure and encrypted
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-rose-800">Payment Error</p>
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handlePayment}
            disabled={!stripe || !elements || !cardComplete || submitting}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay {formatCurrency(APPLICATION_FEE)}
              </>
            )}
          </button>

          {/* Security Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-3">About the Application Fee</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Covers background and credit checks</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Required to process your application</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>Non-refundable (except where prohibited by law)</span>
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            By proceeding with this payment, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
