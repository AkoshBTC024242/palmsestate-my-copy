import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Instagram, Linkedin, 
  Mail, Phone, MapPin, Globe,
  Shield, CreditCard, Home, Users
} from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">PE</span>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold">Palms Estate</h2>
                <p className="text-sm text-gray-400 font-sans">Premier Luxury Rentals</p>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-sm">
              Redefining luxury living with unparalleled service, exclusive properties, and exceptional experiences worldwide.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-300">SSL Secured Payments</span>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-300">Verified Properties</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 pb-2 border-b border-gray-800">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/properties" className="flex items-center text-gray-400 hover:text-amber-400 transition-colors">
                  <Home className="w-4 h-4 mr-3" />
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-amber-400 transition-colors">
                  <Users className="w-4 h-4 mr-3" />
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center text-gray-400 hover:text-amber-400 transition-colors">
                  <span className="w-4 h-4 mr-3 flex items-center justify-center">ℹ️</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center text-gray-400 hover:text-amber-400 transition-colors">
                  <Mail className="w-4 h-4 mr-3" />
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 pb-2 border-b border-gray-800">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mt-1 mr-3 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">24/7 Concierge</p>
                  <p className="text-gray-300 font-medium">+1 (828) 623-9765</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mt-1 mr-3 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-gray-300 font-medium">admin@palmsestate.org</p>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mt-1 mr-3 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Global Headquarters</p>
                  <p className="text-gray-300 font-medium">Worldwide Service</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 pb-2 border-b border-gray-800">Connect With Us</h3>
            
            {/* Social Media */}
            <div className="mb-8">
              <p className="text-gray-400 mb-4">Follow our luxury portfolio</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Website Badge */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-5 h-5 text-amber-500" />
                <span className="text-xs text-gray-400">Verified</span>
              </div>
              <p className="text-sm text-gray-300">palmsestate.org</p>
              <p className="text-xs text-gray-400 mt-1">Official Luxury Platform</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Palms Estate. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/faq" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
              FAQ
            </Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Seals */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-amber-500">🏆</div>
              <p className="text-xs text-gray-400">Luxury Certified</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-amber-500">🔒</div>
              <p className="text-xs text-gray-400">Secure Application</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-amber-500">⭐</div>
              <p className="text-xs text-gray-400">5-Star Service</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-amber-500">🌍</div>
              <p className="text-xs text-gray-400">Global Portfolio</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;