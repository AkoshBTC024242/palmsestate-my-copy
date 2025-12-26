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
  Settings, Heart, Bookmark, HelpCircle,
  LogIn, UserPlus
} from 'lucide-react';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('main');
  const mobileMenuRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Mobile menu
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('button[data-menu-button]')) {
        setMobileMenuOpen(false);
        setActivePanel('main');
      }
      // Desktop menu
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target) && 
          !event.target.closest('button[data-desktop-menu]')) {
        setDesktopMenuOpen(false);
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
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      setActivePanel('main');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setMobileMenuOpen(false);
      setDesktopMenuOpen(false);
      setActivePanel('main');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} />, desc: 'Back to homepage' },
    { name: 'Properties', path: '/properties', icon: <Building2 size={20} />, desc: 'Browse luxury properties' },
    { name: 'About', path: '/about', icon: <Info size={20} />, desc: 'Learn about us' },
    { name: 'Contact', path: '/contact', icon: <Phone size={20} />, desc: 'Get in touch' },
  ];

  // Check if user is admin
  const isAdmin = user?.email?.includes('admin') || user?.user_metadata?.role === 'admin';

  // User menu items
  const userMenuItems = user ? [
    { name: 'Dashboard', path: '/dashboard', icon: <Grid size={20} />, desc: 'Manage your account' },
    { name: 'Applications', path: '/dashboard/applications', icon: <FileText size={20} />, desc: 'View your status' },
    { name: 'Favorites', path: '/dashboard/favorites', icon: <Heart size={20} />, desc: 'Saved properties' },
    { name: 'Messages', path: '/dashboard/messages', icon: <MessageSquare size={20} />, desc: 'Contact support' },
    { name: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={20} />, desc: 'Updates & alerts', badge: 3 },
  ] : [];

  // Admin menu items
  const adminMenuItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: <Shield size={20} />, desc: 'Manage properties', color: 'from-blue-500 to-indigo-500' },
    { name: 'Test Applications', path: '/admin/test', icon: <Eye size={20} />, desc: 'Test user flow', color: 'from-purple-500 to-pink-500' },
    { name: 'Analytics', path: '/admin/analytics', icon: <Users size={20} />, desc: 'View insights', color: 'from-green-500 to-emerald-500' },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} />, desc: 'Configure system', color: 'from-gray-600 to-gray-700' },
  ];

  // Quick actions for menu
  const quickActions = [
    { name: 'Search', icon: <Search size={18} />, action: () => navigate('/properties?search=true') },
    { name: 'Help', icon: <HelpCircle size={18} />, action: () => navigate('/contact') },
    { name: 'Bookmarks', icon: <Bookmark size={18} />, action: () => navigate(user ? '/dashboard/favorites' : '/signin') },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100/50 shadow-lg' : 'bg-white'
    }`}>
      <div className="container-fluid">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group touch-manipulation"
            onClick={() => {
              setMobileMenuOpen(false);
              setDesktopMenuOpen(false);
            }}
          >
            {/* Simple Orange Palm Tree */}
            <div className="flex items-center justify-center">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="md:w-10 md:h-10"
              >
                <path d="M24 38L20 28C17 24, 22 22, 24 16C26 22, 31 24, 28 28L24 38Z" fill="#f97316" fill-opacity="0.9"/>
                <path d="M24 16C22 19, 21 22, 20 25C19 28, 18 31, 20 28L24 38L28 28C29 31, 28 28, 27 25C26 22, 25 19, 24 16Z" fill="#ea580c"/>
                <path d="M24 8C14 12, 8 16, 5 25C2 22, 0 18, 24 8Z" fill="#22c55e"/>
                <path d="M24 8C34 12, 40 16, 43 25C46 22, 48 18, 24 8Z" fill="#16a34a"/>
                <path d="M24 5C10 10, 2 14, 0 24C-2 20, -4 16, 24 5Z" fill="#22c55e"/>
                <path d="M24 5C38 10, 46 14, 48 24C50 20, 52 16, 24 5Z" fill="#16a34a"/>
                <circle cx="24" cy="22" r="3" fill="#c2410c"/>
              </svg>
            </div>
            
            {/* Company Name */}
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
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
            
            {/* Desktop User Menu Button */}
            <div className="relative" ref={desktopMenuRef}>
              <button
                data-desktop-menu
                onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors touch-manipulation ml-2"
                aria-label="User menu"
              >
                {user ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center shadow-sm">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.email?.split('@')[0] || 'Account'}
                      </p>
                      <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Premium'}</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${desktopMenuOpen ? 'rotate-180' : ''}`} />
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center shadow-sm">
                      <LogIn size={16} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Account</p>
                      <p className="text-xs text-gray-500">Sign in</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${desktopMenuOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>

              {/* Desktop Menu Dropdown */}
              {desktopMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl py-3 z-50 animate-fade-in overflow-hidden">
                  {/* User Header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-primary-50/50 to-orange-50/50 border-b border-gray-200/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                        <svg 
                          width="32" 
                          height="32" 
                          viewBox="0 0 48 48" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M24 38L20 28C17 24, 22 22, 24 16C26 22, 31 24, 28 28L24 38Z" fill="#f97316" fill-opacity="0.9"/>
                          <path d="M24 16C22 19, 21 22, 20 25C19 28, 18 31, 20 28L24 38L28 28C29 31, 28 28, 27 25C26 22, 25 19, 24 16Z" fill="#ea580c"/>
                          <path d="M24 8C14 12, 8 16, 5 25C2 22, 0 18, 24 8Z" fill="#22c55e"/>
                          <path d="M24 8C34 12, 40 16, 43 25C46 22, 48 18, 24 8Z" fill="#16a34a"/>
                          <path d="M24 5C10 10, 2 14, 0 24C-2 20, -4 16, 24 5Z" fill="#22c55e"/>
                          <path d="M24 5C38 10, 46 14, 48 24C50 20, 52 16, 24 5Z" fill="#16a34a"/>
                          <circle cx="24" cy="22" r="3" fill="#c2410c"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user ? user.email : 'Welcome to PalmsEstate'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isAdmin 
                              ? 'bg-blue-100 text-blue-800' 
                              : user 
                              ? 'bg-primary-100 text-primary-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isAdmin ? 'Administrator' : user ? 'Premium Member' : 'Guest'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2 max-h-96 overflow-y-auto">
                    {/* Navigation Links */}
                    <div className="px-5 py-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
                    </div>
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setDesktopMenuOpen(false)}
                        className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gray-50/80 transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 group-hover/item:bg-primary-100 transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                      </Link>
                    ))}

                    {/* User Links (if logged in) */}
                    {user && userMenuItems.length > 0 && (
                      <>
                        <div className="px-5 py-2 mt-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Account</p>
                        </div>
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setDesktopMenuOpen(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gray-50/80 transition-colors group/item"
                          >
                            <div className="p-2 rounded-lg bg-gray-100 group-hover/item:bg-primary-100 transition-colors">
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{item.name}</p>
                                {item.badge && (
                                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}

                    {/* Admin Section */}
                    {isAdmin && adminMenuItems.length > 0 && (
                      <>
                        <div className="px-5 py-2 mt-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Tools</p>
                        </div>
                        {adminMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setDesktopMenuOpen(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-blue-50/50 transition-colors group/item"
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white`}>
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}

                    {/* Auth Buttons (if not logged in) */}
                    {!user && (
                      <div className="px-5 py-4 space-y-3">
                        <Link
                          to="/signin"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="block w-full text-center bg-gradient-to-r from-primary-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="block w-full text-center border-2 border-primary-500 text-primary-600 font-semibold py-3 px-6 rounded-xl hover:bg-primary-50 transition-colors"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t border-gray-200/50 pt-3 px-5 pb-3">
                    {user ? (
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors rounded-xl"
                      >
                        <div className="p-2 rounded-lg bg-red-100 text-red-600">
                          <LogOut size={18} />
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    ) : (
                      <div className="text-xs text-gray-500 text-center">
                        PalmsEstate Luxury Rentals
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button - CLEAN: Just shows menu icon */}
          <button
            data-menu-button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-orange-400 text-white shadow-md hover:shadow-lg transition-all duration-300 touch-manipulation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X size={24} className="transform transition-transform duration-300" />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - CLEAN MINIMAL DESIGN */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Container - Clean Design */}
          <div 
            ref={mobileMenuRef}
            className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-100/50 overflow-hidden flex flex-col"
            style={{ 
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Menu Header - SIMPLE: Just Menu title and close button */}
            <div className="pt-6 px-5 pb-4 border-b border-gray-100/50 bg-white/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                {/* Menu Title - BIGGER and CLEAN */}
                <h3 className="text-2xl font-bold text-gray-900">Menu</h3>
                
                {/* Close Button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors touch-manipulation"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Navigation Items - Scrollable Area */}
            <div className="flex-1 overflow-y-auto py-4">
              {/* For NON-LOGGED Users: Simple Public Navigation */}
              {!user && (
                <div className="space-y-1 px-4">
                  {/* Main Navigation Links */}
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-xl mb-1 transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-primary-50 to-orange-50 text-primary-700 border-l-4 border-primary-500'
                          : 'text-gray-700 hover:bg-gray-50/80'
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        location.pathname === item.path ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </Link>
                  ))}

                  {/* Spacer */}
                  <div className="my-6 border-t border-gray-100/50"></div>

                  {/* Auth Section */}
                  <div className="space-y-4 px-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</h4>
                    
                    {/* Sign In Button */}
                    <Link
                      to="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Key size={20} />
                      <span className="text-lg">Sign In</span>
                    </Link>
                    
                    {/* Create Account Button */}
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 border-2 border-primary-500 text-primary-600 font-semibold py-4 px-6 rounded-xl hover:bg-primary-50 transition-all duration-300"
                    >
                      <UserPlus size={20} />
                      <span className="text-lg">Create Account</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* For LOGGED IN Users: Show User Menu */}
              {user && (
                <div className="space-y-1 px-4">
                  {/* User Info - Minimal */}
                  <div className="px-4 py-4 mb-4 rounded-xl bg-gradient-to-r from-primary-50/50 to-orange-50/30 border border-primary-100/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center shadow-sm">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user.email}</p>
                        <p className="text-sm text-gray-500">{isAdmin ? 'Administrator' : 'Premium Member'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Navigation Links */}
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-xl mb-1 transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-primary-50 to-orange-50 text-primary-700 border-l-4 border-primary-500'
                          : 'text-gray-700 hover:bg-gray-50/80'
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        location.pathname === item.path ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </Link>
                  ))}

                  {/* Spacer */}
                  <div className="my-4 border-t border-gray-100/50"></div>

                  {/* User Dashboard Link */}
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-4 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-orange-500 text-white mb-2"
                  >
                    <div className="p-3 rounded-lg bg-white/20">
                      <Grid size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">Dashboard</p>
                      <p className="text-sm text-white/80">Manage your account</p>
                    </div>
                  </Link>

                  {/* Admin Panel Link (if admin) */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-4 px-4 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white mb-2"
                    >
                      <div className="p-3 rounded-lg bg-white/20">
                        <Shield size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">Admin Panel</p>
                        <p className="text-sm text-white/80">Manage properties</p>
                      </div>
                    </Link>
                  )}

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-4 w-full px-4 py-4 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors mt-4"
                  >
                    <div className="p-3 rounded-lg bg-red-100 text-red-600">
                      <LogOut size={20} />
                    </div>
                    <span className="font-semibold text-lg">Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom - SIMPLE: Just copyright/help */}
            <div className="border-t border-gray-100/50 bg-white/80 p-4">
              <div className="flex items-center justify-center">
                <button 
                  onClick={() => {
                    navigate('/contact');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <HelpCircle size={16} />
                  <span>Help & Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
