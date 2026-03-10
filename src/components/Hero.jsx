import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Home as HomeIcon, MapPin } from 'lucide-react';

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    properties: 250,
    residents: 800,
    satisfaction: 98
  };

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Decorative orange elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Subtle orange gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span className="text-orange-400">Trusted by 800+ Happy Clients</span>
            </div>

            {/* Headline - orange accent on second line */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Your Property Journey, <br />
              <span className="text-orange-500" style={{ color: '#FF6600' }}>Expertly Guided</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed">
              Whether you're buying, selling, or renting, our certified REALTORS® deliver 
              data-driven marketing and white-glove service for luxury homes and premium rentals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/properties"
                className="group inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105"
                style={{ backgroundColor: '#FF6600' }}
              >
                Browse Properties
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-orange-500/50 text-white font-semibold rounded-xl hover:bg-orange-500/10 transition-all duration-300"
              >
                Talk to a Realtor
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800">
              <div>
                <div className="text-3xl font-bold text-white">{stats.properties}+</div>
                <div className="text-gray-400 text-sm">Active Listings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.residents}+</div>
                <div className="text-gray-400 text-sm">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.satisfaction}%</div>
                <div className="text-gray-400 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Visual with property cards */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-3xl transform rotate-3 opacity-30"></div>
              <div className="relative bg-gray-900 rounded-3xl shadow-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-orange-500/20">
                <div className="space-y-6">
                  {/* Property Card 1 */}
                  <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <HomeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Luxury Estate</div>
                        <div className="text-sm text-gray-400">Buffalo, NY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-500">$1.2M</div>
                      <div className="text-xs text-gray-500">For Sale</div>
                    </div>
                  </div>

                  {/* Property Card 2 */}
                  <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Modern Apartment</div>
                        <div className="text-sm text-gray-400">New York, NY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-500">$3,200/mo</div>
                      <div className="text-xs text-gray-500">For Rent</div>
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white text-center">
                    <div className="text-3xl font-bold mb-1">15+ Years</div>
                    <div className="text-orange-100">of Real Estate Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="animate-bounce flex flex-col items-center">
          <span className="text-orange-400/70 text-sm mb-2 font-montserrat tracking-widest">EXPLORE</span>
          <svg className="w-6 h-6 text-orange-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}

export default Hero;