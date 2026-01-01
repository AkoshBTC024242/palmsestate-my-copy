// src/pages/dashboard/ApplicationDetail.jsx - FIXED VERSION
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  CalendarDays, Building2, MapPin, DollarSign, User,
  Phone, Mail, ArrowLeft, Download, Printer, Home,
  Check, X, MessageSquare, Shield, Info,
  ChevronRight, ExternalLink, Loader2, AlertTriangle
} from 'lucide-react';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    console.log('ApplicationDetail mounted with ID:', id);
    
    if (id && user) {
      loadApplicationDetails();
    } else if (!user) {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [id, user]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading application details for ID:', id);
      
      // First, verify the application exists and belongs to user
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      console.log('Application query result:', appData);
      console.log('Application query error:', appError);

      if (appError) {
        if (appError.code === 'PGRST116') {
          setError('Application not found or you do not have permission to view it.');
        } else {
          setError(`Error loading application: ${appError.message}`);
        }
        setApplication(null);
        return;
      }

      if (!appData) {
        setError('Application not found.');
        return;
      }

      setApplication(appData);

      // Load property if property_id exists
      if (appData.property_id) {
        console.log('Loading property with ID:', appData.property_id);
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', appData.property_id)
          .single();

        console.log('Property query result:', propertyData);
        console.log('Property query error:', propertyError);

        if (!propertyError && propertyData) {
          setProperty(propertyData);
        }
      }
    } catch (error) {
      console.error('Error in loadApplicationDetails:', error);
      setError(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
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
        icon: <X className="w-4 h-4" />, 
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
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handlePayment = async () => {
    try {
      setLoadingPayment(true);
      navigate(`/dashboard/applications/${id}/payment`);
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setLoadingPayment(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Application</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard/applications')}
              className="inline-flex items-center gap-2 bg-gray-800 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Applications
            </button>
            <button
              onClick={loadApplicationDetails}
              className="inline-flex items-center gap-2 bg-orange-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Loader2 className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No application found
  if (!application) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist or you don't have access.</p>
          <button
            onClick={() => navigate('/dashboard/applications')}
            className="inline-flex items-center gap-2 bg-orange-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusConfig(application.status);
  const applicantName = application.first_name && application.last_name 
    ? `${application.first_name} ${application.last_name}`
    : application.full_name || user?.email?.split('@')[0] || 'Applicant';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Applications
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600 mt-2">
              Reference: <span className="font-medium">#{application.reference_number || application.id.slice(-8)}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Printer className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Application Status</h2>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                {status.icon}
                <span>{status.label}</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{status.description}</p>
            
            {application.status === 'pre_approved' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Application Fee Required</h4>
                    <p className="text-sm text-amber-700">
                      Pay ${application.application_fee || 50} application fee to proceed with the review process.
                    </p>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={loadingPayment}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                  >
                    {loadingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {application.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Congratulations!</h4>
                    <p className="text-sm text-green-700">
                      Your application has been approved. Please contact our team for next steps.
                    </p>
                  </div>
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
                  <div className="flex items-center gap-2 mb-2">
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
                    {property.bedrooms && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bedrooms:</span>
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bathrooms:</span>
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {property.main_image_url && (
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={property.main_image_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Link
                  to={`/properties/${property.id}`}
                  className="text-orange-600 hover:text-orange-800 font-medium flex items-center gap-2"
                >
                  View Property Details
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : application.property_id ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-gray-400" />
                <p className="text-gray-600">
                  Property details not available. Property ID: {application.property_id}
                </p>
              </div>
            </div>
          ) : null}

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Application Timeline</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Application Submitted</h4>
                  <p className="text-sm text-gray-600">{formatDate(application.created_at)}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Application #{application.reference_number || application.id.slice(-8)} was submitted
                  </p>
                </div>
              </div>
              
              {application.updated_at && application.updated_at !== application.created_at && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Status Updated</h4>
                    <p className="text-sm text-gray-600">{formatDate(application.updated_at)}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Status changed to: <span className="font-medium">{status.label}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Next Step */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Next Steps</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    {application.status === 'submitted' && 'Awaiting initial review by our team.'}
                    {application.status === 'pre_approved' && 'Complete payment to proceed with final review.'}
                    {application.status === 'paid_under_review' && 'Application is under final review.'}
                    {application.status === 'approved' && 'Contact our team to proceed with the rental agreement.'}
                    {application.status === 'rejected' && 'Contact support for more information.'}
                    {application.status === 'payment_pending' && 'Waiting for payment confirmation.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Application Information</h2>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Reference Number</h4>
                <p className="font-medium">#{application.reference_number || application.id.slice(-8)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Applied On</h4>
                <p className="font-medium">{formatDate(application.created_at)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                <p className="font-medium">{formatDate(application.updated_at || application.created_at)}</p>
              </div>
              {application.application_fee && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Application Fee</h4>
                  <p className="font-medium flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${application.application_fee}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Applicant Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Applicant Details</h2>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                <p className="font-medium">{applicantName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                <p className="font-medium">{application.email || user?.email || 'N/A'}</p>
              </div>
              {application.phone && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                    <p className="font-medium">{application.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              Have questions about your application? Our team is here to help.
            </p>
            <div className="space-y-3">
              <a href="mailto:support@palmsestate.org" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <Mail className="w-4 h-4" />
                support@palmsestate.org
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <Phone className="w-4 h-4" />
                (123) 456-7890
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
