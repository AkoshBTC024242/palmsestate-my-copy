import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  FileText, Clock, CheckCircle, AlertCircle,
  Building2, MapPin, Bed, Bath, Square,
  ArrowRight, PlusCircle, DollarSign, User,
  LogOut, Calendar, CreditCard, Settings
} from 'lucide-react';

function Dashboard() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
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
      // Load applications from database
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (title, location, price)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading applications:', error);
        setApplications([]);
      } else {
        console.log('✅ Applications loaded:', data?.length || 0);
        setApplications(data || []);
        
        // Calculate stats
        const pending = data?.filter(app => app.status === 'pending').length || 0;
        const approved = data?.filter(app => app.status === 'approved').length || 0;
        const rejected = data?.filter(app => app.status === 'rejected').length || 0;
        
        setStats({
          total: data?.length || 0,
          pending,
          approved,
          rejected
        });
      }
      
    } catch (error) {
      console.error('❌ Dashboard load error:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { 
        icon: <Clock className="w-4 h-4" />, 
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Pending'
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
      paid_pending: { 
        icon: <CheckCircle className="w-4 h-4" />, 
        color: 'bg-blue-100 text-blue-800',
        label: 'Payment Complete'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/properties"
                className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Application
              </Link>
              
              <button
                onClick={handleSignOut}
                className="inline-flex items-center text-gray-700 hover:text-gray-900"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
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

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
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

          <div className="bg-white rounded-lg border border-gray-200 p-6">
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
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <p className="text-sm text-gray-600">Track your property applications</p>
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
                  className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <h4 className="font-medium text-gray-900 truncate">
                          {application.properties?.title || 'Property Application'}
                        </h4>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{application.properties?.location || 'Location not specified'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {application.properties?.bedrooms || 'N/A'} beds
                        </span>
                        <span className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          {application.properties?.bathrooms || 'N/A'} baths
                        </span>
                        {application.properties?.price && (
                          <span className="font-medium text-gray-900">
                            ${application.properties.price.toLocaleString()}/week
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(application.status)}
                      <p className="text-sm text-gray-500">
                        Applied: {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {applications.length > 5 && (
                  <div className="text-center pt-4 border-t border-gray-200">
                    <Link
                      to="#"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View All Applications ({applications.length})
                      <ArrowRight className="w-4 h-4 inline ml-2" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Schedule Tour</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
              
              <Link
                to="/dashboard/profile"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Update Profile</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-2 bg-gradient-to-r from-primary-600 to-orange-500 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Need Assistance?</h3>
            <p className="mb-6 opacity-90">
              Our support team is available 24/7 to help with your applications, property tours, and any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
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