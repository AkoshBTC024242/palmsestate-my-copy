import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import {
  FileText, Clock, CheckCircle, Heart, Building2, MapPin,
  CalendarDays, DollarSign, Eye, PlusCircle, Bell,
  CreditCard, Trophy, Sparkles
} from 'lucide-react';

function Dashboard() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    savedProperties: 0
  });

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('*, properties(title, location, price_per_week)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (appsError) throw appsError;

      setApplications(appsData || []);

      const pending = appsData.filter(app => 
        ['submitted', 'pre_approved', 'paid_under_review'].includes(app.status)
      ).length;

      const approved = appsData.filter(app => app.status === 'approved').length;

      setStats(prev => ({
        ...prev,
        totalApplications: appsData.length,
        pending,
        approved,
      }));

      const { data: savedData } = await supabase
        .from('saved_properties')
        .select('*, properties(*)')
        .eq('user_id', user.id);

      setSavedProperties(savedData || []);
      setStats(prev => ({ ...prev, savedProperties: savedData?.length || 0 }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      submitted: { icon: <Clock className="w-3 h-3" />, color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      pre_approved: { icon: <Clock className="w-3 h-3" />, color: 'bg-amber-100 text-amber-800', label: 'Pre-Approved' },
      paid_under_review: { icon: <CreditCard className="w-3 h-3" />, color: 'bg-purple-100 text-purple-800', label: 'Paid - Review' },
      approved: { icon: <CheckCircle className="w-3 h-3" />, color: 'bg-emerald-100 text-emerald-800', label: 'Approved' },
      rejected: { icon: <AlertCircle className="w-3 h-3" />, color: 'bg-red-100 text-red-800', label: 'Rejected' },
    }[status] || { icon: <Clock className="w-3 h-3" />, color: 'bg-gray-100 text-gray-800', label: status || 'Pending' };

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
    navigate('/signin');
    return null;
  }

  const renderContent = () => {
    if (activeSection === 'overview') {
      return (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* your stats cards */}
          </div>

          {/* Recent Applications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Recent Applications</h2>
                <p className="text-gray-600">Track your property applications and their status</p>
              </div>
              <button
                onClick={() => setActiveSection('applications')}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                View All
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                {/* your no applications UI */}
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 3).map((application) => (
                  <div key={application.id} className="group flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-amber-200 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/30 transition-all duration-300">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200" />
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-serif font-bold text-gray-900">
                              {application.properties?.title || 'Luxury Property'}
                            </h4>
                            {getStatusBadge(application.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              Applied {formatDate(application.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-4 flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                        className="text-sm text-gray-700 hover:text-amber-600 font-medium flex items-center gap-1"
                      >
                        View Details
                        <Eye className="w-4 h-4" />
                      </button>
                      {application.status === 'pre_approved' && (
                        <Link
                          to={`/applications/${application.id}/pay`}
                          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Pay $50 Fee
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    }

    if (activeSection === 'applications') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">All Applications</h2>
          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{application.properties?.title}</h3>
                      <p className="text-gray-600">{application.properties?.location}</p>
                      <p className="text-sm text-gray-500">Applied {formatDate(application.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(application.status)}
                      {application.status === 'pre_approved' && (
                        <Link to={`/applications/${application.id}/pay`} className="bg-amber-600 text-white px-6 py-3 rounded-xl">
                          Pay $50 Fee
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // other sections (saved, profile, etc.) — keep your original or empty for now

    return <div>Section not implemented yet</div>;
  };

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default Dashboard;
