import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Shield, Globe, Star } from 'lucide-react';

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Luxury property stats
  const stats = [
    { label: 'Premium Properties', value: '150+', icon: <Star className="w-4 h-4" /> },
    { label: 'Countries', value: '35+', icon: <Globe className="w-4 h-4" /> },
    { label: 'Client Satisfaction', value: '98%', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Verified Estates', value: '100%', icon: <Shield className="w-4 h-4" /> },
  ];

  // Image URLs for different screen sizes (optimized for mobile)
  const heroImages = {
    mobile: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tablet: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    desktop: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  };

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background Image with responsive sizing */}
      <div className="absolute inset-0">
        <picture>
          {/* Mobile-optimized image */}
          <source 
            media="(max-width: 640px)" 
            srcSet={heroImages.mobile}
          />
          {/* Tablet-optimized image */}
          <source 
            media="(max-width: 1024px)" 
            srcSet={heroImages.tablet}
          />
          {/* Desktop image */}
          <img
            src={heroImages.desktop}
            alt="Luxury Estate Background"
            className={`w-full h-full object-cover transition-transform duration-700 ${isLoaded ? 'scale-100' : 'scale-110'}`}
            loading="eager"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
          />
        </picture>
        
        {/* Luxury Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/70 to-primary-900/40 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      {/* Main Content Container - UPDATED with container-fluid */}
      <div className="container-fluid relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
          {/* Left Column: Hero Text */}
          <div className={`flex-1 max-w-2xl transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Luxury Badge */}
            <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 md:mb-8">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-white tracking-widest uppercase">WORLD-CLASS RESIDENCES</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Exceptional Living
              <span className="block text-amber-300 mt-2">Awaits</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-xl leading-relaxed font-sans">
              Access premium residences through our exclusive property portfolio. 
              Experience unparalleled service and discretion in every detail.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12">
              <Link
                to="/properties"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-300 min-h-[52px] touch-manipulation"
              >
                <span>View All Properties</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/contact"
                className="group flex items-center justify-center gap-3 backdrop-blur-sm bg-white/10 text-white font-semibold py-4 px-8 rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 min-h-[52px] touch-manipulation"
              >
                <span>Schedule Consultation</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className={`backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-500 ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${200 + (index * 100)}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-amber-300">
                      {stat.icon}
                    </div>
                    <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Property Card (Desktop Only) */}
          <div className={`hidden lg:block flex-1 max-w-md transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden">
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Featured Luxury Villa"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    FEATURED
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Seaside Villa Mirage</h3>
                  <p className="text-white/70 text-sm">Monte Carlo, Monaco</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
                  <div className="text-center">
                    <div className="text-amber-300 font-bold text-lg">8</div>
                    <div className="text-white/60 text-xs">BEDROOMS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-300 font-bold text-lg">10</div>
                    <div className="text-white/60 text-xs">BATHROOMS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-300 font-bold text-lg">25K</div>
                    <div className="text-white/60 text-xs">SQ. FT.</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-amber-300 font-bold text-2xl">$85,000<span className="text-white/70 text-sm font-normal">/month</span></div>
                  </div>
                  <Link
                    to="/properties/featured-villa"
                    className="text-white hover:text-amber-300 font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator (Mobile & Tablet) */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} md:hidden`}>
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-white/60 text-sm mb-2">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0.3; }
        }
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
      `}</style>
    </section>
  );
}

export default Hero;
