import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useDevice();

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Palms Estate</h1>
                <p className="text-xs text-gray-500">Luxury Residences</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
                Home
              </Link>
              <Link to="/properties" className="text-gray-700 hover:text-primary font-medium transition-colors">
                Properties
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors">
                Contact
              </Link>
              <Link 
                to="/login" 
                className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">Palms Estate</h1>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t">
              <div className="px-4 py-3 space-y-3">
                <Link 
                  to="/" 
                  className="block py-2 text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/properties" 
                  className="block py-2 text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Properties
                </Link>
                <Link 
                  to="/about" 
                  className="block py-2 text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  to="/contact" 
                  className="block py-2 text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-3 border-t">
                  <Link 
                    to="/login" 
                    className="block w-full text-center bg-primary text-white py-2 rounded-full font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
                {/* Mobile-specific quick contact */}
                <div className="pt-3 border-t">
                  <a 
                    href="tel:+15551234567" 
                    className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Agent</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className={isMobile ? "h-16" : "h-20"}></div>
    </>
  );
}