import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  FileText, Clock, CheckCircle, Eye, ArrowRight, PlusCircle, 
  Building2, MapPin, CalendarDays, DollarSign, XCircle, Search,
  Filter, Download, ChevronDown
} from 'lucide-react';

function Applications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (id, title, location, price_per_week, image_url, bedrooms, bathrooms)
        `)
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

  const getStatusBadge = (status, paymentStatus) => {
    const statusConfig = {
      pending: { color: 'bg-amber-100 text-amber-800', label: 'Pending' },
      under_review: { color: 'bg-blue-100 text-blue-800', label: 'Under Review' },
      approved: { color: 'bg-emerald-100 text-emerald-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      payment_pending: { 
        color: paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800',
        label: paymentStatus === 'completed' ? 'Payment Complete' : 'Payment Pending'
      },
      completed: { color: 'bg-purple-100 text-purple-800', label: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'pending') return app.status === 'pending' || app.status === 'under_review';
    if (filter === 'payment') return app.status === 'payment_pending';
    if (filter === 'approved') return app.status === 'approved';
    if (filter === 'completed') return app.status === 'completed';
    return true;
  }).filter(app => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      app.properties?.title?.toLowerCase().includes(searchLower) ||
      app.properties?.location?.toLowerCase().includes(searchLower) ||
      app.full_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationId)
        .eq('user_id', user.id);

      if (error) throw error;
      alert('Application withdrawn successfully');
      loadApplications();
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Error withdrawing application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-amber-50/20 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600">Track and manage your property applications</p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
            >
              <PlusCircle className="w-5 h-5" />
              Apply for New Property
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'pending' || a.status === 'under_review').length}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'approved').length}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending Review</option>
                  <option value="payment">Payment Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600 mb-6">
                {search || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Start by applying for your first luxury property'}
              </p>
              {!search && filter === 'all' && (
                <button
                  onClick={() => navigate('/properties')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Building2 className="w-5 h-5" />
                  Browse Properties
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Property</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Applied</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Fee</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={app.properties?.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4'}
                              alt={app.properties?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-serif font-medium text-gray-900 mb-1">
                              {app.properties?.title || 'Property Application'}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{app.properties?.location || 'Location not specified'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status, app.payment_status)}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {formatDate(app.created_at)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">${app.application_fee || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/dashboard/applications/${app.id}`)}
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          {(app.status === 'pending' || app.status === 'under_review') && (
                            <button
                              onClick={() => handleWithdrawApplication(app.id)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Withdraw
                            </button>
                          )}
                          {app.status === 'payment_pending' && app.payment_status !== 'completed' && (
                            <button
                              onClick={() => navigate(`/dashboard/applications/${app.id}/payment`)}
                              className="text-sm bg-gradient-to-r from-amber-600 to-orange-500 text-white px-3 py-1 rounded-lg hover:shadow-md"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/properties')}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 text-left hover:border-amber-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-gray-900">Browse Properties</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Explore our collection of luxury residences</p>
            <div className="flex items-center text-amber-600 font-medium">
              <span>View Properties</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 text-left hover:border-amber-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-gray-900">Need Help?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Contact our support team for assistance</p>
            <div className="flex items-center text-blue-600 font-medium">
              <span>Get Support</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>

          <button className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 text-left hover:border-amber-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-gray-900">Documents</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Download your application documents</p>
            <div className="flex items-center text-emerald-600 font-medium">
              <span>View Documents</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Applications;
