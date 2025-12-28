import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, Clock, CheckCircle, Heart, CreditCard, 
  Bell, User, Settings, LogOut, PlusCircle, 
  Menu, X, ChevronLeft, ChevronRight, Home
} from 'lucide-react';

function DashboardLayout({ children, activeSection, setActiveSection }) {
  const { user, signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-amber-50/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="text-center">
            <h1 className="font-serif font-bold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-500">Welcome back</p>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:block ${sidebarCollapsed ? 'w-20' : 'w-64'} fixed left-0 top-0 bottom-0 z-40 transition-all duration-300`}>
          <div className="w-full h-full bg-white/95 backdrop-blur-md border-r border-gray-100 overflow-y-auto flex flex-col">
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                {sidebarCollapsed ? 
                  <ChevronRight className="w-5 h-5 text-gray-600" /> : 
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                }
              </button>
            </div>
            
            {!sidebarCollapsed ? (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-gray-900">
                      {userProfile?.full_name || user?.email?.split('@')[0]}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-medium rounded-full">
                        Verified Member
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-100 flex justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-4">
              <nav className={`px-4 space-y-1 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                {[
                  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
                  { id: 'applications', label: 'Applications', icon: <FileText className="w-5 h-5" />, path: '/dashboard/applications' },
                  { id: 'saved', label: 'Saved', icon: <Heart className="w-5 h-5" />, path: '/dashboard/saved' },
                  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" />, path: '/dashboard' },
                  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/dashboard' },
                  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, path: '/dashboard/profile' },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      navigate(item.path);
                    }}
                    className={`
                      w-full ${sidebarCollapsed ? 'px-2 py-3' : 'px-4 py-3'} rounded-xl transition-all duration-200
                      ${activeSection === item.id 
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-100' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeSection === item.id ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.icon}
                      </div>
                      {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-100 mt-auto">
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center gap-3'} px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors`}
                title={sidebarCollapsed ? "Sign Out" : ""}
              >
                <LogOut className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">Sign Out</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-gray-100 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-gray-900">
                      {userProfile?.full_name || user?.email?.split('@')[0]}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-medium rounded-full">
                        Verified Member
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
                  { id: 'applications', label: 'Applications', icon: <FileText className="w-5 h-5" />, path: '/dashboard/applications' },
                  { id: 'saved', label: 'Saved Properties', icon: <Heart className="w-5 h-5" />, path: '/dashboard/saved' },
                  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" />, path: '/dashboard' },
                  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/dashboard' },
                  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, path: '/dashboard/profile' },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                      ${activeSection === item.id 
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-100' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeSection === item.id ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  handleSignOut();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} pt-16 lg:pt-0`}>
          <div className="hidden lg:block bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-gray-900">
                  {activeSection === 'overview' && 'Dashboard'}
                  {activeSection === 'applications' && 'Applications'}
                  {activeSection === 'saved' && 'Saved Properties'}
                  {activeSection === 'payments' && 'Payments'}
                  {activeSection === 'notifications' && 'Notifications'}
                  {activeSection === 'profile' && 'Profile'}
                  {activeSection === 'settings' && 'Settings'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeSection === 'overview' && 'Your journey to exceptional living continues here.'}
                  {activeSection === 'applications' && 'Manage your property applications'}
                  {activeSection === 'saved' && 'Your collection of luxury residences'}
                  {activeSection === 'payments' && 'Your payment history and transactions'}
                  {activeSection === 'notifications' && 'Your recent updates and alerts'}
                  {activeSection === 'profile' && 'Manage your personal information'}
                  {activeSection === 'settings' && 'Manage your account settings and preferences'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/properties')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Application
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-8">
            <div className="lg:hidden mb-8">
              <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-gray-900">
                  {activeSection === 'overview' && 'Dashboard'}
                  {activeSection === 'applications' && 'Applications'}
                  {activeSection === 'saved' && 'Saved Properties'}
                  {activeSection === 'payments' && 'Payments'}
                  {activeSection === 'notifications' && 'Notifications'}
                  {activeSection === 'profile' && 'Profile'}
                  {activeSection === 'settings' && 'Settings'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeSection === 'overview' && 'Your journey to exceptional living continues here.'}
                  {activeSection === 'applications' && 'Manage your property applications'}
                  {activeSection === 'saved' && 'Your collection of luxury residences'}
                  {activeSection === 'payments' && 'Your payment history and transactions'}
                  {activeSection === 'notifications' && 'Your recent updates and alerts'}
                  {activeSection === 'profile' && 'Manage your personal information'}
                  {activeSection === 'settings' && 'Manage your account settings and preferences'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/properties')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Application
                </button>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
