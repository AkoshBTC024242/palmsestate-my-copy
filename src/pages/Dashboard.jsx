import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { 
  FileText, Clock, CheckCircle, Heart, Building2, MapPin,
  CalendarDays, DollarSign, Eye, PlusCircle, Bell,
  CreditCard, Trophy, Sparkles, ArrowRight, Users, Home
} from 'lucide-react';

function Dashboard() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    savedProperties: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load applications
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (appsError) throw appsError;

      // Load saved properties count
      const { data: savedData, error: savedError } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id);

      if (savedError) throw savedError;

      if (appsData) {
        setApplications(appsData);
        const pending = appsData.filter(app => 
          app.status === 'submitted' || app.status === 'pre_approved' || app.status === 'paid_under_review'
        ).length;
        const approved = appsData.filter(app => 
          app.status === 'approved'
        ).length;

        setStats({
          totalApplications: appsData.length,
          pending,
          approved,
          savedProperties: savedData?.length || 0
        });
      }

      if (savedData) {
        setSavedProperties(savedData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { 
        icon: <Clock className="w-3 h-3" />, 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Submitted'
      },
      pre_approved: { 
        icon: <FileText className="w-3 h-3" />, 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Pre-Approved'
      },
      paid_under_review: { 
        icon: <CreditCard className="w-3 h-3" />, 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Paid - Review'
      },
      approved: { 
        icon: <CheckCircle className="w-3 h-3" />, 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Approved'
      },
      rejected: { 
        icon: <FileText className="w-3 h-3" />, 
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Rejected'
      }
    };

    const config = statusConfig[status] || statusConfig.submitted;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-orange-100 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile?.first_name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your property applications and activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Applications', 
              value: stats.totalApplications, 
              icon: <FileText className="w-6 h-6" />,
              color: 'from-blue-500 to-blue-600',
              onClick: () => navigate('/dashboard/applications')
            },
            { 
              label: 'Pending Review', 
              value: stats.pending, 
              icon: <Clock className="w-6 h-6" />,
              color: 'from-amber-500 to-orange-500',
              onClick: () => navigate('/dashboard/applications')
            },
            { 
              label: 'Approved', 
              value: stats.approved, 
              icon: <CheckCircle className="w-6 h-6" />,
              color: 'from-emerald-500 to-green-600',
              onClick: () => navigate('/dashboard/applications')
            },
            { 
              label: 'Saved Properties', 
              value: stats.savedProperties, 
              icon: <Heart className="w-6 h-6" />,
              color: 'from-rose-500 to-pink-600',
              onClick: () => navigate('/dashboard/saved')
            },
          ].map((stat, index) => (
            <div 
              key={index}
              onClick={stat.onClick}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Applications & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Recent Applications</h2>
                  <p className="text-gray-600">Track your property applications and their status</p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/applications')}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start your luxury living journey by applying for one of our premium properties.
                  </p>
                  <button
                    onClick={() => navigate('/properties')}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <Building2 className="w-5 h-5" />
                    Browse Properties
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div 
                      key={application.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">
                                Property Application
                              </h4>
                              {getStatusBadge(application.status)}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                Applied {formatDate(application.created_at)}
                              </span>
                              {application.reference_number && (
                                <span className="font-medium">
                                  Ref: #{application.reference_number}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-0">
                        <button
                          onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                          View Details
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Browse Properties',
                    description: 'Find your dream property',
                    icon: <Building2 className="w-5 h-5" />,
                    path: '/properties',
                    color: 'bg-blue-500'
                  },
                  {
                    title: 'Submit New Application',
                    description: 'Apply for a property',
                    icon: <PlusCircle className="w-5 h-5" />,
                    path: '/properties',
                    color: 'bg-orange-500'
                  },
                  {
                    title: 'View Saved Properties',
                    description: 'Your favorite listings',
                    icon: <Heart className="w-5 h-5" />,
                    path: '/dashboard/saved',
                    color: 'bg-pink-500'
                  },
                  {
                    title: 'Update Profile',
                    description: 'Manage your information',
                    icon: <Users className="w-5 h-5" />,
                    path: '/dashboard/profile',
                    color: 'bg-purple-500'
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
                  >
                    <div className={`${action.color} p-3 rounded-lg text-white`}>
                      {action.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Activity */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Summary</h2>
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">
                    {userProfile?.first_name || 'User'} {userProfile?.last_name || ''}
                  </h3>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {user?.created_at ? new Date(user.created_at).getFullYear() : 'Recently'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard/profile')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                Edit Profile
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {applications.slice(0, 2).map((app, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`p-2 rounded-lg ${
                      app.status === 'approved' ? 'bg-green-100' :
                      app.status === 'rejected' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {app.status === 'approved' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : app.status === 'rejected' ? (
                        <FileText className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {app.status === 'approved' ? 'Application approved' :
                         app.status === 'rejected' ? 'Application rejected' :
                         'Application submitted'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(app.updated_at || app.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {savedProperties.length > 0 && (
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-pink-100">
                      <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Property saved
                      </p>
                      <p className="text-xs text-gray-500">
                        Recently
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Home className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Dashboard accessed
                    </p>
                    <p className="text-xs text-gray-500">
                      Today
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-gray-700 mb-4 text-sm">
                Our support team is here to help with your applications and property searches.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
