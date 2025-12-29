import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    'Luxury Rentals',
    'Property Management',
    'Investment Advisory',
    'Corporate Housing'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-fluid py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-8">
              {/* Luxury Branding */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-luxury-orange to-amber-600 flex items-center justify-center rounded-lg">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 48 48" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 38L20 28C17 24, 22 22, 24 16C26 22, 31 24, 28 28L24 38Z" fill="white" fillOpacity="0.9"/>
                    <path d="M24 16C22 19, 21 22, 20 25C19 28, 18 31, 20 28L24 38L28 28C29 31, 28 28, 27 25C26 22, 25 19, 24 16Z" fill="white"/>
                    <path d="M24 8C14 12, 8 16, 5 25C2 22, 0 18, 24 8Z" fill="white" fillOpacity="0.8"/>
                    <path d="M24 8C34 12, 40 16, 43 25C46 22, 48 18, 24 8Z" fill="white" fillOpacity="0.8"/>
                  </svg>
                </div>
              </div>
              
              <div>
                <h3 className="font-serif text-2xl font-light mb-3">
                  Palms<span className="text-luxury-orange">Estate</span>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                  Premier luxury real estate with exclusive properties and unparalleled service worldwide.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-luxury-orange hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Our Concierge</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-white pb-3 border-b border-gray-800">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center justify-between text-gray-300 hover:text-white transition-colors duration-200 group py-2"
                  >
                    <span className="text-sm">{link.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-white pb-3 border-b border-gray-800">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-luxury-orange mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Phone</p>
                  <a 
                    href="tel:+18286239765" 
                    className="text-gray-300 hover:text-luxury-orange transition-colors text-sm block"
                  >
                    +1 (828) 623-9765
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-luxury-orange mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <a 
                    href="mailto:admin@palmsestate.org" 
                    className="text-gray-300 hover:text-luxury-orange transition-colors text-sm block"
                  >
                    concierge@palmsestate.org
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-luxury-orange mt=1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Location</p>
                  <p className="text-gray-300 text-sm">Monte Carlo, Monaco</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6 border-t border-gray-800">
        <div className="container-fluid">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left: Copyright & Housing Logo */}
            <div className="flex items-center gap-4">
              {/* Equal Housing Opportunity Logo */}
              <div 
                className="group relative cursor-help" 
                title="Equal Housing Opportunity Provider"
              >
                <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 32 32" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-300 group-hover:text-luxury-orange transition-colors duration-200"
                  >
                    <path 
                      d="M16 6L6 12V26H26V12L16 6Z" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <line 
                      x1="11" 
                      y1="18" 
                      x2="21" 
                      y2="18" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line 
                      x1="11" 
                      y1="22" 
                      x2="21" 
                      y2="22" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <rect 
                      x="13" 
                      y="18" 
                      width="6" 
                      height="8" 
                      rx="1" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1"
                    />
                  </svg>
                  <span className="text-xs text-gray-400 group-hover:text-luxury-orange transition-colors duration-200 hidden md:block">
                    Equal Housing
                  </span>
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © {currentYear} Palms Estate. All rights reserved.
                </p>
              </div>
            </div>
            
            {/* Right: Legal Links */}
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-luxury-orange text-xs transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-luxury-orange text-xs transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                to="/disclaimer" 
                className="text-gray-400 hover:text-luxury-orange text-xs transition-colors duration-200"
              >
                Legal Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
