// pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  HeartIcon, 
  UserIcon,
  CogIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    savedProperties: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch dashboard stats
      const statsResponse = await api.get('/api/dashboard/stats');
      setStats(statsResponse.data);

      // Fetch recent applications
      const appsResponse = await api.get('/api/applications?limit=5');
      setRecentApplications(appsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: DocumentTextIcon,
      color: 'blue',
      path: '/dashboard/applications'
    },
    {
      title: 'Pending',
      value: stats.pendingApplications,
      icon: ClockIcon,
      color: 'yellow',
      path: '/dashboard/applications?status=pending'
    },
    {
      title: 'Approved',
      value: stats.approvedApplications,
      icon: CheckCircleIcon,
      color: 'green',
      path: '/dashboard/applications?status=approved'
    },
    {
      title: 'Saved Properties',
      value: stats.savedProperties,
      icon: HeartIcon,
      color: 'pink',
      path: '/dashboard/saved'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Properties',
      description: 'Find your dream property',
      icon: HomeIcon,
      path: '/properties',
      color: 'bg-blue-500'
    },
    {
      title: 'Update Profile',
      description: 'Keep your information current',
      icon: UserIcon,
      path: '/dashboard/profile',
      color: 'bg-green-500'
    },
    {
      title: 'Application History',
      description: 'View all your applications',
      icon: DocumentTextIcon,
      path: '/dashboard/applications',
      color: 'bg-purple-500'
    },
    {
      title: 'Account Settings',
      description: 'Manage your preferences',
      icon: CogIcon,
      path: '/dashboard/settings',
      color: 'bg-gray-500'
    }
  ];

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      under_review: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your property applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Link
            key={index}
            to={card.path}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                <card.icon className={`h-8 w-8 text-${card.color}-600`} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <span>View all</span>
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link 
                to="/dashboard/applications"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <Link
                    key={application._id}
                    to={`/dashboard/applications/${application._id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {application.property?.title || 'Property Application'}
                        </h3>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className="text-sm text-gray-500">
                            Applied: {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            Reference: #{application.referenceNumber}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(application.status)}
                        <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto" />
                <p className="text-gray-500 mt-4">No applications yet</p>
                <Link
                  to="/properties"
                  className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse Properties →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Profile & Notifications */}
        <div>
          {/* Profile Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Summary</h2>
            <div className="flex items-center mb-4">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div className="ml-4">
                <h3 className="font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt).getFullYear()}</p>
              </div>
            </div>
            <Link
              to="/dashboard/profile"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Edit Profile
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Application approved</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New application submitted</p>
                  <p className="text-xs text-gray-500">5 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <HeartIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Property saved</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
