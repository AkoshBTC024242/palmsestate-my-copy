// src/pages/dashboard/ApplicationDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  CalendarDays, Building2, MapPin, DollarSign, User, 
  Phone, Mail, ArrowLeft, Download, Printer, Home,
  Check, X, MessageSquare, CreditCard as CardIcon,
  Shield, FileCheck, UserCheck, MailCheck, Building,
  AlertTriangle, Info, ChevronRight, ExternalLink
} from 'lucide-react';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);

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

      // Load status history (simulated for now)
      generateStatusHistory(appData);

    } catch (error) {
      console.error('Error loading application details:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStatusHistory = (appData) => {
    const history = [
      {
        status: 'submitted',
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted',
        date: appData.created_at,
        completed: true,
        current: appData.status === 'submitted'
      }
    ];

    if (['pre_approved', 'paid_under_review', 'approved', 'rejected'].includes(appData.status)) {
      history.push({
        status: 'pre_approved',
        title: 'Initial Review',
        description: 'Application reviewed by our team',
        date: appData.updated_at || appData.created_at,
        completed: true,
        current: appData.status === 'pre_approved'
      });
    }

    if (['paid_under_review', 'approved', 'rejected'].includes(appData.status)) {
      history.push({
        status: 'paid_under_review',
        title: 'Payment & Final Review',
        description: 'Application fee processed and under final review',
        date: appData.updated_at || appData.created_at,
        completed: appData.status !== 'pre_approved',
        current: appData.status === 'paid_under_review'
      });
    }

    if (['approved', 'rejected'].includes(appData.status)) {
      history.push({
        status: appData.status,
        title: appData.status === 'approved' ? 'Application Approved' : 'Application Declined',
        description: appData.status === 'approved' 
          ? 'Congratulations! Your application has been approved'
          : 'Application not approved. Contact support for details.',
        date: appData.updated_at || appData.created_at,
        completed: true,
        current: true
      });
    }

    setStatusHistory(history);
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FileText className="w-4 h-4" />, 
        label: 'Submitted',
        description: 'Your application has been submitted and is awaiting initial review.',
        nextStep: 'Initial review by our team',
        estimatedTime: '1-2 business days'
      },
      payment_pending: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <CreditCard className="w-4 h-4" />,
        label: 'Payment Pending',
        description: 'Application fee payment required to proceed.',
        nextStep: 'Complete payment',
        estimatedTime: 'Immediate after payment'
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="w-4 h-4" />, 
        label: 'Pre-Approved',
        description: 'Initial review complete. Please pay the application fee to proceed.',
        nextStep: 'Pay application fee',
        estimatedTime: '1-3 business days after payment'
      },
      paid_under_review: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <Shield className="w-4 h-4" />, 
        label: 'Under Final Review',
        description: 'Application fee received. Under final review by management.',
        nextStep: 'Final decision',
        estimatedTime: '2-3 business days'
      },
      approved: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />, 
        label: 'Approved',
        description: 'Congratulations! Your application has been approved.',
        nextStep: 'Contact us for next steps',
        estimatedTime: 'N/A'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <X className="w-4 h-4" />, 
        label: 'Rejected',
        description: 'Application not approved. Contact us for more information.',
        nextStep: 'Contact support',
        estimatedTime: 'N/A'
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

  const getActionButtons = () => {
    const status = application?.status;
    
    switch(status) {
      case 'pre_approved':
        return (
          <button
            onClick={handlePayment}
            disabled={loadingPayment}
            className="w-full md:w-auto bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loadingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay Application Fee
              </>
            )}
          </button>
        );
      
      case 'approved':
        return (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/properties/${application.property_id}`)}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              View Property
            </button>
            <a
              href="mailto:contact@palmsestate.org"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Agent
            </a>
          </div>
        );
      
      case 'rejected':
        return (
          <a
            href="mailto:support@palmsestate.org"
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Contact Support
          </a>
        );
      
      default:
        return (
          <button
            onClick={() => navigate('/properties')}
            className="w-full md:w-auto bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Building2 className="w-5 h-5" />
            Browse More Properties
          </button>
        );
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-6xl mx-auto">
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
    );
  }

  const status = getStatusConfig(application.status);
  const applicantName = application.first_name && application.last_name 
    ? `${application.first_name} ${application.last_name}`
    : application.full_name || 'Applicant';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Applications
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600 mt-2">
              Reference: <span className="font-medium text-gray-900">#{application.reference_number || application.id.slice(-8)}</span>
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
          {/* Status Overview Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Status</h2>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${status.color}`}>
                      {status.icon}
                      <span>{status.label}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Updated: {formatDate(application.updated_at)}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Application ID</p>
                  <p className="font-mono font-bold text-gray-900">#{application.id.slice(-12)}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Current Status</h3>
                    <p className="text-gray-700 mb-3">{status.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Next Step:</span>
                        <span className="font-medium text-gray-900 ml-2">{status.nextStep}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Estimated Time:</span>
                        <span className="font-medium text-gray-900 ml-2">{status.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-8">
                {getActionButtons()}
              </div>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Timeline</h2>
            
            <div className="space-y-6">
              {statusHistory.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.completed 
                        ? item.current
                          ? 'bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-300'
                          : 'bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300'
                        : 'bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-300'
                    }`}>
                      {item.completed ? (
                        item.current ? (
                          <Clock className="w-6 h-6 text-orange-600" />
                        ) : (
                          <Check className="w-6 h-6 text-green-600" />
                        )
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    
                    {index < statusHistory.length - 1 && (
                      <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                        statusHistory[index + 1]?.completed ? 'bg-green-300' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                      <span className="text-sm text-gray-600">
                        {item.date ? formatDate(item.date) : 'Pending'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{item.description}</p>
                    {item.current && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Current Step
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          {property && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
                <Link
                  to={`/properties/${property.id}`}
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  View Full Details
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200">
                      <Building className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{property.title}</h3>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{property.property_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Weekly Rent</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">${property.price_per_week}/week</p>
                  </div>
                  
                  {application.application_fee && (
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">Application Fee</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">${application.application_fee}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Applicant Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Applicant Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-blue-50">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">{applicantName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-blue-50">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{application.email || user?.email}</p>
                </div>
              </div>
              
              {application.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-blue-50">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{application.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Applied On</span>
                <span className="font-medium">{formatDate(application.created_at)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDate(application.updated_at)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Reference Number</span>
                <span className="font-medium">#{application.reference_number || application.id.slice(-8)}</span>
              </div>
              
              {application.application_fee && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Application Fee</span>
                  <span className="font-medium text-green-600">${application.application_fee}</span>
                </div>
              )}
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg p-6">
            <div className="text-white mb-4">
              <Shield className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">Need Assistance?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Our support team is here to help with any questions about your application.
              </p>
            </div>
            
            <div className="space-y-3">
              <a 
                href="mailto:support@palmsestate.org" 
                className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@palmsestate.org
              </a>
              <a 
                href="tel:+1234567890" 
                className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (123) 456-7890
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white mt-2"
              >
                Contact Form
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
