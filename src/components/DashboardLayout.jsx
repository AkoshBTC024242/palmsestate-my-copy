import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard, FileText, Heart, User, Settings,
  LogOut, Menu, X, Home, Bell, ChevronRight,
  Building2, MessageSquare, HelpCircle, Shield,
  Briefcase, Target, Sparkles, Globe, Users,
  BarChart, Download, Calendar, Clock, Award,
  Star, Compass, Crown, Gem, Key, MapPin,
  Phone, Mail, Copy, Check, DollarSign
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  // All dashboard pages from our frontend
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/dashboard/applications', icon: FileText },
    { name: 'Saved Properties', path: '/dashboard/saved', icon: Heart },
    { name: 'Live Chat', path: '/dashboard/chat', icon: MessageSquare },
    { name: 'Properties', path: '/dashboard/properties', icon: Building2 },
    { name: 'Buyers Guide', path: '/dashboard/buyers', icon: Target },
    { name: 'Sellers Guide', path: '/dashboard/sellers', icon: Briefcase },
    { name: 'Marketing', path: '/dashboard/marketing', icon: BarChart },
    { name: 'Unlock Potential', path: '/dashboard/unlock', icon: Sparkles },
    { name: 'Luxury Experiences', path: '/dashboard/luxury', icon: Crown },
    { name: 'Join Movement', path: '/dashboard/join', icon: Users },
    { name: 'Exclusive Homes', path: '/dashboard/exclusive', icon: Gem },
    { name: 'Strategy Call', path: '/dashboard/strategy', icon: Calendar },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'FAQ', path: '/dashboard/faq', icon: HelpCircle },
  ];

  // Separate admin section
  const adminNavigation = [
    { name: 'Admin Dashboard', path: '/admin', icon: Shield },
    { name: 'Manage Properties', path: '/admin/properties', icon: Building2 },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Payments', path: '/admin/payments', icon: DollarSign },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Subscribe to real-time notifications
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        }, (payload) => {
          handleNewNotification(payload.new);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@palmsestate.org');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          
          <Link to="/dashboard" className="text-xl font-light text-white">
            Palms<span className="text-[#F97316]">Estate</span>
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F97316] text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl z-50">
                <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
                  <h3 className="text-white font-light">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#F97316] hover:text-[#F97316]/80"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-[#27272A] last:border-0 hover:bg-[#0A0A0A] cursor-pointer transition-colors ${
                          !notification.read ? 'bg-[#F97316]/5' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <p className="text-white text-sm mb-1">{notification.message}</p>
                        <p className="text-[#A1A1AA] text-xs">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-[#A1A1AA] text-sm">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-[#0A0A0A] border-r border-[#27272A] overflow-y-auto">
            <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
              <Link to="/dashboard" className="text-xl font-light text-white">
                Palms<span className="text-[#F97316]">Estate</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-[#27272A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user?.email?.split('@')[0]}</p>
                  <p className="text-[#A1A1AA] text-xs">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
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
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}

              {isAdmin && (
                <>
                  <div className="pt-4 mt-4 border-t border-[#27272A]">
                    <p className="px-4 text-xs text-[#A1A1AA] uppercase tracking-wider">Admin</p>
                  </div>
                  {adminNavigation.map((item) => {
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
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </>
              )}

              <div className="pt-4 mt-4 border-t border-[#27272A]">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </nav>

            {/* Support Info */}
            <div className="p-4 border-t border-[#27272A]">
              <p className="text-[#A1A1AA] text-xs mb-3">24/7 Support</p>
              <a href="tel:+18286239765" className="flex items-center gap-2 text-white text-sm mb-2">
                <Phone className="w-4 h-4 text-[#F97316]" />
                +1 (828) 623-9765
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F97316]" />
                <span className="text-white text-sm flex-1">support@palmsestate.org</span>
                <button onClick={handleCopyEmail}>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#A1A1AA]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-[#0A0A0A] border-r border-[#27272A]">
          {/* Logo */}
          <div className="flex items-center h-20 px-6 border-b border-[#27272A]">
            <Link to="/dashboard" className="text-2xl font-light text-white">
              Palms<span className="text-[#F97316]">Estate</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{user?.email?.split('@')[0]}</p>
                <p className="text-[#A1A1AA] text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
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
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className="pt-6 mt-6 border-t border-[#27272A]">
                  <p className="px-4 text-xs text-[#A1A1AA] uppercase tracking-wider">Administration</p>
                </div>
                {adminNavigation.map((item) => {
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
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-[#27272A]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="min-h-screen pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
