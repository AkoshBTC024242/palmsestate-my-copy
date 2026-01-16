import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  CalendarDays, ArrowRight, Building2, Search, Filter, Eye,
  DollarSign, MapPin, XCircle, ExternalLink, FileCheck, ArrowRightCircle
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
  const [properties, setProperties] = useState({});

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
      console.log('Loading applications for user:', user?.id);
      
      // SIMPLE QUERY: Get applications without property join
      let query = supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error, count } = await query;

      console.log('Applications loaded:', data?.length || 0, 'apps');
      console.log('Sample app:', data?.[0]);

      if (error) {
        console.error('Error loading applications:', error);
        // Try a simpler query as fallback
        const { data: fallbackData } = await supabase
          .from('applications')
          .select('id, status, created_at, property_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setApplications(fallbackData || []);
        setTotalCount(fallbackData?.length || 0);
        return;
      }

      setApplications(data || []);
      setTotalCount(count || 0);

      // Load properties separately if we have property_ids
      if (data && data.length > 0) {
        const propertyIds = data
          .map(app => app.property_id)
          .filter(id => id && id !== null && id !== undefined);
        
        if (propertyIds.length > 0) {
          const uniqueIds = [...new Set(propertyIds)];
          console.log('Loading properties:', uniqueIds);
          
          const { data: propertiesData, error: propsError } = await supabase
            .from('properties')
            .select('*')
            .in('id', uniqueIds);
          
          if (!propsError && propertiesData) {
            const propertiesMap = {};
            propertiesData.forEach(prop => {
              propertiesMap[prop.id] = prop;
            });
            setProperties(propertiesMap);
          }
        }
      }

    } catch (error) {
      console.error('Error in loadApplications:', error);
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
        description: 'Application submitted and awaiting review',
        action: null
      },
      under_review: { 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
        icon: <AlertCircle className="w-4 h-4" />, 
        label: 'Under Review',
        description: 'Application being reviewed by admin',
        action: null
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200', 
        icon: <AlertCircle className="w-4 h-4" />, 
        label: 'Pre-Approved',
        description: 'Initial approval pending fee payment',
        action: 'payment'
      },
      approved_pending_info: { 
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200', 
        icon: <FileCheck className="w-4 h-4" />, 
        label: 'Continue Application',
        description: 'Initial approval received. Complete detailed application',
        action: 'continue'
      },
      additional_info_submitted: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: <FileText className="w-4 h-4" />, 
        label: 'Under Final Review',
        description: 'Detailed application submitted for final review',
        action: null
      },
      paid_under_review: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: <CreditCard className="w-4 h-4" />, 
        label: 'Paid - Review',
        description: 'Fee paid, under final review',
        action: null
      },
      approved: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle className="w-4 h-4" />, 
        label: 'Approved',
        description: 'Application fully approved',
        action: null
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: <XCircle className="w-4 h-4" />, 
        label: 'Rejected',
        description: 'Application not approved',
        action: null
      },
      payment_pending: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <CreditCard className="w-4 h-4" />,
        label: 'Payment Pending',
        description: 'Waiting for payment',
        action: 'payment'
      }
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
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPropertyInfo = (propertyId) => {
    if (!propertyId) return { title: 'Unknown Property', location: '' };
    const prop = properties[propertyId];
    return {
      title: prop?.title || `Property #${propertyId}`,
      location: prop?.location || '',
      image: prop?.main_image_url,
      price: prop?.price_per_week
    };
  };

  const getApplicantName = (application) => {
    if (application.first_name && application.last_name) {
      return `${application.first_name} ${application.last_name}`;
    }
    return application.full_name || 'Applicant';
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      getPropertyInfo(app.property_id).title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getApplicantName(app).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.reference_number && app.reference_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  // Get action button based on status
  const getActionButton = (application, statusConfig) => {
    if (!statusConfig.action) return null;

    switch (statusConfig.action) {
      case 'payment':
        return (
          <button
            onClick={() => navigate(`/dashboard/applications/${application.id}/payment`)}
            className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow"
          >
            <CreditCard className="w-4 h-4" />
            Pay Fee
          </button>
        );
      
      case 'continue':
        return (
          <button
            onClick={() => navigate(`/dashboard/applications/${application.id}/post-approval`)}
            className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow"
          >
            <ArrowRightCircle className="w-4 h-4" />
            Continue Application
          </button>
        );
      
      default:
        return null;
    }
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { status: 'all', label: 'All', count: totalCount, color: 'bg-gray-100 text-gray-800', borderColor: 'border-gray-300' },
          { status: 'submitted', label: 'Submitted', count: getStatusCount('submitted'), color: 'bg-blue-100 text-blue-800', borderColor: 'border-blue-300' },
          { status: 'under_review', label: 'Review', count: getStatusCount('under_review'), color: 'bg-indigo-100 text-indigo-800', borderColor: 'border-indigo-300' },
          { status: 'pre_approved', label: 'Pre-Approved', count: getStatusCount('pre_approved'), color: 'bg-amber-100 text-amber-800', borderColor: 'border-amber-300' },
          { status: 'approved_pending_info', label: 'Continue', count: getStatusCount('approved_pending_info'), color: 'bg-cyan-100 text-cyan-800', borderColor: 'border-cyan-300' },
          { status: 'approved', label: 'Approved', count: getStatusCount('approved'), color: 'bg-green-100 text-green-800', borderColor: 'border-green-300' },
        ].map((stat) => (
          <button
            key={stat.status}
            onClick={() => setStatusFilter(stat.status)}
            className={`p-3 rounded-xl border transition-all duration-200 ${
              statusFilter === stat.status 
                ? `${stat.borderColor} shadow-sm scale-[1.02] ring-1 ring-offset-1` 
                : 'border-gray-200 hover:border-gray-300'
            } ${stat.color}`}
          >
            <div className="text-xl font-bold mb-1">{stat.count}</div>
            <div className="text-xs font-medium">{stat.label}</div>
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
                placeholder="Search by property name, applicant name, or reference..."
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
                <option value="under_review">Under Review</option>
                <option value="pre_approved">Pre-Approved</option>
                <option value="approved_pending_info">Continue Application</option>
                <option value="additional_info_submitted">Additional Info Submitted</option>
                <option value="paid_under_review">Paid - Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="payment_pending">Payment Pending</option>
              </select>
            </div>
            
            <button
              onClick={() => navigate('/properties')}
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
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
              const property = getPropertyInfo(application.property_id);
              const applicantName = getApplicantName(application);
              const actionButton = getActionButton(application, status);

              return (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Property Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {property.image ? (
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><Building2 class="w-8 h-8 text-gray-400" /></div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-900 truncate">
                              {property.title}
                            </h4>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                              {status.icon}
                              <span>{status.label}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{status.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              Applied {formatDate(application.created_at)}
                            </span>
                            
                            {property.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {property.location}
                              </span>
                            )}
                            
                            {property.price && (
                              <span className="flex items-center gap-1 font-medium">
                                <DollarSign className="w-4 h-4" />
                                ${property.price}/week
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="text-gray-500">
                              Applicant: {applicantName}
                            </span>
                            
                            {application.reference_number && (
                              <span className="text-gray-500">
                                Reference: #{application.reference_number}
                              </span>
                            )}
                            
                            {application.property_id && (
                              <Link
                                to={`/properties/${application.property_id}`}
                                className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                              >
                                View Property
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <button
                        onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                        className="text-sm text-gray-600 hover:text-orange-600 font-medium flex items-center gap-1 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {actionButton}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Status Guide */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Application Status Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-800">Initial Submission</span>
            </div>
            <p className="text-xs text-gray-600">
              Submitted → Under Review → Pre-Approved/Rejected
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-sm font-medium text-gray-800">Detailed Application</span>
            </div>
            <p className="text-xs text-gray-600">
              Approved (Pending Info) → Additional Info Submitted → Final Review
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-800">Final Status</span>
            </div>
            <p className="text-xs text-gray-600">
              Approved → Lease Signing or Rejected → Application Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Applications;
