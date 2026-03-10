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

  // Updated social links with custom Facebook URL
  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1AouKZ1mDp/', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'X / Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Map, href: '#', label: 'Location' },
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
              <span className="text-orange-500" style={{ color: '#FF6600' }}>Redefining Sophisticated Living</span> | Buffalo, NY – Marketing Agency That Sells Homes and Rent Homes
            </div>

            {/* REALTOR® official SVG logo */}
            <div className="flex items-center gap-4 mt-4">
              <svg width="140" height="120" viewBox="0 0 192.756 192.756" xmlns="http://www.w3.org/2000/svg">
                <g fillRule="evenodd" clipRule="evenodd">
                  <path fill="#fff" d="M0 0h192.756v192.756H0V0z"/>
                  <path d="M25.387 2.835v141.989h139.841V2.835H25.387zm74.779 17.956l12.859-.004c6.998 0 13.578 2.726 18.527 7.674 4.947 4.948 7.672 11.526 7.672 18.523 0 14.445-11.752 26.197-26.199 26.197l-12.859.015V20.791zm-15.72 104.993H45.501V20.801h38.945v104.983zm15.72.11V76.515l50.348 49.379h-50.348zM44.435 179.999h10.306v-3.691H44.435v-4.902h11.163v-3.691H40.005v21.527H56.1v-3.691H44.435v-5.552zM87.603 167.715h-4.43v21.527h14.735v-3.691H87.603v-17.836zM100.324 171.406h6.526v17.836h4.429v-17.836h6.291v-3.691h-17.246v3.691zM171.01 168.508c-2.277 0-4.113 1.836-4.113 4.092a4.106 4.106 0 0 0 4.113 4.112 4.095 4.095 0 0 0 4.092-4.112 4.091 4.091 0 0 0-4.092-4.092zm0 7.711a3.605 3.605 0 0 1-3.609-3.619 3.6 3.6 0 0 1 3.609-3.598 3.598 3.598 0 0 1 3.598 3.598 3.605 3.605 0 0 1-3.598 3.619zM34.458 186.673c-.03-1.093-.088-3.927-.207-4.813-.236-1.949-1.654-2.48-2.392-2.982 1.447-.856 2.392-1.535 2.923-3.396.531-1.859.088-3.396-.207-4.341-.621-2.332-2.806-3.337-4.961-3.425h-11.96v21.527h4.43v-8.505h5.197c1.536 0 2.599.709 2.658 2.156-.059 1.564-.059 3.277 0 4.341.059.709.236 1.358.591 2.008h4.754v-.797c-.472-.297-.826-.562-.826-1.773zm-6.32-9.627h-6.054v-5.64h5.995c1.979 0 2.687.886 2.687 2.421.267 2.126-1.594 3.219-2.628 3.219zM71.808 167.715h-5.109l-7.5 21.527h4.518l1.506-4.312h7.974l1.477 4.312h4.519l-7.385-21.527zm-5.376 13.524l2.836-8.356 2.864 8.356h-5.7zM137.732 170.048c-1.801-1.86-4.43-2.688-7.176-2.688s-5.375.827-7.176 2.688c-2.008 2.097-3.189 5.345-3.189 8.593s1.182 6.497 3.189 8.594c1.801 1.86 4.43 2.688 7.176 2.688s5.375-.827 7.176-2.688c2.008-2.097 3.189-5.346 3.189-8.594s-1.181-6.496-3.189-8.593zm-3.218 14.557c-1.123 1.034-2.539 1.447-3.957 1.447s-2.836-.413-3.957-1.447c-1.418-1.299-2.127-3.632-2.156-5.965.029-2.333.738-4.666 2.156-5.965 1.121-1.034 2.539-1.447 3.957-1.447s2.834.413 3.957 1.447c1.418 1.299 2.127 3.632 2.156 5.965-.029 2.334-.738 4.667-2.156 5.965zM162.205 186.673c-.029-1.093-.088-3.927-.205-4.813-.236-1.949-1.654-2.48-2.393-2.982 1.447-.856 2.393-1.535 2.924-3.396.531-1.859.088-3.396-.207-4.341-.621-2.332-2.805-3.337-4.961-3.425h-11.961v21.527h4.43v-8.505h5.197c1.537 0 2.6.709 2.658 2.156-.059 1.564-.059 3.277 0 4.341.059.709.236 1.358.59 2.008h4.756v-.797c-.472-.297-.828-.562-.828-1.773zm-6.318-9.627h-6.055v-5.64h5.996c1.979 0 2.688.886 2.688 2.421.265 2.126-1.596 3.219-2.629 3.219z" fill="#000"/>
                  <path d="M173.113 171.525c0-.387-.172-.795-.516-.988-.342-.204-.729-.225-1.115-.225h-1.998v4.585h.559v-2.116h1.031l1.311 2.116h.664l-1.385-2.116c.816-.021 1.449-.353 1.449-1.256zm-2.211.817h-.859v-1.622h1.311c.568 0 1.191.086 1.191.795 0 .934-.998.827-1.643.827z" fill="#000"/>
                </g>
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
            
            {/* Equal Housing Opportunity logo - official SVG */}
            <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
              <svg width="32" height="32" viewBox="0 0 192.756 192.756" xmlns="http://www.w3.org/2000/svg">
                <g fillRule="evenodd" clipRule="evenodd">
                  <path fill="#fff" d="M0 0h192.756v192.756H0V0z"/>
                  <path d="M26.473 148.555h-7.099v2.81h6.52v2.373h-6.52v3.453h7.414v2.375H16.636v-13.378h9.837v2.367zM35.45 155.928l1.342 1.264a3.247 3.247 0 0 1-1.509.357c-1.51 0-3.635-.93-3.635-4.674s2.125-4.674 3.635-4.674c1.509 0 3.632.93 3.632 4.674 0 1.254-.242 2.18-.614 2.873l-1.416-1.322-1.435 1.502zm6.317 3.09l-1.457-1.371c.82-1.045 1.4-2.572 1.4-4.771 0-6.277-4.658-7.039-6.428-7.039-1.769 0-6.425.762-6.425 7.039 0 6.281 4.656 7.041 6.425 7.041.78 0 2.16-.146 3.427-.898l1.586 1.514 1.472-1.515zM54.863 154.889c0 3.516-2.127 5.027-5.499 5.027-1.228 0-3.054-.297-4.246-1.619-.726-.814-1.006-1.904-1.042-3.242v-8.867h2.85v8.678c0 1.869 1.08 2.684 2.382 2.684 1.921 0 2.701-.93 2.701-2.551v-8.811h2.855v8.701h-.001zM62.348 149.207h.041l1.655 5.291H60.63l1.718-5.291zm-2.464 7.594h4.939l.858 2.766h3.037l-4.71-13.379h-3.225l-4.769 13.379h2.943l.927-2.766zM73.692 157.145h6.65v2.421h-9.448v-13.378h2.798v10.957zM90.938 153.562v6.004h-2.79v-13.378h2.79v5.066h5.218v-5.066h2.791v13.378h-2.791v-6.004h-5.218zM104.273 152.875c0-3.744 2.127-4.674 3.631-4.674 1.512 0 3.637.93 3.637 4.674s-2.125 4.674-3.637 4.674c-1.504 0-3.631-.93-3.631-4.674zm-2.791 0c0 6.281 4.66 7.041 6.422 7.041 1.777 0 6.432-.76 6.432-7.041 0-6.277-4.654-7.039-6.432-7.039-1.761 0-6.422.762-6.422 7.039zM127.676 154.889c0 3.516-2.127 5.027-5.5 5.027-1.23 0-3.051-.297-4.248-1.619-.725-.814-1.006-1.904-1.039-3.242v-8.867h2.846v8.678c0 1.869 1.084 2.684 2.391 2.684 1.918 0 2.699-.93 2.699-2.551v-8.811h2.852v8.701h-.001zM132.789 155.445c.025.744.4 2.162 2.838 2.162 1.32 0 2.795-.316 2.795-1.736 0-1.039-1.006-1.322-2.42-1.656l-1.436-.336c-2.168-.502-4.252-.98-4.252-3.924 0-1.492.807-4.119 5.145-4.119 4.102 0 5.199 2.68 5.219 4.32h-2.686c-.072-.592-.297-2.012-2.738-2.012-1.059 0-2.326.391-2.326 1.602 0 1.049.857 1.264 1.41 1.395l3.264.801c1.826.449 3.5 1.195 3.5 3.596 0 4.029-4.096 4.379-5.271 4.379-4.877 0-5.715-2.814-5.715-4.471h2.673v-.001zM146.186 159.566H143.4v-13.378h2.786v13.378zM157.35 146.188h2.605v13.378h-2.791l-5.455-9.543h-.047v9.543h-2.605v-13.378H152l5.303 9.316h.047v-9.316zM169.307 152.355h5.584v7.211h-1.859l-.279-1.676c-.707.812-1.732 2.025-4.174 2.025-3.221 0-6.143-2.309-6.143-7.002 0-3.648 2.031-7.098 6.533-7.078 4.105 0 5.727 2.66 5.867 4.512h-2.791c0-.523-.953-2.203-2.924-2.203-1.998 0-3.84 1.377-3.84 4.803 0 3.654 1.994 4.602 3.893 4.602.615 0 2.67-.238 3.242-2.943h-3.109v-2.251zM18.836 173.197c0-3.744 2.123-4.678 3.63-4.678 1.509 0 3.631.934 3.631 4.678 0 3.742-2.122 4.68-3.631 4.68-1.507 0-3.63-.938-3.63-4.68zm-2.794 0c0 6.275 4.656 7.049 6.425 7.049 1.77 0 6.426-.773 6.426-7.049s-4.657-7.039-6.426-7.039c-1.769 0-6.425.764-6.425 7.039zM36.549 172.748v-3.934h2.217c1.731 0 2.459.545 2.459 1.85 0 .596 0 2.084-2.088 2.084h-2.588zm0 2.314h3.202c3.597 0 4.265-3.059 4.265-4.268 0-2.625-1.561-4.285-4.153-4.285h-6.107v13.379h2.793v-4.826zM51.599 172.748v-3.934h2.213c1.733 0 2.46.545 2.46 1.85 0 .596 0 2.084-2.083 2.084h-2.59zm0 2.314h3.204c3.594 0 4.267-3.059 4.267-4.268 0-2.625-1.563-4.285-4.153-4.285h-6.113v13.379h2.795v-4.826zM66.057 173.197c0-3.744 2.118-4.678 3.633-4.678 1.502 0 3.63.934 3.63 4.678 0 3.742-2.127 4.68-3.63 4.68-1.515 0-3.633-.938-3.633-4.68zm-2.795 0c0 6.275 4.655 7.049 6.428 7.049 1.765 0 6.421-.773 6.421-7.049s-4.656-7.039-6.421-7.039c-1.773 0-6.428.764-6.428 7.039zM83.717 172.396v-3.582h3.479c1.64 0 1.954 1.049 1.954 1.756 0 1.324-.705 1.826-2.159 1.826h-3.274zm-2.746 7.493h2.746v-5.236h2.882c2.07 0 2.184.705 2.184 2.531 0 1.375.105 2.064.292 2.705h3.095v-.361c-.596-.221-.596-.707-.596-2.656 0-2.504-.596-2.91-1.694-3.396 1.322-.443 2.064-1.713 2.064-3.182 0-1.158-.648-3.783-4.207-3.783H80.97v13.378h.001zM102.355 179.889h-2.793v-11.012h-4.04v-2.367H106.4v2.367h-4.045v11.012zM121.395 175.207c0 3.52-2.123 5.039-5.498 5.039-1.223 0-3.049-.311-4.244-1.631-.727-.816-1.006-1.898-1.039-3.238v-8.867h2.846v8.678c0 1.863 1.082 2.689 2.385 2.689 1.918 0 2.699-.938 2.699-2.557v-8.811h2.852v8.698h-.001zM134.916 166.51h2.613v13.379h-2.8l-5.459-9.543h-.03v9.543h-2.613V166.51h2.943l5.313 9.312h.033v-9.312zM145.412 179.889h-2.803V166.51h2.803v13.379zM156.32 179.889h-2.793v-11.012h-4.035v-2.367h10.873v2.367h-4.045v11.012zM170.928 179.889h-2.799v-5.051l-4.615-8.328h3.295l2.775 5.814 2.652-5.814h3.162l-4.47 8.361v5.018zM95.706 6.842L5.645 51.199v20.836h10.08v62.502h159.284V72.035h12.104V51.199L95.706 6.842zm59.815 108.871H35.216V58.592l60.49-30.914 59.816 30.914v57.121h-.001z" fill="#000"/>
                  <path d="M123.256 78.75H67.479V58.592h55.777V78.75zM123.256 107.662H67.479V87.491h55.777v20.171z" fill="#000"/>
                </g>
              </svg>
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
            <strong className="text-orange-500">REALTOR®</strong> is a registered trademark of the National Association of REALTORS® and identifies real estate professionals who are members of NAR and/or the quality of services they provide. Inspired by palmestates.org branding: focus on unlocking potential, data-driven marketing, luxury experiences, and the Palm Movement.
          </p>
          <p>© {currentYear} Palm Estates. All rights reserved. Buffalo, NY</p>
        </div>
      </div>
    </footer>
  );
}