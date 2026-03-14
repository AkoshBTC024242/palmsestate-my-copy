import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, FileText, Heart, User, Settings,
  LogOut, Menu, X, Home, Bell, ChevronRight,
  Building2, MessageSquare, HelpCircle, Shield
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/dashboard/applications', icon: FileText },
    { name: 'Saved Properties', path: '/dashboard/saved', icon: Heart },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0A0A0A] border-b border-[#27272A] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-xl font-light text-white">
            Palms<span className="text-[#F97316]">Estate</span>
          </Link>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-[#0A0A0A] border-r border-[#27272A] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="text-xl font-light text-white">
                Palms<span className="text-[#F97316]">Estate</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-[#F97316]/10 text-[#F97316] border-l-2 border-[#F97316]'
                        : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F97316] bg-[#F97316]/10 border-l-2 border-[#F97316] mt-4"
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-[#0A0A0A] border-r border-[#27272A]">
          <div className="flex items-center h-20 px-6 border-b border-[#27272A]">
            <Link to="/" className="text-2xl font-light text-white">
              Palms<span className="text-[#F97316]">Estate</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-[#F97316]/10 text-[#F97316] border-l-2 border-[#F97316]'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F97316] bg-[#F97316]/10 border-l-2 border-[#F97316] mt-4"
              >
                <Shield className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </nav>

          <div className="flex items-center px-6 py-4 border-t border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-white font-medium">{user?.email?.split('@')[0]}</p>
                <p className="text-xs text-[#A1A1AA]">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
