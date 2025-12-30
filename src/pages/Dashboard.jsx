import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  FileText, Clock, CheckCircle, Heart, Building2,
  CalendarDays, DollarSign, Eye, ArrowRight
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-amber-600">
            Palms Estate
          </Link>
          <button onClick={signOut} className="text-gray-600 hover:text-gray-900">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">No applications yet</p>
            <Link to="/properties" className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const status = getStatusConfig(app.status);

              return (
                <div key={app.id} className="bg-white rounded-2xl shadow p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {app.properties?.title || 'Luxury Property'}
                      </h3>
                      <p className="text-gray-600 mt-1">{app.properties?.location}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied {formatDate(app.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
                        {status.icon}
                        <span className="font-medium">{status.label}</span>
                      </div>

                      {app.status === 'pre_approved' && (
                        <Link
                          to={`/applications/${app.id}/pay`}
                          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium"
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
      </main>
    </div>
  );
}

export default Dashboard;
