import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Instagram, Linkedin, 
  Mail, Phone, MapPin, Globe,
  Shield, CreditCard, Building2, Users,
  FileText, HelpCircle
} from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold">PE</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Palms Estate</h2>
                <p className="text-sm text-gray-600">Premium Luxury Rentals</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Providing exclusive access to the world's most prestigious residences with unparalleled service and discretion.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <a href="tel:+18286239765" className="text-gray-700 hover:text-primary-600 transition-colors">
                  +1 (828) 623-9765
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <a href="mailto:admin@palmsestate.org" className="text-gray-700 hover:text-primary-600 transition-colors">
                  admin@palmsestate.org
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-700">palmsestate.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Properties</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/properties" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Browse All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=villa" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?type=penthouse" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Penthouses
                </Link>
              </li>
              <li>
                <Link to="/properties?type=estate" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Estates
                </Link>
              </li>
              <li>
                <Link to="/properties?type=chalet" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Chalets
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services/concierge" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Concierge Services
                </Link>
              </li>
              <li>
                <Link to="/services/property-management" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Property Management
                </Link>
              </li>
              <li>
                <Link to="/services/tour-scheduling" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Tour Scheduling
                </Link>
              </li>
              <li>
                <Link to="/services/application-process" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Application Process
                </Link>
              </li>
              <li>
                <Link to="/services/relocation" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Relocation Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <HelpCircle className="w-4 h-4 inline mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Newsletter */}
            <div className="flex-1 max-w-md">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email for updates"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-r-lg hover:bg-primary-700 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Subscribe to receive updates on new properties and exclusive offers.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} Palms Estate. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              Luxury Property ID: PE-{currentYear}-001
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;