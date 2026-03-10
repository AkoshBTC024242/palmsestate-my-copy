import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Home, 
  Users, 
  Building2, 
  CheckCircle,
  TrendingUp,
  Shield 
} from 'lucide-react';

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { value: '250+', label: 'Active Properties', icon: Building2 },
    { value: '800+', label: 'Happy Clients', icon: Users },
    { value: '98%', label: 'Satisfaction Rate', icon: TrendingUp },
    { value: '45+', label: 'REALTORS®', icon: Shield }
  ];

  return (
    <div className="relative bg-[#0A0A0A] overflow-hidden">
      {/* Sophisticated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Professional Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#18181B] rounded-full border border-[#27272A]">
              <Shield className="w-4 h-4 text-[#F97316]" />
              <span className="text-sm text-[#A1A1AA]">Certified REALTORS®</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#18181B] rounded-full border border-[#27272A]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              <span className="text-sm text-[#A1A1AA]">Equal Housing Opportunity</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#18181B] rounded-full border border-[#27272A]">
              <TrendingUp className="w-4 h-4 text-[#F97316]" />
              <span className="text-sm text-[#A1A1AA]">Data-Driven Marketing</span>
            </div>
          </div>

          {/* Main Headline - Clean and impactful */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
            <span className="text-white">Real Estate,</span>
            <br />
            <span className="text-[#F97316] font-medium">Redefined</span>
          </h1>

          {/* Supporting text - Professional and clear */}
          <p className="text-xl text-[#A1A1AA] mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're buying, selling, or renting, our team of certified professionals 
            delivers exceptional results through data-driven strategies and white-glove service.
          </p>

          {/* CTA Buttons - Clean and purposeful */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/properties"
              className="group inline-flex items-center justify-center px-8 py-4 bg-[#F97316] text-white font-medium rounded-lg hover:bg-[#EA580C] transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 min-w-[200px]"
            >
              Explore Properties
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#18181B] text-white font-medium rounded-lg border border-[#27272A] hover:border-[#F97316] hover:bg-[#F97316]/5 transition-all duration-300 min-w-[200px]"
            >
              Schedule Consultation
            </Link>
          </div>

          {/* Stats Grid - Clean and organized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className={`text-center transition-all duration-700 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#F97316]" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-light text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-[#A1A1AA] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Professional Affiliations */}
          <div className="mt-16 pt-8 border-t border-[#27272A]">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#A1A1AA]">
              <span>National Association of REALTORS®</span>
              <span className="w-1 h-1 rounded-full bg-[#27272A]"></span>
              <span>Equal Housing Opportunity</span>
              <span className="w-1 h-1 rounded-full bg-[#27272A]"></span>
              <span>Buffalo Niagara Association</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-[#A1A1AA] tracking-widest">SCROLL</span>
          <div className="w-5 h-9 border-2 border-[#27272A] rounded-full flex justify-center">
            <div className="w-1 h-2 bg-[#F97316] rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes scroll {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}

export default Hero;