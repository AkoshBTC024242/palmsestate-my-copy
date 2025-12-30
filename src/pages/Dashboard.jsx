import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  Building2, CalendarDays, DollarSign, ArrowRight
} from 'lucide-react';

function Dashboard() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadApplications();
    }
  }, [user, authLoading]);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, properties(title, location, price_per_week)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" />, label: 'Submitted' },
      pre_approved: { color: 'bg-amber-100 text-amber-800', icon: <AlertCircle className="w-4 h-4" />, label: 'Pre-Approved' },
      paid_under_review: { color: 'bg-purple-100 text-purple-800', icon: <CreditCard className="w-4 h-4" />, label: 'Paid - Under Review' },
      approved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4" />, label: 'Rejected' },
    };
    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.full_name || user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-600">Track your luxury rental applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
              No Applications Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your journey toward exceptional living by exploring our exclusive portfolio.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-8 py-4 rounded-xl hover:shadow-xl transition-all"
            >
              Browse Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Your Applications ({applications.length})
              </h2>
            </div>

            {applications.map((app) => {
              const status = getStatusConfig(app.status);

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                          <div>
                            <h3 className="text-xl font-serif font-bold text-gray-900">
                              {app.properties?.title || 'Luxury Property'}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4" />
                              {app.properties?.location || 'Premium Location'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            Applied {formatDate(app.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${app.price_per_week || 0}/week
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start lg:items-end gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
                          {status.icon}
                          <span className="font-medium">{status.label}</span>
                        </div>

                        {app.status === 'pre_approved' && (
                          <Link
                            to={`/applications/${app.id}/pay`}
                            className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-md transition-all"
                          >
                            Pay $50 Fee
                          </Link>
                        )}

                        <button
                          onClick={() => navigate(`/dashboard/applications/${app.id}`)}
                          className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
