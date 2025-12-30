import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CheckCircle, Clock, AlertCircle, CreditCard, Home, LogOut } from 'lucide-react';

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pre_approved': return 'bg-amber-100 text-amber-800';
      case 'paid_under_review': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <Clock className="w-5 h-5" />;
      case 'pre_approved': return <AlertCircle className="w-5 h-5" />;
      case 'paid_under_review': return <CreditCard className="w-5 h-5" />;
      case 'approved': return <CheckCircle className="w-5 h-5" />;
      case 'rejected': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-amber-600">
            <Home className="w-6 h-6" />
            <span className="font-bold">Palms Estate</span>
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600 mb-8">Track your rental application status</p>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No applications yet.</p>
            <Link to="/properties" className="mt-4 inline-block bg-amber-600 text-white px-6 py-3 rounded-xl">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map(app => (
              <div key={app.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{app.properties?.title || 'Property'}</h3>
                    <p className="text-gray-600">{app.properties?.location || 'Location'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied on {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="font-medium capitalize">{app.status.replace('_', ' ')}</span>
                    </div>
                    {app.status === 'pre_approved' && (
                      <Link
                        to={`/applications/${app.id}/pay`}
                        className="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700"
                      >
                        Pay $50 Fee
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
