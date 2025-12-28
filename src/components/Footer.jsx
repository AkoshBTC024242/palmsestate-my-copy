import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, 
  Linkedin, Shield, Lock, CreditCard, Send, ArrowRight,
  Globe, Home, Building2, Info, Users, Award
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
    { name: 'Home', path: '/', icon: <Home size={16} /> },
    { name: 'Properties', path: '/properties', icon: <Building2 size={16} /> },
    { name: 'About Us', path: '/about', icon: <Info size={16} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={16} /> },
    { name: 'Our Team', path: '/team', icon: <Users size={16} /> },
    { name: 'Testimonials', path: '/testimonials', icon: <Award size={16} /> },
  ];

  const destinations = [
    'Monaco', 'New York', 'Dubai', 'London', 'Paris', 'Tokyo',
    'Miami', 'Los Angeles', 'Sydney', 'Singapore', 'Zurich', 'Hong Kong'
  ];

  const securityBadges = [
    { name: 'SSL Secure', icon: <Lock size={20} />, color: 'text-green-600' },
    { name: 'GDPR Compliant', icon: <Shield size={20} />, color: 'text-blue-600' },
    { name: 'Verified', icon: <CreditCard size={20} />, color: 'text-amber-600' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-fluid py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
                <svg 
                  width="24" 
                  height="24" 
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
              <div>
                <h3 className="font-serif text-2xl font-bold">Palms<span className="text-amber-400">Estate</span></h3>
                <p className="text-sm text-gray-300">Exclusive Residences Worldwide</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience unparalleled luxury living through our curated portfolio of premium residences across the globe.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: <Facebook size={20} />, label: 'Facebook' },
                { icon: <Twitter size={20} />, label: 'Twitter' },
                { icon: <Instagram size={20} />, label: 'Instagram' },
                { icon: <Linkedin size={20} />, label: 'LinkedIn' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-amber-600 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center space-x-3 text-gray-300 hover:text-amber-300 transition-colors group"
                  >
                    <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-amber-400 mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-400">24/7 Support</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-amber-400 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300">info@palmsestate.org</p>
                  <p className="text-sm text-gray-400">Response within 15 minutes</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-1" />
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-gray-300">123 Luxury Avenue</p>
                  <p className="text-gray-300">Monte Carlo, Monaco</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-white">Stay Updated</h4>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter for exclusive property listings and luxury insights.
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
                  className="absolute right-0 top-0 h-full px-6 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <Send size={20} />
                </button>
              </div>
              
              {subscribed && (
                <div className="p-3 bg-green-900/30 border border-green-700 text-green-300 text-sm">
                  Thank you for subscribing!
                </div>
              )}
              
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our Privacy Policy. We never spam.
              </p>
            </form>

            {/* Security Badges */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <h5 className="text-sm font-semibold mb-4 text-gray-300">Secure & Verified</h5>
              <div className="flex flex-wrap gap-4">
                {securityBadges.map((badge) => (
                  <div key={badge.name} className="flex items-center space-x-2">
                    <div className={`${badge.color}`}>
                      {badge.icon}
                    </div>
                    <span className="text-xs text-gray-400">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Destinations */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <h4 className="font-serif text-xl font-bold mb-8 text-center text-white">Global Destinations</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {destinations.map((destination) => (
              <span
                key={destination}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-none hover:bg-amber-600 hover:text-white transition-all duration-300 cursor-pointer"
              >
                {destination}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="container-fluid">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Palms Estate. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Premium Luxury Rentals Worldwide
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <Globe className="w-4 h-4 text-gray-400" />
              <select className="bg-transparent text-gray-300 text-sm focus:outline-none">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
              
              <div className="flex items-center space-x-4">
                <Link to="/privacy" className="text-gray-400 hover:text-amber-300 text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-amber-300 text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-amber-300 text-sm transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
