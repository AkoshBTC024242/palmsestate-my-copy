// src/pages/dashboard/ApplicationDetail.jsx - UPDATED VERSION
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, FileText, Clock, CheckCircle, XCircle,
  AlertCircle, CreditCard, Calendar, MapPin, Home,
  DollarSign, Eye, ExternalLink, Building, Users,
  Shield, UserCheck, FileCheck, ChevronRight, Loader2,
  MessageSquare, Phone, Mail, BadgeCheck, Award,
  AlertTriangle, Info, History, Lock, Star
} from 'lucide-react';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
      if (!appData) {
        navigate('/dashboard/applications');
        return;
      }

      setApplication(appData);

      // Load property
      if (appData.property_id) {
        const { data: propertyData } = await supabase
          .from('properties')
          .select('*')
          .eq('id', appData.property_id)
          .maybeSingle();

        setProperty(propertyData);
      }

    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="w-5 h-5" />,
        label: 'Submitted',
        description: 'Your application has been received and is awaiting review.',
        nextAction: null
      },
      under_review: { 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Under Review',
        description: 'Our team is reviewing your application.',
        nextAction: null
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Pre-Approved',
        description: 'Initial approval pending application fee payment.',
        nextAction: {
          label: 'Pay Application Fee',
          path: `/dashboard/applications/${id}/payment`,
          color: 'bg-amber-600 hover:bg-amber-700'
        }
      },
      approved_pending_info: { 
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        icon: <FileCheck className="w-5 h-5" />,
        label: 'Continue Application',
        description: 'Your initial application was approved! Complete the detailed application.',
        nextAction: {
          label: 'Continue Application',
          path: `/dashboard/applications/${id}/post-approval`,
          color: 'bg-cyan-600 hover:bg-cyan-700'
        }
      },
      additional_info_submitted: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <FileText className="w-5 h-5" />,
        label: 'Under Final Review',
        description: 'Detailed application submitted. Final review in progress.',
        nextAction: null
      },
      paid_under_review: { 
        color: 'bg-violet-100 text-violet-800 border-violet-200',
        icon: <CreditCard className="w-5 h-5" />,
        label: 'Paid - Under Review',
        description: 'Application fee paid. Final review in progress.',
        nextAction: null
      },
      approved: { 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Approved',
        description: 'Congratulations! Your application has been fully approved.',
        nextAction: {
          label: 'Contact Agent',
          path: '/contact',
          color: 'bg-emerald-600 hover:bg-emerald-700'
        }
      },
      rejected: { 
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Rejected',
        description: 'Application was not approved.',
        nextAction: {
          label: 'Browse Properties',
          path: '/properties',
          color: 'bg-gray-600 hover:bg-gray-700'
        }
      },
      payment_pending: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <CreditCard className="w-5 h-5" />,
        label: 'Payment Pending',
        description: 'Waiting for payment processing.',
        nextAction: null
      }
    };

    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Get application timeline
  const getTimelineEvents = () => {
    if (!application) return [];
    
    const events = [];
    
    events.push({
      date: application.created_at,
      title: 'Application Submitted',
      description: 'Initial application submitted',
      icon: <FileText className="w-4 h-4" />,
      color: 'bg-blue-500',
      completed: true
    });

    if (application.status === 'under_review' || 
        application.status === 'pre_approved' ||
        application.status === 'approved_pending_info' ||
        application.status === 'additional_info_submitted' ||
        application.status === 'paid_under_review' ||
        application.status === 'approved') {
      events.push({
        date: application.updated_at,
        title: 'Under Review',
        description: 'Application being reviewed by our team',
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'bg-indigo-500',
        completed: application.status !== 'under_review'
      });
    }

    if (application.status === 'pre_approved' ||
        application.status === 'paid_under_review' ||
        application.status === 'approved') {
      events.push({
        date: application.paid_at || application.updated_at,
        title: 'Payment Processed',
        description: 'Application fee payment completed',
        icon: <CreditCard className="w-4 h-4" />,
        color: 'bg-amber-500',
        completed: true
      });
    }

    if (application.status === 'approved_pending_info' ||
        application.status === 'additional_info_submitted' ||
        application.status === 'approved') {
      events.push({
        date: application.initial_approved_at || application.updated_at,
        title: 'Initial Approval',
        description: 'Initial application approved',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-cyan-500',
        completed: true
      });
    }

    if (application.status === 'additional_info_submitted' ||
        application.status === 'approved') {
      events.push({
        date: application.additional_info_submitted_at || application.updated_at,
        title: 'Detailed Info Submitted',
        description: 'Additional information submitted',
        icon: <FileCheck className="w-4 h-4" />,
        color: 'bg-purple-500',
        completed: true
      });
    }

    if (application.status === 'approved') {
      events.push({
        date: application.final_approved_at || application.updated_at,
        title: 'Final Approval',
        description: 'Application fully approved',
        icon: <Award className="w-4 h-4" />,
        color: 'bg-emerald-500',
        completed: true
      });
    }

    if (application.status === 'rejected') {
      events.push({
        date: application.rejected_at || application.updated_at,
        title: 'Application Rejected',
        description: application.rejection_reason || 'Application was not approved',
        icon: <XCircle className="w-4 h-4" />,
        color: 'bg-rose-500',
        completed: true
      });
    }

    return events;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">The requested application could not be found.</p>
          <Link
            to="/dashboard/applications"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status);
  const timelineEvents = getTimelineEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard/applications"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Application #{application.reference_number || id}
            </h1>
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.color}`}>
                {statusConfig.icon}
                <span>{statusConfig.label}</span>
              </span>
              <span className="text-sm text-gray-500">
                Created: {formatDate(application.created_at)}
              </span>
            </div>
          </div>
          
          {statusConfig.nextAction && (
            <Link
              to={statusConfig.nextAction.path}
              className={`inline-flex items-center gap-2 px-6 py-3 ${statusConfig.nextAction.color} text-white font-medium rounded-lg hover:shadow-lg transition-all`}
            >
              {statusConfig.nextAction.label}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <p className="text-orange-800">
            {statusConfig.description}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'details', label: 'Details', icon: FileText },
            { id: 'property', label: 'Property', icon: Home },
            { id: 'timeline', label: 'Timeline', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Status Progress */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Application Progress</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {statusConfig.icon}
                        <span className="font-bold text-gray-900">{statusConfig.label}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(application.updated_at)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative pt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Submitted</span>
                      <span>Review</span>
                      <span>Additional Info</span>
                      <span>Final Review</span>
                      <span>Completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 via-cyan-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: application.status === 'submitted' ? '20%' :
                                 application.status === 'under_review' ? '40%' :
                                 application.status === 'approved_pending_info' ? '60%' :
                                 application.status === 'additional_info_submitted' ? '80%' :
                                 application.status === 'approved' ? '100%' : '0%'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3">Next Steps</h4>
                    {statusConfig.nextAction ? (
                      <Link
                        to={statusConfig.nextAction.path}
                        className={`inline-flex items-center gap-2 px-6 py-3 ${statusConfig.nextAction.color} text-white font-medium rounded-lg hover:shadow-lg transition-all`}
                      >
                        {statusConfig.nextAction.label}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <p className="text-gray-600">
                        Please wait for our team to process your application. You'll be notified when there are updates.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Info */}
              {property && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Property Information</h3>
                  
                  <div className="flex items-start gap-6">
                    {property.main_image_url && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={property.main_image_url} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">{property.title}</h4>
                      <p className="text-gray-600 mb-3">{property.location}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            {property.bedrooms} beds
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            {property.bathrooms} baths
                          </span>
                        )}
                        {property.price_per_week && (
                          <span className="flex items-center gap-1 font-medium text-orange-600">
                            <DollarSign className="w-4 h-4" />
                            {formatCurrency(property.price_per_week)}/week
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              {(application.application_fee || application.payment_status) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Application Fee</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(application.application_fee || 50)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          application.payment_status === 'paid' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {application.payment_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {application.paid_at && (
                        <div>
                          <p className="text-sm text-gray-600">Paid On</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(application.paid_at)}
                          </p>
                        </div>
                      )}
                      {application.payment_id && (
                        <div>
                          <p className="text-sm text-gray-600">Payment ID</p>
                          <p className="font-mono text-sm text-gray-900">{application.payment_id}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Application Details</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{application.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{application.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{application.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Applied On</p>
                      <p className="font-medium">{formatDate(application.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {application.additional_info && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Additional Information</h4>
                    <div className="space-y-4">
                      {Object.entries(application.additional_info).map(([key, value]) => {
                        if (!value || value === '') return null;
                        
                        return (
                          <div key={key} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 capitalize mb-1">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </p>
                            <p className="text-gray-700">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Property Tab */}
          {activeTab === 'property' && property && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Property Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  {property.main_image_url && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={property.main_image_url} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h4>
                    <p className="text-gray-600 mb-4">{property.location}</p>
                    <div className="flex flex-wrap gap-4">
                      {property.bedrooms && (
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{property.bedrooms} beds</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{property.bathrooms} baths</span>
                        </div>
                      )}
                      {property.sqft && (
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-3">Property Information</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Type</span>
                        <span className="font-medium">{property.property_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="font-medium">{property.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Weekly Rate</span>
                        <span className="font-medium">{formatCurrency(property.price_per_week)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-3">Application Details</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Application Fee</span>
                        <span className="font-medium">{formatCurrency(application.application_fee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Security Deposit</span>
                        <span className="font-medium">
                          {formatCurrency(property.security_deposit || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to={`/properties/${property.id}`}
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View Full Property Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Application Timeline</h3>
              
              <div className="space-y-6">
                {timelineEvents.length > 0 ? (
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="relative flex items-start gap-4 mb-6">
                        {/* Icon circle */}
                        <div className={`relative z-10 w-12 h-12 rounded-full ${event.color} flex items-center justify-center flex-shrink-0`}>
                          {event.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900">{event.title}</h4>
                            <span className="text-sm text-gray-500">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No timeline events yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {statusConfig.nextAction && (
                <Link
                  to={statusConfig.nextAction.path}
                  className={`block w-full px-4 py-3 ${statusConfig.nextAction.color} text-white font-medium rounded-lg hover:shadow transition-all text-center`}
                >
                  {statusConfig.nextAction.label}
                </Link>
              )}
              
              <Link
                to="/contact"
                className="block w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact Support
                </div>
              </Link>
              
              <Link
                to="/properties"
                className="block w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Browse Properties
              </Link>
            </div>
          </div>

          {/* Application Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Application Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reference Number</span>
                <span className="font-medium">#{application.reference_number || id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Application Type</span>
                <span className="font-medium">{application.application_type || 'Rental'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Applied On</span>
                <span className="font-medium">{formatDate(application.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDate(application.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Need Help?</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-800">Live Chat</p>
                  <p className="text-sm text-gray-600">Get instant help</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-800">Call Support</p>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-600">support@palmsestate.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
