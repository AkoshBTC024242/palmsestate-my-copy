import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  // Layout & Navigation
  LayoutDashboard, Menu, X, Home, Bell, ChevronRight,
  LogOut, Settings, User, HelpCircle, Shield,
  
  // Property Icons
  Building2, FileText, Heart, Target, Briefcase,
  
  // Communication Icons
  MessageSquare, Headphones, Mail, Phone, Copy, Check,
  
  // Financial Icons
  DollarSign, CreditCard, Receipt, TrendingUp,
  
  // Resource Icons
  BookOpen, GraduationCap, Award, Star,
  
  // Brand Icons
  Sparkles, Crown, Gem, Calendar, Users, Globe,
  
  // Document Icons
  File, Download, Upload, FolderOpen,
  
  // Analytics Icons
  BarChart, PieChart, Activity, Clock,
  
  // Utility Icons
  Search, Filter, Plus, MoreVertical, CheckCircle,
  AlertCircle, XCircle, Info, ExternalLink,
  
  // Social Icons
  Facebook, Twitter, Instagram, Linkedin, Youtube
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  // Organized navigation by category
  const navigation = [
    {
      category: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      category: 'Property Management',
      items: [
        { name: 'Properties', path: '/dashboard/properties', icon: Building2 },
        { name: 'Applications', path: '/dashboard/applications', icon: FileText },
        { name: 'Saved Properties', path: '/dashboard/saved', icon: Heart },
        { name: 'Documents', path: '/dashboard/documents', icon: FolderOpen },
      ]
    },
    {
      category: 'Financial',
      items: [
        { name: 'Payments', path: '/dashboard/payments', icon: DollarSign },
        { name: 'Invoices', path: '/dashboard/invoices', icon: Receipt },
        { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart },
      ]
    },
    {
      category: 'Communication',
      items: [
        { name: 'Live Chat', path: '/dashboard/chat', icon: MessageSquare },
        { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
        { name: 'Support Tickets', path: '/dashboard/support', icon: Headphones },
      ]
    },
    {
      category: 'Resources',
      items: [
        { name: 'Buyers Guide', path: '/dashboard/buyers-guide', icon: Target },
        { name: 'Sellers Guide', path: '/dashboard/sellers-guide', icon: Briefcase },
        { name: 'FAQ', path: '/dashboard/faq', icon: HelpCircle },
        { name: 'Blog', path: '/dashboard/blog', icon: BookOpen },
      ]
    },
    {
      category: 'Palms Experience',
      items: [
        { name: 'Movement', path: '/dashboard/movement', icon: Sparkles },
        { name: 'Luxury Experiences', path: '/dashboard/luxury', icon: Crown },
        { name: 'Exclusive Homes', path: '/dashboard/exclusive', icon: Gem },
        { name: 'Strategy Call', path: '/dashboard/strategy', icon: Calendar },
        { name: 'Join Community', path: '/dashboard/join', icon: Users },
      ]
    },
    {
      category: 'Account',
      items: [
        { name: 'Profile', path: '/dashboard/profile', icon: User },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  // Admin navigation
  const adminNavigation = [
    {
      category: 'Administration',
      items: [
        { name: 'Admin Dashboard', path: '/admin', icon: Shield },
        { name: 'Manage Properties', path: '/admin/properties', icon: Building2 },
        { name: 'Applications', path: '/admin/applications', icon: FileText },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Payments', path: '/admin/payments', icon: DollarSign },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
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

  const filteredNavigation = navigation.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

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

            {/* Search Bar */}
            <div className="p-4 border-b border-[#27272A]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
                />
              </div>
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
            <nav className="p-4 space-y-6">
              {filteredNavigation.map((category) => (
                <div key={category.category}>
                  <h3 className="px-4 text-xs font-light text-[#A1A1AA] uppercase tracking-wider mb-2">
                    {category.category}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                            isActive(item.path)
                              ? 'bg-[#F97316]/10 text-[#F97316]'
                              : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm">{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-[#F97316] text-white px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {isAdmin && (
                <>
                  <div className="pt-4 border-t border-[#27272A]" />
                  {adminNavigation.map((category) => (
                    <div key={category.category}>
                      <h3 className="px-4 text-xs font-light text-[#A1A1AA] uppercase tracking-wider mb-2">
                        {category.category}
                      </h3>
                      <div className="space-y-1">
                        {category.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                                isActive(item.path)
                                  ? 'bg-[#F97316]/10 text-[#F97316]'
                                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-sm">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="pt-4 border-t border-[#27272A]">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </nav>

            {/* Support Info */}
            <div className="p-4 border-t border-[#27272A]">
              <p className="text-[#A1A1AA] text-xs mb-3">24/7 Concierge</p>
              <a href="tel:+18286239765" className="flex items-center gap-2 text-white text-sm mb-2 hover:text-[#F97316] transition-colors">
                <Phone className="w-4 h-4 text-[#F97316]" />
                +1 (828) 623-9765
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F97316]" />
                <span className="text-white text-sm flex-1">support@palmsestate.org</span>
                <button 
                  onClick={handleCopyEmail}
                  className="p-1 hover:bg-[#18181B] rounded transition-colors"
                >
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-[#0A0A0A] border-r border-[#27272A]">
          {/* Logo & Search */}
          <div className="flex-shrink-0 p-6 border-b border-[#27272A]">
            <Link to="/dashboard" className="text-2xl font-light text-white mb-4 block">
              Palms<span className="text-[#F97316]">Estate</span>
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-shrink-0 p-6 border-b border-[#27272A]">
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

          {/* Navigation - Scrollable */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-6">
              {filteredNavigation.map((category) => (
                <div key={category.category}>
                  <h3 className="px-4 text-xs font-light text-[#A1A1AA] uppercase tracking-wider mb-2">
                    {category.category}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                            isActive(item.path)
                              ? 'bg-[#F97316]/10 text-[#F97316]'
                              : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm">{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-[#F97316] text-white px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                          {isActive(item.path) && (
                            <ChevronRight className="w-4 h-4 ml-auto text-[#F97316]" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {isAdmin && (
                <>
                  <div className="pt-4 border-t border-[#27272A]" />
                  {adminNavigation.map((category) => (
                    <div key={category.category}>
                      <h3 className="px-4 text-xs font-light text-[#A1A1AA] uppercase tracking-wider mb-2">
                        {category.category}
                      </h3>
                      <div className="space-y-1">
                        {category.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                                isActive(item.path)
                                  ? 'bg-[#F97316]/10 text-[#F97316]'
                                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-sm">{item.name}</span>
                              {isActive(item.path) && (
                                <ChevronRight className="w-4 h-4 ml-auto text-[#F97316]" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </nav>

          {/* Sign Out & Support */}
          <div className="flex-shrink-0 p-4 border-t border-[#27272A] space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sign Out</span>
            </button>

            <div className="pt-2">
              <p className="text-[#A1A1AA] text-xs mb-2">24/7 Concierge</p>
              <a href="tel:+18286239765" className="flex items-center gap-2 text-white text-sm mb-2 hover:text-[#F97316] transition-colors">
                <Phone className="w-4 h-4 text-[#F97316]" />
                +1 (828) 623-9765
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F97316]" />
                <span className="text-white text-sm flex-1">support@palmsestate.org</span>
                <button 
                  onClick={handleCopyEmail}
                  className="p-1 hover:bg-[#18181B] rounded transition-colors"
                >
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
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        <main className="min-h-screen pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
