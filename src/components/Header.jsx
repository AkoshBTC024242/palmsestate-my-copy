import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogIn, UserPlus, ChevronDown } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const location = useLocation();
  const accountMenuRef = useRef(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsAccountMenuOpen(false);
  }, [location]);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSignOut = () => {
    // Will integrate with Supabase later
    console.log('Sign out clicked');
    setIsAccountMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'backdrop-blur-xl bg-white/20 border-b border-white/30 shadow-2xl shadow-black/10' 
          : 'backdrop-blur-md bg-white/10 border-b border-white/20'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h1 className="relative font-serif text-2xl md:text-3xl font-bold text-amber-600">
                Palms Estate
              </h1>
            </div>
            <span className="hidden md:inline text-xs font-sans font-semibold tracking-widest text-amber-500/70 uppercase">
              Luxury Rentals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-3 font-sans font-medium transition-all duration-300 rounded-full ${
                  isActive(link.path)
                    ? 'text-white bg-gradient-to-r from-amber-600/20 to-orange-500/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></span>
                )}
              </Link>
            ))}

            {/* Account Dropdown Menu */}
            <div className="relative ml-4" ref={accountMenuRef}>
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="group flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-full font-sans font-semibold hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <User size={18} />
                <span>Account</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    isAccountMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Content */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-white/20">
                    <h3 className="font-sans font-semibold text-gray-800">Welcome to Palms Estate</h3>
                    <p className="text-xs text-gray-600 mt-1">Sign in to access your account</p>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      to="/signup"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200 group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors">
                        <UserPlus size={16} className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Sign Up</p>
                        <p className="text-xs text-gray-500">Create new account</p>
                      </div>
                    </Link>

                    <Link
                      to="/signin"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200 group mt-1"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors">
                        <LogIn size={16} className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Sign In</p>
                        <p className="text-xs text-gray-500">Access your account</p>
                      </div>
                    </Link>
                  </div>

                  <div className="p-4 border-t border-white/20 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
                    <p className="text-xs text-gray-600 text-center">
                      Need assistance?{' '}
                      <Link 
                        to="/contact" 
                        className="text-amber-600 hover:text-amber-700 font-medium"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Contact Concierge
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Account button for mobile (no dropdown on mobile - will be in mobile menu) */}
            <Link
              to="/signin"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg"
            >
              <User size={18} />
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="py-4 border-t border-white/20 backdrop-blur-xl bg-white/10 rounded-2xl my-2 shadow-2xl">
              <div className="flex flex-col space-y-1 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-sans font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-amber-600/30 to-orange-500/30 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive(link.path) && (
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    )}
                  </Link>
                ))}

                {/* Mobile Authentication Links */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="px-2 space-y-2">
                    <h3 className="font-sans text-sm font-semibold text-amber-300 mb-2 px-2">Account</h3>
                    
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-500/20 text-white hover:from-amber-600/30 hover:to-orange-500/30 transition-all duration-200"
                    >
                      <UserPlus size={18} />
                      <div>
                        <p className="font-medium">Sign Up</p>
                        <p className="text-xs text-white/70">Create new account</p>
                      </div>
                    </Link>

                    <Link
                      to="/signin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-500/20 text-white hover:from-amber-600/30 hover:to-orange-500/30 transition-all duration-200"
                    >
                      <LogIn size={18} />
                      <div>
                        <p className="font-medium">Sign In</p>
                        <p className="text-xs text-white/70">Access your account</p>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Contact info moved to footer - only show minimal contact */}
                  <div className="mt-4 pt-4 border-t border-white/20 px-4">
                    <p className="text-xs text-white/70">
                      For inquiries, visit{' '}
                      <Link 
                        to="/contact" 
                        className="text-amber-300 hover:text-amber-200 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Contact page
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;