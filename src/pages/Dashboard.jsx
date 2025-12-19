import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Home, Calendar, CreditCard, Heart, Settings, 
  User, CheckCircle, Clock, AlertCircle, ArrowRight,
  PlusCircle, TrendingUp, DollarSign, Building2,
  FileText, MapPin, Bed, Bath, Square,
  ChevronRight, LogOut
} from 'lucide-react';

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    active: 0,
    completed: 0,
    totalSpent: 0
  });
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load applications
      const { data: apps, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(apps || []);
      
      // Calculate stats
      const activeApps = apps?.filter(app => ['pending', 'paid_pending'].includes(app.status)).length || 0;
      const completedApps = apps?.filter(app => ['approved', 'rejected'].includes(app.status)).length || 0;
      
      setStats({
        applications: apps?.length || 0,
        active: activeApps,
        completed: completedApps,
        totalSpent: (apps?.length || 0) * 50 // $50 per application
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        icon: <Clock className="w-4 h-4" />, 
        color: 'bg-amber-100 text-amber-800',
        label: 'Pending Review'
      },
      paid_pending: { 
        icon: <CheckCircle className="w-4 h-4" />, 
        color: 'bg-blue-100 text-blue-800',
        label: 'Payment Complete'
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
    };

    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/properties"
                className="inline-flex items-center bg-gradient-to-r from-primary-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-all"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Apply for New Property
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.applications}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-green-600 font-medium">+2 this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Active Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-sm text-gray-500">In review process</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-sm text-gray-500">Applications processed</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-sm text-gray-500">Application fees</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <p className="text-gray-600 text-sm mt-1">Track your property applications</p>
              </div>

              <div className="p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      Start your luxury living journey by applying for a property.
                    </p>
                    <Link
                      to="/properties"
                      className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application) => {
                      const statusConfig = getStatusConfig(application.status);
                      return (
                        <div key={application.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <Building2 className="w-5 h-5 text-gray-400" />
                              <h4 className="font-semibold text-gray-900 truncate">
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
                              <span className="flex items-center">
                                <Square className="w-4 h-4 mr-1" />
                                {application.properties?.sqft?.toLocaleString() || 'N/A'} sq ft
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                              {statusConfig.icon}
                              <span className="ml-2">{statusConfig.label}</span>
                            </span>
                            <p className="text-sm text-gray-500">
                              {new Date(application.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    
                    {applications.length > 5 && (
                      <Link
                        to="/dashboard/applications"
                        className="block text-center text-primary-600 hover:text-primary-700 font-medium py-4 border-t border-gray-200"
                      >
                        View All Applications ({applications.length})
                        <ArrowRight className="w-4 h-4 inline ml-2" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Profile */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user?.email}</h3>
                  <p className="text-sm text-gray-600">Premium Member</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Edit Profile</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Account Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button
                  onClick={() => navigate('/dashboard/payments')}
                  className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-medium text-gray-700">Payment Methods</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary-600 to-orange-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/properties')}
                  className="flex items-center justify-between w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <PlusCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">Apply for Property</span>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => navigate('/dashboard/tours')}
                  className="flex items-center justify-between w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span className="font-medium">Schedule Tour</span>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => navigate('/contact')}
                  className="flex items-center justify-between w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3" />
                    <span className="font-medium">Contact Support</span>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;