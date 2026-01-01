import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, submitApplication } from '../lib/supabase'; // IMPORT submitApplication
import { sendApplicationConfirmation } from '../lib/emailService';
import {
  Calendar, User, Mail, Phone, FileText, ArrowLeft,
  CreditCard, CheckCircle, Home, Shield, Clock, Building, 
  DollarSign, Users, Dog, Briefcase, AlertCircle
} from 'lucide-react';

function ApplicationForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [applicationResult, setApplicationResult] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      console.log('Fetching property with ID:', id);

      const { data: supabaseProperty, error: supabaseError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (!supabaseError && supabaseProperty) {
        console.log('Property found:', supabaseProperty);
        setProperty(supabaseProperty);
      } else {
        console.warn('Property not found in database, using mock data');
        // Use mock properties if needed
        const mockProperties = [
          {
            id: 1,
            title: 'Oceanfront Villa Bianca',
            location: 'Maldives',
            price_per_week: 35000,
          },
          {
            id: 2,
            title: 'Skyline Penthouse',
            location: 'New York',
            price_per_week: 45000,
          },
          // add your other mock properties
        ];
        const propertyIdNum = parseInt(id);
        const found = mockProperties.find(p => p.id === propertyIdNum);
        setProperty(found || mockProperties[0]);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to load property details');
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

  const validateForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      console.log('Submitting application for property ID:', id);
      console.log('Form data:', formData);
      
      // CRITICAL: Convert property_id to number and prepare data
      const applicationData = {
        property_id: id, // This will be parsed to number in submitApplication
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferred_tour_date: formData.preferredDate || null,
        notes: formData.notes,
        employment_status: formData.employmentStatus,
        monthly_income: formData.monthlyIncome,
        occupants: formData.occupants,
        has_pets: formData.hasPets,
        pet_details: formData.petDetails,
        application_type: formData.applicationType,
        agree_terms: formData.agreeTerms
      };

      console.log('Prepared application data:', applicationData);

      // Use the fixed submitApplication function from supabase.js
      const result = await submitApplication(applicationData);

      console.log('Application submission result:', result);

      if (result.success) {
        // Send confirmation to user
        try {
          await sendApplicationConfirmation(formData.email, {
            applicationId: result.data.id,
            propertyName: property?.title,
            status: 'submitted',
            message: 'Your application has been received. Our team will review shortly.',
            referenceNumber: result.referenceNumber
          });
        } catch (emailError) {
          console.warn('Could not send confirmation email:', emailError);
          // Continue anyway - email is not critical
        }

        // Send notification to admin
        try {
          await sendApplicationConfirmation('admin@palmsestate.org', {
            applicationId: result.data.id,
            userName: formData.fullName,
            propertyName: property?.title,
            status: 'new submission',
            message: `New application for ${property?.title}`,
            referenceNumber: result.referenceNumber
          });
        } catch (adminEmailError) {
          console.warn('Could not send admin notification:', adminEmailError);
        }

        setApplicationResult(result);
        setSuccess(true);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard/applications');
        }, 3000);
      } else {
        setError(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/properties" className="text-orange-600 hover:text-orange-700 font-medium">
            Browse Properties →
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
          
          <p className="text-gray-600 mb-4">
            Thank you for applying for <span className="font-medium">{property.title}</span>.
          </p>
          
          {applicationResult?.referenceNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Reference Number</p>
              <p className="font-mono font-bold text-lg text-gray-900">{applicationResult.referenceNumber}</p>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            Our team will review your application and get back to you shortly.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/dashboard/applications"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              View Your Applications
            </Link>
            <Link
              to="/properties"
              className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 rounded-lg transition-colors"
            >
              Browse More Properties
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            You will be redirected to your dashboard in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/properties/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Property
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Apply for {property.title}</h1>
          <p className="text-gray-600">
            Complete the form below to submit your rental application.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Property Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Property</p>
                    <p className="font-medium">{property.title}</p>
                  </div>
                </div>
                
                {property.location && (
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{property.location}</p>
                    </div>
                  </div>
                )}
                
                {property.price_per_week && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Weekly Price</p>
                      <p className="font-medium">${property.price_per_week}/week</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-600">Application Fee</p>
                      <p className="font-medium text-lg">$50</p>
                      <p className="text-xs text-gray-500">Payable after initial review</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Tour Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Employment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="employmentStatus"
                          value={formData.employmentStatus}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="employed">Employed</option>
                          <option value="self_employed">Self-Employed</option>
                          <option value="student">Student</option>
                          <option value="retired">Retired</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income ($) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="3000"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Household Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Household Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Occupants *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="occupants"
                          value={formData.occupants}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                          required
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5+</option>
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="hasPets"
                          checked={formData.hasPets}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Do you have pets?</span>
                      </label>
                      
                      {formData.hasPets && (
                        <div className="mt-3">
                          <div className="relative">
                            <Dog className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                              name="petDetails"
                              value={formData.petDetails}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              placeholder="Please describe your pets (type, breed, size, etc.)"
                              rows="3"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any additional information you'd like to share..."
                      rows="4"
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="border-t border-gray-200 pt-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the terms and conditions and confirm that all information provided is accurate. *
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                  
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    By submitting, you'll receive a confirmation email with your application details.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;
