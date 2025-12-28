import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  FileText, Clock, CheckCircle, AlertCircle, Building2, MapPin, 
  Bed, Bath, ArrowRight, PlusCircle, DollarSign, LogOut, 
  Calendar, CreditCard, Settings, ChevronRight, Home, Shield,
  Bell, Heart, Users, Key, Sparkles, Award, Star, TrendingUp,
  Mail, Phone, Globe, Lock, Eye, CalendarDays, Download,
  Menu, X, Filter, Search, Check, XCircle, Zap, Trophy,
  User, ArrowLeft, Crown
} from 'lucide-react';

function Dashboard() {
  const { user, signOut, userProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    savedProperties: 0,
    notifications: 3
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log('📊 Dashboard useEffect - Auth Loading:', authLoading);
    console.log('📊 Dashboard useEffect - User:', user);
    
    if (!authLoading && user) {
      loadDashboardData();
      loadSavedProperties();
      loadNotifications();
    } else if (!authLoading && !user) {
      // User is not authenticated, redirect to sign in
      console.log('⚠️ No user found, redirecting to signin');
      navigate('/signin');
      setLoading(false);
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = async () => {
    console.log('📥 Loading dashboard data for user:', user?.id);
    setLoading(true);
    
    try {
      // Load applications
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          properties (id, title, location, price_per_week, bedrooms, bathrooms, square_feet, image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (appsError) {
        console.error('❌ Error loading applications:', appsError);
      }

      if (appsData) {
        console.log('✅ Applications loaded:', appsData.length);
        setApplications(appsData);
        
        const pending = appsData.filter(app => 
          app.status === 'pending' || app.status === 'under_review'
        ).length;
        
        const approved = appsData.filter(app => 
          app.status === 'approved'
        ).length;
        
        const completed = appsData.filter(app => 
          app.status === 'completed' || app.payment_status === 'completed'
        ).length;

        setStats(prev => ({
          ...prev,
          totalApplications: appsData.length,
          pending,
          approved,
          completed
        }));
      }
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProperties = async () => {
    try {
      // In a real app, you'd have a saved_properties table
      // For now, we'll use mock data
      const mockSavedProperties = [
        {
          id: 1,
          title: 'Oceanfront Luxury Villa',
          location: 'Maldives',
          price: '$35,000/week',
          image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
          saved_date: '2024-12-15'
        },
        {
          id: 2,
          title: 'Manhattan Skyline Penthouse',
          location: 'New York, NY',
          price: '$45,000/week',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
          saved_date: '2024-12-10'
        }
      ];
      
      setSavedProperties(mockSavedProperties);
      setStats(prev => ({ ...prev, savedProperties: mockSavedProperties.length }));
    } catch (error) {
      console.error('Error loading saved properties:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const mockNotifications = [
        {
          id: 1,
          title: 'Application Under Review',
          message: 'Your application for Seaside Villa is now under review.',
          time: '2 hours ago',
          read: false,
          type: 'application'
        },
        {
          id: 2,
          title: 'Payment Confirmed',
          message: 'Your payment of $50 has been confirmed.',
          time: '1 day ago',
          read: true,
          type: 'payment'
        },
        {
          id: 3,
          title: 'New Property Alert',
          message: 'A new luxury villa in Monaco has been added.',
          time: '3 days ago',
          read: true,
          type: 'property'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const getStatusBadge = (status, paymentStatus) => {
    const statusConfig = {
      pending: { 
        icon: <Clock className="w-3 h-3" />, 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Pending'
      },
      payment_pending: { 
        icon: paymentStatus === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />,
        color: paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-orange-100 text-orange-800 border-orange-200',
        label: paymentStatus === 'completed' ? 'Payment Complete' : 'Payment Pending'
      },
      under_review: { 
        icon: <Eye className="w-3 h-3" />, 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Under Review'
      },
      approved: { 
        icon: <CheckCircle className="w-3 h-3" />, 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Approved'
      },
      completed: { 
        icon: <Trophy className="w-3 h-3" />, 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Completed'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
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
      day: 'numeric'
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Add safety check for authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-100 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8 max-w-md">
            <Shield className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
            <div className="space-y-3">
              <Link
                to="/signin"
                className="block w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block w-full border-2 border-amber-500 text-amber-600 font-medium py-3 px-6 rounded-xl hover:bg-amber-50 transition-all duration-300"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-100 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Preparing your luxury dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-amber-50/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="text-center">
            <h1 className="font-serif font-bold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-500">Elite Member</p>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Desktop Layout Container */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - Fixed on left, below header */}
        <div className="hidden lg:block w-64 fixed left-0 top-20 bottom-0 z-40">
          <div className="w-full h-full bg-white/95 backdrop-blur-md border-r border-gray-100 overflow-y-auto flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-gray-900">
                    {userProfile?.full_name || user?.email?.split('@')[0]}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-medium rounded-full">
                      Elite Member
                    </span>
                    <Crown className="w-3 h-3 text-yellow-500" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(user?.created_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation - Scrollable area */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" />, badge: null },
                  { id: 'applications', label: 'Applications', icon: <FileText className="w-5 h-5" />, badge: stats.totalApplications },
                  { id: 'saved', label: 'Saved Properties', icon: <Heart className="w-5 h-5" />, badge: stats.savedProperties },
                  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" />, badge: null },
                  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: stats.notifications },
                  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, badge: null },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, badge: null },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                      ${activeSection === item.id 
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-100' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeSection === item.id ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Sign Out Button - Fixed at bottom */}
            <div className="p-4 border-t border-gray-100 mt-auto pb-6">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <div className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-gray-100 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-gray-900">
                      {userProfile?.full_name || user?.email?.split('@')[0]}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-medium rounded-full">
                        Elite Member
                      </span>
                      <Crown className="w-3 h-3 text-yellow-500" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(user?.created_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" />, badge: null },
                  { id: 'applications', label: 'Applications', icon: <FileText className="w-5 h-5" />, badge: stats.totalApplications },
                  { id: 'saved', label: 'Saved Properties', icon: <Heart className="w-5 h-5" />, badge: stats.savedProperties },
                  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" />, badge: null },
                  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: stats.notifications },
                  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, badge: null },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, badge: null },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                      ${activeSection === item.id 
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-100' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeSection === item.id ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Sign Out Button */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  handleSignOut();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Adjusted for sidebar and header */}
        <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          {/* Desktop Welcome Bar */}
          <div className="hidden lg:block bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-gray-900">
                  Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Guest'}
                </h1>
                <p className="text-gray-600 mt-1">Your journey to exceptional living continues here.</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Application
                </Link>
                <button className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 lg:p-8">
            {/* Mobile Welcome Section */}
            <div className="lg:hidden mb-8">
              <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-gray-900">
                  Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Guest'}
                </h1>
                <p className="text-gray-600 mt-1">Your journey to exceptional living continues here.</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Application
                </Link>
                <button className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { 
                  label: 'Total Applications', 
                  value: stats.totalApplications, 
                  icon: <FileText className="w-6 h-6" />,
                  color: 'from-blue-500 to-blue-600',
                  change: '+2'
                },
                { 
                  label: 'Pending Review', 
                  value: stats.pending, 
                  icon: <Clock className="w-6 h-6" />,
                  color: 'from-amber-500 to-orange-500',
                  change: null
                },
                { 
                  label: 'Approved', 
                  value: stats.approved, 
                  icon: <CheckCircle className="w-6 h-6" />,
                  color: 'from-emerald-500 to-green-600',
                  change: '+1'
                },
                { 
                  label: 'Saved Properties', 
                  value: stats.savedProperties, 
                  icon: <Heart className="w-6 h-6" />,
                  color: 'from-rose-500 to-pink-600',
                  change: '+3'
                },
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                      {stat.icon}
                    </div>
                    {stat.change && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                        ↑ {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Applications Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Recent Applications</h2>
                  <p className="text-gray-600">Track your property applications and their status</p>
                </div>
                <Link
                  to="/properties"
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start your luxury living journey by applying for one of our premium properties.
                  </p>
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Building2 className="w-5 h-5" />
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div 
                      key={application.id}
                      className="group flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-amber-200 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/30 transition-all duration-300"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={application.properties?.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4'}
                              alt={application.properties?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-serif font-bold text-gray-900">
                                {application.properties?.title || 'Property Application'}
                              </h4>
                              {getStatusBadge(application.status, application.payment_status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {application.properties?.location || 'Location not specified'}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                Applied {formatDate(application.created_at)}
                              </span>
                              {application.application_fee && (
                                <span className="flex items-center gap-1 font-medium">
                                  <DollarSign className="w-4 h-4" />
                                  ${application.application_fee}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-4 flex items-center gap-4">
                        <Link
                          to={`/properties/${application.property_id}`}
                          className="text-sm text-gray-700 hover:text-amber-600 font-medium flex items-center gap-1"
                        >
                          View Property
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        {application.status === 'payment_pending' && application.payment_status !== 'completed' && (
                          <Link
                            to={`/properties/${application.property_id}/apply`}
                            className="text-sm bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-md transition-all"
                          >
                            Complete Payment
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Properties & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Saved Properties */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Saved Properties</h2>
                      <p className="text-gray-600">Your curated collection of luxury residences</p>
                    </div>
                    <Link
                      to="/properties?filter=saved"
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                    >
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {savedProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-amber-600" />
                      </div>
                      <p className="text-gray-600">No saved properties yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedProperties.map((property) => (
                        <div 
                          key={property.id}
                          className="group relative overflow-hidden rounded-xl border border-gray-200 hover:border-amber-200 transition-all duration-300"
                        >
                          <div className="h-40 overflow-hidden">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-serif font-bold text-gray-900 mb-1">{property.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">{property.price}</span>
                              <button className="text-amber-600 hover:text-amber-700">
                                <Heart className="w-5 h-5 fill-current" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions & Support */}
              <div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-white/10">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold">Quick Actions</h3>
                      <p className="text-sm text-gray-300">Fast access to important features</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <Link
                      to="/properties"
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PlusCircle className="w-5 h-5" />
                        <span>Apply for Property</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    
                    <Link
                      to="/contact"
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" />
                        <span>Schedule Tour</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5" />
                        <span>Download Documents</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h4 className="font-medium mb-4">Need Assistance?</h4>
                    <div className="space-y-3">
                      <a
                        href="mailto:admin@palmsestate.org"
                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        admin@palmsestate.org
                      </a>
                      <a
                        href="tel:+18286239765"
                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        +1 (828) 623-9765
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} Palms Estate Dashboard
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Your personal luxury property management hub
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/contact" className="text-sm text-gray-600 hover:text-amber-600">
                    Support
                  </Link>
                  <Link to="/privacy" className="text-sm text-gray-600 hover:text-amber-600">
                    Privacy
                  </Link>
                  <Link to="/terms" className="text-sm text-gray-600 hover:text-amber-600">
                    Terms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
