import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, Youtube, Map } from 'lucide-react';
// Import your logo
import logo from '../assets/logo.svg'; // Adjust path as needed

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
      title: 'Resources',
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

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1AouKZ1mDp/', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'X / Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Map, href: '#', label: 'Location' },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-[#27272A]">
      {/* Thin orange separator */}
      <div className="h-px bg-[#F97316] w-full opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top row with logo and social */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          {/* Logo with company name - Left side */}
          <Link to="/" className="flex items-center gap-4 group mb-4 md:mb-0">
            <img 
              src={logo} 
              alt="Palms Estate" 
              className="h-12 w-auto md:h-14"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-light tracking-tight">
                <span className="text-white">Palms</span>
                <span className="text-[#F97316] ml-1">Estate</span>
              </span>
              <span className="text-xs text-[#A1A1AA] tracking-wider">REAL ESTATE · SINCE 2010</span>
            </div>
          </Link>

          {/* Social icons */}
          <div className="flex gap-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-lg bg-[#18181B] border border-[#27272A] hover:border-[#F97316] hover:bg-[#F97316]/10 flex items-center justify-center text-[#A1A1AA] hover:text-[#F97316] transition-all duration-300"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-t border-[#27272A]">
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      to={link.path}
                      className="text-[#A1A1AA] hover:text-[#F97316] text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                <MapPin className="w-4 h-4 text-[#F97316] mt-0.5 flex-shrink-0" />
                <span>42 Delaware Avenue<br />Buffalo, NY 14202</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#A1A1AA] hover:text-[#F97316] transition-colors">
                <Phone className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                <a href="tel:+17165550178">(716) 555-0178</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#A1A1AA] hover:text-[#F97316] transition-colors">
                <Mail className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                <a href="mailto:info@palmsestate.com">info@palmsestate.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#27272A] text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">♿</span>
              <span>Accessibility</span>
            </div>
            <div className="w-px h-4 bg-[#27272A]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#F97316]">🏠</span>
              <span>Equal Housing Opportunity</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/disclaimer" className="text-[#F97316] hover:text-[#F97316]/80 transition-colors">
              Disclaimer
            </Link>
            <span>© {currentYear} Palms Estate. All rights reserved.</span>
          </div>
        </div>

        {/* REALTOR® Disclaimer */}
        <div className="mt-8 text-[10px] text-[#A1A1AA] leading-relaxed border-t border-[#27272A] pt-6">
          <p>
            <span className="text-[#F97316] font-semibold">REALTOR®</span> is a registered trademark of the National Association of REALTORS® and identifies real estate professionals who are members of NAR and/or the quality of services they provide. Inspired by palmsestate.org branding: focus on unlocking potential, data-driven marketing, luxury experiences, and the Palm Movement.
          </p>
        </div>
      </div>
    </footer>
  );
}
