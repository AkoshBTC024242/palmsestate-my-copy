import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Building2, Users, FileText, DollarSign, BarChart3,
  Shield, Settings, LogOut, PlusCircle, Search,
  Filter, CheckCircle, Clock, AlertCircle, TrendingUp,
  Eye, Edit, Trash2, ChevronRight, Menu, X, 
  Calendar, CreditCard, Globe, Bell, Download,
  Sparkles, Zap, Lock, Key, TestTube, Home
} from 'lucide-react';

function AdminDashboard() {
  const { user, signOut, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [testMode, setTestMode] = useState(false);
  
  // Dashboard data
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    if (user && isAdmin) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    
    try {
      // Load stats
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*');
      
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('*');
      
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (!propertiesError && properties) {
        setStats(prev => ({ ...prev, totalProperties: properties.length }));
        setRecentProperties(properties.slice(0, 3));
      }
      
      if (!appsError && applications) {
        const pending = applications.filter(app => 
          app.status === 'pending' || app.status === 'under_review'
        ).length;
        
        const revenue = applications
          .filter(app => app.payment_status === 'completed')
          .reduce((sum, app) => sum + (app.application_fee || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalApplications: applications.length,
          pendingApplications: pending,
          totalRevenue: revenue
        }));
        
        setRecentApplications(applications.slice(0, 5));
      }
      
      if (!usersError && users) {
        setStats(prev => ({ ...prev, totalUsers: users.users?.length || 0 }));
      }
      
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const simulateTestApplication = async () => {
    if (!testMode) return;
    
    try {
      // Simulate creating a test application
      const testApplication = {
        id: 'test-' + Date.now(),
        property_id: 'test-property',
        user_id: user.id,
        full_name: 'Test User (Admin)',
        email: user.email,
        phone: '+15555555555',
        status: 'approved',
        payment_status: 'completed',
        application_fee: 0, // No fee for admin tests
        notes: 'Test application created by admin',
        created_at: new Date().toISOString(),
        properties: {
          title: 'Test Property',
          location: 'Monaco',
          price_per_week: 85000
        }
      };
      
      setRecentApplications(prev => [testApplication, ...prev]);
      
      // Show success message
      alert('✅ Test application created successfully! (No payment required)');
      
    } catch (error) {
      console.error('Test simulation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-100 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Shield className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
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
            <h1 className="font-serif font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-amber-600" />
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md border-r border-gray-100 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-gray-900">
                  {user?.email?.split('@')[0]}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-full">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
            { id: 'properties', label: 'Properties', icon: <Building2 className="w-5 h-5" />, badge: stats.totalProperties },
            { id: 'applications', label: 'Applications', icon: <FileText className="w-5 h-5" />, badge: stats.totalApplications },
            { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, badge: stats.totalUsers },
            { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
            { id: 'test-mode', label: 'Test Mode', icon: <TestTube className="w-5 h-5" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (item.id === 'test-mode') setTestMode(!testMode);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
                ${item.id === 'test-mode' && testMode ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-100' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  activeSection === item.id 
                    ? item.id === 'test-mode' && testMode 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-400 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Test Mode Toggle */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${testMode ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gray-200'}`}>
                <TestTube className={`w-4 h-4 ${testMode ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Test Mode</p>
                <p className="text-xs text-gray-600">No charges for admin</p>
              </div>
            </div>
            <button
              onClick={() => setTestMode(!testMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                testMode ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  testMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Eye className="w-5 h-5" />
              <span className="font-medium">View as User</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 pt-16 lg:pt-0">
        {/* Main Content Area */}
        <div className="p-4 lg:p-8">
          {/* Welcome & Stats */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  {testMode && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-medium rounded-full">
                      TEST MODE ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-gray-600">Manage properties, applications, and system analytics</p>
              </div>
              
              <div className="flex items-center gap-4">
                {testMode && (
                  <button
                    onClick={simulateTestApplication}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                  >
                    <TestTube className="w-5 h-5" />
                    Simulate Application
                  </button>
                )}
                <Link
                  to="/admin/properties/new"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Property
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { 
                  label: 'Total Properties', 
                  value: stats.totalProperties, 
                  icon: <Building2 className="w-6 h-6" />,
                  color: 'from-blue-500 to-blue-600',
                  change: '+3'
                },
                { 
                  label: 'Applications', 
                  value: stats.totalApplications, 
                  icon: <FileText className="w-6 h-6" />,
                  color: 'from-emerald-500 to-green-600',
                  change: '+12'
                },
                { 
                  label: 'Pending', 
                  value: stats.pendingApplications, 
                  icon: <Clock className="w-6 h-6" />,
                  color: 'from-amber-500 to-orange-500',
                  change: '+2'
                },
                { 
                  label: 'Total Users', 
                  value: stats.totalUsers, 
                  icon: <Users className="w-6 h-6" />,
                  color: 'from-purple-500 to-pink-600',
                  change: '+5'
                },
                { 
                  label: 'Revenue', 
                  value: formatCurrency(stats.totalRevenue), 
                  icon: <DollarSign className="w-6 h-6" />,
                  color: 'from-emerald-500 to-teal-600',
                  change: '+$1,250'
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
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications & Properties */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Recent Applications</h2>
                  <p className="text-gray-600">Latest property applications</p>
                </div>
                <Link
                  to="/admin/applications"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentApplications.map((app, index) => (
                  <div 
                    key={app.id || index}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                        app.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.full_name}</p>
                        <p className="text-sm text-gray-600">{app.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status || 'pending'}
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Recent Properties</h2>
                  <p className="text-gray-600">Latest added properties</p>
                </div>
                <Link
                  to="/admin/properties"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentProperties.map((property, index) => (
                  <div 
                    key={property.id || index}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={property.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-medium text-gray-900 truncate">{property.title}</h4>
                      <p className="text-sm text-gray-600 truncate">{property.location}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-bold text-gray-900">
                          ${(property.price_per_week || 0).toLocaleString()}/week
                        </span>
                        <span className="text-xs text-gray-500">
                          {property.bedrooms || 3} beds • {property.bathrooms || 3} baths
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Mode Section (if active) */}
          {testMode && (
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-400">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-gray-900">Test Mode Active</h3>
                  <p className="text-gray-600">Simulate user actions without real charges</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={simulateTestApplication}
                  className="p-4 bg-white rounded-xl border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-gray-900">Create Test Application</span>
                  </div>
                  <p className="text-sm text-gray-600">Simulate a user application (no payment required)</p>
                </button>
                
                <button className="p-4 bg-white rounded-xl border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <CheckCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-gray-900">Approve Test Application</span>
                  </div>
                  <p className="text-sm text-gray-600">Simulate application approval process</p>
                </button>
                
                <button className="p-4 bg-white rounded-xl border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-gray-900">Simulate Payment</span>
                  </div>
                  <p className="text-sm text-gray-600">Test payment flow without real charges</p>
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> All actions in Test Mode are simulated. No real payments are processed and no real data is modified.
                </p>
              </div>
            </div>
          )}

          {/* Quick Admin Actions */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/admin/properties/new"
                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
              >
                <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <span className="font-medium text-gray-900">Add Property</span>
              </Link>
              
              <Link
                to="/admin/applications"
                className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all text-center"
              >
                <FileText className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <span className="font-medium text-gray-900">Review Applications</span>
              </Link>
              
              <Link
                to="/admin/users"
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all text-center"
              >
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <span className="font-medium text-gray-900">Manage Users</span>
              </Link>
              
              <Link
                to="/admin/analytics"
                className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all text-center"
              >
                <BarChart3 className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <span className="font-medium text-gray-900">View Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
