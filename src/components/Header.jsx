import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
  }, [location]);

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
            
            {/* Call to Action Button */}
            <div className="ml-4 pl-4 border-l border-white/30">
              <a
                href="tel:+18286239765"
                className="group flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-full font-sans font-semibold hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone size={18} />
                <span>+1 (828) 623-9765</span>
              </a>
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-4">
            <a
              href="tel:+18286239765"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg"
            >
              <Phone size={18} />
            </a>
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
                
                {/* Mobile Contact Info */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="px-4">
                    <h3 className="font-sans text-sm font-semibold text-amber-300 mb-2">Contact Our Concierge</h3>
                    <div className="space-y-2">
                      <a
                        href="tel:+18286239765"
                        className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors"
                      >
                        <Phone size={16} />
                        <span>+1 (828) 623-9765</span>
                      </a>
                      <a
                        href="mailto:admin@palmsestate.org"
                        className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>admin@palmsestate.org</span>
                      </a>
                    </div>
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