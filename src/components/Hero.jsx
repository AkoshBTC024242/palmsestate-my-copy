import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Home as HomeIcon, MapPin, Users, TrendingUp, Shield } from 'lucide-react';

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    properties: 250,
    residents: 800,
    satisfaction: 98,
    agents: 45
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Full-screen luxury background */}
      <div className="absolute inset-0">
        {/* Primary background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            backgroundPosition: 'center 30%'
          }}
        />

        {/* Black gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        
        {/* Orange accent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10"></div>

        {/* Decorative orange blurs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>

        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23FF6600\" fill-opacity=\"0.15\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
      </div>

      {/* Centered Content */}
      <div className={`relative z-10 text-center px-4 max-w-7xl mx-auto py-24 lg:py-32 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Trust Badge */}
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 px-4 py-2 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span className="text-orange-400">Trusted by 800+ Homeowners & Renters</span>
          </div>
        </div>

        {/* Main Headline - Professional Realtor Focus */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 md:mb-8 leading-[0.9] tracking-tight">
          <span className="text-white">Your Property Journey,</span><br />
          <span className="text-orange-500 italic" style={{ color: '#FF6600' }}>Expertly Guided</span>
        </h1>

        {/* Subtitle - Real Estate Services */}
        <p className="font-montserrat text-xl md:text-2xl text-gray-300 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
          Whether you're buying, selling, or renting, our certified REALTORS® deliver 
          data-driven marketing and white-glove service for luxury homes and premium rentals.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 md:mb-20">
          <Link
            to="/properties"
            className="group inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-inter font-medium py-5 px-10 rounded-full text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:-translate-y-1"
            style={{ backgroundColor: '#FF6600' }}
          >
            <span>Browse Properties</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
          
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-10 py-5 border-2 border-orange-500/50 text-white font-semibold rounded-full text-lg hover:bg-orange-500/10 transition-all duration-300 hover:border-orange-500"
          >
            <Shield className="w-5 h-5 mr-2" />
            <span>Talk to a Realtor</span>
          </Link>
        </div>

        {/* Professional Stats Cards - Always visible on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-8 max-w-5xl mx-auto px-2">
          {/* Properties Available */}
          <div 
            className={`text-center p-4 sm:p-5 md:p-6 backdrop-blur-md bg-black/40 border border-orange-500/20 rounded-xl transition-all duration-500 hover:border-orange-500/40 hover:bg-black/50 hover:scale-105 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex justify-center mb-3 text-orange-500">
              <HomeIcon className="w-6 h-6 md:w-7 md:h-7" style={{ color: '#FF6600' }} />
            </div>
            <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white mb-1">
              {stats.properties}+
            </div>
            <div className="font-montserrat text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
              Active Listings
            </div>
          </div>

          {/* Happy Clients */}
          <div 
            className={`text-center p-4 sm:p-5 md:p-6 backdrop-blur-md bg-black/40 border border-orange-500/20 rounded-xl transition-all duration-500 hover:border-orange-500/40 hover:bg-black/50 hover:scale-105 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex justify-center mb-3 text-orange-500">
              <Users className="w-6 h-6 md:w-7 md:h-7" style={{ color: '#FF6600' }} />
            </div>
            <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white mb-1">
              {stats.residents}+
            </div>
            <div className="font-montserrat text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
              Happy Clients
            </div>
          </div>

          {/* Certified Agents */}
          <div 
            className={`text-center p-4 sm:p-5 md:p-6 backdrop-blur-md bg-black/40 border border-orange-500/20 rounded-xl transition-all duration-500 hover:border-orange-500/40 hover:bg-black/50 hover:scale-105 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex justify-center mb-3 text-orange-500">
              <span className="text-2xl md:text-3xl">®</span>
            </div>
            <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white mb-1">
              {stats.agents}+
            </div>
            <div className="font-montserrat text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
              REALTORS®
            </div>
          </div>

          {/* Satisfaction Rate */}
          <div 
            className={`text-center p-4 sm:p-5 md:p-6 backdrop-blur-md bg-black/40 border border-orange-500/20 rounded-xl transition-all duration-500 hover:border-orange-500/40 hover:bg-black/50 hover:scale-105 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="flex justify-center mb-3 text-orange-500">
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7" style={{ color: '#FF6600' }} />
            </div>
            <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white mb-1">
              {stats.satisfaction}%
            </div>
            <div className="font-montserrat text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
              Satisfaction
            </div>
          </div>
        </div>

        {/* REALTOR® Certification Badge */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-orange-500/20">
            <span className="text-orange-500 font-bold text-lg">®</span>
            <span className="text-gray-300 text-sm">Certified REALTOR® Partners</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-orange-500/20">
            <span className="text-orange-500">🏠</span>
            <span className="text-gray-300 text-sm">Equal Housing Opportunity</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="animate-bounce flex flex-col items-center">
          <span className="text-orange-400/70 text-sm mb-2 font-montserrat tracking-widest">DISCOVER</span>
          <svg className="w-6 h-6 text-orange-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default Hero;