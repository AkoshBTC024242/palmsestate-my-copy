import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Building2, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'FAQ', path: '/faq' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: 'https://twitter.com', color: 'hover:bg-sky-500' },
    { icon: Instagram, href: 'https://instagram.com', color: 'hover:bg-pink-600' },
    { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:bg-blue-700' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Stay Updated
              </h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for the latest properties and exclusive deals.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Palms Estate
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner in finding the perfect property. We offer premium real estate solutions tailored to your needs.
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-200 ${social.color} hover:text-white`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm">123 Real Estate Ave</p>
                  <p className="text-sm">Lagos, Nigeria</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-orange-500" />
                </div>
                <a href="tel:+2348012345678" className="text-sm hover:text-orange-500 transition-colors">
                  +234 801 234 5678
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-orange-500" />
                </div>
                <a href="mailto:info@palmsestate.org" className="text-sm hover:text-orange-500 transition-colors">
                  info@palmsestate.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Palms Estate. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-orange-500 fill-current" /> by Palms Estate Team
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500"></div>
    </footer>
  );
}
