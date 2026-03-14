import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import { supabase } from '../lib/supabase';
import {
  FileText, Clock, CheckCircle, Building2, Heart, AlertCircle,
  ArrowRight, CalendarDays, MapPin, DollarSign, Users, TrendingUp,
  User, Mail, Phone, Loader2, Sparkles, Search, Filter,
  MessageSquare, HelpCircle, Bell, Settings, Activity,
  Briefcase, Shield, Target, Zap, Globe, Camera,
  Headphones, LifeBuoy, BookOpen, Download, LogOut,
  ChevronRight, CreditCard, Home, LayoutDashboard,
  PieChart, BarChart, FolderOpen, Clock3, Award,
  Star, ChevronLeft, Menu, X, ExternalLink, Copy,
  Check, AlertTriangle, Info, Plus, Edit, Trash2
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      label: 'Browse Properties',
      icon: <Building2 className="w-4 h-4" />,
      path: '/properties',
      color: 'from-[#F97316] to-[#EA580C]'
    },
    {
      label: 'View Applications',
      icon: <FileText className="w-4 h-4" />,
      path: '/dashboard/applications',
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Saved Properties',
      icon: <Heart className="w-4 h-4" />,
      path: '/dashboard/saved',
      color: 'from-pink-500 to-rose-500'
    },
    {
      label: 'Profile Settings',
      icon: <User className="w-4 h-4" />,
      path: '/dashboard/profile',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'application',
      action: 'Application submitted',
      property: 'Luxury Penthouse, Miami',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'viewing',
      action: 'Virtual tour scheduled',
      property: 'Waterfront Estate, NYC',
      time: '5 hours ago',
      status: 'confirmed'
    },
    {
      id: 3,
      type: 'favorite',
      action: 'Property saved',
      property: 'Modern Villa, LA',
      time: '1 day ago',
      status: 'completed'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-500',
      confirmed: 'bg-green-500/10 text-green-500',
      completed: 'bg-blue-500/10 text-blue-500',
      rejected: 'bg-red-500/10 text-red-500'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-3.5 h-3.5" />,
      confirmed: <CheckCircle className="w-3.5 h-3.5" />,
      completed: <CheckCircle className="w-3.5 h-3.5" />,
      rejected: <AlertCircle className="w-3.5 h-3.5" />
    };
    return icons[status] || icons.pending;
  };

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
    setLocalLoading(true);
    await refreshData();
    setTimeout(() => setLocalLoading(false), 500);
  };

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#F97316] mx-auto mb-4" />
          <p className="text-[#A1A1AA] text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/95 z-50 lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-[#27272A]">
              <span className="text-white font-light text-xl">Menu</span>
              <button onClick={() => setShowMobileMenu(false)} className="text-[#A1A1AA] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[#A1A1AA] text-xs uppercase tracking-wider">Quick Actions</h3>
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.path}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 p-3 bg-[#18181B] border border-[#27272A] rounded-lg hover:border-[#F97316]/30 transition-colors"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                        {action.icon}
                      </div>
                      <span className="text-white text-sm">{action.label}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-[#A1A1AA] text-xs uppercase tracking-wider">Support</h3>
                  <Link
                    to="/faq"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-between p-3 bg-[#18181B] border border-[#27272A] rounded-lg hover:border-[#F97316]/30 transition-colors"
                  >
                    <span className="text-white text-sm">FAQ</span>
                    <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-between p-3 bg-[#18181B] border border-[#27272A] rounded-lg hover:border-[#F97316]/30 transition-colors"
                  >
                    <span className="text-white text-sm">Contact Support</span>
                    <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2 bg-[#18181B] border border-[#27272A] rounded-lg text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-white">
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
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={localLoading}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors"
            >
              {localLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Refresh
                </>
              )}
            </button>
            
            <Link
              to="/properties"
              className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#F97316]/20 transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Browse Properties</span>
              <span className="sm:hidden">Browse</span>
            </Link>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-white text-xl font-light mb-2">Welcome to Your Dashboard</h2>
              <p className="text-orange-100 text-sm max-w-2xl">
                Track your applications, manage saved properties, and connect with your dedicated advisor all in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-white text-sm">+3 advisors online</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 hover:border-[#F97316]/30 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#F97316]" />
              </div>
              <Link 
                to="/dashboard/applications" 
                className="text-[#A1A1AA] hover:text-[#F97316] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-2xl font-light text-white mb-1">{dashboardStats.totalApplications}</div>
            <div className="text-sm text-[#A1A1AA]">Total Applications</div>
            <div className="mt-3 pt-3 border-t border-[#27272A]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A1A1AA]">This month</span>
                <span className="text-[#F97316]">+{Math.min(5, dashboardStats.totalApplications)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 hover:border-[#F97316]/30 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                {dashboardStats.pendingApplications} pending
              </div>
            </div>
            <div className="text-2xl font-light text-white mb-1">{dashboardStats.pendingApplications}</div>
            <div className="text-sm text-[#A1A1AA]">Pending Review</div>
            <div className="mt-3 pt-3 border-t border-[#27272A]">
              <div className="w-full h-1 bg-[#27272A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ width: `${(dashboardStats.pendingApplications / Math.max(dashboardStats.totalApplications, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 hover:border-[#F97316]/30 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {dashboardStats.approvedApplications} approved
              </div>
            </div>
            <div className="text-2xl font-light text-white mb-1">{dashboardStats.approvedApplications}</div>
            <div className="text-sm text-[#A1A1AA]">Approved</div>
            <div className="mt-3 pt-3 border-t border-[#27272A]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-500" />
                <span className="text-xs text-[#A1A1AA]">Success rate 98%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 hover:border-[#F97316]/30 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <Link 
                to="/dashboard/saved" 
                className="text-[#A1A1AA] hover:text-pink-500 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-2xl font-light text-white mb-1">{dashboardStats.savedProperties}</div>
            <div className="text-sm text-[#A1A1AA]">Saved Properties</div>
            <div className="mt-3 pt-3 border-t border-[#27272A]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-500" />
                <span className="text-xs text-[#A1A1AA]">Updated daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Applications & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#27272A] flex items-center justify-between">
                <h2 className="text-white font-light">Recent Applications</h2>
                <Link 
                  to="/dashboard/applications" 
                  className="text-sm text-[#F97316] hover:text-[#F97316]/80 transition-colors flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              {recentApplications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-[#F97316]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[#F97316]" />
                  </div>
                  <h3 className="text-white font-light mb-2">No Applications Yet</h3>
                  <p className="text-[#A1A1AA] text-sm mb-6 max-w-sm mx-auto">
                    Start your journey by exploring available properties and submitting your first application.
                  </p>
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                  >
                    <Search className="w-4 h-4" />
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#27272A]">
                  {recentApplications.map((application) => {
                    const status = getStatusConfig(application.status);
                    return (
                      <div 
                        key={application.id}
                        onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                        className="px-6 py-4 hover:bg-[#0A0A0A] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white text-sm font-medium">
                                {application.property?.title || `Application #${application.id.slice(0, 8)}`}
                              </h3>
                              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${status.color}`}>
                                {status.icon}
                                <span>{status.label}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {formatDate(application.created_at)}
                              </span>
                              {application.property?.location && (
                                <>
                                  <span className="w-0.5 h-0.5 rounded-full bg-[#27272A]"></span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {application.property.location}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#F97316] transition-colors" />
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-[#27272A] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
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

            {/* Recent Activity Feed */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
              <h2 className="text-white font-light mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${getStatusColor(activity.status)} flex items-center justify-center`}>
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-[#A1A1AA] text-xs mt-0.5">{activity.property}</p>
                    </div>
                    <span className="text-[#A1A1AA] text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Support */}
          <div className="space-y-5">
            {/* Profile Card */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-[#A1A1AA] text-xs mt-1">Member since {new Date(user?.created_at || Date.now()).getFullYear()}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-[#F97316]" />
                  <span className="text-[#A1A1AA] flex-1 truncate">{user?.email}</span>
                </div>
                {userProfile?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-[#F97316]" />
                    <span className="text-[#A1A1AA]">{userProfile.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  to="/dashboard/profile"
                  className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-xs text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors text-center"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-xs text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Concierge Card */}
            <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white text-lg font-light">Concierge</h3>
                  <p className="text-orange-100 text-xs">Available 24/7</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-white text-xs">Online</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <a
                  href="tel:+18286239765"
                  className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">Call Us</p>
                    <p className="text-orange-100 text-xs">+1 (828) 623-9765</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-medium">Email</p>
                    <p className="text-orange-100 text-xs truncate">concierge@palmsestate.org</p>
                  </div>
                  <button 
                    onClick={handleCopyEmail}
                    className="w-6 h-6 bg-white/10 rounded hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-white" />
                    )}
                  </button>
                </div>
              </div>

              <Link
                to="/contact"
                className="block w-full px-4 py-2 bg-black/20 text-center text-white text-sm rounded-lg hover:bg-black/30 transition-colors"
              >
                Start Live Chat
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5">
              <h3 className="text-white text-sm font-light mb-3">Resources</h3>
              <div className="space-y-1">
                <Link
                  to="/faq"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#0A0A0A] transition-colors text-sm text-[#A1A1AA] hover:text-white"
                >
                  <span>Frequently Asked Questions</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/buyers"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#0A0A0A] transition-colors text-sm text-[#A1A1AA] hover:text-white"
                >
                  <span>Buyer's Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/marketing"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#0A0A0A] transition-colors text-sm text-[#A1A1AA] hover:text-white"
                >
                  <span>Marketing Resources</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
