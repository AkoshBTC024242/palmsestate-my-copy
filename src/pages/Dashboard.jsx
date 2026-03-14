import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import {
  FileText, Clock, CheckCircle, Building2, Heart, AlertCircle,
  ArrowRight, CalendarDays, MapPin, Mail, Phone, Loader2,
  Sparkles, Search, Activity, Award, TrendingUp,
  User, Copy, Check, ChevronRight, Settings,
  Home, Briefcase, Star, Eye, Download, Bell,
  MessageCircle, Headphones, Shield, Zap
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

  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
        icon: <Clock className="w-3.5 h-3.5" />,
        label: 'Submitted',
        progress: 25
      },
      payment_pending: {
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: 'Payment Pending',
        progress: 40
      },
      pre_approved: { 
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: 'Pre-Approved',
        progress: 60
      },
      paid_under_review: { 
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        icon: <FileText className="w-3.5 h-3.5" />,
        label: 'Under Review',
        progress: 75
      },
      approved: { 
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: 'Approved',
        progress: 100
      },
      rejected: { 
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: 'Rejected',
        progress: 0
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('concierge@palmsestate.org');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const notifications = [
    { id: 1, message: 'Your application is being reviewed', time: '5 min ago', read: false },
    { id: 2, message: 'New property matches your criteria', time: '1 hour ago', read: false },
    { id: 3, message: 'Virtual tour confirmed', time: '2 hours ago', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#F97316] mx-auto mb-4" />
          <p className="text-[#A1A1AA] text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      {/* Mobile Header - Simplified */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:hidden">
        <div>
          <h1 className="text-xl font-light text-white">
            {greeting.split(' ')[0]},
          </h1>
          <p className="text-[#F97316] font-medium text-lg">
            {userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className="p-2 bg-[#18181B] border border-[#27272A] rounded-lg"
          >
            <Activity className={`w-4 h-4 text-[#A1A1AA] ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-[#18181B] border border-[#27272A] rounded-lg relative"
            >
              <Bell className="w-4 h-4 text-[#A1A1AA]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F97316] text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl z-50">
                <div className="p-3 border-b border-[#27272A]">
                  <p className="text-white text-sm font-medium">Notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 border-b border-[#27272A] last:border-0 ${!n.read ? 'bg-[#F97316]/5' : ''}`}>
                      <p className="text-white text-xs mb-1">{n.message}</p>
                      <p className="text-[#A1A1AA] text-[10px]">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">
            {greeting}, 
            <span className="text-[#F97316] font-medium ml-2">
              {userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <CalendarDays className="w-4 h-4 text-[#F97316]" />
            <span className="text-sm text-[#A1A1AA]">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors flex items-center gap-2"
          >
            <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/properties"
            className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Browse Properties
          </Link>
        </div>
      </div>

      {/* Welcome Banner - Responsive */}
      <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-white text-base sm:text-lg font-light mb-1">Welcome Back</h2>
            <p className="text-orange-100 text-xs sm:text-sm max-w-2xl">
              Track your applications, manage saved properties, and connect with your advisor.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="text-white text-xs sm:text-sm">3 advisors online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-[#18181B] border border-[#27272A] rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#F97316]" />
            </div>
            <Link to="/dashboard/applications" className="text-[#A1A1AA] hover:text-[#F97316]">
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="text-lg sm:text-xl font-light text-white mb-0.5">{dashboardStats.totalApplications}</div>
          <div className="text-xs text-[#A1A1AA]">Applications</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">
              {dashboardStats.pendingApplications}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-light text-white mb-0.5">{dashboardStats.pendingApplications}</div>
          <div className="text-xs text-[#A1A1AA]">Pending</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
              {dashboardStats.approvedApplications}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-light text-white mb-0.5">{dashboardStats.approvedApplications}</div>
          <div className="text-xs text-[#A1A1AA]">Approved</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-pink-500" />
            </div>
            <Link to="/dashboard/saved" className="text-[#A1A1AA] hover:text-pink-500">
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="text-lg sm:text-xl font-light text-white mb-0.5">{dashboardStats.savedProperties}</div>
          <div className="text-xs text-[#A1A1AA]">Saved</div>
        </div>
      </div>

      {/* Main Content Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column - Applications */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* Recent Applications */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#27272A] flex items-center justify-between">
              <h2 className="text-white text-sm sm:text-base font-light">Recent Applications</h2>
              <Link 
                to="/dashboard/applications" 
                className="text-xs sm:text-sm text-[#F97316] hover:text-[#F97316]/80 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            {recentApplications.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#F97316]/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#F97316]" />
                </div>
                <h3 className="text-white text-sm sm:text-base font-light mb-2">No Applications Yet</h3>
                <p className="text-[#A1A1AA] text-xs sm:text-sm mb-4 sm:mb-6">Start by exploring available properties.</p>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-xs sm:text-sm font-medium rounded-lg"
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#27272A]">
                {recentApplications.slice(0, 3).map((application) => {
                  const status = getStatusConfig(application.status);
                  return (
                    <div 
                      key={application.id}
                      onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                      className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-[#0A0A0A] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-white text-xs sm:text-sm font-medium truncate">
                              {application.property?.title || `Application`}
                            </h3>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border ${status.color} flex-shrink-0`}>
                              {status.icon}
                              <span className="hidden xs:inline">{status.label}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#A1A1AA]">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {formatDate(application.created_at)}
                            </span>
                            {application.property?.location && (
                              <>
                                <span className="w-0.5 h-0.5 rounded-full bg-[#27272A]"></span>
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{application.property.location}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#A1A1AA] ml-2 flex-shrink-0" />
                      </div>
                      
                      <div className="w-full h-1 bg-[#27272A] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            status.progress === 100 ? 'bg-green-500' :
                            status.progress >= 75 ? 'bg-blue-500' :
                            status.progress >= 50 ? 'bg-purple-500' :
                            status.progress >= 25 ? 'bg-[#F97316]' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${status.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Grid - Responsive */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Link
              to="/dashboard/profile"
              className="bg-[#18181B] border border-[#27272A] rounded-lg p-3 sm:p-4 hover:border-[#F97316]/30 transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center mb-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316]" />
              </div>
              <h3 className="text-white text-xs sm:text-sm font-medium mb-0.5">Profile</h3>
              <p className="text-[#A1A1AA] text-[10px] sm:text-xs">Update info</p>
            </Link>

            <Link
              to="/dashboard/saved"
              className="bg-[#18181B] border border-[#27272A] rounded-lg p-3 sm:p-4 hover:border-pink-500/30 transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-pink-500/10 rounded-lg flex items-center justify-center mb-2">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
              </div>
              <h3 className="text-white text-xs sm:text-sm font-medium mb-0.5">Saved</h3>
              <p className="text-[#A1A1AA] text-[10px] sm:text-xs">{dashboardStats.savedProperties} items</p>
            </Link>

            <Link
              to="/dashboard/settings"
              className="bg-[#18181B] border border-[#27272A] rounded-lg p-3 sm:p-4 hover:border-[#F97316]/30 transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center mb-2">
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316]" />
              </div>
              <h3 className="text-white text-xs sm:text-sm font-medium mb-0.5">Settings</h3>
              <p className="text-[#A1A1AA] text-[10px] sm:text-xs">Preferences</p>
            </Link>

            <Link
              to="/properties"
              className="bg-[#18181B] border border-[#27272A] rounded-lg p-3 sm:p-4 hover:border-[#F97316]/30 transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center mb-2">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316]" />
              </div>
              <h3 className="text-white text-xs sm:text-sm font-medium mb-0.5">Explore</h3>
              <p className="text-[#A1A1AA] text-[10px] sm:text-xs">Find homes</p>
            </Link>
          </div>
        </div>

        {/* Right Column - Profile & Support */}
        <div className="space-y-4 sm:space-y-5">
          {/* Profile Card - Responsive */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-white text-sm sm:text-base font-medium truncate">
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                </h3>
                <p className="text-[#A1A1AA] text-[10px] sm:text-xs mt-0.5">Member since {new Date(user?.created_at || Date.now()).getFullYear()}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Mail className="w-3.5 h-3.5 text-[#F97316] flex-shrink-0" />
                <span className="text-[#A1A1AA] truncate text-[10px] sm:text-xs">{user?.email}</span>
              </div>
              {userProfile?.phone && (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Phone className="w-3.5 h-3.5 text-[#F97316] flex-shrink-0" />
                  <span className="text-[#A1A1AA] text-[10px] sm:text-xs">{userProfile.phone}</span>
                </div>
              )}
            </div>

            <Link
              to="/dashboard/profile"
              className="block w-full px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-[10px] sm:text-xs text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors text-center"
            >
              Edit Profile
            </Link>
          </div>

          {/* Concierge Card - Responsive */}
          <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-white text-sm sm:text-base font-light">Concierge</h3>
                <p className="text-orange-100 text-[10px] sm:text-xs">Available 24/7</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-[10px] sm:text-xs">Online</span>
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <a
                href="tel:+18286239765"
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-white text-[10px] sm:text-xs font-medium">Call Us</p>
                  <p className="text-orange-100 text-[8px] sm:text-[10px]">+1 (828) 623-9765</p>
                </div>
              </a>

              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-black/20 rounded-lg">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[10px] sm:text-xs font-medium">Email</p>
                  <p className="text-orange-100 text-[8px] sm:text-[10px] truncate">concierge@palmsestate.org</p>
                </div>
                <button 
                  onClick={handleCopyEmail}
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-white/10 rounded hover:bg-white/20 transition-colors flex items-center justify-center flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  )}
                </button>
              </div>
            </div>

            <Link
              to="/contact"
              className="block w-full px-3 py-2 sm:px-4 sm:py-2 bg-black/20 text-center text-white text-[10px] sm:text-xs rounded-lg hover:bg-black/30 transition-colors"
            >
              Start Live Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
