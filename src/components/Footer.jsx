function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const services = [
    'Luxury Villa Rentals',
    'Penthouse Leasing',
    'Private Island Bookings',
    'Yacht & Estate Management',
    'Concierge Services',
    'Private Aviation',
  ];

  const socialLinks = [
    { name: 'Instagram', icon: '📱', url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: 'Pinterest', icon: '📌', url: 'https://pinterest.com' },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 via-orange-500/90 to-amber-600/90 backdrop-blur-sm"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 lg:p-8">
                <h3 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4">
                  Palms <span className="text-amber-200">Estate</span>
                </h3>
                <p className="font-sans text-white/90 mb-6 leading-relaxed">
                  Curating the world's most exclusive properties for discerning clients seeking unparalleled luxury.
                </p>
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="w-10 h-10 flex items-center justify-center backdrop-blur-sm bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors duration-300"
                      aria-label={social.name}
                    >
                      <span className="text-lg">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif text-xl font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.path}
                      className="font-sans text-white/80 hover:text-amber-200 hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-serif text-xl font-bold text-white mb-6">Our Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <div className="font-sans text-white/80 flex items-start">
                      <span className="text-amber-300 mr-2">✦</span>
                      {service}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <h4 className="font-serif text-xl font-bold text-white mb-6">Contact Us</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-500/20 rounded-lg">
                      <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sans text-sm text-white/70">24/7 Concierge</p>
                      <a href="tel:+18286239765" className="font-sans font-semibold text-white hover:text-amber-200 transition-colors">
                        +1 (828) 623-9765
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-500/20 rounded-lg">
                      <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sans text-sm text-white/70">Email</p>
                      <a href="mailto:admin@palmsestate.org" className="font-sans font-semibold text-white hover:text-amber-200 transition-colors">
                        admin@palmsestate.org
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-500/20 rounded-lg">
                      <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sans text-sm text-white/70">Business Hours</p>
                      <p className="font-sans font-semibold text-white">Mon-Sun: 24/7</p>
                    </div>
                  </div>
                </div>
                
                {/* Newsletter Signup */}
                <div className="mt-8">
                  <p className="font-sans text-white/90 mb-3">Subscribe to our luxury insights</p>
                  <form className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-grow px-4 py-2 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-amber-300"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-r-lg font-sans font-semibold hover:opacity-90 transition-opacity"
                    >
                      →
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="font-sans text-white/80 text-sm">
                  © {currentYear} Palms Estate. All rights reserved.
                </p>
                <p className="font-sans text-white/60 text-xs mt-1">
                  Luxury redefined. Experience the extraordinary.
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-sans text-white/70 text-sm">24/7 Concierge Available</span>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                  <span className="font-sans text-white/60 text-sm">✦</span>
                  <span className="font-sans text-white/60 text-sm">Member of International Luxury Association</span>
                  <span className="font-sans text-white/60 text-sm">✦</span>
                </div>
              </div>
            </div>
            
            {/* Accreditation Badges */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center items-center gap-6">
              <div className="backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
                <span className="font-sans text-white/70 text-xs">★ Forbes Global Properties ★</span>
              </div>
              <div className="backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
                <span className="font-sans text-white/70 text-xs">✦ Luxury Travel Awards 2024 ✦</span>
              </div>
              <div className="backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
                <span className="font-sans text-white/70 text-xs">⏣ Five-Star Service Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;