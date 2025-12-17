import { Link } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';

export default function Home() {
  const { device, isMobile } = useDevice();

  return (
    <>
      {/* Hero Section - Different based on device */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Desktop Background */}
        <div 
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent"></div>
        </div>
        
        {/* Mobile Background (Different image optimized for mobile) */}
        <div 
          className="block md:hidden absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            backgroundPosition: 'center 70%'
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60"></div>
        </div>

        {/* Hero Content - Device Optimized */}
        <div className="relative z-10 text-center px-4 md:px-6 max-w-6xl mx-auto">
          {/* Device-specific badge */}
          {isMobile ? (
            <div className="mb-4">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs tracking-widest">
                LUXURY ESTATES
              </span>
            </div>
          ) : (
            <div className="mb-8">
              <span className="inline-block bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm tracking-widest border border-white/20">
                PREMIUM LUXURY ESTATES
              </span>
            </div>
          )}
          
          {/* Responsive Title */}
          <h1 className={`font-bold text-white mb-4 md:mb-6 tracking-tight ${
            isMobile ? 'text-3xl' : 'text-5xl md:text-8xl'
          }`}>
            {isMobile ? 'PALMS' : 'PALMS ESTATE'}
          </h1>
          
          {/* Device-specific subtitle */}
          <p className={`text-white/90 mb-6 md:mb-12 max-w-3xl mx-auto font-light ${
            isMobile 
              ? 'text-sm px-2 leading-tight' 
              : 'text-xl md:text-4xl leading-relaxed'
          }`}>
            {isMobile 
              ? 'Premier Luxury Residences'
              : 'Curated Collection of Premier Luxury Residences'
            }
          </p>
          
          {/* Responsive CTA Button */}
          <Link 
            to="/properties" 
            className={`inline-block bg-white text-primary font-bold transition-all duration-300 hover:scale-105 shadow-xl ${
              isMobile 
                ? 'px-6 py-3 rounded-lg text-base'
                : 'px-12 py-4 rounded-full text-xl'
            }`}
          >
            {isMobile ? 'View Properties →' : 'Discover Exclusive Rentals →'}
          </Link>
          
          {/* Mobile-only quick action buttons */}
          {isMobile && (
            <div className="mt-6 flex gap-3 justify-center">
              <Link 
                to="/contact" 
                className="inline-block bg-transparent border border-white text-white px-4 py-2 rounded-lg text-sm"
              >
                Contact
              </Link>
              <a 
                href="tel:+15551234567" 
                className="inline-block bg-accent text-white px-4 py-2 rounded-lg text-sm"
              >
                Call Now
              </a>
            </div>
          )}
        </div>
        
        {/* Desktop-only scroll indicator */}
        {!isMobile && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
            </div>
          </div>
        )}
      </section>

      {/* Properties Section - Different layout for mobile/desktop */}
      <section className="py-8 md:py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Different for mobile */}
          <div className={`text-center mb-8 md:mb-16 ${
            isMobile ? 'px-2' : ''
          }`}>
            <h2 className={`font-bold text-gray-900 mb-2 ${
              isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'
            }`}>
              {isMobile ? 'Featured' : 'Featured Properties'}
            </h2>
            <p className={`text-gray-600 max-w-3xl mx-auto ${
              isMobile ? 'text-sm' : 'text-lg md:text-xl'
            }`}>
              {isMobile 
                ? 'Luxury residences selected for excellence'
                : 'Each residence is meticulously selected to represent the pinnacle of luxury living'
              }
            </p>
          </div>

          {/* Properties Grid - Different layout for mobile */}
          <div className={
            isMobile 
              ? 'space-y-4'  // Stacked on mobile
              : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'  // Grid on desktop
          }>
            {/* Property Card 1 */}
            <div className={`bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
              isMobile 
                ? 'rounded-lg' 
                : 'rounded-xl md:rounded-2xl group'
            }`}>
              <div className={
                isMobile 
                  ? 'flex'  // Horizontal layout on mobile
                  : 'relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden' // Vertical on desktop
              }>
                <img 
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Oceanfront Villa"
                  className={
                    isMobile
                      ? 'w-1/2 h-40 object-cover'  // Half width on mobile
                      : 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                  }
                />
                
                {/* Mobile layout content beside image */}
                {isMobile ? (
                  <div className="w-1/2 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Oceanfront Villa</h3>
                      <div className="text-sm text-gray-600 mt-1">Miami Beach, FL</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">$8,500/mo</div>
                      <Link 
                        to="/properties/1" 
                        className="text-sm text-accent font-medium block mt-2"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                      <div className="p-4 md:p-6 text-white">
                        <div className="text-xl md:text-2xl font-bold">$8,500/month</div>
                        <div className="text-sm">Miami Beach, FL</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Desktop property details */}
              {!isMobile && (
                <div className="p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Oceanfront Villa</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-4">5 Beds</span>
                        <span>4 Baths</span>
                      </div>
                      <div className="text-sm mt-1">5,200 sq ft</div>
                    </div>
                    <Link 
                      to="/properties/1" 
                      className="text-primary font-semibold hover:text-accent transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Property Card 2 (Similar pattern) */}
            <div className={`bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
              isMobile 
                ? 'rounded-lg' 
                : 'rounded-xl md:rounded-2xl group'
            }`}>
              <div className={
                isMobile 
                  ? 'flex'
                  : 'relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden'
              }>
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modern Penthouse"
                  className={
                    isMobile
                      ? 'w-1/2 h-40 object-cover'
                      : 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                  }
                />
                
                {isMobile ? (
                  <div className="w-1/2 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Modern Penthouse</h3>
                      <div className="text-sm text-gray-600 mt-1">Los Angeles, CA</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">$12,000/mo</div>
                      <Link 
                        to="/properties/2" 
                        className="text-sm text-accent font-medium block mt-2"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                    <div className="p-4 md:p-6 text-white">
                      <div className="text-xl md:text-2xl font-bold">$12,000/month</div>
                      <div className="text-sm">Los Angeles, CA</div>
                    </div>
                  </div>
                )}
              </div>
              
              {!isMobile && (
                <div className="p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Modern Penthouse</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-4">3 Beds</span>
                        <span>3 Baths</span>
                      </div>
                      <div className="text-sm mt-1">3,800 sq ft</div>
                    </div>
                    <Link 
                      to="/properties/2" 
                      className="text-primary font-semibold hover:text-accent transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Device-specific call to action */}
      <section className={`bg-primary ${
        isMobile ? 'py-8' : 'py-20'
      }`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className={`font-bold text-white mb-4 ${
            isMobile ? 'text-xl' : 'text-3xl md:text-5xl'
          }`}>
            {isMobile 
              ? 'Ready to Find Your Luxury Home?'
              : 'Experience Unparalleled Luxury'
            }
          </h2>
          
          {isMobile ? (
            <div className="flex flex-col gap-3">
              <Link 
                to="/properties" 
                className="block bg-white text-primary px-6 py-3 rounded-lg font-bold"
              >
                Browse Properties
              </Link>
              <a 
                href="tel:+15551234567" 
                className="block bg-accent text-white px-6 py-3 rounded-lg font-bold"
              >
                Call Agent: (555) 123-4567
              </a>
            </div>
          ) : (
            <>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Our dedicated team of luxury property specialists is committed to providing exceptional service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/properties" 
                  className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition"
                >
                  Browse All Properties
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition"
                >
                  Schedule Viewing
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}