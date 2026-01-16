// src/pages/admin/AdminApplications.jsx - UPDATED
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  FileText, Clock, CheckCircle, XCircle, Search, Filter, 
  Eye, Download, Mail, Phone, DollarSign, Calendar, AlertCircle,
  UserCheck, FileCheck, ArrowRight, ChevronRight
} from 'lucide-react';

function AdminApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      
      // Load applications with user and property data
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles:user_id (full_name, email, phone),
          properties:property_id (title, location, price_per_week)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));

      const updateData = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Add timestamp for specific statuses
      if (newStatus === 'approved_pending_info') {
        updateData.initial_approved_at = new Date().toISOString();
      } else if (newStatus === 'approved') {
        updateData.final_approved_at = new Date().toISOString();
      } else if (newStatus === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, ...updateData } : app
      ));

      alert(`Application status updated to: ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application: ' + error.message);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        icon: <Clock className="w-3 h-3" />, 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Submitted',
        bgColor: 'bg-blue-50'
      },
      under_review: { 
        icon: <AlertCircle className="w-3 h-3" />, 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        label: 'Under Review',
        bgColor: 'bg-indigo-50'
      },
      pre_approved: { 
        icon: <AlertCircle className="w-3 h-3" />, 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Pre-Approved',
        bgColor: 'bg-amber-50'
      },
      approved_pending_info: { 
        icon: <FileCheck className="w-3 h-3" />, 
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        label: 'Approved - Pending Info',
        bgColor: 'bg-cyan-50'
      },
      additional_info_submitted: { 
        icon: <FileText className="w-3 h-3" />, 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Additional Info Submitted',
        bgColor: 'bg-purple-50'
      },
      paid_under_review: { 
        icon: <DollarSign className="w-3 h-3" />, 
        color: 'bg-violet-100 text-violet-800 border-violet-200',
        label: 'Paid - Under Review',
        bgColor: 'bg-violet-50'
      },
      approved: { 
        icon: <CheckCircle className="w-3 h-3" />, 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Approved',
        bgColor: 'bg-emerald-50'
      },
      rejected: { 
        icon: <XCircle className="w-3 h-3" />, 
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        label: 'Rejected',
        bgColor: 'bg-rose-50'
      },
      payment_pending: {
        icon: <DollarSign className="w-3 h-3" />,
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        label: 'Payment Pending',
        bgColor: 'bg-orange-50'
      }
    };

    return configs[status] || configs.submitted;
  };

  const getStatusLabel = (status) => {
    const config = getStatusConfig(status);
    return config.label;
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get available next statuses for an application
  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = {
      submitted: ['under_review', 'rejected'],
      under_review: ['pre_approved', 'rejected', 'approved_pending_info'],
      pre_approved: ['paid_under_review', 'rejected'],
      paid_under_review: ['approved', 'rejected'],
      approved_pending_info: ['additional_info_submitted', 'rejected'],
      additional_info_submitted: ['approved', 'rejected'],
      payment_pending: ['paid_under_review', 'rejected']
    };

    return statusFlow[currentStatus] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Applications Management</h1>
            <p className="text-gray-600">Review and manage property applications</p>
          </div>
          
          <button
            onClick={loadApplications}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, property, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="pre_approved">Pre-Approved</option>
                <option value="approved_pending_info">Approved - Pending Info</option>
                <option value="additional_info_submitted">Additional Info Submitted</option>
                <option value="payment_pending">Payment Pending</option>
                <option value="paid_under_review">Paid - Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <button
                onClick={loadApplications}
                className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {[
            { status: 'all', label: 'Total', count: applications.length },
            { status: 'submitted', label: 'Submitted', count: applications.filter(a => a.status === 'submitted').length },
            { status: 'under_review', label: 'Review', count: applications.filter(a => a.status === 'under_review').length },
            { status: 'approved_pending_info', label: 'Pending Info', count: applications.filter(a => a.status === 'approved_pending_info').length },
            { status: 'additional_info_submitted', label: 'Info Submitted', count: applications.filter(a => a.status === 'additional_info_submitted').length },
            { status: 'approved', label: 'Approved', count: applications.filter(a => a.status === 'approved').length },
          ].map((stat) => (
            <div 
              key={stat.status}
              className={`p-4 rounded-xl border ${
                filterStatus === stat.status 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => setFilterStatus(stat.status)}
            >
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.count}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.map((application) => {
                    const statusConfig = getStatusConfig(application.status);
                    const nextStatusOptions = getNextStatusOptions(application.status);
                    
                    return (
                      <tr key={application.id} className={`hover:bg-gray-50 ${statusConfig.bgColor}`}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{application.full_name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Mail className="w-3 h-3" />
                              <span>{application.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              <span>{application.phone || 'N/A'}</span>
                            </div>
                            {application.reference_number && (
                              <div className="text-xs text-gray-400 mt-1">
                                Ref: #{application.reference_number}
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{application.properties?.title || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{application.properties?.location || 'N/A'}</p>
                            {application.properties?.price_per_week && (
                              <p className="text-sm text-gray-500">
                                {formatCurrency(application.properties.price_per_week)}/week
                              </p>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {getStatusBadge(application.status)}
                            
                            {/* Status Update Buttons */}
                            {nextStatusOptions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {nextStatusOptions.map((nextStatus) => (
                                  <button
                                    key={nextStatus}
                                    onClick={() => updateApplicationStatus(application.id, nextStatus)}
                                    disabled={updatingStatus[application.id]}
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                      nextStatus === 'rejected' 
                                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                        : nextStatus === 'approved_pending_info'
                                        ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                                        : nextStatus === 'approved'
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  >
                                    {updatingStatus[application.id] ? '...' : getStatusLabel(nextStatus)}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Quick Approve Button for initial applications */}
                            {application.status === 'under_review' && (
                              <button
                                onClick={() => updateApplicationStatus(application.id, 'approved_pending_info')}
                                disabled={updatingStatus[application.id]}
                                className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-medium rounded-lg hover:shadow transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                              >
                                {updatingStatus[application.id] ? (
                                  'Processing...'
                                ) : (
                                  <>
                                    <UserCheck className="w-3 h-3" />
                                    Approve & Request Info
                                  </>
                                )}
                              </button>
                            )}

                            {/* View Detailed Application Button */}
                            {application.status === 'additional_info_submitted' && (
                              <button
                                onClick={() => navigate(`/admin/applications/${application.id}`)}
                                className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs font-medium rounded-lg hover:shadow transition-all flex items-center justify-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                Review Details
                              </button>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(application.created_at)}
                          </div>
                          {application.initial_approved_at && (
                            <div className="text-xs text-cyan-600 mt-1">
                              Initial approved: {formatDate(application.initial_approved_at)}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/applications/${application.id}`)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => {
                                // Export application as PDF
                                console.log('Export application:', application.id);
                              }}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Export"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {/* Quick Action Arrow */}
                            <button
                              onClick={() => navigate(`/admin/applications/${application.id}`)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Go to Details"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredApplications.length === 0 && (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications found</p>
                  {searchTerm && (
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your search filters</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Flow Guide */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Application Status Flow</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto">
            {[
              { status: 'submitted', label: 'Submitted', icon: Clock },
              { status: 'under_review', label: 'Review', icon: AlertCircle },
              { status: 'approved_pending_info', label: 'Approved (Pending Info)', icon: FileCheck },
              { status: 'additional_info_submitted', label: 'Info Submitted', icon: FileText },
              { status: 'approved', label: 'Approved', icon: CheckCircle },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.status} className="flex items-center">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-xs font-medium text-gray-700">{step.label}</div>
                    <div className="text-xs text-gray-500">
                      {applications.filter(a => a.status === step.status).length} apps
                    </div>
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block mx-4">
                      <ArrowRight className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>• <span className="text-cyan-600 font-medium">"Approve & Request Info"</span>: Approves initial application and sends user to detailed form</p>
            <p>• Users will see a "Continue Application" button after initial approval</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminApplications;
