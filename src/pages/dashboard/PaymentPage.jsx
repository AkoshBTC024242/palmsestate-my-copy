// src/pages/dashboard/PaymentPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import {
  CreditCard, Lock, Shield, CheckCircle,
  AlertCircle, ArrowLeft, Clock, Building2,
  DollarSign, FileText, CalendarDays, User
} from 'lucide-react';

function PaymentPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    saveCard: false
  });

  useEffect(() => {
    if (id && user) {
      loadApplicationDetails();
    }
  }, [id, user]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      
      // Load application
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('status', 'pre_approved')
        .single();

      if (appError) throw appError;
      
      if (!appData) {
        navigate('/dashboard/applications');
        return;
      }

      setApplication(appData);

      // Load property details
      if (appData.property_id) {
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', appData.property_id)
          .single();

        if (!propertyError && propertyData) {
          setProperty(propertyData);
        }
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      navigate('/dashboard/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const validateForm = () => {
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      return 'Please enter a valid 16-digit card number';
    }
    
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!paymentData.cvv || paymentData.cvv.length !== 3) {
      return 'Please enter a valid 3-digit CVV';
    }
    
    if (!paymentData.nameOnCard) {
      return 'Please enter the name on card';
    }
    
    return '';
  };

  const processPayment = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real application, you would integrate with a payment gateway here
      // For now, we'll simulate a successful payment
      
      // Create a payment record
      const paymentRecord = {
        application_id: id,
        user_id: user.id,
        amount: 50, // $50 application fee
        currency: 'USD',
        status: 'completed',
        payment_method: 'credit_card',
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        card_last_four: paymentData.cardNumber.slice(-4),
        created_at: new Date().toISOString()
      };

      // Save payment to database
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([paymentRecord]);

      if (paymentError) throw paymentError;

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'paid_under_review',
          updated_at: new Date().toISOString(),
          application_fee: 50
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate(`/dashboard/applications/${id}`);
      }, 3000);

    } catch (error) {
      console.error('Payment processing error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading payment details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Application Not Found</h3>
            <p className="text-gray-600 mb-6">Unable to process payment for this application.</p>
            <button
              onClick={() => navigate('/dashboard/applications')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Applications
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (paymentSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your application fee has been processed successfully. Your application is now under final review.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Transaction ID:</span>
                <span className="font-medium text-emerald-700">txn_{Date.now()}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Amount:</span>
                <span className="font-bold text-xl text-emerald-700">$50.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Status:</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                  Completed
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Redirecting to application details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/dashboard/applications/${id}`)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Application
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">
            Pay the application fee to proceed with your application review
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                  <p className="text-gray-600">Enter your credit card information</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              <form className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="3"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Name on Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="nameOnCard"
                      value={paymentData.nameOnCard}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Save Card Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="saveCard"
                    checked={paymentData.saveCard}
                    onChange={handleInputChange}
                    id="saveCard"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                    Save this card for future payments
                  </label>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium mb-1">Secure Payment</p>
                      <p className="text-xs text-blue-700">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={processPayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6" />
                  Pay $50.00 Application Fee
                </>
              )}
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                {/* Property Info */}
                {property && (
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {property.main_image_url ? (
                          <img
                            src={property.main_image_url}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400 m-auto" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-1">{property.title}</h4>
                        <p className="text-sm text-gray-600">{property.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Application Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Application Fee</span>
                    <span className="font-medium">$50.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">$50.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Application Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium">#{application.reference_number || application.id.slice(-8)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">
                    {new Date(application.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                    Pre-Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-medium text-gray-900 mb-3">Accepted Payment Methods</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                All transactions are secure and encrypted. By completing this payment, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PaymentPage;
