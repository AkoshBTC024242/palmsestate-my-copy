import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { 
  FileText, Clock, CheckCircle, Heart, Building2, MapPin,
  CalendarDays, DollarSign, Eye, PlusCircle, Bell,
  CreditCard, Trophy, Sparkles
} from 'lucide-react';

function Dashboard() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    savedProperties: 0
  });

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      // Load applications
      const { data: appsData } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (appsData) {
        setApplications(appsData);
        const pending = appsData.filter(app => 
          app.status === 'pending' || app.status === 'under_review'
        ).length;
        const approved = appsData.filter(app => 
          app.status === 'approved'
        ).length;

        setStats(prev => ({
          ...prev,
          totalApplications: appsData.length,
          pending,
          approved
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getStatusBadge = (status, paymentStatus) => {
    const statusConfig = {
      pending: { 
        icon: <Clock className="w-3 h-3" />, 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Pending'
      },
      approved: { 
        icon: <CheckCircle className="w-3 h-3" />, 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Approved'
      },
      completed: { 
        icon: <Trophy className="w-3 h-3" />, 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Completed'
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
      day: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-100 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { 
            label: 'Total Applications', 
            value: stats.totalApplications, 
            icon: <FileText className="w-6 h-6" />,
            color: 'from-blue-500 to-blue-600',
            onClick: () => navigate('/dashboard/applications')
          },
          { 
            label: 'Pending Review', 
            value: stats.pending, 
            icon: <Clock className="w-6 h-6" />,
            color: 'from-amber-500 to-orange-500',
            onClick: () => navigate('/dashboard/applications')
          },
          { 
            label: 'Approved', 
            value: stats.approved, 
            icon: <CheckCircle className="w-6 h-6" />,
            color: 'from-emerald-500 to-green-600',
            onClick: () => navigate('/dashboard/applications')
          },
          { 
            label: 'Saved Properties', 
            value: stats.savedProperties, 
            icon: <Heart className="w-6 h-6" />,
            color: 'from-rose-500 to-pink-600',
            onClick: () => navigate('/dashboard/saved')
          },
        ].map((stat, index) => (
          <div 
            key={index}
            onClick={stat.onClick}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Recent Applications</h2>
            <p className="text-gray-600">Track your property applications and their status</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/applications')}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
          >
            View All
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your luxury living journey by applying for one of our premium properties.
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Building2 className="w-5 h-5" />
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 3).map((application) => (
              <div 
                key={application.id}
                className="group flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-amber-200 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/30 transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gray-200"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-serif font-bold text-gray-900">
                          Property Application
                        </h4>
                        {getStatusBadge(application.status, application.payment_status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          Applied {formatDate(application.created_at)}
                        </span>
                        {application.application_fee && (
                          <span className="flex items-center gap-1 font-medium">
                            <DollarSign className="w-4 h-4" />
                            ${application.application_fee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 lg:mt-0 lg:ml-4 flex items-center gap-4">
                  <button
                    onClick={() => navigate(`/dashboard/applications/${application.id}`)}
                    className="text-sm text-gray-700 hover:text-amber-600 font-medium flex items-center gap-1"
                  >
                    View Details
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
