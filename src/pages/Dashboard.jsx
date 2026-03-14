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
  MessageSquare, HelpCircle, Bell, Settings, Activity,
  Briefcase, Shield, Target, Zap, Globe, Camera,
  Headphones, LifeBuoy, BookOpen, Download, LogOut,
  ChevronLeft, CreditCard, Home as HomeIcon, LayoutDashboard,
  PieChart, BarChart, FolderOpen, Clock3
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

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
        icon: <Clock className="w-3.5 h-3.5" />,
        label: 'Submitted',
        description: 'Application submitted'
      },
      payment_pending: {
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: 'Payment Pending',
        description: 'Awaiting payment'
      },
      pre_approved: { 
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: 'Pre-Approved',
        description: 'Initial approval granted'
      },
      paid_under_review: { 
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        icon: <FileText className="w-3.5 h-3.5" />,
        label: 'Under Review',
        description: 'Final review'
      },
      approved: { 
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: 'Approved',
        description: 'Application approved'
      },
      rejected: { 
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: 'Rejected',
        description: 'Not approved'
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

  const handleRefresh = async () => {
    setLocalLoading(true);
    await refreshData();
    setTimeout(() => setLocalLoading(false), 500);
  };

  if (dashboardLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#F97316] mx-auto mb-4" />
          <p className="text-[#A1A1AA] text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-light text-white">
                {greeting}, 
                <span className="text-[#F97316] font-medium ml-2">
                  {userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#A1A1AA]">
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span className="w-1 h-1 rounded-full bg-[#27272A]"></span>
              <span>{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={localLoading}
              className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors inline-flex items-center gap-2"
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
              className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#F97316]/20 transition-all inline-flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Browse Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 hover:border-[#F97316]/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
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
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 hover:border-[#F97316]/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-sm text-yellow-500 font-light">{dashboardStats.pendingApplications}</span>
          </div>
          <div className="text-2xl font-light text-white mb-1">{dashboardStats.pendingApplications}</div>
          <div className="text-sm text-[#A1A1AA]">Pending Review</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 hover:border-[#F97316]/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-green-500 font-light">{dashboardStats.approvedApplications}</span>
          </div>
          <div className="text-2xl font-light text-white mb-1">{dashboardStats.approvedApplications}</div>
          <div className="text-sm text-[#A1A1AA]">Approved</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 hover:border-[#F97316]/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
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
                      className="px-6 py-4 hover:bg-[#0A0A0A] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
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
                        <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/dashboard/profile"
              className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 hover:border-[#F97316]/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center mb-3">
                <User className="w-5 h-5 text-[#F97316] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Profile</h3>
              <p className="text-[#A1A1AA] text-xs">Update your information</p>
            </Link>

            <Link
              to="/dashboard/saved"
              className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 hover:border-pink-500/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Saved</h3>
              <p className="text-[#A1A1AA] text-xs">View favorites</p>
            </Link>

            <Link
              to="/dashboard/settings"
              className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 hover:border-[#F97316]/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center mb-3">
                <Settings className="w-5 h-5 text-[#F97316] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Settings</h3>
              <p className="text-[#A1A1AA] text-xs">Preferences</p>
            </Link>

            <Link
              to="/properties"
              className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 hover:border-[#F97316]/30 transition-colors group"
            >
              <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-[#F97316] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-white text-sm font-medium mb-1">Explore</h3>
              <p className="text-[#A1A1AA] text-xs">Find properties</p>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Profile Card */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                </h3>
                <p className="text-[#A1A1AA] text-xs mt-0.5">Member since {new Date(user?.created_at || Date.now()).getFullYear()}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-3 border-t border-[#27272A]">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-[#F97316]" />
                <span className="text-[#A1A1AA] truncate">{user?.email}</span>
              </div>
              {userProfile?.phone && (
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                  <span className="text-[#A1A1AA]">{userProfile.phone}</span>
                </div>
              )}
            </div>
            
            <Link 
              to="/dashboard/profile"
              className="mt-4 w-full px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-xs text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors inline-flex items-center justify-center gap-2"
            >
              <User className="w-3.5 h-3.5" />
              Manage Profile
            </Link>
          </div>

          {/* Live Support Card */}
          <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl p-6">
            <h3 className="text-white text-base font-light mb-1">Concierge Support</h3>
            <p className="text-orange-100 text-xs mb-4 opacity-90">Available 24/7 for assistance</p>
            
            <div className="space-y-3">
              <a
                href="tel:+18286239765"
                className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">Call Us</p>
                  <p className="text-orange-100 text-xs opacity-90">+1 (828) 623-9765</p>
                </div>
              </a>

              <Link
                to="/contact"
                className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">Live Chat</p>
                  <p className="text-orange-100 text-xs opacity-90">Avg. 2 min response</p>
                </div>
              </Link>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-orange-100 text-xs">Agents online</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-white text-xs">3</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5">
            <h3 className="text-white text-sm font-light mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link
                to="/faq"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#0A0A0A] transition-colors text-xs text-[#A1A1AA] hover:text-white"
              >
                <span>Frequently Asked Questions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#0A0A0A] transition-colors text-xs text-[#A1A1AA] hover:text-white"
              >
                <span>Contact Support</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/dashboard/settings"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#0A0A0A] transition-colors text-xs text-[#A1A1AA] hover:text-white"
              >
                <span>Account Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
