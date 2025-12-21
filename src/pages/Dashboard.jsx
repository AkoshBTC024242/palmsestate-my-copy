import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  FileText, Clock, CheckCircle, AlertCircle,
  Building2, MapPin, Bed, Bath, Square,
  ArrowRight, PlusCircle, DollarSign, User,
  LogOut, Calendar, CreditCard, Settings,
  ChevronRight, Home
} from 'lucide-react';

function Dashboard() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    paid: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDashboardData = async () => {
    console.log('📊 Loading dashboard data for user:', user?.email);
    
    try {
      // Load applications from database with property details
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (title, location, price_per_week, bedrooms, bathrooms, square_feet)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading applications:', error);
        setApplications([]);
      } else {
        console.log('✅ Applications loaded:', data?.length || 0);
        setApplications(data || []);
        
        // Calculate stats - UPDATED to match your actual status values
        const pendingApps = data?.filter(app => 
          app.status === 'pending' || 
          app.status === 'payment_pending'
        ) || [];
        
        const underReview = data?.filter(app => app.status === 'under_review') || [];
        const approved = data?.filter(app => app.status === 'approved') || [];
        const rejected = data?.filter(app => app.status === 'rejected') || [];
        const paid = data?.filter(app => app.payment_status === 'completed') || [];
        
        setStats({
          total: data?.length || 0,
          pending: pendingApps.length + underReview.length,
          approved: approved.length,
          rejected: rejected.length,
          paid: paid.length
        });
      }
      
    } catch (error) {
      console.error('❌ Dashboard load error:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, paymentStatus) => {
    const config = {
      pending: { 
        icon: <Clock className="w-4 h-4" />, 
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Pending'
      },
      payment_pending: { 
        icon: paymentStatus === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />,
        color: paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800',
        label: paymentStatus === 'completed' ? 'Payment Complete' : 'Payment Pending'
      },
      under_review: { 
        icon: <Clock className="w-4 h-4" />, 
        color: 'bg-blue-100 text-blue-800',
        label: 'Under Review'
      },
      approved: { 
        icon: <CheckCircle className="w-4 h-4" />, 
        color: 'bg-green-100 text-green-800',
        label: 'Approved'
      },
      rejected: { 
        icon: <AlertCircle className="w-4 h-4" />, 
        color: 'bg-red-100 text-red-800',
        label: 'Rejected'
      },
      completed: { 
        icon: <CheckCircle className="w-4 h-4" />, 
        color: 'bg-green-100 text-green-800',
        label: 'Completed'
      }
    };

    const statusConfig = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
        {statusConfig.icon}
        <span className="ml-2">{statusConfig.label}</span>
      </span>
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/properties"
                className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Application
              </Link>
              
              <button
                onClick={handleSignOut}
                className="inline-flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-semibold text-gray-900">Recent Applications</h2>
                <p className="text-sm text-gray-600">Track your property applications</p>
              </div>
              <Link
                to="/properties"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Apply for another property
              </Link>
            </div>
          </div>

          <div className="p-6">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6">Start your journey by applying for a property.</p>
                <Link
                  to="/properties"
                  className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-serif font-semibold text-gray-900 truncate">
                            {application.properties?.title || 'Property Application'}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{application.properties?.location || 'Location not specified'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Applied: {formatDate(application.created_at)}
                        </span>
                        {application.paid_at && (
                          <span className="flex items-center text-green-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Paid: {formatDate(application.paid_at)}
                          </span>
                        )}
                        {application.application_fee && (
                          <span className="font-medium text-gray-900">
                            Fee: ${application.application_fee}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-3">
                      {getStatusBadge(application.status, application.payment_status)}
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/properties/${application.property_id}`}
                          className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
                        >
                          View Property
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                        {application.status === 'payment_pending' && application.payment_status !== 'completed' && (
                          <Link
                            to={`/properties/${application.property_id}/apply`}
                            className="text-white bg-gradient-to-r from-amber-600 to-orange-500 text-sm font-medium px-3 py-1 rounded-lg hover:shadow-md transition-all"
                          >
                            Complete Payment
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {applications.length > 5 && (
                  <div className="text-center pt-4 border-t border-gray-200">
                    <Link
                      to="#"
                      className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
                    >
                      View All Applications ({applications.length})
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Support */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/properties"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <PlusCircle className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Apply for Property</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Schedule Tour</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              
              <Link
                to="/"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Return Home</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-2 bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl p-6 text-white shadow-sm">
            <h3 className="text-lg font-serif font-semibold mb-4">Need Assistance?</h3>
            <p className="mb-6 opacity-90">
              Our support team is available 24/7 to help with your applications, property tours, and any questions.
              Contact us for payment issues or application status updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white text-amber-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <a
                href="tel:+18286239765"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Call Now: +1 (828) 623-9765
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
