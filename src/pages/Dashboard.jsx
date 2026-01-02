// src/pages/Dashboard.jsx - UPDATED VERSION
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, fetchUserApplications, getSavedPropertiesCount } from '../lib/supabase';
import { supabase, fetchUserApplications } from '../lib/supabase'; // Add fetchUserApplications import
import {
  FileText, Clock, CheckCircle, Building2, Heart, AlertCircle,
  ArrowRight, CalendarDays, MapPin, DollarSign, Users, TrendingUp,
  Home, User, Mail, Phone, ArrowLeft, ExternalLink, Loader2
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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading dashboard data for user:', user?.id);

      // Fetch user applications using the helper function
      const applications = await fetchUserApplications(user.id);
      console.log('Applications loaded:', applications?.length || 0);

      // Calculate stats
      const totalApplications = applications?.length || 0;
      const pendingApplications = applications?.filter(app => 
        ['submitted', 'payment_pending', 'pre_approved'].includes(app.status)
      ).length || 0;
      const approvedApplications = applications?.filter(app => 
        app.status === 'approved'
      ).length || 0;

      // Fetch saved properties count
     const savedCountResult = await getSavedPropertiesCount(user.id);
     const savedCount = savedCountResult.success ? savedCountResult.count : 0;

      // Get recent applications (last 5)
      const recentApps = applications?.slice(0, 5) || [];

      setStats({
        totalApplications,
        pendingApplications,
        approvedApplications,
        savedProperties: savedCount || 0,
        upcomingPayments: 0
      });

      setRecentApplications(recentApps);

      // Load property details for recent applications
      if (recentApps.length > 0) {
        const propertyIds = recentApps
          .map(app => app.property_id)
          .filter(id => id !== null && id !== undefined);
        
        if (propertyIds.length > 0) {
          const uniqueIds = [...new Set(propertyIds)];
          const { data: propertiesData } = await supabase
            .from('properties')
            .select('*')
            .in('id', uniqueIds);
          
          if (propertiesData) {
            // Add property details to recent applications
            const appsWithProperties = recentApps.map(app => ({
              ...app,
              property: propertiesData.find(p => p.id === app.property_id) || null
            }));
            setRecentApplications(appsWithProperties);
          }
        }
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
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
        // Create profile if doesn't exist
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.email?.split('@')[0] || 'User',
            email: user.email,
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
        label: 'Submitted',
        description: 'Application submitted'
      },
      payment_pending: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Payment Pending',
        description: 'Awaiting payment'
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Pre-Approved',
        description: 'Initial approval granted'
      },
      paid_under_review: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <FileText className="w-4 h-4" />,
        label: 'Under Review',
        description: 'Final review in progress'
      },
      approved: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Approved',
        description: 'Application approved'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Rejected',
        description: 'Application not approved'
      }
    };
    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getApplicantName = (application) => {
    if (application.first_name && application.last_name) {
      return `${application.first_name} ${application.last_name}`;
    }
    return application.full_name || user?.email?.split('@')[0] || 'Applicant';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadDashboardData}
                className="inline-flex items-center gap-2 bg-orange-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                <Loader2 className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {recentApplications.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6">You haven't submitted any applications yet</p>
                <button
                  onClick={() => navigate('/properties')}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <Building2 className="w-5 h-5" />
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentApplications.map((application) => {
                  const status = getStatusConfig(application.status);
                  const property = application.property || { title: `Property #${application.property_id}` };
                  const applicantName = getApplicantName(application);
                  
                  return (
                    <div 
                      key={application.id} 
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                    >
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
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
                            
                            {application.application_fee && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${application.application_fee}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Applicant: {applicantName}</span>
                            
                            {application.reference_number && (
                              <span>Ref: #{application.reference_number}</span>
                            )}
                            
                            {property.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/properties/${property.id}`);
                                }}
                                className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                              >
                                View Property
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/applications/${application.id}`);
                          }}
                          className="ml-4 text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                          View Details
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
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white border border-orange-200">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{userProfile?.full_name || user?.email?.split('@')[0] || 'User'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white border border-orange-200">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              {userProfile?.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white border border-orange-200">
                    <Phone className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{userProfile.phone}</p>
                  </div>
                </div>
              )}
              
              <Link 
                to="/dashboard/profile"
                className="inline-block text-orange-600 hover:text-orange-700 font-medium text-sm mt-2"
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
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-orange-300 hover:bg-orange-50 transition-colors group"
              >
                <span className="font-medium">Browse Properties</span>
                <Building2 className="w-5 h-5 text-gray-500 group-hover:text-orange-600" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard/applications')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <span className="font-medium">View Applications</span>
                <FileText className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard/saved')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-red-300 hover:bg-red-50 transition-colors group"
              >
                <span className="font-medium">Saved Properties</span>
                <Heart className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
              </button>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-700 text-sm mb-4">
              Our support team is available to assist with any questions.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
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
