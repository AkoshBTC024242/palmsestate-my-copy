import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import { supabase } from '../lib/supabase';
import {
  FileText, Clock, CheckCircle, Building2, Heart, AlertCircle,
  ArrowRight, CalendarDays, MapPin, User, Mail, Phone, Loader2,
  Search, Bell, Settings, Activity, ChevronRight, LogOut,
  Home, CreditCard, Briefcase, Target, Shield
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

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-[#F97316] text-white',
        icon: <Clock className="w-3 h-3" />,
        label: 'Submitted'
      },
      payment_pending: {
        color: 'bg-yellow-500 text-white',
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Payment Pending'
      },
      pre_approved: { 
        color: 'bg-blue-500 text-white',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Pre-Approved'
      },
      paid_under_review: { 
        color: 'bg-purple-500 text-white',
        icon: <FileText className="w-3 h-3" />,
        label: 'Under Review'
      },
      approved: { 
        color: 'bg-green-500 text-white',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Approved'
      },
      rejected: { 
        color: 'bg-red-500 text-white',
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Rejected'
      }
    };
    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <Loader2 className="w-8 h-8 animate-spin text-[#F97316] mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-white font-light">
                {greeting}{' '}
                <span className="text-[#F97316] font-medium">
                  {userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={localLoading}
                className="p-2 bg-[#111] border border-gray-800 rounded-lg hover:border-[#F97316]/50 transition-colors"
              >
                {localLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <Activity className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              <Link
                to="/properties"
                className="px-4 py-2 bg-[#F97316] text-white text-sm rounded-lg hover:bg-[#EA580C] transition-colors inline-flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Browse Properties
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#F97316]" />
              </div>
              <Link to="/dashboard/applications" className="text-gray-500 hover:text-[#F97316]">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-2xl text-white font-light mb-1">{dashboardStats.totalApplications}</div>
            <div className="text-sm text-gray-500">Applications</div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="text-sm text-yellow-500">{dashboardStats.pendingApplications}</span>
            </div>
            <div className="text-2xl text-white font-light mb-1">{dashboardStats.pendingApplications}</div>
            <div className="text-sm text-gray-500">Pending Review</div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm text-green-500">{dashboardStats.approvedApplications}</span>
            </div>
            <div className="text-2xl text-white font-light mb-1">{dashboardStats.approvedApplications}</div>
            <div className="text-sm text-gray-500">Approved</div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <Link to="/dashboard/saved" className="text-gray-500 hover:text-pink-500">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-2xl text-white font-light mb-1">{dashboardStats.savedProperties}</div>
            <div className="text-sm text-gray-500">Saved Properties</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-white font-light">Recent Applications</h2>
                <Link 
                  to="/dashboard/applications"
                  className="text-sm text-[#F97316] hover:text-[#EA580C] flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              
              {recentApplications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 bg-[#F97316]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <h3 className="text-white text-sm font-light mb-2">No Applications Yet</h3>
                  <p className="text-gray-500 text-xs mb-5 max-w-xs mx-auto">
                    Start by exploring available properties and submitting your first application.
                  </p>
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white text-xs rounded-lg hover:bg-[#EA580C] transition-colors"
                  >
                    <Search className="w-3 h-3" />
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div>
                  {recentApplications.map((application) => {
                    const status = getStatusConfig(application.status);
                    return (
                      <div 
                        key={application.id}
                        onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                        className="px-5 py-4 border-b border-gray-800 last:border-0 hover:bg-black/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white text-sm">
                                {application.property?.title || `Application ${application.id.slice(0, 8)}`}
                              </h3>
                              <div className={`${status.color} text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1`}>
                                {status.icon}
                                <span>{status.label}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{formatDate(application.created_at)}</span>
                              {application.property?.location && (
                                <>
                                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                  <span>{application.property.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">
                    {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">Member</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400">{user?.email}</span>
                </div>
                {userProfile?.phone && (
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-gray-400">{userProfile.phone}</span>
                  </div>
                )}
              </div>
              
              <Link 
                to="/dashboard/profile"
                className="mt-4 w-full px-3 py-2 bg-black border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-[#F97316] hover:border-[#F97316]/30 transition-colors inline-flex items-center justify-center gap-2"
              >
                <User className="w-3 h-3" />
                Edit Profile
              </Link>
            </div>

            {/* Support Card */}
            <div className="bg-[#F97316] rounded-lg p-5">
              <h3 className="text-white text-sm font-medium mb-1">Need Assistance?</h3>
              <p className="text-orange-100 text-xs mb-4">Our team is here 24/7</p>
              
              <div className="space-y-2">
                <a
                  href="tel:+18286239765"
                  className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">Call Concierge</p>
                    <p className="text-orange-100 text-xs opacity-90">+1 (828) 623-9765</p>
                  </div>
                </a>

                <Link
                  to="/contact"
                  className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">Send Message</p>
                    <p className="text-orange-100 text-xs opacity-90">2hr response</p>
                  </div>
                </Link>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                <span className="text-orange-100 text-xs">Support team</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-white text-xs">3 online</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#111] border border-gray-800 rounded-lg p-4">
              <div className="space-y-1">
                <Link
                  to="/dashboard/settings"
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black transition-colors text-xs text-gray-400 hover:text-white"
                >
                  <span>Account Settings</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/faq"
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black transition-colors text-xs text-gray-400 hover:text-white"
                >
                  <span>FAQ</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black transition-colors text-xs text-gray-400 hover:text-white"
                >
                  <span>Contact Support</span>
                  <ChevronRight className="w-3 h-3" />
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
