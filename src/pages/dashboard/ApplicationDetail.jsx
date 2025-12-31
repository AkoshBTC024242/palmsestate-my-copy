// src/pages/dashboard/ApplicationDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  CalendarDays, Building2, MapPin, DollarSign, User,
  Phone, Mail, ArrowLeft, Download, Printer
} from 'lucide-react';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);

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
        .single();

      if (appError) throw appError;
      setApplication(appData);

      // Load property if property_id exists
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
        icon: <AlertCircle className="w-4 h-4" />, 
        label: 'Rejected',
        description: 'Application not approved. Contact us for more information.'
      },
    };
    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading application details...</p>
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
            <p className="text-gray-600 mb-6">The application you're looking for doesn't exist or you don't have access.</p>
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

  const status = getStatusConfig(application.status);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/applications')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
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
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-amber-900 mb-1">Application Fee Required</h4>
                      <p className="text-sm text-amber-700">
                        Pay $50 application fee to proceed with the review process.
                      </p>
                    </div>
                    <button
                      onClick={handlePayment}
                      disabled={loadingPayment}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loadingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
            </div>

            {/* Property Details */}
            {property && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <h3 className="font-medium text-gray-900">{property.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{property.property_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-lg">${property.price_per_week}/week</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Link
                    to={`/properties/${property.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                  >
                    View Property Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline</h2>
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
              </div>
            </div>
          </div>

          {/* Right Column */}
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
                  <p className="font-medium">{formatDate(application.updated_at)}</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ApplicationDetail;
