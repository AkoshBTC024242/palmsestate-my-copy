// src/pages/AdminDashboard.jsx - COMPREHENSIVE VERSION
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  BarChart3, Users, Home, FileText, DollarSign, Settings,
  TrendingUp, CheckCircle, XCircle, Clock, AlertCircle,
  Search, Filter, Download, Eye, Edit, Trash2,
  RefreshCw, LogOut, User, Shield, Building
} from 'lucide-react';

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalApplications: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingApplications: 0,
    approvedApplications: 0
  });
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load statistics
      await loadStats();
      
      // Load recent applications
      await loadRecentApplications();
      
      // Load recent properties
      await loadRecentProperties();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get total properties
      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
      
      // Get total applications
      const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });
      
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get pending applications
      const { count: pendingCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Get approved applications
      const { count: approvedCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      
      // Calculate revenue (mock data for now)
      const totalRevenue = (approvedCount || 0) * 50; // $50 per approved application
      
      setStats({
        totalProperties: propertiesCount || 0,
        totalApplications: applicationsCount || 0,
        totalUsers: usersCount || 0,
        totalRevenue: totalRevenue,
        pendingApplications: pendingCount || 0,
        approvedApplications: approvedCount || 0
      });
      
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties:property_id (
            title,
            location
          ),
          profiles:user_id (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setRecentApplications(data);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadRecentProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!error && data) {
        setRecentProperties(data);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', applicationId);
      
      if (!error) {
        // Refresh data
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-orange-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">Palms Estate Admin</h1>
              </div>
              
              {/* Search */}
              <div className="hidden md:block flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications, properties, users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Filter */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              
              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Eye className="w-4 h-4 mr-2" />
                      User View
                    </Link>
                    <Link to="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, {user?.email}. Here's what's happening with your business today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Properties */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProperties}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <Link to="/admin/properties" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
              View all properties →
            </Link>
          </div>

          {/* Total Applications */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    {stats.approvedApplications} approved
                  </span>
                  <span className="text-sm text-yellow-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {stats.pendingApplications} pending
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <Link to="/admin/applications" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
              Manage applications →
            </Link>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500 mt-1">Registered accounts</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
              View all users →
            </Link>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +24% from last month
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <Link to="/admin/payments" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
              View payments →
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={loadDashboardData}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <Link
                    to="/admin/applications"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentApplications.length > 0 ? (
                      recentApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {application.profiles?.first_name} {application.profiles?.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {application.profiles?.email || application.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{application.properties?.title}</div>
                            <div className="text-sm text-gray-500">{application.properties?.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(application.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                              {application.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/admin/applications/${application.id}`}
                                className="text-blue-600 hover:text-blue-900"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              {application.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateApplicationStatus(application.id, 'approved')}
                                    className="text-green-600 hover:text-green-900"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                    className="text-red-600 hover:text-red-900"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                          <p>No applications found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90">Avg. Response Time</p>
                    <p className="text-2xl font-bold mt-2">2.4 days</p>
                  </div>
                  <Clock className="w-8 h-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90">Approval Rate</p>
                    <p className="text-2xl font-bold mt-2">68%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90">Avg. Revenue/App</p>
                    <p className="text-2xl font-bold mt-2">$50.00</p>
                  </div>
                  <DollarSign className="w-8 h-8 opacity-80" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Properties & Quick Actions */}
          <div className="space-y-8">
            {/* Recent Properties */}
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentProperties.length > 0 ? (
                    recentProperties.map((property) => (
                      <div key={property.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          {property.image_url ? (
                            <img
                              src={property.image_url}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                e.target.parentElement.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center">
                                    <Home class="w-6 h-6 text-gray-400" />
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{property.title}</h3>
                          <p className="text-sm text-gray-500">{property.location}</p>
                          <p className="text-sm font-bold text-orange-600 mt-1">
                            ${property.price_per_week?.toLocaleString()}/week
                          </p>
                        </div>
                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Home className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p>No properties found</p>
                    </div>
                  )}
                </div>
                <Link
                  to="/admin/properties"
                  className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Properties →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/admin/properties/new"
                    className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Home className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-700">Add Property</span>
                  </Link>
                  
                  <Link
                    to="/admin/users/new"
                    className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Users className="w-6 h-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-green-700">Add User</span>
                  </Link>
                  
                  <Link
                    to="/admin/settings"
                    className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-purple-700">Settings</span>
                  </Link>
                  
                  <button
                    onClick={loadDashboardData}
                    className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-orange-700">Refresh Data</span>
                  </button>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Services</span>
                    <span className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="flex items-center text-sm text-yellow-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      75% used
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Backup</span>
                    <span className="text-sm text-gray-900">Today, 02:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
