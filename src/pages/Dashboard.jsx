// src/pages/Dashboard.jsx - ENHANCED VERSION
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import { supabase } from '../lib/supabase';
import {
  FileText, Clock, CheckCircle, Building2, Heart, AlertCircle,
  ArrowRight, CalendarDays, MapPin, DollarSign, Users, TrendingUp,
  Home, User, Mail, Phone, ArrowLeft, ExternalLink, Loader2,
  Sparkles, Plus, Search, Filter, Eye, Star, ChevronRight,
  MessageSquare, HelpCircle, Bell, Settings as SettingsIcon
} from 'lucide-react';

function Dashboard() {
  const { user, userProfile } = useAuth();
  const { 
    dashboardStats, 
    recentApplications, 
    loading: dashboardLoading,
    refreshData 
  } = useDashboard();
  const navigate = useNavigate();

  const [localLoading, setLocalLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [quickTips, setQuickTips] = useState([]);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Set quick tips based on user status
    const tips = [];
    if (dashboardStats.totalApplications === 0) {
      tips.push({
        icon: Search,
        title: 'Browse Properties',
        description: 'Start by exploring available rentals',
        action: () => navigate('/properties'),
        color: 'from-blue-500 to-blue-600'
      });
      tips.push({
        icon: Heart,
        title: 'Save Favorites',
        description: 'Bookmark properties you like',
        action: () => navigate('/properties'),
        color: 'from-pink-500 to-rose-600'
      });
    } else if (dashboardStats.pendingApplications > 0) {
      tips.push({
        icon: FileText,
        title: 'Track Applications',
        description: 'Monitor your pending applications',
        action: () => navigate('/dashboard/applications'),
        color: 'from-amber-500 to-orange-600'
      });
    } else {
      tips.push({
        icon: Building2,
        title: 'Find More Properties',
        description: 'Discover new rental opportunities',
        action: () => navigate('/properties'),
        color: 'from-green-500 to-emerald-600'
      });
    }

    tips.push({
      icon: User,
      title: 'Complete Profile',
      description: 'Update your personal information',
      action: () => navigate('/dashboard/profile'),
      color: 'from-purple-500 to-violet-600'
    });

    setQuickTips(tips);
  }, [dashboardStats, navigate]);

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
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getApplicantName = (application) => {
    if (application.first_name && application.last_name) {
      return `${application.first_name} ${application.last_name}`;
    }
    return application.full_name || user?.email?.split('@')[0] || 'Applicant';
  };

  const handleRefresh = async () => {
    setLocalLoading(true);
    await refreshData();
    setTimeout(() => setLocalLoading(false), 500);
  };

  if (dashboardLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your Palms Estate Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={localLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-orange-300 hover:text-orange-700 font-medium transition-colors disabled:opacity-50"
            >
              {localLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 rotate-90" />
              )}
              Refresh
            </button>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 transition-all"
            >
              <Building2 className="w-4 h-4" />
              Browse Properties
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalApplications}</p>
            </div>
            <div className="p-3 rounded-full bg-white">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link 
            to="/dashboard/applications" 
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-4 font-medium"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.pendingApplications}</p>
            </div>
            <div className="p-3 rounded-full bg-white">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="text-sm text-amber-700 mt-4">
            {dashboardStats.pendingApplications > 0 ? 'Awaiting review' : 'No pending applications'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.approvedApplications}</p>
            </div>
            <div className="p-3 rounded-full bg-white">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-green-700 mt-4">
            {dashboardStats.approvedApplications > 0 ? 'Successfully approved' : 'No approved applications yet'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-rose-100 border border-pink-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pink-700 mb-1">Saved Properties</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.savedProperties}</p>
            </div>
            <div className="p-3 rounded-full bg-white">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <Link 
            to="/dashboard/saved" 
            className="inline-flex items-center gap-1 text-sm text-pink-600 hover:text-pink-800 mt-4 font-medium"
          >
            View Saved
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Applications Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                  <p className="text-gray-600 text-sm mt-1">Your most recent rental applications</p>
                </div>
                <Link 
                  to="/dashboard/applications"
                  className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {recentApplications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mb-6">
                  <FileText className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start your rental journey by applying for properties you're interested in.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/properties')}
                    className="w-full max-w-md bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                  >
                    <Search className="w-5 h-5" />
                    Browse Properties
                  </button>
                  <Link
                    to="/dashboard/saved"
                    className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <Heart className="w-4 h-4" />
                    View saved properties first
                  </Link>
                </div>
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
                            <h3 className="font-semibold text-gray-900 truncate">
                              {property.title}
                            </h3>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                              {status.icon}
                              <span>{status.label}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
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
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>Applicant: {applicantName}</span>
                            
                            {application.reference_number && (
                              <span>Ref: #{application.reference_number}</span>
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

          {/* Quick Tips Section */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <button
                    key={index}
                    onClick={tip.action}
                    className={`bg-gradient-to-br ${tip.color} rounded-xl p-4 text-left hover:shadow-lg transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-lg">{tip.title}</h4>
                    </div>
                    <p className="text-white/80 text-sm">{tip.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              Your Profile
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-sm text-gray-600">Member</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{user?.email}</span>
                </div>
                
                {userProfile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{userProfile.phone}</span>
                  </div>
                )}
              </div>
              
              <Link 
                to="/dashboard/profile"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm mt-2"
              >
                Update Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-pink-300 hover:bg-pink-50 transition-colors group"
              >
                <span className="font-medium">Saved Properties</span>
                <Heart className="w-5 h-5 text-gray-500 group-hover:text-pink-600" />
              </button>

              <button
                onClick={() => navigate('/dashboard/settings')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
              >
                <span className="font-medium">Settings</span>
                <SettingsIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-xl mb-3">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-6">
              Our support team is available to assist with any questions about properties, applications, or your account.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-white text-blue-600 font-semibold py-2.5 rounded-lg transition-colors hover:bg-blue-50"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="w-full bg-transparent border border-white/30 text-white py-2.5 rounded-lg transition-colors hover:bg-white/10"
              >
                View FAQs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
