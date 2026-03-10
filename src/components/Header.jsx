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
          ? 'bg-black shadow-2xl border-b border-gray-800'
          : 'bg-black/95 backdrop-blur-sm border-b border-gray-800'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left spacer for centering logo */}
          <div className="w-32 md:w-48 lg:w-64"></div>

          {/* Logo - Centered */}
          <PreloadLink to="/" className="flex items-center space-x-3 group absolute left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                <span className="text-white">P</span>
                <span className="text-orange-500" style={{ color: '#FF6600' }}>alm</span>
                <span className="text-white"> Estates</span>
              </div>
              <div className="text-xs text-gray-400">Redefining Sophisticated Living</div>
            </div>
          </PreloadLink>

          {/* Desktop Navigation - Hidden on desktop, we'll use right side for actions */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Navigation moved to right side with user actions */}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Desktop Navigation Links */}
            <div className="flex items-center space-x-1 mr-4">
              {navigation.map((item) => (
                <PreloadLink
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-orange-500 bg-orange-500/10 border border-orange-500/20'
                      : 'text-gray-300 hover:text-orange-500 hover:bg-orange-500/5'
                  }`}
                >
                  {item.name}
                </PreloadLink>
              ))}
            </div>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                  style={{ background: 'linear-gradient(135deg, #FF6600, #FF4500)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu - Dark theme */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900">
                      <p className="text-sm font-semibold text-white">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {isAdmin ? '🔐 Administrator' : '👤 Member'}
                      </p>
                    </div>

                    <div className="py-2">
                      <PreloadLink
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                      >
                        <HomeIcon className="w-4 h-4 mr-3 text-orange-500" />
                        Dashboard
                      </PreloadLink>

                      {isAdmin && (
                        <PreloadLink
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-3 text-sm font-semibold text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 transition-colors border-l-4 border-orange-500"
                        >
                          <Shield className="w-4 h-4 mr-3 text-orange-500" />
                          Admin Dashboard
                        </PreloadLink>
                      )}

                      <PreloadLink
                        to="/dashboard/applications"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-3 text-orange-500" />
                        My Applications
                      </PreloadLink>

                      <PreloadLink
                        to="/dashboard/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-3 text-orange-500" />
                        Saved Properties
                      </PreloadLink>

                      <PreloadLink
                        to="/dashboard/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3 text-orange-500" />
                        Settings
                      </PreloadLink>

                      <div className="border-t border-gray-800 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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
                  className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Sign In
                </PreloadLink>
                <PreloadLink
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                  style={{ background: 'linear-gradient(135deg, #FF6600, #FF4500)' }}
                >
                  Get Started
                </PreloadLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation - Dark theme */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="space-y-1">
              {navigation.map((item) => (
                <PreloadLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-orange-500 bg-orange-500/10 border-l-4 border-orange-500'
                      : 'text-gray-300 hover:text-orange-500 hover:bg-orange-500/5'
                  }`}
                >
                  {item.name}
                </PreloadLink>
              ))}

              {user ? (
                <>
                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400">
                      {user.email}
                    </div>

                    <PreloadLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors rounded-lg"
                    >
                      <HomeIcon className="w-4 h-4 mr-3 text-orange-500" />
                      Dashboard
                    </PreloadLink>

                    {isAdmin && (
                      <PreloadLink
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-sm font-semibold text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 transition-colors rounded-lg border-l-4 border-orange-500"
                      >
                        <Shield className="w-4 h-4 mr-3 text-orange-500" />
                        Admin Dashboard
                      </PreloadLink>
                    )}

                    <PreloadLink
                      to="/dashboard/applications"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors rounded-lg"
                    >
                      <FileText className="w-4 h-4 mr-3 text-orange-500" />
                      My Applications
                    </PreloadLink>

                    <PreloadLink
                      to="/dashboard/saved"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors rounded-lg"
                    >
                      <Heart className="w-4 h-4 mr-3 text-orange-500" />
                      Saved Properties
                    </PreloadLink>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-lg mt-2"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-800 space-y-2">
                  <PreloadLink
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 transition-colors rounded-lg"
                  >
                    Sign In
                  </PreloadLink>
                  <PreloadLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r hover:from-orange-600 hover:to-orange-700 transition-all rounded-lg text-center"
                    style={{ background: 'linear-gradient(135deg, #FF6600, #FF4500)' }}
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