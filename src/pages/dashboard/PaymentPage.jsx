import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, CreditCard, CheckCircle, Shield, Lock, 
  Building2, DollarSign, Calendar, AlertCircle, 
  CreditCard as CardIcon, Bank, Smartphone
} from 'lucide-react';

function PaymentPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [application, setApplication] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  useEffect(() => {
    loadApplication();
  }, [id, user]);

  const loadApplication = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (title, location, price_per_week)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, number: value });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;

    // Validate card details
    if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length !== 5) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (!cardDetails.cvc || cardDetails.cvc.length !== 3) {
        alert('Please enter a valid 3-digit CVC');
        return;
      }
      if (!cardDetails.name) {
        alert('Please enter the name on card');
        return;
      }
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update application status
      const { error } = await supabase
        .from('applications')
        .update({ 
          payment_status: 'completed',
          status: 'approved'
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      alert('Payment processed successfully! Your application has been approved.');
      navigate(`/dashboard/applications/${id}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h1>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist or you don't have access.</p>
          <button
            onClick={() => navigate('/dashboard/applications')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-amber-50/20 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/dashboard/applications/${id}`)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Application
        </button>

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
              <p className="text-gray-600">Application #{application.id.slice(0, 8)}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Payment Required</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={application.properties?.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4'}
                      alt={application.properties?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{application.properties?.title}</h3>
                    <p className="text-sm text-gray-600">{application.properties?.location}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Fee</span>
                    <span className="font-medium">{formatCurrency(application.application_fee || 50)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium">{formatCurrency(5)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-medium text-gray-900">Total Amount</span>
                    <span className="font-bold text-lg text-gray-900">
                      {formatCurrency((application.application_fee || 50) + 5)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Secure Payment</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your payment is encrypted and secure. We use industry-standard SSL encryption to protect your information.
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-gray-200 hover:border-amber-200'
                      }`}
                    >
                      <CardIcon className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium">Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                        paymentMethod === 'bank' 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-gray-200 hover:border-amber-200'
                      }`}
                    >
                      <Bank className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium">Bank Transfer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('digital')}
                      className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                        paymentMethod === 'digital' 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-gray-200 hover:border-amber-200'
                      }`}
                    >
                      <Smartphone className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium">Digital Wallet</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Bank Transfer Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                        <p className="font-medium">Palms Estate Trust Bank</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Account Number</p>
                        <p className="font-medium">1234 5678 9012 3456</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Routing Number</p>
                        <p className="font-medium">021000021</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Reference</p>
                        <p className="font-medium">APP-{application.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'digital' && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Digital Wallet</h3>
                    <p className="text-gray-600 mb-4">
                      After clicking "Pay Now", you will be redirected to our secure payment gateway to complete the transaction.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Supports Apple Pay, Google Pay, and PayPal</span>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span>Your payment is secure and encrypted</span>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay {formatCurrency((application.application_fee || 50) + 5)}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By completing this payment, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Bank-Level Security</h3>
              <p className="text-sm text-gray-600">256-bit SSL encryption for all transactions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">PCI Compliant</h3>
              <p className="text-sm text-gray-600">We meet all Payment Card Industry standards</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Money-Back Guarantee</h3>
              <p className="text-sm text-gray-600">Full refund if application is not approved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
