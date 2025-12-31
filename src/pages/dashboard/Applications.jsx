// src/pages/dashboard/Applications.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  CalendarDays, ArrowRight, Building2, Search, Filter, Eye,
  DollarSign, MapPin, XCircle
} from 'lucide-react';

function Applications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalCount, setTotalCount] = useState(0);

  // Get status filter from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user, statusFilter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('applications')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            price_per_week,
            property_type,
            main_image_url
          )
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setApplications(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: <Clock className="w-4 h-4" />, 
        label: 'Submitted',
        description: 'Application submitted and awaiting review'
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200', 
        icon: <AlertCircle className="w-4 h-4" />, 
        label: 'Pre-Approved',
        description: 'Initial approval pending fee payment'
      },
      paid_under_review: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: <CreditCard className="w-4 h-4" />, 
        label: 'Paid - Review',
        description: 'Fee paid, under final review'
      },
      approved: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle className="w-4 h-4" />, 
        label: 'Approved',
        description: 'Application approved'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: <XCircle className="w-4 h-4" />, 
        label: 'Rejected',
        description: 'Application not approved'
      },
    };
    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      (app.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.properties?.location?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">
          Track and manage all your property applications ({totalCount})
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { status: 'all', label: 'All', count: totalCount, color: 'bg-gray-100 text-gray-800' },
          { status: 'submitted', label: 'Submitted', count: getStatusCount('submitted'), color: 'bg-blue-100 text-blue-800' },
          { status: 'pre_approved', label: 'Pre-Approved', count: getStatusCount('pre_approved'), color: 'bg-amber-100 text-amber-800' },
          { status: 'paid_under_review', label: 'Under Review', count: getStatusCount('paid_under_review'), color: 'bg-purple-100 text-purple-800' },
          { status: 'approved', label: 'Approved', count: getStatusCount('approved'), color: 'bg-green-100 text-green-800' },
        ].map((stat) => (
          <button
            key={stat.status}
            onClick={() => setStatusFilter(stat.status)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              statusFilter === stat.status 
                ? 'border-orange-300 shadow-sm scale-[1.02]' 
                : 'border-gray-200 hover:border-gray-300'
            } ${stat.color}`}
          >
            <div className="text-2xl font-bold mb-1">{stat.count}</div>
            <div className="text-sm font-medium">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by property name, location, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="pre_approved">Pre-Approved</option>
                <option value="paid_under_review">Paid - Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <button
              onClick={() => navigate('/properties')}
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Building2 className="h-5 w-5" />
              New Application
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search filters'
                : 'You haven\'t submitted any applications yet'}
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <Building2 className="w-5 h-5" />
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => {
              const status = getStatusConfig(application.status);

              return (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Property Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {application.properties?.main_image_url ? (
                            <img
                              src={application.properties.main_image_url}
                              alt={application.properties.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-900 truncate">
                              {application.properties?.title || 'Luxury Property'}
                            </h4>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                              {status.icon}
                              <span>{status.label}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{status.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              Applied {formatDate(application.created_at)}
                            </span>
                            
                            {application.properties?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {application.properties.location}
                              </span>
                            )}
                            
                            {application.properties?.price_per_week && (
                              <span className="flex items-center gap-1 font-medium">
                                <DollarSign className="w-4 h-4" />
                                {formatCurrency(application.properties.price_per_week)}/week
                              </span>
                            )}
                          </div>
                          
                          {application.reference_number && (
                            <p className="text-sm text-gray-500 mt-2">
                              Reference: #{application.reference_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                      >
                        View Details
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {application.status === 'pre_approved' && (
                        <button
                          onClick={() => navigate(`/dashboard/applications/${application.id}/payment`)}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay Fee
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
