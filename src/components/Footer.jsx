import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, Youtube, Map } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Updated navigation sections for real estate focus
  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about' },
        { name: 'Contact / Collaborate', path: '/contact' },
        { name: 'Careers', path: '/careers' },
      ],
    },
    {
      title: 'Resources / Services',
      links: [
        { name: 'Buyers', path: '/buyers' },
        { name: 'Sellers', path: '/sellers' },
        { name: 'Sell Your Home', path: '/sell' },
        { name: 'Marketing Guide', path: '/marketing' },
      ],
    },
    {
      title: 'Palm Movement',
      links: [
        { name: 'Unlock Potential', path: '/unlock' },
        { name: 'Data-Driven Marketing', path: '/data-marketing' },
        { name: 'Luxury Experiences', path: '/luxury' },
        { name: 'Join the Movement', path: '/join' },
      ],
    },
  ];

  // Updated social links with YouTube and Map/Location
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'X / Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Map, href: '#', label: 'Location' }, // Map pin icon
  ];

  return (
    <footer className="bg-black text-white" style={{ backgroundColor: '#000000' }}>
      {/* Thin horizontal separator near top */}
      <div className="h-px bg-orange-600 w-full" style={{ backgroundColor: '#FF6600', height: '1px' }}></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top row: Logo + REALTOR badge + Social icons */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
          {/* Logo and badge section */}
          <div className="mb-6 lg:mb-0">
            <Link to="/" className="inline-block group">
              <div className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-white">P</span>
                <span className="text-orange-600" style={{ color: '#FF6600' }}>alm</span>
                <span className="text-white"> Estates</span>
              </div>
            </Link>
            
            <div className="text-gray-300 text-sm md:text-base max-w-xl mt-2">
              <span className="text-orange-500" style={{ color: '#FF6600' }}>Redefining Sophisticated Living</span> | Buffalo, NY – Marketing Agency That Sells Homes
            </div>

            {/* REALTOR® house symbol with realistic SVG logo */}
            <div className="flex items-center gap-4 mt-4">
              <svg width="140" height="120" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
                {/* Rectangular block background (orange) */}
                <rect x="40" y="20" width="120" height="100" rx="8" fill="#ff6600" />
                
                {/* Stylized block "R" (white) - geometric Futura-like shape */}
                <g fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold">
                  {/* Vertical left leg */}
                  <rect x="55" y="35" width="20" height="70" />
                  {/* Top horizontal */}
                  <rect x="75" y="35" width="60" height="20" />
                  {/* Middle horizontal */}
                  <rect x="75" y="65" width="50" height="20" />
                  {/* Diagonal leg (bottom right) */}
                  <polygon points="135,85 75,85 135,105" />
                </g>
                
                {/* REALTOR® text below (orange) */}
                <text x="100" y="145" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="bold" fill="#ff6600" textAnchor="middle">
                  REALTOR®
                </text>
              </svg>
            </div>
          </div>

          {/* Social icons row - top right */}
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-11 h-11 rounded-full bg-gray-900 hover:bg-orange-600 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 border border-gray-800"
                style={{ '--tw-hover-bg': '#FF6600' }}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Grid - Three/Four columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          {/* Company column with Buffalo address */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Contact / Collaborate
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Careers
                </Link>
              </li>
            </ul>
            {/* Buffalo address */}
            <div className="mt-4 text-gray-400 text-sm flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Palm Estates<br />Buffalo, New York 14201</span>
            </div>
          </div>

          {/* Resources / Services */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2">Resources / Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/buyers" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Buyers
                </Link>
              </li>
              <li>
                <Link to="/sellers" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Sellers
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Sell Your Home
                </Link>
              </li>
              <li>
                <Link to="/marketing" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Marketing Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Palm Movement */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2">Palm Movement</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/unlock" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Unlock Potential
                </Link>
              </li>
              <li>
                <Link to="/data-marketing" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Data-Driven Marketing
                </Link>
              </li>
              <li>
                <Link to="/luxury" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Luxury Experiences
                </Link>
              </li>
              <li>
                <Link to="/join" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Join the Movement
                </Link>
              </li>
            </ul>
          </div>

          {/* Fourth column - additional Palm Estates info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2">Palm Estates</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/listings" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Buffalo Listings
                </Link>
              </li>
              <li>
                <Link to="/exclusive" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Exclusive Homes
                </Link>
              </li>
              <li>
                <Link to="/strategy" className="text-gray-400 hover:text-orange-500 transition-colors inline-block">
                  Strategy Call
                </Link>
              </li>
            </ul>
            <div className="mt-4 text-orange-500 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>(716) 555-0178</span>
            </div>
          </div>
        </div>

        {/* Bottom row: accessibility left / disclaimer right + Equal Housing Opportunity */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 border-t border-gray-800 mt-4">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            {/* Accessibility icon */}
            <div className="flex items-center gap-2 text-blue-400">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-xl">♿</span>
              </div>
              <span className="text-sm text-gray-400">Accessibility</span>
            </div>
            
            {/* Equal Housing Opportunity logo */}
            <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs">
                <span className="rotate-45 text-lg">🏠</span>
              </div>
              <span className="text-sm text-gray-300">Equal Housing<br />Opportunity</span>
            </div>
          </div>
          
          <Link to="/disclaimer" className="text-orange-500 hover:text-orange-400 font-medium border-b border-orange-500 border-dotted">
            Buffalo Disclaimer
          </Link>
        </div>

        {/* Very bottom: NAR disclaimer */}
        <div className="text-xs text-gray-500 leading-relaxed pt-6 border-t border-gray-800 mt-2">
          <p className="mb-2">
            <strong className="text-orange-500">REALTOR®</strong> is a registered trademark of the National Association of REALTORS® and identifies real estate professionals who are members of NAR and/or the quality of services they provide. Inspired by palmestates.com branding: focus on unlocking potential, data-driven marketing, luxury experiences, and the Palm Movement.
          </p>
          <p>© {currentYear} Palm Estates. All rights reserved. Buffalo, NY</p>
        </div>
      </div>
    </footer>
  );
}
