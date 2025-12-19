import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, User, ChevronDown, 
  Home, Building, Info, Mail, LogOut
} from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [applicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Handle scroll effect
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
    setUserMenuOpen(false);
    setApplicationMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Properties', path: '/properties', icon: <Building size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg border-b border-gray-100' 
        : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">PE</span>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
                Palms Estate
              </h1>
              <p className="text-xs text-gray-500 font-sans tracking-wider uppercase">
                Premier Luxury Rentals
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-5 py-3 font-sans font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50/50'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            {/* User Menu */}
            <div className="relative ml-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Applications Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setApplicationMenuOpen(!applicationMenuOpen)}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 rounded-lg font-sans font-medium hover:bg-amber-100 transition-colors"
                    >
                      <span>Applications</span>
                      <ChevronDown size={16} className={`transition-transform ${applicationMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {applicationMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <h4 className="font-sans font-semibold text-gray-800">Your Applications</h4>
                          <p className="text-xs text-gray-500">Track your rental requests</p>
                        </div>
                        <ApplicationStatus />
                        <div className="px-4 py-3 border-t border-gray-100">
                          <Link
                            to="/dashboard"
                            className="block text-center text-amber-600 hover:text-amber-700 font-medium text-sm"
                            onClick={() => setApplicationMenuOpen(false)}
                          >
                            View All in Dashboard →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-5 py-2.5 rounded-lg font-sans font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <User size={18} />
                      <span>Account</span>
                      <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-sans font-semibold text-gray-800">{user.email}</p>
                          <p className="text-xs text-gray-500">Premium Member</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                          >
                            <User size={18} />
                            <span>Dashboard</span>
                          </Link>
                          
                          <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/signin"
                    className="px-5 py-2.5 text-gray-700 font-sans font-medium hover:text-amber-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-2.5 rounded-lg font-sans font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 text-white"
              >
                <User size={20} />
              </button>
            ) : (
              <Link
                to="/signin"
                className="px-4 py-2 text-amber-600 font-sans font-medium"
              >
                Sign In
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-700"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 py-4 my-2">
              <div className="flex flex-col space-y-1 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-sans font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}

                {/* Mobile User Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {user ? (
                    <>
                      <div className="px-4 mb-4">
                        <p className="font-sans font-semibold text-gray-800">{user.email}</p>
                        <p className="text-sm text-gray-500">Premium Member</p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-amber-50 text-amber-700 font-medium"
                      >
                        <User size={18} />
                        <span>Dashboard</span>
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-semibold mt-2"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
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