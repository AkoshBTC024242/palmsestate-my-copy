import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, User, Bell, ChevronDown, Grid, 
  Home, Building2, Info, Phone, LogOut,
  Menu, X, Calendar, FileText, Key,
  Shield, Settings // Added for future admin features
} from 'lucide-react';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label*="menu"]')) {
        setMobileMenuOpen(false);
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
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Properties', path: '/properties', icon: <Building2 size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
  ];

  // Check if user is admin (you'll implement this later in AuthContext)
  const isAdmin = user?.email?.includes('admin') || user?.user_metadata?.role === 'admin';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg' : 'bg-white'
    }`}>
      {/* UPDATED: Using container-fluid for better mobile spacing */}
      <div className="container-fluid">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Professional Design */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group touch-manipulation"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary-600 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-bold text-lg md:text-xl">P</span>
              </div>
            </div>
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
                className={`flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-xl transition-all duration-200 luxury-hover ${
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search - Desktop Only */}
            <button 
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors touch-manipulation"
              aria-label="Search properties"
            >
              <Search size={20} />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 px-3 md:px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors touch-manipulation"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center shadow-sm">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {user.email?.split('@')[0] || 'Account'}
                      </p>
                      <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Premium'}</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900 truncate">{user.email}</p>
                        <p className="text-sm text-gray-500">{isAdmin ? 'Administrator' : 'Premium Member'}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors luxury-hover"
                        >
                          <Grid size={18} className="text-gray-500" />
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-sm text-gray-500">Manage your account</p>
                          </div>
                        </Link>
                        
                        <Link
                          to="/dashboard/applications"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors luxury-hover"
                        >
                          <FileText size={18} className="text-gray-500" />
                          <div>
                            <p className="font-medium">Applications</p>
                            <p className="text-sm text-gray-500">View your status</p>
                          </div>
                        </Link>

                        {/* Admin Link - Only show for admins */}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-primary-700 hover:bg-primary-50 transition-colors luxury-hover border-t border-gray-100 mt-2 pt-2"
                          >
                            <Shield size={18} className="text-primary-600" />
                            <div>
                              <p className="font-medium">Admin Panel</p>
                              <p className="text-sm text-primary-500">Manage properties & applications</p>
                            </div>
                          </Link>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors luxury-hover"
                        >
                          <LogOut size={18} className="text-gray-500" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-orange-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 touch-manipulation"
                  >
                    <Key size={18} />
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - IMPROVED */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors touch-manipulation"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* NEW: Improved Mobile Menu with slide-in animation */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Menu Panel - Slides in from right */}
        <div className={`absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-orange-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">PalmsEstate</h1>
                <p className="text-xs text-gray-500 font-medium">Mobile Menu</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              aria-label="Close menu"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          {/* Menu Items - Scrollable area */}
          <div className="p-4 overflow-y-auto h-[calc(100vh-120px)]">
            <div className="space-y-2 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Navigation</p>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-primary-50 to-orange-50 text-primary-700 border-l-4 border-primary-500 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    location.pathname === item.path ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            
            {/* Mobile User Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {user ? (
                <>
                  <div className="px-4 mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center shadow-md">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 truncate">{user.email}</p>
                        <p className="text-sm text-gray-500">{isAdmin ? 'Administrator' : 'Premium Member'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-4 px-4 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-orange-500 text-white shadow-md"
                    >
                      <Grid size={20} />
                      <span className="font-semibold">Dashboard</span>
                    </Link>

                    {/* Admin Link - Mobile */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-4 px-4 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md"
                      >
                        <Shield size={20} />
                        <span className="font-semibold">Admin Panel</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-4 w-full px-4 py-4 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors border border-gray-200"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-4 bg-gradient-to-r from-primary-600 to-orange-500 text-white rounded-xl font-semibold shadow-md"
                  >
                    <Key size={20} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-4 border-2 border-primary-500 text-primary-600 rounded-xl font-semibold"
                  >
                    Create Premium Account
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Stats - Mobile Only */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Access</p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/properties?filter=featured"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-lg text-center hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">Featured</p>
                </Link>
                <Link
                  to="/properties?filter=luxury"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-lg text-center hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">Luxury</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
