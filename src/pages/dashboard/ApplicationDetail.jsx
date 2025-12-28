import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, Building2, MapPin, Calendar, DollarSign, User, 
  Mail, Phone, FileText, CheckCircle, Clock, AlertCircle,
  Download, Printer, MessageSquare, Home, Bed, Bath, 
  Maximize, CreditCard, Shield, ChevronRight
} from 'lucide-react';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    loadApplication();
  }, [id, user]);

  const loadApplication = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status, paymentStatus) => {
    const configs = {
      pending: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <Clock className="w-5 h-5" />,
        label: 'Pending Review',
        description: 'Your application is being reviewed by our team'
      },
      under_review: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Under Review',
        description: 'Our team is currently reviewing your application'
      },
      approved: { 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Approved',
        description: 'Your application has been approved!'
      },
      payment_pending: { 
        color: paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-orange-100 text-orange-800 border-orange-200',
        icon: paymentStatus === 'completed' ? <CheckCircle className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />,
        label: paymentStatus === 'completed' ? 'Payment Complete' : 'Payment Required',
        description: paymentStatus === 'completed' ? 'Payment has been processed successfully' : 'Complete payment to proceed'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Rejected',
        description: 'Your application was not approved'
      },
      completed: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Completed',
        description: 'Application process completed successfully'
      }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h1>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist or you don't have access.</p>
          <button
            onClick={() => navigate('/dashboard/applications')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status, application.payment_status);
  const property = application.properties;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-amber-50/20 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Applications
        </button>

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
                    Application #{application.id.slice(0, 8)}
                  </h1>
                  <p className="text-gray-600">Submitted for {property?.title}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
                  {statusConfig.icon}
                  <span className="font-medium">{statusConfig.label}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{statusConfig.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Applied {formatDate(application.created_at)}</span>
                </div>
                {application.application_fee > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>Application Fee: {formatCurrency(application.application_fee)}</span>
                  </div>
                )}
                {application.payment_status && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment: {application.payment_status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={property?.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4'}
                  alt={property?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">{property?.title}</h2>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{property?.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(property?.price_per_week || 0)}</p>
                    <p className="text-sm text-gray-600">per week</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bed className="w-5 h-5 text-gray-400" />
                      <span className="text-lg font-bold text-gray-900">{property?.bedrooms || 3}</span>
                    </div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bath className="w-5 h-5 text-gray-400" />
                      <span className="text-lg font-bold text-gray-900">{property?.bathrooms || 3}</span>
                    </div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Maximize className="w-5 h-5 text-gray-400" />
                      <span className="text-lg font-bold text-gray-900">{property?.square_feet?.toLocaleString() || '2,500'}</span>
                    </div>
                    <p className="text-sm text-gray-600">Square Feet</p>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/properties/${property?.id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-600 font-medium py-3 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  View Property Details
                </button>
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Application Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-400" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Full Name</p>
                      <p className="font-medium">{application.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-medium">{application.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <p className="font-medium">{application.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    Additional Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Move-in Date</p>
                      <p className="font-medium">
                        {application.move_in_date ? formatDate(application.move_in_date) : 'Flexible'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Lease Duration</p>
                      <p className="font-medium">{application.lease_duration || '12 months'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Occupants</p>
                      <p className="font-medium">{application.number_of_occupants || '1'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {application.notes && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Additional Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{application.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-6 text-white">
              <h3 className="font-serif text-xl font-bold mb-4">Application Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Submitted</span>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Under Review</span>
                  <div className={`w-5 h-5 rounded-full ${application.status === 'under_review' || application.status === 'approved' || application.status === 'completed' ? 'bg-white' : 'bg-white/30'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Approval</span>
                  <div className={`w-5 h-5 rounded-full ${application.status === 'approved' || application.status === 'completed' ? 'bg-white' : 'bg-white/30'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment</span>
                  <div className={`w-5 h-5 rounded-full ${application.payment_status === 'completed' || application.status === 'completed' ? 'bg-white' : 'bg-white/30'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completed</span>
                  <div className={`w-5 h-5 rounded-full ${application.status === 'completed' ? 'bg-white' : 'bg-white/30'}`}></div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h3 className="font-serif font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {application.status === 'payment_pending' && application.payment_status !== 'completed' && (
                  <button
                    onClick={() => navigate(`/dashboard/applications/${id}/payment`)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:shadow-md transition-all"
                  >
                    <span>Complete Payment</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <span>Contact Support</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-gray-600" />
                    <span>Download PDF</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-gray-600" />
                    <span>Print Application</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 text-white">
              <h3 className="font-serif font-bold mb-4">Need Help?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Our support team is available 24/7 to assist you with your application.
              </p>
              <div className="space-y-3">
                <a href="mailto:admin@palmsestate.org" className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  admin@palmsestate.org
                </a>
                <a href="tel:+18286239765" className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  +1 (828) 623-9765
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
