import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  FileText, Clock, CheckCircle, XCircle, Search, Filter, 
  Eye, Download, Mail, Phone, DollarSign, Calendar, AlertCircle
} from 'lucide-react';

function AdminApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      alert(`Application ${newStatus}`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        icon: <Clock className="w-3 h-3" />, 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Pending'
      },
      under_review: { 
        icon: <AlertCircle className="w-3 h-3" />, 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Under Review'
      },
      approved: { 
        icon: <CheckCircle className="w-3 h-3" />, 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Approved'
      },
      rejected: { 
        icon: <XCircle className="w-3 h-3" />, 
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        label: 'Rejected'
      },
      payment_pending: { 
        icon: <DollarSign className="w-3 h-3" />, 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Payment Pending'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
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
      app.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600"
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
                placeholder="Search by name, email, or property..."
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
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="payment_pending">Payment Pending</option>
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
                      Application Fee
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
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
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
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{formatCurrency(application.application_fee)}</span>
                        </div>
                        <span className={`text-xs ${
                          application.payment_status === 'paid' 
                            ? 'text-emerald-600' 
                            : 'text-amber-600'
                        }`}>
                          {application.payment_status || 'pending'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(application.status)}
                          <div className="flex gap-1">
                            {application.status !== 'approved' && (
                              <button
                                onClick={() => updateApplicationStatus(application.id, 'approved')}
                                className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                              >
                                Approve
                              </button>
                            )}
                            {application.status !== 'rejected' && (
                              <button
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                className="px-2 py-1 text-xs bg-rose-100 text-rose-700 rounded hover:bg-rose-200"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(application.created_at)}
                        </div>
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
                        </div>
                      </td>
                    </tr>
                  ))}
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
      </div>
    </div>
  );
}

export default AdminApplications;
