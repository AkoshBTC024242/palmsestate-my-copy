import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Properties', path: '/properties' },
        { name: 'Contact', path: '/contact' },
        { name: 'Sign Up', path: '/signup' },
      ],
    },
    {
      title: 'For Renters',
      links: [
        { name: 'Browse Rentals', path: '/properties' },
        { name: 'My Applications', path: '/dashboard/applications' },
        { name: 'Saved Properties', path: '/dashboard/saved' },
        { name: 'My Profile', path: '/dashboard/profile' },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { name: 'Sign In', path: '/signin' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Settings', path: '/dashboard/settings' },
        { name: 'Help Center', path: '/contact' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  Palms Estate
                </div>
                <div className="text-sm text-orange-400">Premium Rentals</div>
              </div>
            </Link>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner in finding the perfect rental property. We offer premium rental services with a commitment to excellence and customer satisfaction.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+12345678900" className="flex items-center text-gray-400 hover:text-orange-400 transition-colors">
                <Phone className="w-5 h-5 mr-3 text-orange-500" />
                <span>+1 (234) 567-8900</span>
              </a>
              <a href="mailto:rentals@palmsestate.org" className="flex items-center text-gray-400 hover:text-orange-400 transition-colors">
                <Mail className="w-5 h-5 mr-3 text-orange-500" />
                <span>rentals@palmsestate.org</span>
              </a>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                <span>123 Real Estate Blvd, New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-4 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-orange-400 transition-colors inline-flex items-center group"
                    >
                      <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-12 border-t border-gray-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for the latest rental properties and exclusive deals.
              </p>
            </div>
            <div>
              <form className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center text-gray-400 text-sm">
              <span>© {currentYear} Palms Estate. Made with</span>
              <Heart className="w-4 h-4 mx-1 text-orange-500 fill-current" />
              <span>in New York</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
