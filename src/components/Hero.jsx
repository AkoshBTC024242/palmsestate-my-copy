import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
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

        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23FF6600\" fill-opacity=\"0.15\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
      </div>

      {/* Centered Content */}
      <div className={`relative z-10 text-center px-4 max-w-7xl mx-auto transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Pre-title badge - Orange accent */}
        <div className="mb-8 md:mb-12">
          <span className="inline-block font-montserrat font-light tracking-[0.3em] text-sm text-orange-400 uppercase border-b border-orange-500/30 pb-3">
            PREMIER LUXURY RENTALS
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 md:mb-8 leading-[0.9] tracking-tight">
          Exceptional <span className="text-orange-500 italic" style={{ color: '#FF6600' }}>Living</span> Awaits
        </h1>

        {/* Subtitle */}
        <p className="font-montserrat text-xl md:text-2xl text-white/90 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
          Access premium residences through our exclusive property portfolio. 
          Experience unparalleled service and discretion in every detail.
        </p>

        {/* Primary CTA Button */}
        <div className="mb-16 md:mb-20">
          <Link
            to="/properties"
            className="inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-inter font-medium py-5 px-16 rounded-full text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:-translate-y-1 group"
            style={{ backgroundColor: '#FF6600' }}
          >
            <span>View Properties</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

        {/* Luxury Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-8 max-w-4xl mx-auto px-2">
          {[
            { value: '250+', label: 'Premium Properties', icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5" /> },
            { value: '24', label: 'Global Destinations', icon: <span className="text-lg md:text-xl">🌍</span> },
            { value: '892+', label: 'Satisfied Clients', icon: <span className="text-lg md:text-xl">⭐</span> },
            { value: '15min', label: 'Response Time', icon: <span className="text-lg md:text-xl">⏱️</span> }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`text-center p-3 sm:p-4 md:p-6 backdrop-blur-md bg-black/40 border border-orange-500/20 rounded-xl transition-all duration-500 hover:border-orange-500/40 hover:bg-black/50 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + (index * 100)}ms` }}
            >
              <div className="flex justify-center mb-2 md:mb-3 text-orange-500" style={{ color: '#FF6600' }}>
                {stat.icon}
              </div>
              <div className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white mb-1 md:mb-2">
                {stat.value}
              </div>
              <div className="font-montserrat text-[10px] sm:text-xs md:text-sm text-gray-300 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
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

      {/* Add animation styles directly in the component */}
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