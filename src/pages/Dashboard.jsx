// src/pages/Dashboard.jsx - ENHANCED VERSION WITH BLACK/ORANGE THEME
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
  MessageSquare, HelpCircle, Bell, Settings as SettingsIcon,
  Activity, Award, Briefcase, Compass, Crown, Gem,
  Shield, Target, Zap, Globe, Camera, Video,
  HeadphonesIcon, LifeBuoy, BookOpen, Download
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
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
        description: 'Start exploring available luxury rentals',
        action: () => navigate('/properties'),
        color: 'from-[#F97316] to-[#EA580C]'
      });
      tips.push({
        icon: Heart,
        title: 'Save Favorites',
        description: 'Bookmark properties you love',
        action: () => navigate('/properties'),
        color: 'from-[#F97316] to-[#EA580C]'
      });
    } else if (dashboardStats.pendingApplications > 0) {
      tips.push({
        icon: FileText,
        title: 'Track Applications',
        description: 'Monitor your pending applications',
        action: () => navigate('/dashboard/applications'),
        color: 'from-[#F97316] to-[#EA580C]'
      });
    } else {
      tips.push({
        icon: Building2,
        title: 'Discover More',
        description: 'Find new luxury opportunities',
        action: () => navigate('/properties'),
        color: 'from-[#F97316] to-[#EA580C]'
      });
    }

    tips.push({
      icon: User,
      title: 'Complete Profile',
      description: 'Enhance your experience',
      action: () => navigate('/dashboard/profile'),
      color: 'from-[#F97316] to-[#EA580C]'
    });

    setQuickTips(tips);

    // Simulate live notifications (in real app, this would come from WebSocket or real-time subscriptions)
    const mockNotifications = [
      {
        id: 1,
        type: 'application',
        message: 'Your application is being reviewed',
        time: '5 min ago',
        read: false
      },
      {
        id: 2,
        type: 'property',
        message: 'New property matches your criteria',
        time: '1 hour ago',
        read: false
      },
      {
        id: 3,
        type: 'message',
        message: 'Advisor sent you a message',
        time: '2 hours ago',
        read: true
      }
    ];
    setLiveNotifications(mockNotifications);

    // Subscribe to real-time updates (example with Supabase)
    const subscription = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'applications',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        // Handle real-time updates
        refreshData();
        // Show notification
        setLiveNotifications(prev => [{
          id: Date.now(),
          type: 'application',
          message: 'Your application status has been updated',
          time: 'Just now',
          read: false
        }, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [dashboardStats, navigate, user?.id, refreshData]);

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
        icon: <Clock className="w-4 h-4" />,
        label: 'Submitted',
        description: 'Application submitted successfully'
      },
      payment_pending: {
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Payment Pending',
        description: 'Awaiting payment confirmation'
      },
      pre_approved: { 
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Pre-Approved',
        description: 'Initial approval granted'
      },
      paid_under_review: { 
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        icon: <FileText className="w-4 h-4" />,
        label: 'Under Review',
        description: 'Final review in progress'
      },
      approved: { 
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Approved',
        description: 'Application approved!'
      },
      rejected: { 
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
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

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
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

  const markNotificationAsRead = (notificationId) => {
    setLiveNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const unreadCount = liveNotifications.filter(n => !n.read).length;

  if (dashboardLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-[#F97316] mx-auto mb-4" />
          <p className="text-[#A1A1AA]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section with Notifications */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-light text-white">
                {greeting}, <span className="text-[#F97316] font-medium">
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
              </h1>
              {unreadCount > 0 && (
                <span className="bg-[#F97316] text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[#A1A1AA] mt-2">
              Welcome to your Palms Estate Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-[#18181B] border border-[#27272A] rounded-xl hover:border-[#F97316]/30 transition-colors"
              >
                <Bell className="w-5 h-5 text-[#A1A1AA]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F97316] text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-[#27272A]">
                    <h3 className="text-white font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {liveNotifications.length > 0 ? (
                      liveNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-[#27272A] last:border-0 hover:bg-[#0A0A0A] cursor-pointer transition-colors ${
                            !notification.read ? 'bg-[#F97316]/5' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <p className="text-white text-sm mb-1">{notification.message}</p>
                          <p className="text-[#A1A1AA] text-xs">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-[#A1A1AA]">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={localLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-xl text-[#A1A1AA] hover:border-[#F97316]/30 hover:text-white transition-colors disabled:opacity-50"
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#F97316]/20 transition-all"
            >
              <Building2 className="w-4 h-4" />
              Browse Properties
            </button>
          </div>
        </div>
      </div>

      {/* Live Contact Integration - New Section for Real-time Updates */}
      <div className="mb-8 bg-gradient-to-br from-[#18181B] to-[#0A0A0A] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
              <HeadphonesIcon className="w-5 h-5 text-[#F97316]" />
            </div>
            <div>
              <h3 className="text-white font-medium">Live Concierge Support</h3>
              <p className="text-[#A1A1AA] text-sm">Real-time assistance from our team</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[#A1A1AA] text-sm">Online</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.open('https://wa.me/18286239765', '_blank')}
            className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl hover:border-[#25D366]/30 transition-colors group"
          >
            <div className="w-8 h-8 bg-[#25D366]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#25D366] text-lg">📱</span>
            </div>
            <div className="text-left">
              <p className="text-white text-sm group-hover:text-[#25D366] transition-colors">WhatsApp</p>
              <p className="text-[#A1A1AA] text-xs">Instant chat</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl hover:border-[#F97316]/30 transition-colors group"
          >
            <div className="w-8 h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#F97316]" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm group-hover:text-[#F97316] transition-colors">Live Chat</p>
              <p className="text-[#A1A1AA] text-xs">Avg. 2 min response</p>
            </div>
          </button>

          <button
            onClick={() => window.location.href = 'tel:+18286239765'}
            className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl hover:border-[#F97316]/30 transition-colors group"
          >
            <div className="w-8 h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#F97316]" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm group-hover:text-[#F97316] transition-colors">Call Us</p>
              <p className="text-[#A1A1AA] text-xs">24/7 Concierge</p>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Grid - Updated with Black/Orange Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A1A1AA] text-sm mb-1">Total Applications</p>
              <p className="text-3xl font-light text-white">{dashboardStats.totalApplications}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F97316]/10">
              <FileText className="w-6 h-6 text-[#F97316]" />
            </div>
          </div>
          <Link 
            to="/dashboard/applications" 
            className="inline-flex items-center gap-1 text-sm text-[#F97316] hover:text-[#F97316]/80 mt-4"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A1A1AA] text-sm mb-1">Pending Review</p>
              <p className="text-3xl font-light text-white">{dashboardStats.pendingApplications}</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="text-sm text-yellow-500 mt-4">
            {dashboardStats.pendingApplications > 0 ? 'Awaiting review' : 'No pending applications'}
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A1A1AA] text-sm mb-1">Approved</p>
              <p className="text-3xl font-light text-white">{dashboardStats.approvedApplications}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="text-sm text-green-500 mt-4">
            {dashboardStats.approvedApplications > 0 ? 'Successfully approved' : 'No approved applications yet'}
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A1A1AA] text-sm mb-1">Saved Properties</p>
              <p className="text-3xl font-light text-white">{dashboardStats.savedProperties}</p>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10">
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
          </div>
          <Link 
            to="/dashboard/saved" 
            className="inline-flex items-center gap-1 text-sm text-pink-500 hover:text-pink-400 mt-4"
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
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#27272A]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light text-white">Recent Applications</h2>
                  <p className="text-[#A1A1AA] text-sm mt-1">Your most recent rental applications</p>
                </div>
                <Link 
                  to="/dashboard/applications"
                  className="inline-flex items-center gap-2 text-sm text-[#F97316] hover:text-[#F97316]/80"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {recentApplications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-block p-4 bg-[#F97316]/10 rounded-2xl mb-6">
                  <FileText className="w-12 h-12 text-[#F97316]" />
                </div>
                <h3 className="text-lg font-light text-white mb-2">No Applications Yet</h3>
                <p className="text-[#A1A1AA] mb-6 max-w-md mx-auto">
                  Start your luxury rental journey by applying for properties you're interested in.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/properties')}
                    className="w-full max-w-md bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F97316] text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <Search className="w-5 h-5" />
                    Browse Properties
                  </button>
                  <Link
                    to="/dashboard/saved"
                    className="inline-flex items-center gap-2 text-sm text-[#F97316] hover:text-[#F97316]/80"
                  >
                    <Heart className="w-4 h-4" />
                    View saved properties first
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#27272A]">
                {recentApplications.map((application) => {
                  const status = getStatusConfig(application.status);
                  const property = application.property || { title: `Property #${application.property_id}` };
                  const applicantName = getApplicantName(application);
                  
                  return (
                    <div 
                      key={application.id} 
                      className="p-6 hover:bg-[#0A0A0A] transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-white truncate">
                              {property.title}
                            </h3>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                              {status.icon}
                              <span>{status.label}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-[#A1A1AA] mb-3">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4 text-[#F97316]" />
                              Applied {formatDate(application.created_at)}
                            </span>
                            
                            {property.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-[#F97316]" />
                                {property.location}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-[#A1A1AA]">
                            <span>Applicant: {applicantName}</span>
                            
                            {application.reference_number && (
                              <span>Ref: #{application.reference_number}</span>
                            )}
                          </div>

                          {/* Live Status Update Indicator */}
                          {application.status_updated_at && (
                            <div className="mt-2 text-xs text-[#F97316]">
                              Updated {formatRelativeTime(application.status_updated_at)}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/applications/${application.id}`);
                          }}
                          className="ml-4 text-sm text-[#F97316] hover:text-[#F97316]/80 flex items-center gap-1"
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

          {/* Quick Tips Section - Updated with Black/Orange Theme */}
          <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-2xl p-6 text-white">
            <h3 className="text-xl font-light mb-6 flex items-center gap-2">
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
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/20 transition-all hover:scale-[1.02] border border-white/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-medium text-lg">{tip.title}</h4>
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
          {/* Profile Card - Updated */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
            <h3 className="font-light text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#F97316]" />
              Your Profile
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-sm text-[#A1A1AA]">Member</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#F97316]" />
                  <span className="text-sm text-[#A1A1AA]">{user?.email}</span>
                </div>
                
                {userProfile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#F97316]" />
                    <span className="text-sm text-[#A1A1AA]">{userProfile.phone}</span>
                  </div>
                )}
              </div>
              
              <Link 
                to="/dashboard/profile"
                className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 text-sm mt-2"
              >
                Update Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
            <h3 className="font-light text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/properties')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#27272A] hover:border-[#F97316]/30 hover:bg-[#0A0A0A] transition-colors group"
              >
                <span className="text-white">Browse Properties</span>
                <Building2 className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#F97316]" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard/applications')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#27272A] hover:border-[#F97316]/30 hover:bg-[#0A0A0A] transition-colors group"
              >
                <span className="text-white">View Applications</span>
                <FileText className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#F97316]" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard/saved')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#27272A] hover:border-pink-500/30 hover:bg-[#0A0A0A] transition-colors group"
              >
                <span className="text-white">Saved Properties</span>
                <Heart className="w-5 h-5 text-[#A1A1AA] group-hover:text-pink-500" />
              </button>

              <button
                onClick={() => navigate('/dashboard/settings')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#27272A] hover:border-[#F97316]/30 hover:bg-[#0A0A0A] transition-colors group"
              >
                <span className="text-white">Settings</span>
                <SettingsIcon className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#F97316]" />
              </button>
            </div>
          </div>

          {/* Live Contact Card - Enhanced */}
          <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-2xl p-6 text-white">
            <h3 className="font-medium text-xl mb-3">Live Concierge</h3>
            <p className="text-orange-100 text-sm mb-6">
              Our team is online and ready to assist you with any questions.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <HeadphonesIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Average Response</p>
                  <p className="text-2xl font-light">&lt; 2 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Agents Online</p>
                  <p className="text-2xl font-light">5</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-white text-[#F97316] font-medium py-3 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Start Live Chat
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="w-full bg-transparent border border-white/30 text-white py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                View FAQs
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-orange-100">
                24/7 Support Available
              </span>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
            <h3 className="font-light text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#F97316]" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentApplications.slice(0, 3).map((app, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Application {app.status}</p>
                    <p className="text-[#A1A1AA] text-xs">{formatRelativeTime(app.created_at)}</p>
                  </div>
                </div>
              ))}
              {recentApplications.length === 0 && (
                <p className="text-[#A1A1AA] text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
