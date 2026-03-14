import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Clock, CheckCircle, AlertCircle, CreditCard,
  CalendarDays, ArrowRight, Building2, Search, Filter, Eye,
  DollarSign, MapPin, XCircle, ExternalLink, FileCheck, 
  ArrowRightCircle, Home, User, Phone, Mail, ChevronRight,
  Loader2, Plus, RefreshCw, Download, Printer, Share2
} from 'lucide-react';

function Applications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      
      let query = supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error loading applications:', error);
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

      // Load properties separately
      if (data && data.length > 0) {
        const propertyIds = data
          .map(app => app.property_id)
          .filter(id => id && id !== null && id !== undefined);
        
        if (propertyIds.length > 0) {
          const uniqueIds = [...new Set(propertyIds)];
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
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
        icon: <Clock className="w-3.5 h-3.5" />,
        label: 'Submitted',
        description: 'Application submitted and awaiting review',
        progress: 20,
        action: null
      },
      under_review: { 
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: 'Under Review',
        description: 'Application being reviewed by admin',
        progress: 40,
        action: null
      },
      pre_approved: { 
        color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: 'Pre-Approved',
        description: 'Initial approval pending fee payment',
        progress: 60,
        action: 'payment'
      },
      approved_pending_info: { 
        color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        icon: <FileCheck className="w-3.5 h-3.5" />,
        label: 'Continue Application',
        description: 'Initial approval received. Complete detailed application',
        progress: 60,
        action: 'continue'
      },
      additional_info_submitted: { 
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        icon: <FileText className="w-3.5 h-3.5" />,
        label: 'Under Final Review',
        description: 'Detailed application submitted for final review',
        progress: 80,
        action: null
      },
      paid_under_review: { 
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        icon: <CreditCard className="w-3.5 h-3.5" />,
        label: 'Paid - Review',
        description: 'Fee paid, under final review',
        progress: 80,
        action: null
      },
      approved: { 
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: 'Approved',
        description: 'Application fully approved',
        progress: 100,
        action: null
      },
      rejected: { 
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: <XCircle className="w-3.5 h-3.5" />,
        label: 'Rejected',
        description: 'Application not approved',
        progress: 0,
        action: null
      },
      payment_pending: {
        color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        icon: <CreditCard className="w-3.5 h-3.5" />,
        label: 'Payment Pending',
        description: 'Waiting for payment',
        progress: 40,
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

  const getActionButton = (application, statusConfig) => {
    if (!statusConfig.action) return null;

    switch (statusConfig.action) {
      case 'payment':
        return (
          <button
            onClick={() => navigate(`/dashboard/applications/${application.id}/payment`)}
            className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Pay Fee
          </button>
        );
      
      case 'continue':
        return (
          <button
            onClick={() => navigate(`/dashboard/applications/${application.id}/post-approval`)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <ArrowRightCircle className="w-4 h-4" />
            Continue Application
          </button>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#F97316] mx-auto mb-4" />
          <p className="text-[#A1A1AA] text-sm">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-light text-white">Applications</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">
            Track and manage all your property applications ({totalCount})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/properties"
            className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Link>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { status: 'all', label: 'All', count: totalCount, icon: <FileText className="w-4 h-4" /> },
          { status: 'submitted', label: 'Submitted', count: getStatusCount('submitted'), icon: <Clock className="w-4 h-4" /> },
          { status: 'pre_approved', label: 'Pre-Approved', count: getStatusCount('pre_approved'), icon: <AlertCircle className="w-4 h-4" /> },
          { status: 'approved_pending_info', label: 'Continue', count: getStatusCount('approved_pending_info'), icon: <FileCheck className="w-4 h-4" /> },
          { status: 'approved', label: 'Approved', count: getStatusCount('approved'), icon: <CheckCircle className="w-4 h-4" /> },
          { status: 'payment_pending', label: 'Payment', count: getStatusCount('payment_pending'), icon: <CreditCard className="w-4 h-4" /> },
        ].map((stat) => (
          <button
            key={stat.status}
            onClick={() => setStatusFilter(stat.status)}
            className={`p-4 rounded-xl border transition-all ${
              statusFilter === stat.status 
                ? 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]' 
                : 'bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:border-[#F97316]/30 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <span className="text-xs uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-2xl font-light">{stat.count}</div>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="text"
                placeholder="Search by property, applicant, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#A1A1AA]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316]/50"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="pre_approved">Pre-Approved</option>
                <option value="approved_pending_info">Continue Application</option>
                <option value="additional_info_submitted">Additional Info</option>
                <option value="paid_under_review">Paid - Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="payment_pending">Payment Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#F97316]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#F97316]" />
            </div>
            <h3 className="text-white font-light text-lg mb-2">No Applications Found</h3>
            <p className="text-[#A1A1AA] text-sm mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search filters'
                : 'You haven\'t submitted any applications yet'}
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
            >
              <Building2 className="w-4 h-4" />
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#27272A]">
            {filteredApplications.map((application) => {
              const status = getStatusConfig(application.status);
              const property = getPropertyInfo(application.property_id);
              const applicantName = getApplicantName(application);
              const actionButton = getActionButton(application, status);

              return (
                <div 
                  key={application.id} 
                  className="p-6 hover:bg-[#0A0A0A] transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        {/* Property Image Placeholder */}
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#F97316]/10 to-[#EA580C]/10 flex-shrink-0 flex items-center justify-center">
                          <Home className="w-8 h-8 text-[#F97316]/30" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h4 className="text-white font-medium truncate">
                              {property.title}
                            </h4>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${status.color}`}>
                              {status.icon}
                              <span>{status.label}</span>
                            </div>
                          </div>
                          
                          <p className="text-[#A1A1AA] text-sm mb-3">{status.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-[#A1A1AA] mb-3">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {formatDate(application.created_at)}
                            </span>
                            
                            {property.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {property.location}
                              </span>
                            )}
                            
                            {property.price && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                {formatCurrency(property.price)}/week
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            <span className="text-[#A1A1AA]">
                              Applicant: {applicantName}
                            </span>
                            
                            {application.reference_number && (
                              <span className="text-[#A1A1AA]">
                                Ref: #{application.reference_number}
                              </span>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4 w-full h-1 bg-[#27272A] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                status.progress === 100 ? 'bg-green-500' :
                                status.progress >= 80 ? 'bg-blue-500' :
                                status.progress >= 60 ? 'bg-purple-500' :
                                status.progress >= 40 ? 'bg-[#F97316]' : 'bg-amber-500'
                              }`}
                              style={{ width: `${status.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/applications/${application.id}`);
                        }}
                        className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#0A0A0A] border border-[#27272A] rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {actionButton && (
                        <div onClick={(e) => e.stopPropagation()}>
                          {actionButton}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Guide */}
      <div className="mt-8 bg-[#18181B] border border-[#27272A] rounded-xl p-6">
        <h3 className="text-white font-light mb-4">Application Status Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#27272A]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#F97316]"></div>
              <span className="text-white text-sm font-medium">Initial Submission</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <Clock className="w-3 h-3" /> Submitted
              <ArrowRight className="w-3 h-3" />
              <AlertCircle className="w-3 h-3" /> Under Review
              <ArrowRight className="w-3 h-3" />
              <CheckCircle className="w-3 h-3" /> Pre-Approved
            </div>
          </div>
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#27272A]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-white text-sm font-medium">Detailed Application</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <FileCheck className="w-3 h-3" /> Continue
              <ArrowRight className="w-3 h-3" />
              <FileText className="w-3 h-3" /> Additional Info
              <ArrowRight className="w-3 h-3" />
              <CreditCard className="w-3 h-3" /> Final Review
            </div>
          </div>
          <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#27272A]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-white text-sm font-medium">Final Status</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <CheckCircle className="w-3 h-3" /> Approved
              <span className="text-[#A1A1AA]">or</span>
              <XCircle className="w-3 h-3" /> Rejected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Applications;
