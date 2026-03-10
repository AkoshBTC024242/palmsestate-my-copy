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
    <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden">
      {/* Decorative elements - exactly like home.jsx */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - exactly like home.jsx */}
          <div className="text-white space-y-8">
            {/* Trust badge - exactly like home.jsx */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted by 800+ Happy Clients</span>
            </div>

            {/* Headline - exactly like home.jsx */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Your Property Journey, <br />
              <span className="text-orange-200">Expertly Guided</span>
            </h1>

            {/* Description - exactly like home.jsx */}
            <p className="text-xl text-orange-100 leading-relaxed">
              Whether you're buying, selling, or renting, our certified REALTORS® deliver 
              data-driven marketing and white-glove service for luxury homes and premium rentals.
            </p>

            {/* CTA Buttons - exactly like home.jsx */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/properties"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Browse Properties
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Talk to a Realtor
              </Link>
            </div>

            {/* Quick Stats - exactly like home.jsx */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold">{stats.properties}+</div>
                <div className="text-orange-200 text-sm">Active Listings</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.residents}+</div>
                <div className="text-orange-200 text-sm">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.satisfaction}%</div>
                <div className="text-orange-200 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Visual - exactly like home.jsx with property cards */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  {/* Property Card 1 - exactly like home.jsx */}
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <HomeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Luxury Estate</div>
                        <div className="text-sm text-gray-600">Buffalo, NY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600">$1.2M</div>
                      <div className="text-xs text-gray-500">For Sale</div>
                    </div>
                  </div>

                  {/* Property Card 2 - exactly like home.jsx */}
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Modern Apartment</div>
                        <div className="text-sm text-gray-600">New York, NY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600">$3,200/mo</div>
                      <div className="text-xs text-gray-500">For Rent</div>
                    </div>
                  </div>

                  {/* Stats Card - exactly like home.jsx */}
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

      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
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