import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  FileText, Clock, CheckCircle, Building2, Heart, AlertCircle,
  ArrowRight, CalendarDays, MapPin, Mail, Phone, Loader2,
  Sparkles, Search, Activity, Award, TrendingUp,
  User, Copy, Check, ChevronRight, Settings,
  MessageCircle, Headphones, Bell, Zap, Eye,
  Home, Briefcase, Star, Download, DollarSign,
  PieChart, BarChart, Users, Globe, Shield
} from 'lucide-react';

function Dashboard() {
  const { user, userProfile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    savedProperties: 0,
    totalProperties: 0
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    if (user) {
      fetchDashboardData();
    }

    // Subscribe to real-time updates if user exists
    let applicationsSubscription;
    let savedSubscription;

    if (user) {
      applicationsSubscription = supabase
        .channel('applications-channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'applications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          handleApplicationUpdate(payload);
        })
        .subscribe();

      savedSubscription = supabase
        .channel('saved-channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'saved_properties',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          handleSavedUpdate(payload);
        })
        .subscribe();
    }

    return () => {
      clearInterval(timer);
      if (applicationsSubscription) applicationsSubscription.unsubscribe();
      if (savedSubscription) savedSubscription.unsubscribe();
    };
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch applications
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          property:properties (
            id,
            title,
            location,
            price,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (appsError) throw appsError;

      if (appsData) {
        setApplications(appsData);
        
        // Calculate stats
        const total = appsData.length;
        const pending = appsData.filter(a => 
          ['submitted', 'payment_pending', 'pre_approved', 'paid_under_review'].includes(a.status)
        ).length;
        const approved = appsData.filter(a => a.status === 'approved').length;

        setStats(prev => ({
          ...prev,
          totalApplications: total,
          pendingApplications: pending,
          approvedApplications: approved
        }));
      }

      // Fetch saved properties count and data
      const { count, error: savedError } = await supabase
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!savedError) {
        setStats(prev => ({ ...prev, savedProperties: count || 0 }));
      }

      // Fetch saved properties for display with property details
      const { data: savedData, error: savedDataError } = await supabase
        .from('saved_properties')
        .select(`
          *,
          property:properties (
            id,
            title,
            location,
            price,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!savedDataError && savedData) {
        setSavedProperties(savedData);
      }

      // Fetch total available properties count
      const { count: propertiesCount, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      if (!propertiesError) {
        setStats(prev => ({ ...prev, totalProperties: propertiesCount || 0 }));
      }

      // Generate recent activity
      const activity = [];
      
      // Add application activities
      appsData?.slice(0, 3).forEach(app => {
        activity.push({
          id: `app-${app.id}`,
          type: 'application',
          action: getStatusAction(app.status),
          property: app.property?.title || 'Property',
          time: formatRelativeTime(app.created_at),
          status: app.status,
          created_at: app.created_at
        });
      });

      // Add saved property activities
      savedData?.slice(0, 2).forEach(saved => {
        activity.push({
          id: `saved-${saved.id}`,
          type: 'saved',
          action: 'Property saved to favorites',
          property: saved.property?.title || 'Property',
          time: formatRelativeTime(saved.created_at),
          status: 'completed',
          created_at: saved.created_at
        });
      });

      // Sort by date (most recent first)
      const sortedActivity = activity.sort((a, b) => 
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
      ).slice(0, 5);

      setRecentActivity(sortedActivity);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusAction = (status) => {
    const actions = {
      submitted: 'Application submitted',
      payment_pending: 'Payment pending',
      pre_approved: 'Pre-approved',
      paid_under_review: 'Under review',
      approved: 'Application approved',
      rejected: 'Application rejected'
    };
    return actions[status] || 'Application updated';
  };

  const handleApplicationUpdate = (payload) => {
    if (payload.eventType === 'INSERT') {
      // Fetch the full application with property details
      supabase
        .from('applications')
        .select(`
          *,
          property:properties (
            id,
            title,
            location,
            price,
            images
          )
        `)
        .eq('id', payload.new.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setApplications(prev => [data, ...prev].slice(0, 5));
            
            setStats(prev => ({
              ...prev,
              totalApplications: prev.totalApplications + 1,
              pendingApplications: prev.pendingApplications + 1
            }));
            
            // Add to recent activity
            setRecentActivity(prev => [{
              id: `app-${data.id}`,
              type: 'application',
              action: 'New application submitted',
              property: data.property?.title || 'Property',
              time: 'Just now',
              status: data.status,
              created_at: new Date().toISOString()
            }, ...prev].slice(0, 5));
          }
        });

    } else if (payload.eventType === 'UPDATE') {
      // Update the application in state
      setApplications(prev => 
        prev.map(app => app.id === payload.new.id ? { ...app, ...payload.new } : app)
      );
      
      // Recalculate stats
      supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .then(({ data }) => {
          if (data) {
            const pending = data.filter(a => 
              ['submitted', 'payment_pending', 'pre_approved', 'paid_under_review'].includes(a.status)
            ).length;
            const approved = data.filter(a => a.status === 'approved').length;

            setStats(prev => ({
              ...prev,
              pendingApplications: pending,
              approvedApplications: approved
            }));
          }
        });

      // Add to recent activity
      setRecentActivity(prev => [{
        id: `app-update-${payload.new.id}`,
        type: 'application',
        action: `Application ${getStatusAction(payload.new.status).toLowerCase()}`,
        property: 'Property',
        time: 'Just now',
        status: payload.new.status,
        created_at: new Date().toISOString()
      }, ...prev].slice(0, 5));
    }
  };

  const handleSavedUpdate = (payload) => {
    if (payload.eventType === 'INSERT') {
      setStats(prev => ({
        ...prev,
        savedProperties: prev.savedProperties + 1
      }));
      
      // Fetch the property details
      supabase
        .from('properties')
        .select('*')
        .eq('id', payload.new.property_id)
        .single()
        .then(({ data }) => {
          if (data) {
            const newSaved = {
              ...payload.new,
              property: data
            };
            setSavedProperties(prev => [newSaved, ...prev].slice(0, 3));

            setRecentActivity(prev => [{
              id: `saved-${payload.new.id}`,
              type: 'saved',
              action: 'Property saved to favorites',
              property: data.title,
              time: 'Just now',
              status: 'completed',
              created_at: new Date().toISOString()
            }, ...prev].slice(0, 5));
          }
        });

    } else if (payload.eventType === 'DELETE') {
      setStats(prev => ({
        ...prev,
        savedProperties: Math.max(0, prev.savedProperties - 1)
      }));
      setSavedProperties(prev => 
        prev.filter(s => s.id !== payload.old.id)
      );
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Just now';
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('concierge@palmsestate.org');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-white">
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
            disabled={refreshing}
            className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            to="/properties"
            className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Browse
          </Link>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-white text-lg font-light mb-1">Welcome to Your Dashboard</h2>
            <p className="text-orange-100 text-sm max-w-2xl">
              Track your applications, manage saved properties, and connect with your dedicated advisor.
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
            <span className="text-white text-sm">3 advisors online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#F97316]" />
            </div>
            <Link to="/dashboard/applications" className="text-[#A1A1AA] hover:text-[#F97316]">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-xl font-light text-white mb-0.5">{stats.totalApplications}</div>
          <div className="text-xs text-[#A1A1AA]">Applications</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">
              {stats.pendingApplications}
            </span>
          </div>
          <div className="text-xl font-light text-white mb-0.5">{stats.pendingApplications}</div>
          <div className="text-xs text-[#A1A1AA]">Pending</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
              {stats.approvedApplications}
            </span>
          </div>
          <div className="text-xl font-light text-white mb-0.5">{stats.approvedApplications}</div>
          <div className="text-xs text-[#A1A1AA]">Approved</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-pink-500" />
            </div>
            <Link to="/dashboard/saved" className="text-[#A1A1AA] hover:text-pink-500">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-xl font-light text-white mb-0.5">{stats.savedProperties}</div>
          <div className="text-xs text-[#A1A1AA]">Saved</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Applications */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#27272A] flex items-center justify-between">
              <h2 className="text-white font-light">Recent Applications</h2>
              <Link 
                to="/dashboard/applications" 
                className="text-sm text-[#F97316] hover:text-[#F97316]/80 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {applications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-[#F97316]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#F97316]" />
                </div>
                <h3 className="text-white font-light mb-2">No Applications Yet</h3>
                <p className="text-[#A1A1AA] text-sm mb-6">Start by exploring available properties.</p>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg"
                >
                  <Search className="w-4 h-4" />
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#27272A]">
                {applications.slice(0, 3).map((application) => {
                  const status = getStatusConfig(application.status);
                  return (
                    <div 
                      key={application.id}
                      onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                      className="px-6 py-4 hover:bg-[#0A0A0A] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-white text-sm font-medium group-hover:text-[#F97316] transition-colors">
                              {application.property?.title || 'Property Application'}
                            </h3>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${status.color}`}>
                              {status.icon}
                              <span>{status.label}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-[#A1A1AA]">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5 text-[#F97316]" />
                              {formatDate(application.created_at)}
                            </span>
                            {application.property?.location && (
                              <>
                                <span className="w-0.5 h-0.5 rounded-full bg-[#27272A]"></span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                                  <span className="truncate max-w-[150px]">{application.property.location}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#F97316] transition-colors" />
                      </div>
                      
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

          {/* Recent Activity */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
            <h2 className="text-white font-light mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 group hover:bg-[#0A0A0A] p-2 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'application' 
                        ? 'bg-[#F97316]/10' 
                        : 'bg-pink-500/10'
                    }`}>
                      {activity.type === 'application' ? (
                        <FileText className="w-4 h-4 text-[#F97316]" />
                      ) : (
                        <Heart className="w-4 h-4 text-pink-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{activity.action}</p>
                      <p className="text-[#A1A1AA] text-xs mt-0.5 truncate">{activity.property}</p>
                    </div>
                    <span className="text-[#A1A1AA] text-xs whitespace-nowrap">{activity.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-[#A1A1AA]/30 mx-auto mb-3" />
                  <p className="text-[#A1A1AA] text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Saved */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                </h3>
                <p className="text-[#A1A1AA] text-xs mt-1">Member since {new Date(user?.created_at || Date.now()).getFullYear()}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                <span className="text-[#A1A1AA] text-xs truncate">{user?.email}</span>
              </div>
              {userProfile?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <span className="text-[#A1A1AA] text-xs">{userProfile.phone}</span>
                </div>
              )}
            </div>

            <Link
              to="/dashboard/profile"
              className="block w-full px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-xs text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors text-center"
            >
              Edit Profile
            </Link>
          </div>

          {/* Saved Properties Preview */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-light">Saved Properties</h3>
              <Link to="/dashboard/saved" className="text-xs text-[#F97316] hover:text-[#F97316]/80">
                View All
              </Link>
            </div>

            {savedProperties.length > 0 ? (
              <div className="space-y-3">
                {savedProperties.map((saved) => (
                  <div key={saved.id} className="flex items-center gap-3 group hover:bg-[#0A0A0A] p-2 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate group-hover:text-[#F97316] transition-colors">
                        {saved.property?.title || 'Property'}
                      </p>
                      <p className="text-[#A1A1AA] text-xs truncate">{saved.property?.location || 'Location'}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/properties/${saved.property_id}`)}
                      className="text-[#A1A1AA] hover:text-[#F97316] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-[#A1A1AA]/30 mx-auto mb-3" />
                <p className="text-[#A1A1AA] text-sm">No saved properties</p>
                <Link
                  to="/properties"
                  className="text-xs text-[#F97316] hover:text-[#F97316]/80 mt-2 inline-block"
                >
                  Browse Properties →
                </Link>
              </div>
            )}
          </div>

          {/* Live Chat Card */}
          <Link
            to="/dashboard/chat"
            className="block bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">Live Chat</h3>
                <p className="text-orange-100 text-xs">Connect with support</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Start conversation</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-xs">Online</span>
              </div>
            </div>
          </Link>

          {/* Quick Stats Card */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
            <h3 className="text-white font-light mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA] text-sm">Total Properties</span>
                <span className="text-white font-light">{stats.totalProperties}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA] text-sm">Application Success</span>
                <span className="text-green-500 font-light">
                  {stats.totalApplications > 0 
                    ? Math.round((stats.approvedApplications / stats.totalApplications) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full h-1 bg-[#27272A] rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full"
                  style={{ width: `${stats.totalApplications > 0 ? (stats.approvedApplications / stats.totalApplications) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
