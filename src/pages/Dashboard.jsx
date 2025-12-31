// src/pages/Dashboard.jsx (or move it to src/pages/dashboard/Dashboard.jsx)
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  FileText, Clock, CheckCircle, Building2, Heart, AlertCircle,
  ArrowRight, CalendarDays, MapPin, DollarSign, Users, TrendingUp
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    savedProperties: 0,
    upcomingPayments: 0
  });
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadUserProfile();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total applications
      const { count: totalCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch pending applications (submitted, payment_pending, pre_approved)
      const { count: pendingCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['submitted', 'payment_pending', 'pre_approved']);

      // Fetch approved applications
      const { count: approvedCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'approved');

      // Fetch saved properties count
      const { count: savedCount } = await supabase
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch recent applications (last 3)
      const { data: recentApps } = await supabase
        .from('applications')
        .select(`
          *,
          property:property_id (
            title,
            location,
            main_image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setStats({
        totalApplications: totalCount || 0,
        pendingApplications: pendingCount || 0,
        approvedApplications: approvedCount || 0,
        savedProperties: savedCount || 0,
        upcomingPayments: 0
      });

      setRecentApplications(recentApps || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserProfile(data);
      } else {
        // If no profile exists, create one
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.email?.split('@')[0] || 'User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (newProfile) {
          setUserProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="w-4 h-4" />,
        label: 'Submitted'
      },
      payment_pending: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Payment Pending'
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Pre-Approved'
      },
      paid_under_review: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <FileText className="w-4 h-4" />,
        label: 'Under Review'
      },
      approved: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Approved'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Rejected'
      }
    };
    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getUserGreeting()}, {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back to your Palms Estate dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link 
            to="/dashboard/applications" 
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-4"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-50">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="text-xs text-amber-600 mt-4">
            Awaiting review or payment
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-xs text-green-600 mt-4">
            Successfully approved
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Saved Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.savedProperties}</p>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <Link 
            to="/dashboard/saved" 
            className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 mt-4"
          >
            View Saved
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <Link 
                  to="/dashboard/applications"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            
            {recentApplications.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't submitted any applications yet</p>
                <button
                  onClick={() => navigate('/properties')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentApplications.map((application) => {
                  const status = getStatusConfig(application.status);
                  const property = application.property || { title: 'Property' };
                  
                  return (
                    <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {property.title}
                            </h3>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                              {status.icon}
                              <span>{status.label}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              Applied {formatDate(application.created_at)}
                            </span>
                            
                            {property.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {property.location}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                          className="ml-4 text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                          View
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Profile */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              {userProfile?.phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium">{userProfile.phone}</p>
                </div>
              )}
              <Link 
                to="/dashboard/profile"
                className="inline-block text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Update Profile →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/properties')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <span className="font-medium">Browse Properties</span>
                <Building2 className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard/applications')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium">View Applications</span>
                <FileText className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard/saved')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                <span className="font-medium">Saved Properties</span>
                <Heart className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-700 text-sm mb-4">
              Our support team is available to assist with any questions.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
