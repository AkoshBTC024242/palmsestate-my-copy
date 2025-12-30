import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  FileText, Clock, CheckCircle, Heart, Building2, MapPin,
  CalendarDays, DollarSign, Eye, ArrowRight, Home as HomeIcon
} from 'lucide-react';

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      // Load applications
      const { data: apps } = await supabase
        .from('applications')
        .select('*, properties(title, location, price_per_week)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setApplications(apps || []);

      // Load saved properties
      const { data: saved } = await supabase
        .from('saved_properties')
        .select('*, properties(title, location, price_per_week, image_url)')
        .eq('user_id', user.id);

      setSavedProperties(saved || []);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status) => {
    const map = {
      submitted: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" />, label: 'Submitted' },
      pre_approved: { color: 'bg-amber-100 text-amber-800', icon: <AlertCircle className="w-4 h-4" />, label: 'Pre-Approved' },
      paid_under_review: { color: 'bg-purple-100 text-purple-800', icon: <DollarSign className="w-4 h-4" />, label: 'Paid - Review' },
      approved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4" />, label: 'Rejected' },
    };
    return map[status] || map.submitted;
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Simple Header - No Verified Member */}
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

        {/* Applications Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
            <Link to="/properties" className="text-amber-600 hover:text-amber-700">
              Browse Properties →
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No applications yet. Start by browsing properties.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map(app => {
                const status = getStatus(app.status);
                return (
                  <div key={app.id} className="bg-white rounded-2xl shadow p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{app.properties?.title || 'Property'}</h3>
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

        {/* Saved Properties */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Properties</h2>
          {savedProperties.length === 0 ? (
            <p className="text-gray-600">No saved properties.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedProperties.map(saved => (
                <div key={saved.property_id} className="bg-white rounded-2xl shadow overflow-hidden">
                  <img src={saved.properties.image_url} alt="" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold">{saved.properties.title}</h3>
                    <p className="text-gray-600">{saved.properties.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
