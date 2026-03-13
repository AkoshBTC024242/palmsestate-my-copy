import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, User, LogOut, Settings, FileText, 
  Home, Heart, Shield, ChevronDown, Briefcase,
  Users, Target, Sparkles, Crown, Key, Compass,
  Building2, Phone, Mail, ChevronRight, MapPin
} from 'lucide-react';
import PreloadLink from './PreloadLink';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedSections, setMobileExpandedSections] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const userMenuRef = useRef(null);
  const dropdownRef = useRef(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
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

  const toggleMobileSection = (sectionTitle) => {
    setMobileExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const isActive = (path) => location.pathname === path;

  const dropdowns = [
    {
      title: 'Company',
      icon: <Briefcase className="w-4 h-4" />,
      items: [
        { name: 'About Us', path: '/about', icon: <Users className="w-4 h-4" /> },
        { name: 'Careers', path: '/careers', icon: <Briefcase className="w-4 h-4" /> },
        { name: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4" /> },
        { name: 'Strategy Call', path: '/strategy', icon: <Target className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Resources',
      icon: <Compass className="w-4 h-4" />,
      items: [
        { name: 'Buyers', path: '/buyers', icon: <Home className="w-4 h-4" /> },
        { name: 'Sellers', path: '/sellers', icon: <Building2 className="w-4 h-4" /> },
        { name: 'Sell Your Home', path: '/sell', icon: <Key className="w-4 h-4" /> },
        { name: 'Marketing Guide', path: '/marketing', icon: <Target className="w-4 h-4" /> },
        { name: 'FAQ', path: '/faq', icon: <Users className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Palms Movement',
      icon: <Sparkles className="w-4 h-4" />,
      items: [
        { name: 'Unlock Potential', path: '/unlock', icon: <Key className="w-4 h-4" /> },
        { name: 'Data Marketing', path: '/data-marketing', icon: <Target className="w-4 h-4" /> },
        { name: 'Luxury Experiences', path: '/luxury', icon: <Crown className="w-4 h-4" /> },
        { name: 'Join the Movement', path: '/join', icon: <Users className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Properties',
      icon: <Building2 className="w-4 h-4" />,
      items: [
        { name: 'All Properties', path: '/properties', icon: <Home className="w-4 h-4" /> },
        { name: 'Buffalo Listings', path: '/listings', icon: <MapPin className="w-4 h-4" /> },
        { name: 'Exclusive Homes', path: '/exclusive', icon: <Crown className="w-4 h-4" /> },
        { name: 'Services', path: '/services', icon: <Sparkles className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-md border-b border-[#27272A] shadow-2xl' 
          : 'bg-black/80 backdrop-blur-sm border-b border-[#27272A]/50'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left on Desktop, Centered on Mobile */}
          <PreloadLink to="/" className="md:static md:transform-none absolute left-1/2 transform -translate-x-1/2 md:translate-x-0">
            <div className="flex flex-col items-center md:items-start">
              <div className="text-2xl md:text-3xl font-light tracking-tight">
                <span className="text-white font-medium">Palms</span>
                <span className="text-[#F97316] font-light ml-1">Estate</span>
              </div>
              <div className="text-[10px] text-[#A1A1AA] tracking-[0.3em] -mt-1 md:block hidden">
                REALTY
              </div>
            </div>
          </PreloadLink>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:flex items-center flex-1 justify-end">
            {/* Navigation Dropdowns */}
            <div className="flex items-center gap-1" ref={dropdownRef}>
              {dropdowns.map((dropdown) => (
                <div key={dropdown.title} className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === dropdown.title ? null : dropdown.title)}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-light tracking-wide transition-all duration-300 ${
                      activeDropdown === dropdown.title
                        ? 'text-[#F97316]'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {dropdown.icon}
                    {dropdown.title}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      activeDropdown === dropdown.title ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === dropdown.title && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#111111] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden py-2">
                      {dropdown.items.map((item) => (
                        <PreloadLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                            isActive(item.path)
                              ? 'text-[#F97316] bg-[#F97316]/5'
                              : 'text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10'
                          }`}
                        >
                          <span className="text-[#F97316]">{item.icon}</span>
                          {item.name}
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#27272A]" />
                        </PreloadLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* User Section */}
            <div className="ml-4">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-[#111111] border border-[#27272A] rounded-full hover:border-[#F97316]/30 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-[#F97316]" />
                    </div>
                    <span className="text-sm text-white max-w-[100px] truncate">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#A1A1AA] transition-transform duration-300 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#111111] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-[#27272A]">
                        <p className="text-sm font-medium text-white">{user.email}</p>
                        <p className="text-xs text-[#A1A1AA] mt-1">
                          {isAdmin ? 'Administrator' : 'Member'}
                        </p>
                      </div>

                      <div className="p-2">
                        <PreloadLink
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 rounded-lg transition-all"
                        >
                          <Home className="w-4 h-4" />
                          Dashboard
                        </PreloadLink>

                        {isAdmin && (
                          <PreloadLink
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[#F97316] bg-[#F97316]/5 hover:bg-[#F97316]/10 rounded-lg transition-all"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Dashboard
                          </PreloadLink>
                        )}

                        <PreloadLink
                          to="/dashboard/applications"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 rounded-lg transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          Applications
                        </PreloadLink>

                        <PreloadLink
                          to="/dashboard/saved"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 rounded-lg transition-all"
                        >
                          <Heart className="w-4 h-4" />
                          Saved
                        </PreloadLink>

                        <PreloadLink
                          to="/dashboard/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10 rounded-lg transition-all"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </PreloadLink>

                        <div className="border-t border-[#27272A] mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
                <div className="flex items-center gap-3">
                  <PreloadLink
                    to="/signin"
                    className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
                  >
                    Sign In
                  </PreloadLink>
                  <PreloadLink
                    to="/signup"
                    className="px-4 py-2 bg-[#F97316] text-white text-sm font-medium rounded-full hover:bg-[#EA580C] transition-all shadow-lg shadow-orange-500/20"
                  >
                    Get Started
                  </PreloadLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation - Professional Accordion Style */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#27272A] max-h-[80vh] overflow-y-auto">
            <div className="space-y-2 px-2">
              {/* Mobile Accordion Sections */}
              {dropdowns.map((dropdown) => (
                <div key={dropdown.title} className="bg-[#111111] border border-[#27272A] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleMobileSection(dropdown.title)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left transition-colors hover:bg-[#F97316]/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#F97316]">{dropdown.icon}</span>
                      <span className="text-white font-medium">{dropdown.title}</span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#A1A1AA] transition-transform duration-300 ${
                        mobileExpandedSections[dropdown.title] ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {/* Collapsible Content */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      mobileExpandedSections[dropdown.title] 
                        ? 'max-h-96 opacity-100 border-t border-[#27272A]' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="p-2 bg-black/30">
                      {dropdown.items.map((item) => (
                        <PreloadLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                            isActive(item.path)
                              ? 'text-[#F97316] bg-[#F97316]/10'
                              : 'text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/5'
                          }`}
                        >
                          <span className="text-[#F97316]">{item.icon}</span>
                          {item.name}
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#27272A]" />
                        </PreloadLink>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Subtitle - Only shown on mobile */}
              <div className="text-[10px] text-[#A1A1AA] tracking-[0.3em] text-center py-2 md:hidden">
                REALTY
              </div>

              {/* User Section for Mobile */}
              {user ? (
                <div className="mt-4 bg-[#111111] border border-[#27272A] rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#27272A]">
                    <p className="text-sm font-medium text-white">{user.email}</p>
                    <p className="text-xs text-[#A1A1AA] mt-1">
                      {isAdmin ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                  <div className="p-2">
                    <PreloadLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/5 rounded-lg transition-all"
                    >
                      <Home className="w-4 h-4 text-[#F97316]" />
                      Dashboard
                    </PreloadLink>
                    {isAdmin && (
                      <PreloadLink
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[#F97316] bg-[#F97316]/5 hover:bg-[#F97316]/10 rounded-lg transition-all mt-1"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </PreloadLink>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <PreloadLink
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-3 bg-[#111111] border border-[#27272A] text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/5 rounded-xl text-center transition-all"
                  >
                    Sign In
                  </PreloadLink>
                  <PreloadLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-3 bg-[#F97316] text-white rounded-xl hover:bg-[#EA580C] text-center transition-all"
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
