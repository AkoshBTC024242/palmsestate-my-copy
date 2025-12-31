import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  CalendarDays, ArrowRight
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">Start your luxury living journey by applying for one of our premium properties.</p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const status = getStatusConfig(application.status);

            return (
              <div key={application.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-serif font-bold text-gray-900">
                            {application.properties?.title || 'Luxury Property'}
                          </h4>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                            {status.icon}
                            <span>{status.label}</span>
                          </div>
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
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                      className="text-sm text-gray-700 hover:text-amber-600 font-medium flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Applications;
