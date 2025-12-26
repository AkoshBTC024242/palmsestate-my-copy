import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, User, ChevronDown, Grid, 
  Home, Building2, Info, Phone, LogOut,
  Menu, X, FileText, Key,
  Shield, Bell, Calendar,
  Star, Globe, CreditCard, MessageSquare,
  Lock, Eye, Users, CheckCircle,
  Settings, Heart, Bookmark, HelpCircle
} from 'lucide-react';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('main'); // 'main', 'user', 'admin'
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('button[data-menu-button]')) {
        setMobileMenuOpen(false);
        setActivePanel('main');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      setActivePanel('main');
    }
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setMobileMenuOpen(false);
      setActivePanel('main');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={22} />, desc: 'Back to homepage' },
    { name: 'Properties', path: '/properties', icon: <Building2 size={22} />, desc: 'Browse luxury properties' },
    { name: 'About', path: '/about', icon: <Info size={22} />, desc: 'Learn about us' },
    { name: 'Contact', path: '/contact', icon: <Phone size={22} />, desc: 'Get in touch' },
  ];

  // Check if user is admin
  const isAdmin = user?.email?.includes('admin') || user?.user_metadata?.role === 'admin';

  // User menu items
  const userMenuItems = user ? [
    { name: 'Dashboard', path: '/dashboard', icon: <Grid size={22} />, desc: 'Manage your account' },
    { name: 'Applications', path: '/dashboard/applications', icon: <FileText size={22} />, desc: 'View your status' },
    { name: 'Favorites', path: '/dashboard/favorites', icon: <Heart size={22} />, desc: 'Saved properties' },
    { name: 'Messages', path: '/dashboard/messages', icon: <MessageSquare size={22} />, desc: 'Contact support' },
    { name: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={22} />, desc: 'Updates & alerts', badge: 3 },
  ] : [];

  // Admin menu items
  const adminMenuItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: <Shield size={22} />, desc: 'Manage properties', color: 'from-blue-500 to-indigo-500' },
    { name: 'Test Applications', path: '/admin/test', icon: <Eye size={22} />, desc: 'Test user flow', color: 'from-purple-500 to-pink-500' },
    { name: 'Analytics', path: '/admin/analytics', icon: <Users size={22} />, desc: 'View insights', color: 'from-green-500 to-emerald-500' },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={22} />, desc: 'Configure system', color: 'from-gray-600 to-gray-700' },
  ];

  // Quick actions for main panel
  const quickActions = [
    { name: 'Search', icon: <Search size={20} />, action: () => navigate('/properties?search=true') },
    { name: 'Help', icon: <HelpCircle size={20} />, action: () => navigate('/contact') },
    { name: 'Bookmarks', icon: <Bookmark size={20} />, action: () => navigate(user ? '/dashboard/favorites' : '/signin') },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100/50 shadow-lg' : 'bg-white'
    }`}>
      <div className="container-fluid">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - UPDATED WITH PALM TREE */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group touch-manipulation"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
              {/* Palm Tree Logo Container */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                {/* Palm Tree SVG */}
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 48 48" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="md:w-8 md:h-8"
                >
                  {/* Palm Tree Trunk (Orange Brown) */}
                  <path d="M24 30L22 38L26 38L24 30Z" fill="#ea580c" />
                  <path d="M24 16L22 30L26 30L24 16Z" fill="#f97316" />
                  
                  {/* Palm Leaves (Green) */}
                  <path d="M24 10L16 14L18 20L24 10Z" fill="#22c55e" />
                  <path d="M24 10L32 14L30 20L24 10Z" fill="#16a34a" />
                  <path d="M24 8L14 12L12 18L24 8Z" fill="#22c55e" />
                  <path d="M24 8L34 12L36 18L24 8Z" fill="#16a34a" />
                  <path d="M24 6L12 10L10 16L24 6Z" fill="#22c55e" />
                  <path d="M24 6L36 10L38 16L24 6Z" fill="#16a34a" />
                  
                  {/* Coconut (Dark Orange) */}
                  <circle cx="24" cy="20" r="2" fill="#c2410c" />
                  <circle cx="23" cy="19" r="0.5" fill="#fef3c7" />
                  
                  {/* Subtle Shadow */}
                  <circle cx="25" cy="25" r="22" fill="black" fill-opacity="0.05" />
                </svg>
              </div>
              
              {/* Optional: Badge for premium */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-sm hidden md:block"></div>
            </div>
            
            {/* Text Logo (Desktop Only) */}
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Palms<span className="text-primary-600">Estate</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider">
                EXCLUSIVE RESIDENCES
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side - Combined Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Desktop: User Menu */}
            {user && (
              <div className="hidden md:block relative">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors touch-manipulation group"
                  aria-label="User dashboard"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.email?.split('@')[0] || 'Account'}
                    </p>
                    <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Premium'}</p>
                  </div>
                </button>
              </div>
            )}

            {/* Mobile Menu Button - Enhanced */}
            <button
              data-menu-button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X size={24} className="transform transition-transform duration-300" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {user ? (
                    <User size={20} />
                  ) : (
                    <Menu size={24} />
                  )}
                  {user && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu - Unified Design */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Container */}
          <div 
            ref={mobileMenuRef}
            className="absolute right-0 top-0 bottom-0 w-[90vw] max-w-sm bg-gradient-to-b from-white/95 via-white/90 to-white/80 backdrop-blur-2xl shadow-2xl border-l border-white/30 overflow-hidden"
            style={{ 
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* User Header Section */}
            <div className="pt-8 px-6 pb-6 bg-gradient-to-r from-primary-500/5 to-orange-400/5 border-b border-white/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl border border-gray-100">
                      <svg 
                        width="32" 
                        height="32" 
                        viewBox="0 0 48 48" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 30L22 38L26 38L24 30Z" fill="#ea580c" />
                        <path d="M24 16L22 30L26 30L24 16Z" fill="#f97316" />
                        <path d="M24 10L16 14L18 20L24 10Z" fill="#22c55e" />
                        <path d="M24 10L32 14L30 20L24 10Z" fill="#16a34a" />
                        <path d="M24 8L14 12L12 18L24 8Z" fill="#22c55e" />
                        <path d="M24 8L34 12L36 18L24 8Z" fill="#16a34a" />
                        <path d="M24 6L12 10L10 16L24 6Z" fill="#22c55e" />
                        <path d="M24 6L36 10L38 16L24 6Z" fill="#16a34a" />
                        <circle cx="24" cy="20" r="2" fill="#c2410c" />
                        <circle cx="23" cy="19" r="0.5" fill="#fef3c7" />
                        <circle cx="25" cy="25" r="22" fill="black" fill-opacity="0.05" />
                      </svg>
                    </div>
                    {user && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {user ? user.email?.split('@')[0] : 'Welcome'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {user ? (isAdmin ? 'Administrator' : 'Premium Member') : 'Guest User'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                  <div className="text-lg font-bold text-primary-600">24</div>
                  <div className="text-xs text-gray-600">Properties</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                  <div className="text-lg font-bold text-primary-600">98%</div>
                  <div className="text-xs text-gray-600">Satisfaction</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                  <div className="text-lg font-bold text-primary-600">15m</div>
                  <div className="text-xs text-gray-600">Response</div>
                </div>
              </div>
            </div>

            {/* Navigation Panels */}
            <div className="h-[calc(100vh-200px)] overflow-y-auto pb-24">
              {/* Panel Switcher */}
              <div className="flex border-b border-white/30 bg-white/30 backdrop-blur-sm">
                <button
                  onClick={() => setActivePanel('main')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${activePanel === 'main' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-600'}`}
                >
                  Menu
                </button>
                {user && (
                  <button
                    onClick={() => setActivePanel('user')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activePanel === 'user' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-600'}`}
                  >
                    Account
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => setActivePanel('admin')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activePanel === 'admin' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
                  >
                    Admin
                  </button>
                )}
              </div>

              {/* Main Panel */}
              {activePanel === 'main' && (
                <div className="p-4 space-y-2">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Navigation</p>
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-2xl mb-2 transition-all duration-200 ${
                          location.pathname === item.path
                            ? 'bg-gradient-to-r from-primary-50 to-orange-50 text-primary-700 border-l-4 border-primary-500 shadow-sm'
                            : 'bg-white/50 hover:bg-white/80 text-gray-700'
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${
                          location.pathname === item.path ? 'bg-primary-100' : 'bg-gray-100'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <ChevronDown size={18} className="text-gray-400 -rotate-90" />
                      </Link>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Quick Actions</p>
                    <div className="grid grid-cols-3 gap-3">
                      {quickActions.map((action) => (
                        <button
                          key={action.name}
                          onClick={() => {
                            action.action();
                            setMobileMenuOpen(false);
                          }}
                          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors touch-manipulation"
                        >
                          <div className="p-3 rounded-xl bg-primary-50 text-primary-600 mb-2">
                            {action.icon}
                          </div>
                          <span className="text-xs font-medium text-gray-700">{action.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auth Buttons */}
                  {!user && (
                    <div className="space-y-3 mt-6">
                      <Link
                        to="/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center bg-gradient-to-r from-primary-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center border-2 border-primary-500 text-primary-600 font-semibold py-4 px-6 rounded-2xl hover:bg-primary-50 transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* User Panel */}
              {activePanel === 'user' && user && (
                <div className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Your Account</p>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-4 px-4 py-4 rounded-2xl mb-2 bg-white/50 hover:bg-white/80 transition-colors"
                    >
                      <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{item.name}</p>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <ChevronDown size={18} className="text-gray-400 -rotate-90" />
                    </Link>
                  ))}
                  
                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-4 w-full px-4 py-4 rounded-2xl bg-white/50 hover:bg-red-50 hover:text-red-700 transition-colors mt-4"
                  >
                    <div className="p-3 rounded-xl bg-red-100 text-red-600">
                      <LogOut size={22} />
                    </div>
                    <span className="font-semibold">Sign Out</span>
                  </button>
                </div>
              )}

              {/* Admin Panel */}
              {activePanel === 'admin' && isAdmin && (
                <div className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Admin Tools</p>
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-4 px-4 py-4 rounded-2xl mb-2 bg-gradient-to-r from-white/50 to-white/30 hover:from-white/70 hover:to-white/50 transition-all duration-300 border border-white/30"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <ChevronDown size={18} className="text-gray-400 -rotate-90" />
                    </Link>
                  ))}
                  
                  {/* Test Mode Quick Action */}
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        <Eye size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-purple-700">Test Mode Active</p>
                        <p className="text-sm text-purple-600">You can test applications without payment</p>
                      </div>
                    </div>
                    <button className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-sm font-semibold">
                      Start Testing
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-xl border-t border-white/30 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {user ? `Logged in as ${user.email}` : 'Guest mode'}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-white/30 transition-colors">
                    <Settings size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/30 transition-colors">
                    <HelpCircle size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
