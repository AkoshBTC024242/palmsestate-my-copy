// src/pages/dashboard/ApplicationDetail.jsx - SAFE VERSION
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  CalendarDays, Building2, MapPin, DollarSign, User,
  Phone, Mail, ArrowLeft, ExternalLink, Loader2, AlertTriangle,
  Home, MessageSquare, Shield, Info
} from 'lucide-react';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && user) {
      loadApplicationDetails();
    } else if (!user) {
      setError('Please sign in to view application details');
      setLoading(false);
    }
  }, [id, user]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading application ID:', id);
      
      // Load application with safe property access
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      console.log('Application data:', appData);
      console.log('Application error:', appError);

      if (appError) {
        console.error('Error details:', appError);
        if (appError.code === 'PGRST116') {
          setError('Application not found. Please check the application ID.');
        } else {
          setError(`Error: ${appError.message}`);
        }
        return;
      }

      if (!appData) {
        setError('Application not found in database.');
        return;
      }

      setApplication(appData);

      // Load property if property_id exists
      if (appData.property_id) {
        console.log('Loading property ID:', appData.property_id);
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', appData.property_id)
          .single();

        if (!propertyError && propertyData) {
          setProperty(propertyData);
        } else {
          console.warn('Could not load property:', propertyError?.message);
        }
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      setError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Safe accessor functions
  const getStatusConfig = (status) => {
    if (!status) status = 'submitted';
    
    const configs = {
      submitted: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="w-4 h-4" />, 
        label: 'Submitted',
        description: 'Your application has been submitted and is awaiting initial review.'
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="w-4 h-4" />, 
        label: 'Pre-Approved',
        description: 'Initial review complete. Please pay the application fee to proceed.'
      },
      paid_under_review: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <CreditCard className="w-4 h-4" />, 
        label: 'Paid - Under Review',
        description: 'Application fee received. Under final review by management.'
      },
      approved: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />, 
        label: 'Approved',
        description: 'Your application has been approved! Contact us for next steps.'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertCircle className="w-4 h-4" />, 
        label: 'Rejected',
        description: 'Application not approved. Contact us for more information.'
      },
      payment_pending: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <CreditCard className="w-4 h-4" />,
        label: 'Payment Pending',
        description: 'Waiting for payment confirmation.'
      }
    };
    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getApplicantName = () => {
    if (application?.first_name && application?.last_name) {
      return `${application.first_name} ${application.last_name}`;
    }
    if (application?.full_name) {
      return application.full_name;
    }
    return user?.email?.split('@')[0] || 'Applicant';
  };

  const getApplicantEmail = () => {
    return application?.email || user?.email || 'Not provided';
  };

  const getApplicantPhone = () => {
    return application?.phone || 'Not provided';
  };

  const getReferenceNumber = () => {
    return application?.reference_number || application?.id || 'N/A';
  };

  const getApplicationFee = () => {
    return application?.application_fee || 50;
  };

  const handlePayment = () => {
    navigate(`/dashboard/applications/${id}/payment`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Application</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/dashboard/applications')}
                  className="inline-flex items-center gap-2 bg-gray-800 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Applications
                </button>
                <button
                  onClick={loadApplicationDetails}
                  className="inline-flex items-center gap-2 bg-orange-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-600 mb-6">The application could not be loaded.</p>
          <button
            onClick={() => navigate('/dashboard/applications')}
            className="inline-flex items-center gap-2 bg-orange-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-orange-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusConfig(application.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Applications
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600 mt-1">
              Reference: <span className="font-medium">#{getReferenceNumber()}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
              {status.icon}
              <span>{status.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Status</h2>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700">{status.description}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Applied on:</span>
                    <span className="font-medium ml-2">{formatDate(application.created_at)}</span>
                  </div>
                  {application.updated_at && (
                    <div>
                      <span className="text-gray-600">Last updated:</span>
                      <span className="font-medium ml-2">{formatDate(application.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {application.status === 'pre_approved' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Application Fee Required</h4>
                    <p className="text-sm text-amber-700">
                      Pay ${getApplicationFee()} application fee to proceed with the review process.
                    </p>
                  </div>
                  <button
                    onClick={handlePayment}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          {property ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <h3 className="font-medium text-gray-900">{property.title || `Property #${property.id}`}</h3>
                  </div>
                  {property.location && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-5 h-5" />
                      <span>{property.location}</span>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {property.property_type && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-medium">{property.property_type}</span>
                      </div>
                    )}
                    {property.price_per_week && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-lg">${property.price_per_week}/week</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {property.main_image_url && (
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={property.main_image_url}
                      alt={property.title || 'Property'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {property.id && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="text-orange-600 hover:text-orange-800 font-medium flex items-center gap-2"
                  >
                    View Property Details
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : application.property_id ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-600">Property ID: <span className="font-medium">{application.property_id}</span></p>
                  <p className="text-sm text-gray-500">Property details could not be loaded.</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Application Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                <p className="font-medium">#{getReferenceNumber()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Applied On</p>
                <p className="font-medium">{formatDate(application.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.icon}
                  <span>{status.label}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Application Fee</p>
                <p className="font-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${getApplicationFee()}
                </p>
              </div>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Applicant Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-medium">{getApplicantName()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium">{getApplicantEmail()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium">{getApplicantPhone()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900">Need Help?</h3>
                <p className="text-gray-700 text-sm mt-1">
                  Our support team is here to assist with any questions about your application.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <a
                href="mailto:support@palmsestate.org"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Mail className="w-4 h-4" />
                support@palmsestate.org
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Phone className="w-4 h-4" />
                (123) 456-7890
              </a>
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
