import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { sendApplicationConfirmation } from '../lib/emailService';
import PaymentForm from '../components/PaymentForm';
import { 
  Calendar, User, Mail, Phone, FileText, ArrowLeft, 
  CreditCard, CheckCircle, Home, Shield, Clock, Building, 
  DollarSign, Users, Dog, MapPin, Home as HomeIcon, Globe,
  Flask
} from 'lucide-react';

function ApplicationForm() {
  const { id } = useParams();
  const { user, canUseTestMode } = useAuth();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    
    // Billing Address
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    
    // Application Details
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
  const [isTestMode, setIsTestMode] = useState(false);
  
  const APPLICATION_FEE = 5000;

  useEffect(() => {
    fetchProperty();
    checkTestMode();
  }, [id]);

  useEffect(() => {
    if (user && !formData.firstName) {
      // Try to extract first/last name from full name
      const userFullName = user.user_metadata?.full_name || '';
      const nameParts = userFullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
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
        // Fallback to mock data
        const mockProperties = [
          {
            id: '1',
            title: 'Oceanfront Villa Bianca',
            location: 'Maldives',
            price_per_week: 35000,
          },
          {
            id: '2',
            title: 'Skyline Penthouse',
            location: 'Manhattan, NY',
            price_per_week: 45000,
          },
          {
            id: '3',
            title: 'Mediterranean Estate',
            location: 'Saint-Tropez, France',
            price_per_week: 75000,
          },
          {
            id: '4',
            title: 'Modern Cliffside Villa',
            location: 'Big Sur, CA',
            price_per_week: 28000,
          },
          {
            id: '5',
            title: 'Alpine Chalet',
            location: 'Aspen, CO',
            price_per_week: 32000,
          },
          {
            id: '6',
            title: 'Urban Penthouse Loft',
            location: 'Miami Beach, FL',
            price_per_week: 38000,
          }
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

  const checkTestMode = async () => {
    if (!user || !canUseTestMode) return;
    
    try {
      // Check user_roles table for test mode
      const { data, error } = await supabase
        .from('user_roles')
        .select('test_mode')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.log('Checking test mode from system settings');
        // Check system_settings instead
        const { data: settings } = await supabase
          .from('system_settings')
          .select('test_mode')
          .single();
        
        if (settings?.test_mode?.enabled) {
          setIsTestMode(true);
          console.log('✅ Test mode enabled from system settings');
        }
      } else if (data && data.test_mode) {
        setIsTestMode(true);
        console.log('✅ Test mode enabled for admin user');
      }
    } catch (error) {
      console.log('Test mode check error:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('billing.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First and last name are required');
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
    
    // In test mode, billing address is optional
    if (!isTestMode) {
      if (!formData.billingAddress.line1.trim()) {
        setError('Billing address line 1 is required');
        return false;
      }
      if (!formData.billingAddress.city.trim()) {
        setError('City is required');
        return false;
      }
      if (!formData.billingAddress.state.trim()) {
        setError('State is required');
        return false;
      }
      if (!formData.billingAddress.postalCode.trim()) {
        setError('Postal code is required');
        return false;
      }
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
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const customerInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: fullName,
        email: formData.email,
        phone: formData.phone,
        billingAddress: formData.billingAddress
      };

      console.log('Submitting application. Test mode:', isTestMode);

      // Determine application status based on test mode
      let applicationStatus = 'payment_pending';
      let paymentStatus = 'pending';
      let applicationFee = 50;
      
      if (isTestMode) {
        applicationStatus = 'approved'; // Auto-approve for test mode
        paymentStatus = 'test_mode_skipped';
        applicationFee = 0;
      }

      // Create application record in database
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert([
          {
            property_id: id,
            user_id: user?.id,
            full_name: fullName,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            billing_address: formData.billingAddress,
            employment_status: formData.employmentStatus,
            monthly_income: parseInt(formData.monthlyIncome.replace(/,/g, '')) || 0,
            occupants: parseInt(formData.occupants),
            has_pets: formData.hasPets,
            pet_details: formData.petDetails,
            preferred_tour_date: formData.preferredDate || null,
            notes: formData.notes,
            application_type: formData.applicationType,
            status: applicationStatus,
            payment_status: paymentStatus,
            application_fee: applicationFee,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (appError) {
        console.error('Database error details:', appError);
        throw appError;
      }

      // Store application ID for next steps
      localStorage.setItem('currentApplicationId', application.id);
      localStorage.setItem('applicantData', JSON.stringify(customerInfo));
      
      console.log('Application created successfully:', application.id);
      
      // If test mode, skip payment and go to success
      if (isTestMode) {
        await handleTestModeSuccess(application);
      } else {
        // Move to payment step
        setStep(2);
      }

    } catch (error) {
      console.error('Full application error:', error);
      setError(`Failed to submit application: ${error.message}. Please try again or contact support.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestModeSuccess = async (application) => {
    try {
      // Send test mode confirmation email
      if (user?.email) {
        await sendApplicationConfirmation(user.email, {
          applicationId: application.id,
          propertyName: property?.title || 'Luxury Property',
          propertyLocation: property?.location || 'Premium Location',
          propertyPrice: property ? `$${property.price_per_week}/week` : '$0/week',
          applicationDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          paymentId: 'TEST_MODE_SKIPPED',
          paymentAmount: '$0.00',
          customerName: `${formData.firstName} ${formData.lastName}`,
          isTestMode: true,
          status: 'auto-approved'
        });
      }

      setPaymentComplete(true);
      setStep(3);
      
      // Clear stored data
      localStorage.removeItem('currentApplicationId');
      localStorage.removeItem('applicantData');

    } catch (error) {
      console.error('Test mode success error:', error);
      setError('Application submitted but failed to send confirmation.');
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    console.log('Payment successful:', paymentData);
    
    setSubmitting(true);
    
    try {
      const applicationId = localStorage.getItem('currentApplicationId');
      
      if (!applicationId) {
        throw new Error('No application found');
      }

      // Update application with payment details
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

      // Send confirmation email
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
          paymentAmount: `$${(paymentData.amount / 100).toFixed(2)}`,
          customerName: `${formData.firstName} ${formData.lastName}`
        });
      }

      setPaymentComplete(true);
      setStep(3);
      
      // Clear stored data
      localStorage.removeItem('currentApplicationId');
      localStorage.removeItem('applicantData');

    } catch (error) {
      console.error('Payment processing error:', error);
      setError('Payment processed but failed to update application. Please contact support with payment ID: ' + paymentData.paymentIntentId);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentCancel = () => {
    setStep(1);
    setError('Payment was cancelled. You can try again.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property with ID "{id}" could not be found.</p>
          <Link
            to="/properties"
            className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-sans font-semibold hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

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
                <span className={`text-xs font-medium md:hidden ${
                  step >= index + 1 ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {label.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
          <div className="hidden md:block w-full h-1 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/properties/${id}`} 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Property
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-2">
                {step === 1 ? 'Rental Application' : 
                 step === 2 ? 'Payment Processing' : 
                 'Application Complete'}
              </h1>
              <p className="text-gray-600">
                {step === 1 ? `Applying for ${property.title}` : 
                 step === 2 ? 'Secure payment for your application fee' : 
                 'Your application has been submitted successfully'}
              </p>
            </div>
            
            {isTestMode && step === 1 && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                <Flask className="w-4 h-4 mr-2" />
                TEST MODE
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Application Form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Property Summary */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    <Building className="w-5 h-5 mr-2" />
                    <h2 className="text-xl font-serif font-bold">{property.title}</h2>
                  </div>
                  <p className="opacity-90">{property.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <DollarSign className="w-5 h-5 mr-1" />
                    <p className="text-2xl font-bold">${property.price_per_week?.toLocaleString()}/week</p>
                  </div>
                  <p className="text-sm opacity-90">Security deposit: ${(property.price_per_week * 2)?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Application Fee Notice */}
              <div className={`rounded-xl p-6 mb-8 ${
                isTestMode 
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200' 
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
              }`}>
                <div className="flex items-start">
                  {isTestMode ? (
                    <Flask className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    {isTestMode ? (
                      <>
                        <h3 className="font-semibold text-emerald-800 mb-2">🧪 ADMIN TEST MODE ACTIVE</h3>
                        <p className="text-emerald-700 text-sm">
                          You are submitting this application in test mode. Payment will be skipped and application will be auto-approved.
                        </p>
                        <div className="mt-3 p-3 bg-emerald-100 rounded-lg">
                          <p className="text-emerald-800 font-medium">Test Mode Features:</p>
                          <ul className="text-emerald-700 text-sm list-disc list-inside mt-1">
                            <li>No payment required ($0 fee)</li>
                            <li>Auto-approved status</li>
                            <li>Billing address optional</li>
                            <li>Immediate confirmation</li>
                            <li>Full admin dashboard access</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold text-amber-800 mb-2">Application Fee: $50</h3>
                        <p className="text-amber-700 text-sm">
                          This non-refundable fee covers administrative processing and background checks. 
                          You'll be redirected to secure payment after submitting this form.
                        </p>
                        <p className="text-amber-700 text-sm mt-2">
                          <strong>Note:</strong> Your billing address is required for fraud protection.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address - Optional in test mode */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Billing Address {!isTestMode && '*'}
                    {isTestMode && <span className="text-sm text-gray-500 ml-2">(Optional in test mode)</span>}
                  </h3>
                  {!isTestMode && (
                    <p className="text-sm text-gray-600 -mt-4">
                      Required for payment verification and fraud protection
                    </p>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Street Address {!isTestMode && '*'}
                    </label>
                    <input
                      type="text"
                      name="billing.line1"
                      required={!isTestMode}
                      value={formData.billingAddress.line1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, Suite, Unit (Optional)
                    </label>
                    <input
                      type="text"
                      name="billing.line2"
                      value={formData.billingAddress.line2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City {!isTestMode && '*'}
                      </label>
                      <input
                        type="text"
                        name="billing.city"
                        required={!isTestMode}
                        value={formData.billingAddress.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State {!isTestMode && '*'}
                      </label>
                      <input
                        type="text"
                        name="billing.state"
                        required={!isTestMode}
                        value={formData.billingAddress.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        placeholder="NY"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code {!isTestMode && '*'}
                      </label>
                      <input
                        type="text"
                        name="billing.postalCode"
                        required={!isTestMode}
                        value={formData.billingAddress.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Country {!isTestMode && '*'}
                    </label>
                    <select
                      name="billing.country"
                      value={formData.billingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Financial Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status *
                      </label>
                      <select
                        name="employmentStatus"
                        required
                        value={formData.employmentStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Select status</option>
                        <option value="employed">Employed</option>
                        <option value="self_employed">Self-Employed</option>
                        <option value="student">Student</option>
                        <option value="retired">Retired</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income ($) *
                      </label>
                      <input
                        type="number"
                        name="monthlyIncome"
                        required
                        min="0"
                        step="100"
                        value={formData.monthlyIncome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        placeholder="3000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter your average monthly income</p>
                    </div>
                  </div>
                </div>

                {/* Living Situation */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Living Situation</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Number of Occupants *
                      </label>
                      <select
                        name="occupants"
                        required
                        value={formData.occupants}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Preferred Tour Date (Optional)
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hasPets"
                        name="hasPets"
                        checked={formData.hasPets}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-amber-600 bg-white border-gray-300 rounded focus:ring-amber-500"
                      />
                      <label htmlFor="hasPets" className="ml-2 text-sm text-gray-700 flex items-center">
                        <Dog className="w-4 h-4 mr-1" />
                        I have pets
                      </label>
                    </div>
                  </div>

                  {formData.hasPets && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Details
                      </label>
                      <textarea
                        name="petDetails"
                        value={formData.petDetails}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                        rows="2"
                        placeholder="Please describe your pets (type, breed, size, etc.)"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400"
                    rows="4"
                    placeholder="Any special requirements, questions, or additional information..."
                  />
                </div>

                {/* Terms Agreement */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 mr-3 w-4 h-4 text-amber-600 bg-white border-gray-300 rounded focus:ring-amber-500 flex-shrink-0"
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Terms & Conditions:</span> I agree to {isTestMode ? 'submit this test application' : 'pay the $50 non-refundable application fee'} and understand that this does not guarantee approval. I authorize Palms Estate to conduct background, credit, and reference checks as part of the application process. I certify that all information provided is true and accurate.
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full font-semibold py-4 px-6 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none ${
                    isTestMode 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white' 
                      : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isTestMode ? (
                    'Submit Test Application (No Payment)'
                  ) : (
                    'Continue to Payment - $50'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-500">
                  <p>
                    Have questions? <Link to="/contact" className="text-amber-600 hover:text-amber-700">Contact our concierge</Link>
                  </p>
                  <p className="mt-2 md:mt-0">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Your information is securely encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment - Only show if NOT in test mode */}
        {step === 2 && !isTestMode && (
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
              <PaymentForm
                amount={APPLICATION_FEE}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                propertyTitle={property.title}
              />
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className={`p-8 text-white text-center ${
              isTestMode 
                ? 'bg-gradient-to-r from-emerald-600 to-green-500' 
                : 'bg-gradient-to-r from-green-600 to-emerald-500'
            }`}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2">
                Application {isTestMode ? 'Submitted in Test Mode!' : 'Submitted!'}
              </h2>
              <p className="opacity-90 max-w-md mx-auto">
                {isTestMode 
                  ? `Your test application for ${property.title} has been auto-approved.`
                  : `Your application for ${property.title} has been received successfully.`
                }
              </p>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  isTestMode ? 'bg-emerald-100' : 'bg-green-100'
                }`}>
                  <CheckCircle className={`w-8 h-8 ${isTestMode ? 'text-emerald-600' : 'text-green-600'}`} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-800 mb-3">
                  What Happens Next?
                </h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  {isTestMode 
                    ? 'As a test application, it has been auto-approved. You can view it immediately in your dashboard.'
                    : 'Our team will review your application and get back to you within 24-48 hours. You\'ll receive an email confirmation shortly.'
                  }
                </p>
              </div>

              {!isTestMode && (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Review Process</h4>
                    <p className="text-sm text-gray-600">Our team reviews your application details</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Verification</h4>
                    <p className="text-sm text-gray-600">Background and reference checks</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Decision</h4>
                    <p className="text-sm text-gray-600">You'll receive our final decision</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Link
                  to="/dashboard"
                  className={`block w-full text-white font-semibold py-4 px-6 rounded-xl text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
                    isTestMode 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                      : 'bg-gradient-to-r from-amber-600 to-orange-500'
                  }`}
                >
                  View {isTestMode ? 'Test ' : ''}Application in Dashboard
                </Link>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Link
                    to="/properties"
                    className="block border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl text-center hover:bg-gray-50 transition-colors"
                  >
                    Browse More Properties
                  </Link>
                  
                  <Link
                    to="/"
                    className="block border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl text-center hover:bg-gray-50 transition-colors"
                  >
                    <HomeIcon className="w-4 h-4 inline mr-2" />
                    Return Home
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  Need immediate assistance? <Link to="/contact" className="text-amber-600 hover:text-amber-700">Contact our support team</Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationForm;
