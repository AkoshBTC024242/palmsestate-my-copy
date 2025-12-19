import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function ApplicationStatus() {
  const { user } = useAuth();
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
        .select(`
          *,
          properties (title, location)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        icon: <Clock className="w-3 h-3" />, 
        color: 'bg-amber-100 text-amber-800',
        label: 'Pending'
      },
      paid_pending: { 
        icon: <Clock className="w-3 h-3" />, 
        color: 'bg-blue-100 text-blue-800',
        label: 'Payment Complete'
      },
      approved: { 
        icon: <CheckCircle className="w-3 h-3" />, 
        color: 'bg-green-100 text-green-800',
        label: 'Approved'
      },
      rejected: { 
        icon: <AlertCircle className="w-3 h-3" />, 
        color: 'bg-red-100 text-red-800',
        label: 'Rejected'
      },
    };

    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="px-4 py-3">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="px-4 py-3 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">No applications yet</p>
        <Link
          to="/properties"
          className="inline-block mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium"
        >
          Browse Properties →
        </Link>
      </div>
    );
  }

  return (
    <div className="py-2">
      {applications.map((app) => {
        const config = getStatusConfig(app.status);
        return (
          <Link
            key={app.id}
            to={`/property/${app.property_id}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {app.properties?.title || 'Property Application'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {app.properties?.location || 'Location not specified'}
              </p>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
                  {config.icon}
                  <span className="ml-1">{config.label}</span>
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(app.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
          </Link>
        );
      })}
    </div>
  );
}

export default ApplicationStatus;