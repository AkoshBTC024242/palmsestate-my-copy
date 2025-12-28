import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, User, ChevronDown, Grid, Home, 
  Building2, Info, Phone, LogOut, Menu, X, 
  FileText, Key, Shield, Bell, MessageSquare,
  Settings, Heart, Bookmark, HelpCircle, LogIn, 
  UserPlus, MapPin, Star, LayoutDashboard, Settings as SettingsIcon,
  Shield as ShieldIcon
} from 'lucide-react';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();

  // Handle scroll effect for header background
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
      if (mobileMenuOpen && mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('button[data-menu-button]')) {
        closeMobileMenu();
      }
      if (desktopMenuOpen && desktopMenuRef.current && 
          !desktopMenuRef.current.contains(event.target) && 
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
  }, [mobileMenuOpen, desktopMenuOpen]);

  // Mobile menu scroll management - NO AUTO-SCROLL
  useEffect(() => {
    if (mobileMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      closeMobileMenu();
      setDesktopMenuOpen(false);
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

  // Get the actual admin status from AuthContext
  const adminStatus = isAdmin;

  // Loading state
  if (authLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container-fluid">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 48 48" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="md:w-10 md:h-10"
                >
                  <path d="M24 38L20 28C17 24, 22 22, 24 16C26 22, 31 24, 28 28L24 38Z" fill="#f97316" fillOpacity="0.9"/>
                  <path d="M24 16C22 19, 21 22, 20 25C19 28, 18 31, 20 28L24 38L28 28C29 31, 28 28, 27 25C26 22, 25 19, 24 16Z" fill="#ea580c"/>
                  <path d="M24 8C14 12, 8 16, 5 25C2 22, 0 18, 24 8Z" fill="#22c55e"/>
                  <path d="M24 8C34 12, 40 16, 43 25C46 22, 48 18, 24 8Z" fill="#16a34a"/>
                  <path d="M24 5C10 10, 2 14, 0 24C-2 20, -4 16, 24 5Z" fill="#22c55e"/>
                  <path d="M24 5C38 10, 46 14, 48 24C50 20, 52 16, 24 5Z" fill="#16a34a"/>
                  <circle cx="24" cy="22" r="3" fill="#c2410c"/>
                </svg>
              </div>
              
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight font-serif">
                  Palms<span className="text-amber-600">Estate</span>
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wider">
                  EXCLUSIVE RESIDENCES
                </p>
              </div>
            </Link>
            
            <div className="md:hidden w-12 h-12"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm' : 'bg-white'
    }`}>
      <div className="container-fluid">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => {
              closeMobileMenu();
              setDesktopMenuOpen(false);
            }}
          >
            <div className="flex items-center justify-center">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="md:w-10 md:h-10"
              >
                <path d="M24 38L20 28C17 24, 22 22, 24 16C26 22, 31 24, 28 28L24 38Z" fill="#f97316" fillOpacity="0.9"/>
                <path d="M24 16C22 19, 21 22, 20 25C19 28, 18 31, 20 28L24 38L28 28C29 31, 28 28, 27 25C26 22, 25 19, 24 16Z" fill="#ea580c"/>
                <path d="M24 8C14 12, 8 16, 5 25C2 22, 0 18, 24 8Z" fill="#22c55e"/>
                <path d="M24 8C34 12, 40 16, 43 25C46 22, 48 18, 24 8Z" fill="#16a34a"/>
                <path d="M24 5C10 10, 2 14, 0 24C-2 20, -4 16, 24 5Z" fill="#22c55e"/>
                <path d="M24 5C38 10, 46 14, 48 24C50 20, 52 16, 24 5Z" fill="#16a34a"/>
                <circle cx="24" cy="22" r="3" fill="#c2410c"/>
              </svg>
            </div>
            
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight font-serif">
                Palms<span className="text-amber-600">Estate</span>
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
                className={`flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-none transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-700 hover:text-amber-600 hover:border-b-2 hover:border-amber-200'
                }`}
              >
                {item.icon}
                <span className="font-serif">{item.name}</span>
              </Link>
            ))}
            
            {/* Desktop User Menu */}
            <div className="relative" ref={desktopMenuRef}>
              <button
                data-desktop-menu
                onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-none border border-gray-200 bg-white hover:bg-gray-50 transition-colors ml-2"
              >
                {user ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-sm">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.email?.split('@')[0] || 'Account'}
                      </p>
                      <p className="text-xs text-gray-500">{adminStatus ? 'Admin' : 'Premium'}</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${desktopMenuOpen ? 'rotate-180' : ''}`} />
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-sm">
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
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl py-3 z-50 animate-fade-in">
                  {/* User Header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user ? user.email : 'Welcome to PalmsEstate'}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          adminStatus 
                            ? 'bg-blue-100 text-blue-800' 
                            : user 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {adminStatus ? 'Administrator' : user ? 'Premium Member' : 'Guest'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2 max-h-96 overflow-y-auto">
                    <div className="px-5 py-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
                    </div>
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setDesktopMenuOpen(false)}
                        className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-amber-50 transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 group-hover/item:bg-amber-100 group-hover/item:text-amber-600 transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                    
                    {/* Dashboard & Admin Links (Only for logged in users) */}
                    {user && (
                      <>
                        <div className="px-5 py-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                        </div>
                        
                        {/* Dashboard Link */}
                        <Link
                          to="/dashboard"
                          onClick={() => {
                            setDesktopMenuOpen(false);
                            navigate('/dashboard');
                          }}
                          className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-amber-50 transition-colors group/item cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 group-hover/item:bg-amber-100 group-hover/item:text-amber-600 transition-colors">
                            <LayoutDashboard size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Dashboard</p>
                            <p className="text-sm text-gray-500">Your property applications & saved properties</p>
                          </div>
                        </Link>
                        
                        {/* Admin Panel Link (Only for admins) */}
                        {adminStatus && (
                          <Link
                            to="/admin"
                            onClick={() => {
                              setDesktopMenuOpen(false);
                              navigate('/admin');
                            }}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors group/item cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-gray-100 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
                              <ShieldIcon size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Admin Panel</p>
                              <p className="text-sm text-gray-500">Manage properties, users, and applications</p>
                            </div>
                          </Link>
                        )}
                        
                        {/* Settings Link - Goes to dashboard for now */}
                        <Link
                          to="/dashboard"
                          onClick={() => {
                            setDesktopMenuOpen(false);
                            navigate('/dashboard');
                          }}
                          className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-amber-50 transition-colors group/item cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 group-hover/item:bg-amber-100 group-hover/item:text-amber-600 transition-colors">
                            <SettingsIcon size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Settings</p>
                            <p className="text-sm text-gray-500">Manage your account preferences</p>
                          </div>
                        </Link>
                      </>
                    )}
                    
                    {/* Auth Buttons */}
                    {!user && (
                      <div className="px-5 py-4 space-y-3">
                        <Link
                          to="/signin"
                          onClick={() => {
                            setDesktopMenuOpen(false);
                            navigate('/signin');
                          }}
                          className="block w-full text-center bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-3 px-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => {
                            setDesktopMenuOpen(false);
                            navigate('/signup');
                          }}
                          className="block w-full text-center border-2 border-amber-500 text-amber-600 font-semibold py-3 px-6 hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                    
                    {user && (
                      <button
                        onClick={() => {
                          handleSignOut();
                          setDesktopMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-5 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-red-100 text-red-600">
                          <LogOut size={18} />
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            data-menu-button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative flex items-center justify-center w-12 h-12 rounded-none bg-transparent text-gray-700 hover:text-amber-600 transition-colors"
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

      {/* Mobile Menu - Full Screen Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-[9999] transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        ref={mobileMenuRef}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
        />
        
        {/* Menu Panel - Slides from right */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 48 48" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 38L20 28C17 24, 22 22, 24 16C26 22, 31 24, 28 28L24 38Z" fill="#ffffff" fillOpacity="0.9"/>
                  <path d="M24 16C22 19, 21 22, 20 25C19 28, 18 31, 20 28L24 38L28 28C29 31, 28 28, 27 25C26 22, 25 19, 24 16Z" fill="#ffffff"/>
                  <path d="M24 8C14 12, 8 16, 5 25C2 22, 0 18, 24 8Z" fill="#ffffff" fillOpacity="0.8"/>
                  <path d="M24 8C34 12, 40 16, 43 25C46 22, 48 18, 24 8Z" fill="#ffffff" fillOpacity="0.8"/>
                  <circle cx="24" cy="22" r="3" fill="#ffffff"/>
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900">
                  {user ? user.email?.split('@')[0] : 'Welcome'}
                </h2>
                <p className="text-sm text-gray-600">
                  {user ? (adminStatus ? 'Administrator' : 'Premium Member') : 'Guest'}
                </p>
              </div>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="overflow-y-auto h-[calc(100vh-120px)] py-6">
            <div className="space-y-1 px-4">
              {navItems.map((item, index) => (
                <div key={item.path} className="mb-2">
                  <Link
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-4 px-4 py-5 rounded-lg transition-all duration-200 cursor-pointer ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-600'
                        : 'hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50'
                    }`}
                  >
                    <div className={`p-3 rounded-lg transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-gray-100 text-gray-700 group-hover:bg-amber-100 group-hover:text-amber-700'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        location.pathname === item.path ? 'text-amber-700' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <ChevronDown size={18} className={`transform -rotate-90 ${
                      location.pathname === item.path ? 'text-amber-500' : 'text-gray-400'
                    }`} />
                  </Link>
                  
                  {index < navItems.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4"></div>
                  )}
                </div>
              ))}
              
              {/* Spacer */}
              <div className="my-8">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
              </div>

              {/* Dashboard & Admin Links (Only for logged in users) */}
              {user && (
                <>
                  <div className="mb-4 px-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</p>
                    
                    {/* Dashboard Link */}
                    <Link
                      to="/dashboard"
                      onClick={() => {
                        closeMobileMenu();
                        navigate('/dashboard');
                      }}
                      className="flex items-center space-x-4 px-4 py-5 rounded-lg hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200 mb-3 cursor-pointer"
                    >
                      <div className="p-3 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                        <LayoutDashboard size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Dashboard</p>
                        <p className="text-sm text-gray-500">Your property applications & saved properties</p>
                      </div>
                      <ChevronDown size={18} className="transform -rotate-90 text-gray-400" />
                    </Link>
                    
                    {/* Admin Panel Link (Only for admins) */}
                    {adminStatus && (
                      <Link
                        to="/admin"
                        onClick={() => {
                          closeMobileMenu();
                          navigate('/admin');
                        }}
                        className="flex items-center space-x-4 px-4 py-5 rounded-lg hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-50/30 transition-all duration-200 mb-3 cursor-pointer"
                      >
                        <div className="p-3 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <ShieldIcon size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Admin Panel</p>
                          <p className="text-sm text-gray-500">Manage properties, users, and applications</p>
                        </div>
                        <ChevronDown size={18} className="transform -rotate-90 text-gray-400" />
                      </Link>
                    )}
                    
                    {/* Settings Link */}
                    <Link
                      to="/dashboard"
                      onClick={() => {
                        closeMobileMenu();
                        navigate('/dashboard');
                      }}
                      className="flex items-center space-x-4 px-4 py-5 rounded-lg hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="p-3 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                        <SettingsIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Settings</p>
                        <p className="text-sm text-gray-500">Manage your account preferences</p>
                      </div>
                      <ChevronDown size={18} className="transform -rotate-90 text-gray-400" />
                    </Link>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4 my-6"></div>
                </>
              )}

              {/* Auth Section */}
              {!user ? (
                <div className="space-y-4 px-4">
                  <Link
                    to="/signin"
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/signin');
                    }}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <Key size={20} />
                    <span>Sign In</span>
                  </Link>
                  
                  <Link
                    to="/signup"
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/signup');
                    }}
                    className="flex items-center justify-center gap-3 border-2 border-amber-500 text-amber-600 font-semibold py-4 px-6 rounded-lg hover:bg-amber-50 transition-all duration-300 cursor-pointer"
                  >
                    <UserPlus size={20} />
                    <span>Create Account</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 px-4">
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMobileMenu();
                    }}
                    className="flex items-center space-x-4 w-full px-4 py-5 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-3 rounded-lg bg-red-100 text-red-600">
                      <LogOut size={20} />
                    </div>
                    <span className="font-semibold">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Palms Estate
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Premium Luxury Rentals Worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
