import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, User, LogOut, Settings, FileText, 
  Home, Heart, Shield, ChevronDown 
} from 'lucide-react';
import PreloadLink from './PreloadLink';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#27272A] shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left aligned for professional look */}
          <PreloadLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#F97316]/20 rounded-lg blur-lg group-hover:bg-[#F97316]/30 transition-all"></div>
              <div className="relative w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-light tracking-tight">
                <span className="text-white">Palms</span>
                <span className="text-[#F97316] ml-1">Estate</span>
              </span>
              <span className="text-[10px] text-[#A1A1AA] tracking-wider -mt-1">REAL ESTATE</span>
            </div>
          </PreloadLink>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <PreloadLink
                key={item.name}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-[#F97316] bg-[#F97316]/10'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                }`}
              >
                {item.name}
              </PreloadLink>
            ))}
          </div>

          {/* Right Section - Professional Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg hover:border-[#F97316]/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-md bg-[#F97316]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#F97316]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white">
                      {user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA]">
                      {isAdmin ? 'Administrator' : 'Member'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#A1A1AA] transition-transform duration-300 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Professional Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#18181B] border border-[#27272A] rounded-lg shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-[#27272A] bg-[#0A0A0A]">
                      <p className="text-sm font-medium text-white">{user.email}</p>
                      <p className="text-xs text-[#A1A1AA] mt-1">
                        {isAdmin ? 'Administrator Access' : 'Member Account'}
                      </p>
                    </div>

                    <div className="p-2">
                      <PreloadLink
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 rounded-md transition-all"
                      >
                        <Home className="w-4 h-4" />
                        Dashboard
                      </PreloadLink>

                      {isAdmin && (
                        <PreloadLink
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-[#F97316] bg-[#F97316]/5 hover:bg-[#F97316]/10 rounded-md transition-all border-l-2 border-[#F97316]"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </PreloadLink>
                      )}

                      <PreloadLink
                        to="/dashboard/applications"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 rounded-md transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        Applications
                      </PreloadLink>

                      <PreloadLink
                        to="/dashboard/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 rounded-md transition-all"
                      >
                        <Heart className="w-4 h-4" />
                        Saved Properties
                      </PreloadLink>

                      <PreloadLink
                        to="/dashboard/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 rounded-md transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </PreloadLink>

                      <div className="border-t border-[#27272A] mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <PreloadLink
                  to="/signin"
                  className="px-4 py-2 text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Sign In
                </PreloadLink>
                <PreloadLink
                  to="/signup"
                  className="px-4 py-2 bg-[#F97316] text-white text-sm font-medium rounded-lg hover:bg-[#EA580C] transition-all shadow-lg shadow-orange-500/20"
                >
                  Get Started
                </PreloadLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#18181B] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#27272A] bg-[#0A0A0A]">
            <div className="space-y-1">
              {navigation.map((item) => (
                <PreloadLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-[#F97316] bg-[#F97316]/10'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                  }`}
                >
                  {item.name}
                </PreloadLink>
              ))}

              {user ? (
                <div className="pt-4 mt-4 border-t border-[#27272A]">
                  <div className="px-4 py-2">
                    <p className="text-sm text-white">{user.email}</p>
                    <p className="text-xs text-[#A1A1AA] mt-1">
                      {isAdmin ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                  <PreloadLink
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg"
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </PreloadLink>
                  {isAdmin && (
                    <PreloadLink
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#F97316] bg-[#F97316]/5 hover:bg-[#F97316]/10 rounded-lg border-l-2 border-[#F97316]"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </PreloadLink>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-[#27272A] flex gap-3">
                  <PreloadLink
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg text-center"
                  >
                    Sign In
                  </PreloadLink>
                  <PreloadLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 bg-[#F97316] text-white text-sm font-medium rounded-lg hover:bg-[#EA580C] text-center"
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