import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, submitApplication } from '../lib/supabase';
import { sendApplicationConfirmation } from '../lib/emailService';
import { User, Mail, Phone, Calendar, FileText, CheckCircle, ArrowLeft, Home, AlertCircle } from 'lucide-react';

function InitialApplyForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    preferredDate: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [applicationResult, setApplicationResult] = useState(null);

  // Load property details
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        console.log('Loading property ID:', id);
        
        if (id) {
          const propertyId = Number(id);
          console.log('Converted property ID:', propertyId);
          
          if (isNaN(propertyId)) {
            throw new Error('Invalid property ID');
          }
          
          const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .single();
          
          if (error) {
            console.error('Property fetch error:', error);
            throw error;
          }
          
          if (data) {
            console.log('Property loaded:', data);
            setProperty(data);
          } else {
            throw new Error('Property not found');
          }
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError(`Failed to load property: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadProperty();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');

    try {
      console.log('Starting application submission...');
      console.log('Form data:', formData);
      
      const applicationData = {
        property_id: id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferred_tour_date: formData.preferredDate || null,
        notes: formData.message,
        employment_status: 'not_specified',
        monthly_income: '0',
        occupants: '1',
        has_pets: false,
        application_type: 'rental'
      };

      console.log('Prepared application data:', applicationData);

      const result = await submitApplication(applicationData);
      console.log('Application result:', result);

      if (result.success) {
        // Send confirmation email
        try {
          console.log('Sending confirmation email to applicant...');
          const emailResult = await sendApplicationConfirmation(formData.email, {
            fullName: formData.fullName,
            referenceNumber: result.referenceNumber,
            applicationId: result.data.id,
            propertyName: property?.title || 'Property',
            propertyLocation: property?.location || 'Location not specified',
            status: 'submitted'
          });
          
          console.log('Email result:', emailResult);
          
          if (!emailResult.success) {
            console.warn('Email sending had issues:', emailResult.message);
          }
        } catch (emailError) {
          console.warn('Email sending error (non-critical):', emailError);
          // Continue anyway - application was created
        }

        // Send notification to admin (optional)
        try {
          console.log('Sending admin notification...');
          await sendApplicationConfirmation('admin@palmsestate.org', {
            fullName: formData.fullName,
            referenceNumber: result.referenceNumber,
            applicationId: result.data.id,
            propertyName: property?.title || 'Property',
            propertyLocation: property?.location || 'Location not specified',
            status: 'new_submission',
            customerName: formData.fullName,
            applicantEmail: formData.email
          });
        } catch (adminEmailError) {
          console.warn('Admin email notification failed:', adminEmailError);
        }

        setApplicationResult({
          ...result,
          emailSent: true
        });
        setSuccess(true);
        
        setTimeout(() => {
          navigate('/dashboard/applications');
        }, 3000);
        
      } else {
        console.error('Application failed:', result.error);
        setError(result.error || 'Failed to submit application. Please try again.');
      }
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-2xl shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/properties" 
            className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-2xl shadow-xl">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
          
          {applicationResult?.referenceNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Reference Number</p>
              <p className="font-mono font-bold text-lg text-gray-900">{applicationResult.referenceNumber}</p>
              <p className="text-xs text-gray-500 mt-1">
                Keep this number for your records
              </p>
            </div>
          )}
          
          <p className="text-gray-600 mb-2">
            A confirmation email has been sent to <span className="font-medium">{formData.email}</span>.
          </p>
          
          <p className="text-gray-600 mb-6">
            Our team will review your application and contact you soon.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/properties" 
              className="inline-flex items-center justify-center bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Link>
            <Link 
              to="/dashboard/applications" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              View Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Link to={`/properties/${id}`} className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Property
        </Link>
        
        {/* Property Info */}
        {property && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                {property.main_image_url ? (
                  <img 
                    src={property.main_image_url} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{property.title}</h3>
                <p className="text-gray-600 text-sm">{property.location}</p>
                {property.price_per_week && (
                  <p className="text-amber-600 font-bold mt-1">
                    ${property.price_per_week}/week
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply for Property</h1>
          <p className="text-gray-600 mb-8">Submit your interest — our team will review and notify you for next steps.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium">Error: {error}</p>
                  <p className="text-red-600 text-sm mt-1">
                    Please check your information and try again. If the problem persists, contact support.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
                placeholder="(123) 456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Tour Date (optional)
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Additional Notes (optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows="4"
                placeholder="Any special requirements or questions..."
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> A $50 application fee will be required if your application is pre-approved.
                You'll be notified via email if payment is needed.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
            
            <p className="text-center text-gray-500 text-sm">
              By submitting, you'll receive a confirmation email with your application details.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InitialApplyForm;
