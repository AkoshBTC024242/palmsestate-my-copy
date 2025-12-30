import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  Building2, CalendarDays, DollarSign, ArrowRight, Home as HomeIcon
} from 'lucide-react';

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

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
      paid_under_review: { color: 'bg-purple-100 text-purple-800', icon: <CreditCard className="w-4 h-4" />, label: 'Paid - Review' },
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-amber-600 font-bold">
            <HomeIcon className="w-6 h-6" />
            Palms Estate
          </Link>
          <button onClick={signOut} className="text-gray-600 hover:text-gray-900">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications ({applications.length})</h2>

          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">No applications yet.</p>
              <Link to="/properties" className="bg-amber-600 text-white px-6 py-3 rounded-xl">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map(app => {
                const status = getStatusConfig(app.status);

                return (
                  <div key={app.id} className="bg-white rounded-2xl shadow p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{app.properties?.title || 'Luxury Property'}</h3>
                        <p className="text-gray-600">{app.properties?.location}</p>
                        <p className="text-sm text-gray-500 mt-1">Applied {formatDate(app.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
                          {status.icon}
                          <span className="font-medium">{status.label}</span>
                        </div>
                        {app.status === 'pre_approved' && (
                          <Link
                            to={`/applications/${app.id}/pay`}
                            className="bg-amber-600 text-white px-6 py-3 rounded-xl"
                          >
                            Pay $50 Fee
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
