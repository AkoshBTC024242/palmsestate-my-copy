import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Building2, Users, FileText, DollarSign, BarChart3,
  Shield, Settings, LogOut, PlusCircle, Search,
  Filter, CheckCircle, Clock, AlertCircle, TrendingUp,
  Eye, Edit, Trash2, ChevronRight, Menu, X,
  Calendar, CreditCard, Globe, Bell, Download,
  Sparkles, Zap, Lock, Key, TestTube, Home,
  ArrowRight, Trophy, User, Crown, Star, ChevronLeft
} from 'lucide-react';

function AdminDashboard() {
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [testMode, setTestMode] = useState(false);

  // Dashboard data
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      loadAdminData();
    } else if (!authLoading) {
      navigate('/dashboard');
    }
  }, [authLoading, user, isAdmin, navigate]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const { data: properties } = await supabase
        .from('properties')
        .select('*');

      setStats(prev => ({ ...prev, totalProperties: properties.length }));
      setRecentProperties(properties.slice(0, 3));

      const { data: applications } = await supabase
        .from('applications')
        .select('*');

      const pending = applications.filter(app => app.status === 'submitted').length;
      const revenue = applications.filter(app => app.payment_status === 'completed').reduce((sum, app) => sum + app.application_fee, 0);

      setStats(prev => ({
        ...prev,
        totalApplications: applications.length,
        pendingApplications: pending,
        totalRevenue: revenue
      }));

      setRecentApplications(applications.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const handlePreApprove = async (appId) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'pre_approved' })
        .eq('id', appId);

      if (error) throw error;

      // Send email with payment link
      const { data: app } = await supabase
        .from('applications')
        .select('email')
        .eq('id', appId)
        .single();

      await sendApplicationConfirmation(app.email, {
        message: 'Pre-approved! Pay $50 to complete: https://palmsestate.org/applications/' + appId + '/pay'
      });

      loadAdminData();
    } catch (error) {
      alert('Error pre-approving');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'properties':
        return renderProperties();
      case 'applications':
        return renderApplications();
      case 'users':
        return renderUsers();
      case 'payments':
        return renderPayments();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div> {/* your original overview code */ }</div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Applications</h1>
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Property</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentApplications.map(app => (
              <tr key={app.id}>
                <td>{app.full_name}</td>
                <td>{app.property_id}</td>
                <td>{app.status}</td>
                <td>
                  {app.status === 'submitted' && (
                    <button onClick={() => handlePreApprove(app.id)}>Pre-Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ... add other render functions as needed

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* your full dashboard JSX (unchanged) */}
      {renderContent()}
    </div>
  );
}

export default AdminDashboard;
