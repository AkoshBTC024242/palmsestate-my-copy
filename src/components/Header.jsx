import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, FileText, Home as HomeIcon, Heart, Shield } from 'lucide-react';
import PreloadLink from './PreloadLink';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setShowUserMenu(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <PreloadLink to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                Palms Estate
              </div>
              <div className="text-xs text-gray-500">Premium Rentals</div>
            </div>
          </PreloadLink>

          {/* Desktop Navigation with PreloadLink */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <PreloadLink
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.name}
              </PreloadLink>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
                      <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {isAdmin ? '🔐 Administrator' : '👤 Member'}
                      </p>
                    </div>

                    <div className="py-2">
                      <PreloadLink
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <HomeIcon className="w-4 h-4 mr-3" />
                        Dashboard
                      </PreloadLink>

                      {isAdmin && (
                        <PreloadLink
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-3 text-sm font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors border-l-4 border-orange-500"
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Dashboard
                        </PreloadLink>
                      )}

                      <PreloadLink
                        to="/dashboard/applications"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        My Applications
                      </PreloadLink>

                      <PreloadLink
                        to="/dashboard/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        Saved Properties
                      </PreloadLink>

                      <PreloadLink
                        to="/dashboard/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </PreloadLink>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <PreloadLink
                  to="/signin"
                  className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </PreloadLink>
                <PreloadLink
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </PreloadLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              {navigation.map((item) => (
                <PreloadLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {item.name}
                </PreloadLink>
              ))}

              {user ? (
                <>
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                      {user.email}
                    </div>

                    <PreloadLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded-lg"
                    >
                      <HomeIcon className="w-4 h-4 mr-3" />
                      Dashboard
                    </PreloadLink>

                    {isAdmin && (
                      <PreloadLink
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-sm font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors rounded-lg border-l-4 border-orange-500"
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Dashboard
                      </PreloadLink>
                    )}

                    <PreloadLink
                      to="/dashboard/applications"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded-lg"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      My Applications
                    </PreloadLink>

                    <PreloadLink
                      to="/dashboard/saved"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded-lg"
                    >
                      <Heart className="w-4 h-4 mr-3" />
                      Saved Properties
                    </PreloadLink>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mt-2"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                  <PreloadLink
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded-lg"
                  >
                    Sign In
                  </PreloadLink>
                  <PreloadLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-lg text-center"
                  >
                    Get Started
                  </PreloadLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
