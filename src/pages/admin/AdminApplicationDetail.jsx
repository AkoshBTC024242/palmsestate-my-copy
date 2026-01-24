// src/pages/admin/AdminApplicationDetail.jsx - UPDATED WITH PAYMENT SECTION
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { updateApplicationStatus, sendApplicationStatusUpdate, sendPaymentRequest } from '../../lib/applicationStatus';
import {
  ArrowLeft, User, Mail, Phone, Calendar, MapPin, Home,
  DollarSign, FileText, CheckCircle, XCircle, AlertCircle,
  Clock, Shield, Users, CreditCard, Building, Download,
  Edit, Send, UserCheck, FileCheck, ChevronRight, Printer,
  MessageSquare, PhoneCall, ExternalLink, Eye, Star, Award,
  Briefcase, Banknote, ShieldCheck, BadgeCheck, FileSearch,
  Mail as MailIcon, Phone as PhoneIcon, Globe, Lock, Check,
  AlertTriangle, Info, History, ArrowRight, RefreshCw,
  Bell, MailOpen, Send as SendIcon, Receipt, Key, ReceiptText,
  Copy, CheckSquare, Square, CreditCard as CreditCardIcon,
  Wallet, TrendingUp, FileWarning
} from 'lucide-react';

function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [adminNotes, setAdminNotes] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);
  const [sendingPaymentRequest, setSendingPaymentRequest] = useState(false);
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
  const [manualPaymentDetails, setManualPaymentDetails] = useState({
    amount: '50.00',
    method: 'cash',
    receiptNumber: '',
    notes: ''
  });

  useEffect(() => {
    loadApplicationDetails();
  }, [id]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      
      // Load application
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (appError) throw appError;
      if (!appData) {
        navigate('/admin/applications');
        return;
      }

      setApplication(appData);

      // Load property
      if (appData.property_id) {
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', appData.property_id)
          .maybeSingle();

        if (!propertyError && propertyData) {
          setProperty(propertyData);
        }
      }

      // Load admin notes
      await loadAdminNotes();
      
      // Load status history
      await loadStatusHistory();

    } catch (error) {
      console.error('Error loading application:', error);
      alert('Failed to load application details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('application_notes')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: false });

      if (!error) {
        setAdminNotes(data || []);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const loadStatusHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('application_status_logs')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: false });

      if (!error) {
        setStatusHistory(data || []);
      }
    } catch (error) {
      console.error('Error loading status history:', error);
    }
  };

  const addAdminNote = async () => {
    if (!notes.trim()) return;

    try {
      const { error } = await supabase
        .from('application_notes')
        .insert({
          application_id: id,
          content: notes.trim(),
          created_by: 'admin',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setNotes('');
      await loadAdminNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const handleStatusUpdate = async (newStatus, note = '') => {
    try {
      setUpdating(true);

      const result = await updateApplicationStatus(id, newStatus, note);
      
      if (result.success) {
        // Show success message
        alert(`Application status updated to: ${getStatusLabel(newStatus)}`);
        
        // Reload application details
        await loadApplicationDetails();
        
        // Close reject modal if open
        if (newStatus === 'rejected') {
          setShowRejectModal(false);
          setRejectReason('');
        }
      } else {
        alert('Error updating status: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendPaymentRequest = async () => {
    try {
      setSendingPaymentRequest(true);
      
      const result = await sendPaymentRequest(id, 'Payment request sent from admin panel');
      
      if (result.success) {
        alert('Payment request email sent successfully!');
        await loadApplicationDetails();
      } else {
        alert('Failed to send payment request: ' + result.message);
      }
    } catch (error) {
      console.error('Error sending payment request:', error);
      alert('Error sending payment request: ' + error.message);
    } finally {
      setSendingPaymentRequest(false);
    }
  };

  const handleManualPayment = async () => {
    try {
      setUpdating(true);
      
      // Update application with manual payment details
      const updateData = {
        status: 'paid_under_review',
        payment_status: 'paid',
        payment_method: manualPaymentDetails.method,
        receipt_number: manualPaymentDetails.receiptNumber,
        paid_at: new Date().toISOString(),
        application_fee: parseFloat(manualPaymentDetails.amount) || 50.00,
        updated_at: new Date().toISOString(),
        last_status_change: new Date().toISOString()
      };

      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Add note about manual payment
      await supabase
        .from('application_notes')
        .insert({
          application_id: id,
          content: `Manual payment recorded: ${manualPaymentDetails.method.toUpperCase()} payment of $${manualPaymentDetails.amount}. ${manualPaymentDetails.receiptNumber ? `Receipt: ${manualPaymentDetails.receiptNumber}` : ''} ${manualPaymentDetails.notes ? `Notes: ${manualPaymentDetails.notes}` : ''}`,
          created_by: 'admin',
          created_at: new Date().toISOString()
        });

      // Log status change
      await supabase.from('application_status_logs').insert({
        application_id: id,
        from_status: application.status,
        to_status: 'paid_under_review',
        note: `Manual ${manualPaymentDetails.method} payment recorded`,
        changed_by: 'admin',
        created_at: new Date().toISOString()
      });

      // Send confirmation email
      try {
        await sendApplicationStatusUpdate(application.email, {
          fullName: application.full_name,
          referenceNumber: application.reference_number,
          applicationId: application.id,
          propertyName: property?.title || 'Property',
          propertyLocation: property?.location || 'Location',
          status: 'paid_under_review',
          statusNote: `Application fee paid via ${manualPaymentDetails.method}. Your application is now under final review.`,
          paymentAmount: `$${manualPaymentDetails.amount}`,
          paymentDate: new Date().toLocaleDateString()
        });
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
      }

      alert('Manual payment recorded successfully!');
      setShowManualPaymentModal(false);
      await loadApplicationDetails();
      
    } catch (error) {
      console.error('Error recording manual payment:', error);
      alert('Error recording manual payment: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const sendStatusEmail = async () => {
    if (!application) return;
    
    try {
      setSendingEmail(true);
      
      const result = await sendApplicationStatusUpdate(application.email, {
        fullName: application.full_name,
        referenceNumber: application.reference_number,
        applicationId: application.id,
        propertyName: property?.title || 'Property',
        propertyLocation: property?.location || 'Location',
        status: application.status,
        statusNote: 'Application status update'
      });
      
      if (result.success) {
        alert('Status update email sent successfully!');
        
        // Add a note about the email
        await supabase
          .from('application_notes')
          .insert({
            application_id: id,
            content: `Status update email sent to applicant (${application.email})`,
            created_by: 'system',
            created_at: new Date().toISOString()
          });
        
        await loadAdminNotes();
      } else {
        alert('Failed to send email: ' + result.message);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email: ' + error.message);
    } finally {
      setSendingEmail(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-blue-100 text-blue-800',
        icon: <Clock className="w-5 h-5" />,
        label: 'Submitted',
        badgeColor: 'border-blue-200',
        bgColor: 'bg-blue-50'
      },
      under_review: { 
        color: 'bg-indigo-100 text-indigo-800',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Under Review',
        badgeColor: 'border-indigo-200',
        bgColor: 'bg-indigo-50'
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Pre-Approved',
        badgeColor: 'border-amber-200',
        bgColor: 'bg-amber-50'
      },
      approved_pending_info: { 
        color: 'bg-cyan-100 text-cyan-800',
        icon: <FileCheck className="w-5 h-5" />,
        label: 'Approved - Pending Info',
        badgeColor: 'border-cyan-200',
        bgColor: 'bg-cyan-50'
      },
      additional_info_submitted: { 
        color: 'bg-purple-100 text-purple-800',
        icon: <FileText className="w-5 h-5" />,
        label: 'Additional Info Submitted',
        badgeColor: 'border-purple-200',
        bgColor: 'bg-purple-50'
      },
      paid_under_review: { 
        color: 'bg-violet-100 text-violet-800',
        icon: <CreditCard className="w-5 h-5" />,
        label: 'Paid - Under Review',
        badgeColor: 'border-violet-200',
        bgColor: 'bg-violet-50'
      },
      approved: { 
        color: 'bg-emerald-100 text-emerald-800',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Approved',
        badgeColor: 'border-emerald-200',
        bgColor: 'bg-emerald-50'
      },
      rejected: { 
        color: 'bg-rose-100 text-rose-800',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Rejected',
        badgeColor: 'border-rose-200',
        bgColor: 'bg-rose-50'
      },
      payment_pending: {
        color: 'bg-orange-100 text-orange-800',
        icon: <CreditCard className="w-5 h-5" />,
        label: 'Payment Pending',
        badgeColor: 'border-orange-200',
        bgColor: 'bg-orange-50'
      }
    };

    return configs[status] || configs.submitted;
  };

  const getStatusLabel = (status) => {
    const config = getStatusConfig(status);
    return config.label;
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

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get available next statuses
  const getNextStatusOptions = () => {
    if (!application) return [];
    
    const statusFlow = {
      submitted: ['under_review', 'rejected'],
      under_review: ['pre_approved', 'approved_pending_info', 'rejected'],
      pre_approved: ['payment_pending', 'rejected'],
      payment_pending: ['paid_under_review', 'rejected'],
      paid_under_review: ['approved', 'rejected'],
      approved_pending_info: ['additional_info_submitted', 'rejected'],
      additional_info_submitted: ['approved', 'rejected']
    };

    return statusFlow[application.status] || [];
  };

  // Get application timeline
  const getTimelineEvents = () => {
    if (!application) return [];
    
    const events = [];
    
    // Add application submission
    events.push({
      date: application.created_at,
      title: 'Application Submitted',
      description: 'Initial application submitted',
      icon: <FileText className="w-4 h-4" />,
      color: 'bg-blue-500'
    });

    // Add status history events
    statusHistory.forEach(log => {
      events.push({
        date: log.created_at,
        title: 'Status Updated',
        description: `From ${getStatusLabel(log.from_status)} to ${getStatusLabel(log.to_status)}${log.note ? ` - ${log.note}` : ''}`,
        icon: log.to_status === 'approved' ? <CheckCircle className="w-4 h-4" /> : 
               log.to_status === 'rejected' ? <XCircle className="w-4 h-4" /> : 
               <AlertCircle className="w-4 h-4" />,
        color: log.to_status === 'approved' ? 'bg-emerald-500' : 
               log.to_status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
      });
    });

    // Add other important dates
    if (application.initial_approved_at) {
      events.push({
        date: application.initial_approved_at,
        title: 'Initial Approval',
        description: 'Application initially approved',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-cyan-500'
      });
    }

    if (application.additional_info_submitted_at) {
      events.push({
        date: application.additional_info_submitted_at,
        title: 'Detailed Info Submitted',
        description: 'User submitted detailed application information',
        icon: <FileCheck className="w-4 h-4" />,
        color: 'bg-purple-500'
      });
    }

    if (application.final_approved_at) {
      events.push({
        date: application.final_approved_at,
        title: 'Final Approval',
        description: 'Application fully approved',
        icon: <Award className="w-4 h-4" />,
        color: 'bg-emerald-500'
      });
    }

    if (application.paid_at) {
      events.push({
        date: application.paid_at,
        title: 'Payment Received',
        description: `Application fee paid ${application.payment_method ? `via ${application.payment_method}` : ''}`,
        icon: <CreditCard className="w-4 h-4" />,
        color: 'bg-green-500'
      });
    }

    // Add last status change if available
    if (application.last_status_change) {
      events.push({
        date: application.last_status_change,
        title: 'Last Status Update',
        description: 'Application status was updated',
        icon: <History className="w-4 h-4" />,
        color: 'bg-gray-500'
      });
    }

    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const copyPaymentLink = () => {
    const paymentLink = `https://palmsestate.org/payment/${id}`;
    navigator.clipboard.writeText(paymentLink)
      .then(() => alert('Payment link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Not Found</h2>
            <p className="text-gray-600 mb-6">The requested application could not be found.</p>
            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status);
  const nextStatusOptions = getNextStatusOptions();
  const timelineEvents = getTimelineEvents();
  const isPaymentPending = application.status === 'pre_approved' || application.status === 'payment_pending';
  const isPaymentCompleted = application.payment_status === 'paid' || application.status === 'paid_under_review';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/admin/applications')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Applications
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={loadApplicationDetails}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={sendStatusEmail}
                disabled={sendingEmail}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title="Send Status Update Email"
              >
                {sendingEmail ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                ) : (
                  <SendIcon className="w-5 h-5" />
                )}
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Application #{application.reference_number || id}
              </h1>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.color} ${statusConfig.badgeColor}`}>
                  {statusConfig.icon}
                  <span>{statusConfig.label}</span>
                </span>
                <span className="text-sm text-gray-500">
                  Created: {formatDate(application.created_at)}
                </span>
                {application.last_status_change && (
                  <span className="text-sm text-gray-500">
                    Last Updated: {formatDate(application.last_status_change)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.open(`mailto:${application.email}`, '_blank')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MailIcon className="w-4 h-4" />
                Email Applicant
              </button>
              <button
                onClick={() => window.open(`tel:${application.phone}`, '_blank')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PhoneIcon className="w-4 h-4" />
                Call Applicant
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'details', label: 'Application Details', icon: FileSearch },
              { id: 'property', label: 'Property', icon: Home },
              { id: 'payment', label: 'Payment', icon: CreditCardIcon },
              { id: 'timeline', label: 'Timeline', icon: History },
              { id: 'notes', label: 'Notes', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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
                {/* Status Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Application Status</h3>
                    <button
                      onClick={sendStatusEmail}
                      disabled={sendingEmail}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      {sendingEmail ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <SendIcon className="w-3 h-3" />
                          Send Update Email
                        </>
                      )}
                    </button>
                  </div>
                  
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
                        <p className="text-sm text-gray-600">Last Status Change</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(application.last_status_change || application.updated_at)}
                        </p>
                      </div>
                    </div>

                    {/* Status Progress */}
                    <div className="relative pt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Submitted</span>
                        <span>Initial Review</span>
                        <span>Payment</span>
                        <span>Final Review</span>
                        <span>Completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: application.status === 'submitted' ? '20%' :
                                   application.status === 'under_review' ? '40%' :
                                   application.status === 'pre_approved' ? '50%' :
                                   application.status === 'payment_pending' ? '60%' :
                                   application.status === 'approved_pending_info' ? '70%' :
                                   application.status === 'additional_info_submitted' ? '80%' :
                                   application.status === 'paid_under_review' ? '90%' :
                                   application.status === 'approved' ? '100%' : '0%'
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-3">Quick Actions</h4>
                      <div className="flex flex-wrap gap-3">
                        {application.status === 'under_review' && (
                          <button
                            onClick={() => handleStatusUpdate('approved_pending_info')}
                            disabled={updating}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:shadow transition-all disabled:opacity-50"
                          >
                            {updating ? 'Processing...' : 'Approve & Request Info'}
                          </button>
                        )}
                        
                        {application.status === 'pre_approved' && (
                          <button
                            onClick={() => handleStatusUpdate('payment_pending')}
                            disabled={updating}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:shadow transition-all disabled:opacity-50"
                          >
                            {updating ? 'Processing...' : 'Request Payment'}
                          </button>
                        )}

                        {application.status === 'additional_info_submitted' && (
                          <button
                            onClick={() => handleStatusUpdate('approved')}
                            disabled={updating}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg hover:shadow transition-all disabled:opacity-50"
                          >
                            {updating ? 'Processing...' : 'Final Approve'}
                          </button>
                        )}

                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="px-4 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
                        >
                          Reject Application
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Status Card (only show for pre-approved/payment pending) */}
                {isPaymentPending && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Status</h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800">Payment Pending</p>
                            <p className="text-sm text-amber-700 mt-1">
                              Application fee of $50.00 is pending payment. The applicant needs to pay to continue.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Payment Actions</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={handleSendPaymentRequest}
                            disabled={sendingPaymentRequest || sendingEmail}
                            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {sendingPaymentRequest ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <SendIcon className="w-4 h-4" />
                                Send Payment Request Email
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={copyPaymentLink}
                            className="px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Payment Link
                          </button>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setShowManualPaymentModal(true)}
                            className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                          >
                            <Wallet className="w-4 h-4" />
                            Record Manual Payment
                          </button>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Use this for cash, check, or bank transfer payments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Applicant Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Applicant Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium text-gray-900">{application.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{application.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{application.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Preferred Tour Date</p>
                        <p className="font-medium text-gray-900">
                          {application.preferred_tour_date || application.preferred_date 
                            ? new Date(application.preferred_tour_date || application.preferred_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Application Type</p>
                        <p className="font-medium text-gray-900">{application.application_type || 'Rental'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reference Number</p>
                        <p className="font-medium text-gray-900">#{application.reference_number || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Communication */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Email Communication</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <MailOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-blue-800">Email Notification</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Send a status update email to the applicant with the current application status.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={sendStatusEmail}
                          disabled={sendingEmail}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {sendingEmail ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <SendIcon className="w-3 h-3" />
                              Send Status Email
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${application.email}?subject=Application Update - ${application.reference_number}`, '_blank')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                          <MailIcon className="w-3 h-3" />
                          Compose Custom Email
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Email Automation:</strong> When you change the application status, an automatic email will be sent to the applicant.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Payment Details</h3>
                
                <div className="space-y-6">
                  {/* Payment Status */}
                  <div className={`p-6 rounded-xl ${
                    isPaymentCompleted 
                      ? 'bg-emerald-50 border border-emerald-200' 
                      : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isPaymentCompleted ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        {isPaymentCompleted ? (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          {isPaymentCompleted ? 'Payment Received' : 'Payment Pending'}
                        </h4>
                        <p className={`text-sm ${isPaymentCompleted ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {isPaymentCompleted 
                            ? `Application fee of ${formatCurrency(application.application_fee || 50)} has been paid.`
                            : 'Application fee of $50.00 is pending payment.'
                          }
                        </p>
                      </div>
                    </div>

                    {isPaymentCompleted ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-lg border border-emerald-100">
                            <p className="text-xs text-gray-600">Amount Paid</p>
                            <p className="font-bold text-gray-900">{formatCurrency(application.application_fee || 50)}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-emerald-100">
                            <p className="text-xs text-gray-600">Payment Date</p>
                            <p className="font-bold text-gray-900">{formatDate(application.paid_at)}</p>
                          </div>
                        </div>
                        
                        {application.payment_method && (
                          <div className="p-3 bg-white rounded-lg border border-emerald-100">
                            <p className="text-xs text-gray-600">Payment Method</p>
                            <p className="font-bold text-gray-900">{application.payment_method.toUpperCase()}</p>
                          </div>
                        )}
                        
                        {application.stripe_payment_id && (
                          <div className="p-3 bg-white rounded-lg border border-emerald-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-600">Stripe Transaction ID</p>
                                <p className="font-mono text-sm text-gray-900">{application.stripe_payment_id}</p>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(application.stripe_payment_id);
                                  alert('Transaction ID copied!');
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-4 bg-white rounded-lg border border-amber-200">
                          <h5 className="font-bold text-amber-800 mb-3">Payment Required</h5>
                          <p className="text-sm text-gray-600 mb-4">
                            The applicant must pay the $50 application fee to continue with the application process.
                          </p>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                              <span className="text-gray-700">Application Fee</span>
                              <span className="font-bold text-gray-900">$50.00</span>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                onClick={handleSendPaymentRequest}
                                disabled={sendingPaymentRequest}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {sendingPaymentRequest ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <SendIcon className="w-4 h-4" />
                                    Send Payment Request
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={copyPaymentLink}
                                className="flex-1 px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy Payment Link
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-bold text-gray-800 mb-3">Payment Link</h5>
                          <div className="flex items-center gap-2 mb-3">
                            <input
                              type="text"
                              readOnly
                              value={`https://palmsestate.org/payment/${id}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono"
                            />
                            <button
                              onClick={copyPaymentLink}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Share this link with the applicant for online payment
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Actions */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-bold text-gray-800 mb-4">Payment Actions</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {!isPaymentCompleted ? (
                        <>
                          <button
                            onClick={handleSendPaymentRequest}
                            disabled={sendingPaymentRequest}
                            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <SendIcon className="w-4 h-4" />
                            Send Payment Request Email
                          </button>
                          
                          <button
                            onClick={() => setShowManualPaymentModal(true)}
                            className="px-4 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                          >
                            <Wallet className="w-4 h-4" />
                            Record Manual Payment
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              // View receipt/download
                              alert('Receipt functionality would be implemented here');
                            }}
                            className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Receipt className="w-4 h-4" />
                            View Receipt
                          </button>
                          
                          <button
                            onClick={() => {
                              // Resend receipt
                              alert('Receipt email would be resent');
                            }}
                            className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                          >
                            <MailIcon className="w-4 h-4" />
                            Resend Receipt
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ... Rest of the tabs (details, property, timeline, notes) remain the same ... */}
            {/* Application Details Tab */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Full Application Details</h3>
                
                <div className="space-y-6">
                  {/* ... existing details content ... */}
                </div>
              </div>
            )}

            {/* Property Tab */}
            {activeTab === 'property' && property && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Property Details</h3>
                
                <div className="space-y-6">
                  {/* ... existing property content ... */}
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Application Timeline</h3>
                
                <div className="space-y-6">
                  {/* ... existing timeline content ... */}
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Notes & Comments</h3>
                
                <div className="space-y-6">
                  {/* ... existing notes content ... */}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Status Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Update Status</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                {nextStatusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      if (status === 'rejected') {
                        setShowRejectModal(true);
                      } else {
                        handleStatusUpdate(status);
                      }
                    }}
                    disabled={updating}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      status === 'rejected'
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                        : status === 'approved'
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        : status === 'approved_pending_info'
                        ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700'
                        : status === 'payment_pending'
                        ? 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{getStatusLabel(status)}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <p className="text-sm mt-1 opacity-75">
                      {status === 'approved_pending_info' 
                        ? 'Approve initial application and request detailed info'
                        : status === 'payment_pending'
                        ? 'Request payment for application fee'
                        : `Change status to ${getStatusLabel(status).toLowerCase()}`
                      }
                    </p>
                  </button>
                ))}

                {nextStatusOptions.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                    <p className="text-gray-600">No further actions available</p>
                    <p className="text-sm text-gray-500">Application has reached final status</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Changing status will automatically send an email notification to the applicant.
                </p>
              </div>
            </div>

            {/* Payment Status Card (in sidebar for all tabs) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Status</h3>
              
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${
                  isPaymentCompleted 
                    ? 'bg-emerald-50 border border-emerald-200' 
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {isPaymentCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="font-medium text-gray-800">
                      {isPaymentCompleted ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isPaymentCompleted 
                      ? `$${(application.application_fee || 50).toFixed(2)} paid on ${application.paid_at ? formatDate(application.paid_at).split('at')[0] : 'N/A'}`
                      : '$50.00 application fee pending'
                    }
                  </p>
                </div>
                
                {!isPaymentCompleted && (
                  <button
                    onClick={handleSendPaymentRequest}
                    disabled={sendingPaymentRequest}
                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sendingPaymentRequest ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <SendIcon className="w-4 h-4" />
                        Send Payment Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Email Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Email Status</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <MailOpen className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-800">Email Status</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Emails are sent automatically when status changes. Click below to send manually.
                  </p>
                </div>
                
                <button
                  onClick={sendStatusEmail}
                  disabled={sendingEmail}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-4 h-4" />
                      Send Status Update Email
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Property Quick View */}
            {property && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Property Quick View</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {property.main_image_url && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={property.main_image_url} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900">{property.title}</h4>
                      <p className="text-sm text-gray-600">{property.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Weekly Rate</p>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(property.price_per_week)}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Security Deposit</p>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(property.security_deposit || 0)}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/properties/${property.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Property Page
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Reject Application</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this application.
            </p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 mb-4"
              rows="3"
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected', rejectReason)}
                disabled={!rejectReason.trim() || updating}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {updating ? 'Processing...' : 'Reject Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {showManualPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Record Manual Payment</h3>
            <p className="text-gray-600 mb-6">
              Record a manual payment for cash, check, or bank transfer.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['cash', 'check', 'bank_transfer', 'other'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setManualPaymentDetails(prev => ({ ...prev, method }))}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        manualPaymentDetails.method === method
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {method.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={manualPaymentDetails.amount}
                  onChange={(e) => setManualPaymentDetails(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt/Reference Number (Optional)
                </label>
                <input
                  type="text"
                  value={manualPaymentDetails.receiptNumber}
                  onChange={(e) => setManualPaymentDetails(prev => ({ ...prev, receiptNumber: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., CHK-12345"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={manualPaymentDetails.notes}
                  onChange={(e) => setManualPaymentDetails(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Additional payment details..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowManualPaymentModal(false);
                  setManualPaymentDetails({
                    amount: '50.00',
                    method: 'cash',
                    receiptNumber: '',
                    notes: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManualPayment}
                disabled={updating || !manualPaymentDetails.amount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Record Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApplicationDetail;
