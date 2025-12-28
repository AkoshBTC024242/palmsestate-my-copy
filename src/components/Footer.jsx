import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Shield, Lock, CheckCircle,
  Send, ArrowRight, Globe, Home, Building2, 
  Info, Users, Award, CreditCard, Sparkles
} from 'lucide-react';
import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribed with:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Our Team', path: '/team' },
    { name: 'Testimonials', path: '/testimonials' },
  ];

  const services = [
    'Luxury Rentals',
    'Property Management',
    'Real Estate Advisory',
    'Investment Properties',
    'Vacation Homes',
    'Corporate Housing'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-fluid py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start space-x-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 48 48" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 38L20 28C17 24, 22 22, 24 16C26 22, 31 24, 28 28L24 38Z" fill="#ffffff" fillOpacity="0.9"/>
                  <path d="M24 16C22 19, 21 22, 20 25C19 28, 18 31, 20 28L24 38L28 28C29 31, 28 28, 27 25C26 22, 25 19, 24 16Z" fill="#ffffff"/>
                  <path d="M24 8C14 12, 8 16, 5 25C2 22, 0 18, 24 8Z" fill="#ffffff" fillOpacity="0.8"/>
                  <path d="M24 8C34 12, 40 16, 43 25C46 22, 48 18, 24 8Z" fill="#ffffff" fillOpacity="0.8"/>
                  <circle cx="24" cy="22" r="3" fill="#ffffff"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-2">Palms<span className="text-amber-400">Estate</span></h3>
                <p className="text-gray-300 mb-6 leading-relaxed max-w-lg">
                  Experience unparalleled luxury living through our curated portfolio of premium residences across the world's most exclusive destinations.
                </p>
                
                {/* Real Estate Verified Badge - UPDATED: Removed green badge */}
                <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Licensed Real Estate Agency</p>
                    <p className="text-sm text-gray-400">Fully Accredited & Verified</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Button */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-3 px-8 rounded-none hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-8 text-white pb-4 border-b border-gray-800">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center justify-between text-gray-300 hover:text-amber-300 transition-colors group py-2"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Services */}
            <h4 className="font-serif text-xl font-bold mt-10 mb-6 text-white pb-4 border-b border-gray-800">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-gray-400 hover:text-amber-300 transition-colors cursor-pointer text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Subscribe */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-8 text-white pb-4 border-b border-gray-800">Stay Connected</h4>
            
            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+18286239765" className="text-gray-300 hover:text-amber-300 transition-colors block">
                    +1 (828) 623-9765
                  </a>
                  <p className="text-sm text-gray-400">Available 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:admin@palmsestate.org" className="text-gray-300 hover:text-amber-300 transition-colors block">
                    admin@palmsestate.org
                  </a>
                  <p className="text-sm text-gray-400">Response within 15 minutes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-gray-300">123 Luxury Avenue</p>
                  <p className="text-gray-300">Monte Carlo, Monaco</p>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-6 border-t border-gray-800">
              <h5 className="font-serif font-bold mb-4 text-white">Exclusive Updates</h5>
              <p className="text-gray-300 mb-6 text-sm">
                Subscribe for premier property insights and exclusive listings.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Send size={20} />
                  </button>
                </div>
                
                {subscribed && (
                  <div className="p-3 bg-emerald-900/30 border border-emerald-700 text-emerald-300 text-sm">
                    Thank you for subscribing to our exclusive updates.
                  </div>
                )}
              </form>

              {/* Secure & Verified Section */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <h5 className="font-serif font-bold mb-4 text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Secure & Verified
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-400/20 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">SSL Secure</p>
                      <p className="text-xs text-gray-400">256-bit Encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-400/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">GDPR Compliant</p>
                      <p className="text-xs text-gray-400">Data Protected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-400/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Licensed</p>
                      <p className="text-xs text-gray-400">Real Estate Agency</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-400/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Secure Payments</p>
                      <p className="text-xs text-gray-400">PCI DSS Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Equal Housing Opportunity Logo */}
      <div className="bg-gray-950 py-6 border-t border-gray-800">
        <div className="container-fluid">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left: Copyright and Equal Housing Logo */}
            <div className="flex items-center gap-6">
              {/* Equal Housing Opportunity Logo */}
              <div className="group relative" title="Equal Housing Opportunity">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700">
                  {/* Official Equal Housing Opportunity Logo - House with equal sign */}
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 32 32" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-300 group-hover:text-amber-300 transition-colors"
                  >
                    {/* House outline */}
                    <path 
                      d="M16 6L6 12V26H26V12L16 6Z" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    {/* Equal sign lines inside house */}
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
                    {/* Door for house detail */}
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
                  <span className="text-xs text-gray-300 group-hover:text-amber-300 transition-colors hidden md:block">
                    Equal Housing Opportunity
                  </span>
                </div>
                {/* Tooltip for mobile */}
                <div className="md:hidden absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Equal Housing Opportunity
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Palms Estate. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Premier Luxury Real Estate & Property Management
                </p>
              </div>
            </div>
            
            {/* Right: Language and Legal Links */}
            <div className="flex items-center gap-8">
              {/* Legal Links */}
              <div className="flex items-center space-x-6">
                <Link to="/privacy" className="text-gray-400 hover:text-amber-300 text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-amber-300 text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link to="/disclaimer" className="text-gray-400 hover:text-amber-300 text-sm transition-colors">
                  Legal Disclaimer
                </Link>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <select className="bg-transparent text-gray-300 text-sm focus:outline-none">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
