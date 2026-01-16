// src/pages/dashboard/PostApprovalForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, CreditCard, Shield, Users, CheckCircle,
  MessageSquare, ChevronRight, Calendar, DollarSign,
  Building2, MapPin, ArrowLeft, Loader2, AlertCircle,
  Home, FileCheck, UserCheck, BadgeCheck
} from 'lucide-react';

function PostApprovalForm() {
  const { id } = useParams(); // Application ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state for additional information
  const [formData, setFormData] = useState({
    employmentStatus: '',
    monthlyIncome: '',
    employerName: '',
    employmentDuration: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    numberOfOccupants: '1',
    hasPets: false,
    petDetails: '',
    additionalNotes: '',
    agreeToTerms: false,
    employmentProof: null,
    idProof: null,
    incomeProof: null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    loadApplicationDetails();
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
        .maybeSingle();

      if (appError) throw appError;
      if (!appData) throw new Error('Application not found');

      setApplication(appData);

      // Check if application is in the right status
      if (appData.status !== 'approved_pending_info') {
        setError('This application is not ready for additional information.');
        return;
      }

      // Load property details
      if (appData.property_id) {
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', appData.property_id)
          .maybeSingle();

        if (propertyError) throw propertyError;
        setProperty(propertyData);
      }

    } catch (error) {
      console.error('Error loading application:', error);
      setError(error.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.employmentStatus) {
      setError('Employment status is required');
      return false;
    }
    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      setError('Valid monthly income is required');
      return false;
    }
    if (!formData.employerName) {
      setError('Employer name is required');
      return false;
    }
    if (!formData.emergencyContactName) {
      setError('Emergency contact name is required');
      return false;
    }
    if (!formData.emergencyContactPhone) {
      setError('Emergency contact phone is required');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');

    try {
      // Update application with additional information
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          additional_info: formData,
          status: 'additional_info_submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccess(true);
      
      // Redirect to applications page after 3 seconds
      setTimeout(() => {
        navigate('/dashboard/applications');
      }, 3000);

    } catch (error) {
      console.error('Error submitting information:', error);
      setError(error.message || 'Failed to submit information. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Application</h3>
            <p className="text-gray-600">Preparing your information form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Application</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to="/dashboard/applications" 
              className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Information Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your additional information has been submitted successfully.
              Our team will review it and contact you shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/dashboard/applications" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Link 
          to="/dashboard/applications" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-orange-300 hover:text-orange-600 font-medium mb-6 group transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Applications
        </Link>

        {/* Property & Application Info */}
        {property && application && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold rounded-full text-sm">
                    <BadgeCheck className="w-4 h-4" />
                    Initial Approval Received
                  </span>
                  <span className="text-sm text-gray-500">
                    Application #{application.reference_number || id}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Additional Information Required
                </h1>
                <p className="text-gray-600">
                  Congratulations! Your initial application has been approved.
                  Please complete this form to proceed with your rental application for:
                </p>
              </div>
              
              {property && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 min-w-[300px]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {property.main_image_url ? (
                        <img 
                          src={property.main_image_url} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{property.title}</h3>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Application Timeline */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Application Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { 
                    step: '1', 
                    title: 'Initial Application', 
                    time: 'Completed', 
                    description: 'Basic information submitted',
                    completed: true
                  },
                  { 
                    step: '2', 
                    title: 'Admin Review', 
                    time: 'Completed', 
                    description: 'Initial approval received',
                    completed: true
                  },
                  { 
                    step: '3', 
                    title: 'Additional Info', 
                    time: 'Current Step', 
                    description: 'Complete this form',
                    current: true
                  },
                  { 
                    step: '4', 
                    title: 'Final Approval', 
                    time: 'Pending', 
                    description: 'Final review and lease signing',
                    pending: true
                  }
                ].map((step, index) => (
                  <div key={index} className="relative">
                    <div className={`rounded-2xl p-6 ${
                      step.current 
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
                        : step.completed
                        ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
                    }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-4 ${
                        step.current 
                          ? 'bg-white/20' 
                          : step.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {step.step}
                      </div>
                      <h4 className="font-bold mb-2">{step.title}</h4>
                      <div className={`font-medium mb-2 ${
                        step.current ? 'text-orange-100' : 'text-orange-600'
                      }`}>
                        {step.time}
                      </div>
                      <p className={`text-sm ${
                        step.current ? 'text-orange-100' : 'text-gray-600'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <ChevronRight className={`w-6 h-6 ${
                          step.current ? 'text-orange-300' : 'text-gray-300'
                        }`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Application Requirements Section - From PropertyDetails.jsx */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8">
          {/* Application Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Complete Your Application</h2>
                <p className="text-orange-100">Provide additional information to proceed</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1 min-w-[200px]">
                <div className="text-sm text-orange-200 mb-1">Application Fee</div>
                <div className="text-2xl font-bold">$75</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1 min-w-[200px]">
                <div className="text-sm text-orange-200 mb-1">Estimated Completion</div>
                <div className="text-2xl font-bold">10-15 minutes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1 min-w-[200px]">
                <div className="text-sm text-orange-200 mb-1">Security Deposit</div>
                <div className="text-2xl font-bold">
                  ${property?.security_deposit ? parseFloat(property.security_deposit).toLocaleString() : '0'}
                </div>
              </div>
            </div>
          </div>

          {/* Application Requirements */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Requirements */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Required Information</h3>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      { icon: UserCheck, text: 'Employment & Income Verification' },
                      { icon: FileCheck, text: 'Identification Documents' },
                      { icon: Users, text: 'Emergency Contact Details' },
                      { icon: Shield, text: 'Household Information' }
                    ].map((req, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                          <req.icon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 mb-1">{req.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                      <CheckCircle className="w-5 h-5" />
                      Secure Digital Process
                    </div>
                    <p className="text-green-700 text-sm">
                      All information is encrypted and stored securely. We never share your personal data with third parties.
                    </p>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Additional Information Form</h3>
                  
                  <div className="space-y-4">
                    {/* Employment Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Employment Information</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employment Status *
                        </label>
                        <select
                          name="employmentStatus"
                          value={formData.employmentStatus}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="employed">Employed</option>
                          <option value="self_employed">Self-Employed</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="student">Student</option>
                          <option value="retired">Retired</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Income (USD) *
                        </label>
                        <input
                          type="number"
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                          placeholder="5000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employer Name *
                        </label>
                        <input
                          type="text"
                          name="employerName"
                          value={formData.employerName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                          placeholder="Company Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration at Current Employment
                        </label>
                        <input
                          type="text"
                          name="employmentDuration"
                          value={formData.employmentDuration}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="2 years"
                        />
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-700">Emergency Contact</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                          placeholder="Jane Smith"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                          placeholder="(123) 456-7890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship *
                        </label>
                        <input
                          type="text"
                          name="emergencyContactRelation"
                          value={formData.emergencyContactRelation}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                          placeholder="Spouse, Parent, etc."
                        />
                      </div>
                    </div>

                    {/* Household Information */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-700">Household Information</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Occupants
                        </label>
                        <select
                          name="numberOfOccupants"
                          value={formData.numberOfOccupants}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="hasPets"
                          name="hasPets"
                          checked={formData.hasPets}
                          onChange={handleChange}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="hasPets" className="text-sm font-medium text-gray-700">
                          Do you have pets?
                        </label>
                      </div>

                      {formData.hasPets && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pet Details
                          </label>
                          <textarea
                            name="petDetails"
                            value={formData.petDetails}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            rows="2"
                            placeholder="Type, breed, size, etc."
                          />
                        </div>
                      )}
                    </div>

                    {/* Terms Agreement */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                          required
                        />
                        <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                          I agree to the terms and conditions and confirm that all information provided is accurate.
                          I understand that providing false information may result in application denial.
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Additional Information'
                      )}
                    </button>
                    
                    <p className="text-center text-sm text-gray-600 mt-4">
                      By submitting, you authorize Palms Estate to verify the provided information.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">Live Chat Support</h4>
              <p className="text-gray-600 text-sm">
                Chat with our support team for immediate assistance
              </p>
            </div>
            <div className="text-center">
              <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">Document Guide</h4>
              <p className="text-gray-600 text-sm">
                Learn what documents you'll need for verification
              </p>
            </div>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">Schedule Call</h4>
              <p className="text-gray-600 text-sm">
                Book a call with an agent for personalized help
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostApprovalForm;
