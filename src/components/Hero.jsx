import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Home as HomeIcon, MapPin } from 'lucide-react';

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({ properties: 250, residents: 800, satisfaction: 98 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-black overflow-hidden min-h-[800px] flex items-center">
      {/* Background image with overlays */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            backgroundPosition: 'center 30%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10"></div>
      </div>

      {/* Decorative orange accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>

      {/* Main Content */}
      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span className="text-orange-400">Trusted by 800+ Happy Renters</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Your Dream Rental <br />
              <span className="text-orange-500" style={{ color: '#FF6600' }}>Awaits You</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl">
              Discover premium rental properties across the United States. Experience luxury living with Palms Estate - where comfort meets affordability.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link
                to="/properties"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 text-sm sm:text-base"
                style={{ backgroundColor: '#FF6600' }}
              >
                Browse Rentals
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-orange-500/50 text-white font-semibold rounded-xl hover:bg-orange-500/10 transition-all duration-300 text-sm sm:text-base"
              >
                Get Started
              </Link>
            </div>

            {/* Quick Stats - Always visible on mobile */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-800">
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stats.properties}+</div>
                <div className="text-xs sm:text-sm text-gray-400">Rentals Available</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stats.residents}+</div>
                <div className="text-xs sm:text-sm text-gray-400">Happy Renters</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stats.satisfaction}%</div>
                <div className="text-xs sm:text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Image/Visual - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-3xl transform rotate-3 opacity-50"></div>
              <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-orange-500/20">
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center justify-between p-3 lg:p-4 bg-black/60 rounded-xl border border-orange-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <HomeIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm lg:text-base">Modern Apartment</div>
                        <div className="text-xs lg:text-sm text-gray-400">Los Angeles, CA</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base lg:text-lg font-bold text-orange-500">$2,500/mo</div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 lg:p-4 bg-black/60 rounded-xl border border-orange-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm lg:text-base">Luxury Condo</div>
                        <div className="text-xs lg:text-sm text-gray-400">New York, NY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base lg:text-lg font-bold text-orange-500">$3,200/mo</div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white text-center">
                    <div className="text-2xl lg:text-3xl font-bold mb-1">800+</div>
                    <div className="text-xs lg:text-sm text-orange-100">Rentals Listed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="animate-bounce flex flex-col items-center">
          <span className="text-orange-400/70 text-xs md:text-sm mb-1 md:mb-2 font-montserrat tracking-widest">EXPLORE</span>
          <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Hero;