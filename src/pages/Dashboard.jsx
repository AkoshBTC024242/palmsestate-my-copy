import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Home, Calendar, CreditCard, Heart, Settings, LogOut, 
  User, CheckCircle, Clock, XCircle, Loader,
  ChevronRight, MapPin, Bed, Bath
} from 'lucide-react';

function Dashboard() {
  const { user, signOut } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserApplications();
  }, []);

  const fetchUserApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-amber-100 text-amber-800', icon: <Clock className="w-4 h-4" /> },
      paid_pending: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" /> },
      approved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      rejected: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-2 capitalize">{status.replace('_', ' ')}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">Your Dashboard</h1>
          <p className="text-gray-600 font-sans">Welcome back to your Palms Estate experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg p-6 sticky top-24">
              {/* User Profile */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-gray-800">
                    {user?.user_metadata?.full_name || 'User'}
                  </h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 text-amber-700'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-3" />
                    <span>Overview</span>
                  </div>
                  {activeTab === 'overview' && <ChevronRight className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'applications'
                      ? 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 text-amber-700'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span>Applications</span>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    {applications.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('tours')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Tour Requests</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-3" />
                    <span>Saved Properties</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-3" />
                    <span>Account Settings</span>
                  </div>
                </button>
              </nav>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 mt-8 px-4 py-3 border border-gray-300/70 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-8 text-white">
                  <h2 className="font-serif text-2xl font-bold mb-4">Welcome to Luxury Living</h2>
                  <p className="mb-6 opacity-90">
                    Your journey to exceptional living starts here. Track your applications, 
                    schedule tours, and discover new luxury properties.
                  </p>
                  <Link
                    to="/properties"
                    className="inline-flex items-center bg-white text-amber-700 px-6 py-3 rounded-xl font-sans font-semibold hover:bg-amber-50 transition-colors"
                  >
                    Browse Properties
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-sans font-semibold text-gray-800">Active Applications</h3>
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 mb-2">
                      {applications.filter(app => ['pending', 'paid_pending'].includes(app.status)).length}
                    </p>
                    <p className="text-sm text-gray-600">In review process</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-sans font-semibold text-gray-800">Properties Viewed</h3>
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Home className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 mb-2">
                      {applications.length}
                    </p>
                    <p className="text-sm text-gray-600">Total applications</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-sans font-semibold text-gray-800">Member Since</h3>
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 mb-2">
                      {new Date(user?.created_at).getFullYear()}
                    </p>
                    <p className="text-sm text-gray-600">Valued member</p>
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg p-8">
                  <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Recent Applications</h2>
                  
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <CreditCard className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">No Applications Yet</h3>
                      <p className="text-gray-600 mb-8">Start your luxury living journey by applying for a property.</p>
                      <Link
                        to="/properties"
                        className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-sans font-semibold hover:shadow-lg transition-all"
                      >
                        Browse Properties
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {applications.slice(0, 3).map((application) => (
                        <div key={application.id} className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h4 className="font-sans font-semibold text-gray-800 mb-2">
                                {application.properties?.title || 'Property Application'}
                              </h4>
                              <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="text-sm">{application.properties?.location || 'Location not specified'}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Bed className="w-4 h-4 mr-1" />
                                  {application.properties?.bedrooms || 'N/A'} beds
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Bath className="w-4 h-4 mr-1" />
                                  {application.properties?.bathrooms || 'N/A'} baths
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              {getStatusBadge(application.status)}
                              <p className="text-sm text-gray-600 mt-2">
                                Applied on {new Date(application.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {applications.length > 3 && (
                        <Link
                          to="#"
                          onClick={() => setActiveTab('applications')}
                          className="block text-center text-amber-600 hover:text-amber-700 font-medium py-4"
                        >
                          View all {applications.length} applications
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg p-8">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Your Applications</h2>
                
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <CreditCard className="w-10 h-10 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-8">Start your luxury living journey by applying for a property.</p>
                    <Link
                      to="/properties"
                      className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-sans font-semibold hover:shadow-lg transition-all"
                    >
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {applications.map((application) => (
                      <div key={application.id} className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-sans font-semibold text-gray-800 text-lg mb-2">
                                  {application.properties?.title || 'Property Application'}
                                </h4>
                                <div className="flex items-center text-gray-600 mb-3">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  <span>{application.properties?.location || 'Location not specified'}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-serif font-bold text-amber-600">
                                  ${application.properties?.price?.toLocaleString()}/week
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <Bed className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                                <span className="font-medium">{application.properties?.bedrooms || 'N/A'}</span>
                                <p className="text-xs text-gray-600">Bedrooms</p>
                              </div>
                              <div className="text-center">
                                <Bath className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                                <span className="font-medium">{application.properties?.bathrooms || 'N/A'}</span>
                                <p className="text-xs text-gray-600">Bathrooms</p>
                              </div>
                              <div className="text-center">
                                <span className="font-medium">
                                  {application.properties?.sqft?.toLocaleString() || 'N/A'}
                                </span>
                                <p className="text-xs text-gray-600">Square Feet</p>
                              </div>
                              <div className="text-center">
                                {getStatusBadge(application.status)}
                              </div>
                            </div>
                            
                            {application.notes && (
                              <div className="mt-4 p-4 bg-white/50 rounded-lg">
                                <p className="text-sm text-gray-700">{application.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Applied on {new Date(application.created_at).toLocaleDateString()}
                            </p>
                            {application.tour_date && (
                              <p className="text-sm text-gray-600">
                                Tour scheduled: {new Date(application.tour_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {/* Add view details function */}}
                              className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                            >
                              View Details
                            </button>
                            {application.status === 'pending' && (
                              <button
                                onClick={() => {/* Add payment function */}}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                              >
                                Complete Payment
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other Tabs Placeholder */}
            {activeTab === 'tours' && (
              <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg p-8">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Tour Requests</h2>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                  <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">No Tour Requests</h3>
                  <p className="text-gray-600 mb-8">Schedule a tour through the application process.</p>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg p-8">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Saved Properties</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                  <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">No Saved Properties</h3>
                  <p className="text-gray-600 mb-8">Save properties you're interested in by clicking the heart icon.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg p-8">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                  <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Settings Coming Soon</h3>
                  <p className="text-gray-600 mb-8">Profile and account settings will be available soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;