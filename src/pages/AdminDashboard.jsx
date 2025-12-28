import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Building2, Users, FileText, DollarSign, BarChart3,
  Shield, Settings, LogOut, PlusCircle, Search,
  Filter, CheckCircle, Clock, AlertCircle, TrendingUp,
  Eye, Edit, Trash2, ChevronRight, Menu, X, 
  Calendar, CreditCard, Globe, Bell, Download,
  Sparkles, Zap, Lock, Key, TestTube, Home,
  ArrowRight, Trophy, User, Crown, Star, ChevronLeft
} from 'lucide-react';

function AdminDashboard() {
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const navigate = useNavigate();

  useEffect(() => {
    console.log('📊 AdminDashboard useEffect - Auth Loading:', authLoading);
    console.log('📊 AdminDashboard useEffect - User:', user);
    console.log('📊 AdminDashboard useEffect - Is Admin:', isAdmin);
    
    if (!authLoading && user && isAdmin) {
      loadAdminData();
    } else if (!authLoading && (!user || !isAdmin)) {
      console.log('⚠️ No admin access, redirecting');
      navigate('/dashboard');
      setLoading(false);
    }
  }, [user, authLoading, isAdmin, navigate]);

  const loadAdminData = async () => {
    console.log('📥 Loading admin data for user:', user?.id);
    setLoading(true);
    
    try {
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertiesError) {
        console.error('Error loading properties:', propertiesError);
        setRecentProperties([
          {
            id: 'fallback-1',
            title: 'Seaside Villa Mirage',
            location: 'Monte Carlo, Monaco',
            price_per_week: 85000,
            image_url: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
            bedrooms: 8,
            bathrooms: 10,
            created_at: new Date().toISOString()
          }
        ]);
      } else {
        setRecentProperties(properties.slice(0, 3));
        setStats(prev => ({ ...prev, totalProperties: properties.length }));
      }

      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          properties (title, location, price_per_week)
        `)
        .order('created_at', { ascending: false });

      if (appsError) {
        console.error('Error loading applications:', appsError);
      } else {
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

      try {
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 100
        });
        
        if (!usersError) {
          setStats(prev => ({ ...prev, totalUsers: users?.length || 0 }));
        }
      } catch (error) {
        console.error('Error loading users:', error);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
      const testApplication = {
        id: 'test-' + Date.now(),
        property_id: 'test-property',
        user_id: user.id,
        full_name: 'Test User (Admin)',
        email: user.email,
        phone: '+15555555555',
        status: 'approved',
        payment_status: 'completed',
        application_fee: 0,
        notes: 'Test application created by admin',
        created_at: new Date().toISOString(),
        properties: {
          title: 'Test Property',
          location: 'Monaco',
          price_per_week: 85000
        }
      };
      
      setRecentApplications(prev => [testApplication, ...prev]);
      alert('✅ Test application created successfully! (No payment required)');
      
    } catch (error) {
      console.error('Test simulation error:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'properties':
        return renderProperties();
      case 'applications':
        return renderApplications();
      case 'users':
        return renderUsers();
      case 'payments':
        return renderPayments();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { 
            label: 'Total Properties', 
            value: stats.totalProperties, 
            icon: <Building2 className="w-6 h-6" />,
            color: 'from-blue-500 to-blue-600',
            onClick: () => setActiveSection('properties')
          },
          { 
            label: 'Applications', 
            value: stats.totalApplications, 
            icon: <FileText className="w-6 h-6" />,
            color: 'from-emerald-500 to-green-600',
            onClick: () => setActiveSection('applications')
          },
          { 
            label: 'Pending', 
            value: stats.pendingApplications, 
            icon: <Clock className="w-6 h-6" />,
            color: 'from-amber-500 to-orange-500',
            onClick: () => setActiveSection('applications')
          },
          { 
            label: 'Total Users', 
            value: stats.totalUsers, 
            icon: <Users className="w-6 h-6" />,
            color: 'from-purple-500 to-pink-600',
            onClick: () => setActiveSection('users')
          },
          { 
            label: 'Revenue', 
            value: formatCurrency(stats.totalRevenue), 
            icon: <DollarSign className="w-6 h-6" />,
            color: 'from-emerald-500 to-teal-600',
            onClick: () => setActiveSection('payments')
          },
        ].map((stat, index) => (
          <div 
            key={index}
            onClick={stat.onClick}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Recent Applications</h2>
              <p className="text-gray-600">Latest property applications</p>
            </div>
            <button
              onClick={() => setActiveSection('applications')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
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
                    <p className="font-medium text-gray-900">{app.full_name || app.email?.split('@')[0]}</p>
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
                  <button 
                    onClick={() => navigate(`/admin/applications/${app.id}`)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Recent Properties</h2>
              <p className="text-gray-600">Latest added properties</p>
            </div>
            <button
              onClick={() => setActiveSection('properties')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
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
                  <button 
                    onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProperty(property.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/properties/new')}
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
          >
            <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <span className="font-medium text-gray-900">Add Property</span>
          </button>
          
          <button
            onClick={() => setActiveSection('applications')}
            className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all text-center"
          >
            <FileText className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <span className="font-medium text-gray-900">Review Applications</span>
          </button>
          
          <button
            onClick={() => setActiveSection('users')}
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all text-center"
          >
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <span className="font-medium text-gray-900">Manage Users</span>
          </button>
          
          <button
            onClick={() => setActiveSection('analytics')}
            className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all text-center"
          >
            <BarChart3 className="w-8 h-8 text-amber-600 mx-auto mb-3" />
            <span className="font-medium text-gray-900">View Analytics</span>
          </button>
        </div>
      </div>
    </>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Properties Management</h1>
          <p className="text-gray-600">Manage all luxury properties in the system</p>
        </div>
        <button
          onClick={() => navigate('/admin/properties/new')}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Property
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Property</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price/Week</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProperties.map((property, index) => (
                <tr key={property.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img 
                          src={property.image_url} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{property.title}</p>
                        <p className="text-sm text-gray-600">{property.bedrooms || 3} beds, {property.bathrooms || 3} baths</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {property.location}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-gray-900">
                      ${(property.price_per_week || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      property.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {property.status || 'active'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Applications Management</h1>
          <p className="text-gray-600">Review and manage property applications</p>
        </div>
        <button className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <Download className="w-5 h-5" />
          Export Reports
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium">
            All ({stats.totalApplications})
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Pending ({stats.pendingApplications})
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Approved
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Rejected
          </button>
        </div>

        <div className="space-y-4">
          {recentApplications.map((app, index) => (
            <div 
              key={app.id || index}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img 
                    src={app.properties?.image_url} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{app.full_name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {app.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{app.email}</p>
                  <p className="text-sm text-gray-500">{app.properties?.title || 'Property Application'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(`/admin/applications/${app.id}`)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Review
                </button>
                {app.status === 'pending' && (
                  <button className="text-sm bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700">
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        <button className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <PlusCircle className="w-5 h-5" />
          Add New User
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Management Panel</h3>
          <p className="text-gray-600 mb-6">Manage all registered users and their permissions.</p>
          <p className="text-sm text-gray-500">Total Users: {stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Payments & Revenue</h1>
          <p className="text-gray-600">Track payments and revenue analytics</p>
        </div>
        <button className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <Download className="w-5 h-5" />
          Export Financials
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Management</h3>
          <p className="text-gray-600 mb-2">Total Revenue: {formatCurrency(stats.totalRevenue)}</p>
          <p className="text-gray-600">View and manage all payment transactions.</p>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">System analytics and performance metrics</p>
        </div>
        <button className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <BarChart3 className="w-5 h-5" />
          Generate Report
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-600">View detailed analytics and performance reports.</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure system preferences and options</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <h3 className="font-serif font-bold text-gray-900 mb-6">General Settings</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Site Configuration</p>
                  <p className="text-sm text-gray-600">Configure site settings and options</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Notification Settings</p>
                  <p className="text-sm text-gray-600">Configure system notifications</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <h3 className="font-serif font-bold text-gray-900 mb-6">System Maintenance</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Database Management</p>
                  <p className="text-sm text-gray-600">Manage database backups and maintenance</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Security Settings</p>
                  <p className="text-sm text-gray-600">Configure security and access controls</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', propertyId);
        
        if (error) throw error;
        
        alert('Property deleted successfully');
        loadAdminData();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property');
      }
    }
  };

  if (authLoading) {
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
            <p className="mt-6 text-gray-600 font-medium">Checking admin access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8 max-w-md">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">You don't have administrator privileges to access this page.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Go to User Dashboard
            </button>
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

      <div className="flex min-h-screen">
        <div className={`hidden lg:block ${sidebarCollapsed ? 'w-20' : 'w-72'} fixed left-0 top-0 bottom-0 z-40 transition-all duration-300`}>
          <div className="w-full h-full bg-white/95 backdrop-blur-md border-r border-gray-100 overflow-y-auto flex flex-col">
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                {sidebarCollapsed ? 
                  <ChevronRight className="w-5 h-5 text-gray-600" /> : 
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                }
              </button>
            </div>
            
            {!sidebarCollapsed ? (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
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
                      <Crown className="w-3 h-3 text-yellow-500" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Admin Since</span>
                    <span className="font-medium">{formatDate(user?.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Access Level</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="w-3 h-3" />
                      Full Access
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-100 flex justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-4">
              <nav className={`px-4 space-y-1 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                {[
                  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
                  { id: 'properties', label: 'Properties', icon: <Building2 className="w-5 h-5" />, badge: stats.totalProperties },
                  { id: 'applications', label: 'Applications', icon: <FileText className="w-5 h-5" />, badge: stats.totalApplications },
                  { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, badge: stats.totalUsers },
                  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (item.id === 'test-mode') setTestMode(!testMode);
                    }}
                    className={`
                      w-full ${sidebarCollapsed ? 'px-2 py-3' : 'px-4 py-3'} rounded-xl transition-all duration-200
                      ${activeSection === item.id 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activeSection === item.id 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-400 text-white' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.icon}
                      </div>
                      {!sidebarCollapsed && (
                        <>
                          <span className="font-medium">{item.label}</span>
                          {item.badge !== undefined && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full ml-auto">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </nav>

              {!sidebarCollapsed && (
                <div className="p-4 border-t border-gray-100 mt-4">
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
              )}
            </div>

            <div className="p-4 border-t border-gray-100 mt-auto">
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors`}
                  title={sidebarCollapsed ? "View as User" : ""}
                >
                  <Eye className="w-5 h-5" />
                  {!sidebarCollapsed && <span className="font-medium">View as User</span>}
                </button>
                <button
                  onClick={handleSignOut}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors`}
                  title={sidebarCollapsed ? "Sign Out" : ""}
                >
                  <LogOut className="w-5 h-5" />
                  {!sidebarCollapsed && <span className="font-medium">Sign Out</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md border-r border-gray-100 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
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

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
                  { id: 'properties', label: 'Properties', icon: <Building2 className="w-5 h-5" />, badge: stats.totalProperties },
                  { id: 'applications', label: 'Applications', icon: <FileText className="w-5 h-5" />, badge: stats.totalApplications },
                  { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, badge: stats.totalUsers },
                  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
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
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activeSection === item.id 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-400 text-white' 
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

              <div className="p-4 border-t border-gray-100 mt-4">
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
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors w-full"
                >
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">View as User</span>
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`flex-1 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} pt-16 lg:pt-0`}>
          <div className="hidden lg:block bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-serif text-3xl font-bold text-gray-900">
                    {activeSection === 'overview' && 'Admin Dashboard'}
                    {activeSection === 'properties' && 'Properties Management'}
                    {activeSection === 'applications' && 'Applications Management'}
                    {activeSection === 'users' && 'User Management'}
                    {activeSection === 'payments' && 'Payments & Revenue'}
                    {activeSection === 'analytics' && 'Analytics Dashboard'}
                    {activeSection === 'settings' && 'System Settings'}
                  </h1>
                  {testMode && activeSection === 'overview' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-medium rounded-full">
                      TEST MODE ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-gray-600">
                  {activeSection === 'overview' && 'Manage properties, applications, and system analytics'}
                  {activeSection === 'properties' && 'Manage all luxury properties in the system'}
                  {activeSection === 'applications' && 'Review and manage property applications'}
                  {activeSection === 'users' && 'Manage system users and permissions'}
                  {activeSection === 'payments' && 'Track payments and revenue analytics'}
                  {activeSection === 'analytics' && 'System analytics and performance metrics'}
                  {activeSection === 'settings' && 'Configure system preferences and options'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {testMode && activeSection === 'overview' && (
                  <button
                    onClick={simulateTestApplication}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                  >
                    <TestTube className="w-5 h-5" />
                    Simulate Application
                  </button>
                )}
                {activeSection === 'properties' && (
                  <button
                    onClick={() => navigate('/admin/properties/new')}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Add Property
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-8">
            <div className="lg:hidden mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-serif text-2xl font-bold text-gray-900">
                      {activeSection === 'overview' && 'Admin Dashboard'}
                      {activeSection === 'properties' && 'Properties'}
                      {activeSection === 'applications' && 'Applications'}
                      {activeSection === 'users' && 'Users'}
                      {activeSection === 'payments' && 'Payments'}
                      {activeSection === 'analytics' && 'Analytics'}
                      {activeSection === 'settings' && 'Settings'}
                    </h1>
                    {testMode && activeSection === 'overview' && (
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-medium rounded-full">
                        TEST MODE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {activeSection === 'overview' && 'Manage properties, applications, and system analytics'}
                    {activeSection === 'properties' && 'Manage all luxury properties'}
                    {activeSection === 'applications' && 'Review property applications'}
                    {activeSection === 'users' && 'Manage system users'}
                    {activeSection === 'payments' && 'Track payments and revenue'}
                    {activeSection === 'analytics' && 'System analytics and metrics'}
                    {activeSection === 'settings' && 'Configure system preferences'}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {testMode && activeSection === 'overview' && (
                    <button
                      onClick={simulateTestApplication}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                    >
                      <TestTube className="w-5 h-5" />
                      Simulate
                    </button>
                  )}
                  {activeSection === 'properties' && (
                    <button
                      onClick={() => navigate('/admin/properties/new')}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Add Property
                    </button>
                  )}
                </div>
              </div>
            </div>

            {renderContent()}

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} Palms Estate Admin Panel
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Version 1.0.0 • Last updated: Today
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/admin/help')}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Help Center
                  </button>
                  <button
                    onClick={() => navigate('/admin/status')}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    System Status
                  </button>
                  <button
                    onClick={() => navigate('/admin/logs')}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
