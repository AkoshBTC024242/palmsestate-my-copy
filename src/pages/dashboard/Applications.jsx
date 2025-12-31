import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  ArrowRight
} from 'lucide-react';

function Applications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

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
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-600">Manage your property applications</p>
        </div>
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          New Application
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-6">No applications yet</p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold"
          >
            Browse Properties
          </button>
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
                  <div className="flex items-center gap-4">
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
    </div>
  );
}

export default Applications;
