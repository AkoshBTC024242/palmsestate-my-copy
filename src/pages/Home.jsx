import { Link } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';

export default function Home() {
  const { device, isMobile } = useDevice();

  // Property data - in a real app, this would come from an API
  const featuredProperties = [
    {
      id: '1',
      title: 'Oceanfront Villa',
      location: 'Miami Beach, FL',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 5200,
      amenities: ['Private Beach', 'Infinity Pool', 'Wine Cellar'],
      type: 'Premium'
    },
    {
      id: '2',
      title: 'Modern Penthouse',
      location: 'Los Angeles, CA',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 3800,
      amenities: ['City View', 'Rooftop Terrace', 'Smart Home'],
      type: 'Penthouse'
    },
    {
      id: '3',
      title: 'Beachfront Estate',
      location: 'Malibu, CA',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      bedrooms: 6,
      bathrooms: 7,
      squareFeet: 8500,
      amenities: ['Private Beach', 'Infinity Pool', 'Home Theater'],
      type: 'Exclusive'
    }
  ];

  return (
    <>
      {/* Hero Section with Device Detection */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        
        {/* Mobile Background */}
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

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 md:px-6 max-w-6xl mx-auto">
          {/* Premium Badge - Different for mobile/desktop */}
          {isMobile ? (
            <div className="mb-4 animate-fade-in-down">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs tracking-widest font-light">
                LUXURY ESTATES
              </span>
            </div>
          ) : (
            <div className="mb-8 animate-fade-in-down">
              <span className="inline-block bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm tracking-widest font-light border border-white/20">
                PREMIUM LUXURY ESTATES
              </span>
            </div>
          )}
          
          {/* Main Title with Device-Specific Sizing */}
          <h1 className={`font-bold text-white mb-4 md:mb-6 tracking-tight animate-slide-up ${
            isMobile ? 'text-4xl' : 'text-6xl md:text-8xl'
          }`}>
            PALMS ESTATE
          </h1>
          
          {/* Subtitle with Device-Specific Text */}
          <div className="h-1 w-24 md:w-48 bg-accent mx-auto mb-8 md:mb-12 animate-scale-x"></div>
          
          <p className={`text-white/90 mb-6 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in delay-300 ${
            isMobile 
              ? 'text-lg px-2' 
              : 'text-2xl md:text-4xl'
          }`}>
            Where <span className="font-bold text-accent">Extraordinary</span> Living Meets <span className="font-bold text-accent">Uncompromising</span> Excellence
          </p>
          
          {/* CTA Buttons with Device-Specific Styling */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center animate-fade-in-up delay-500">
            <Link 
              to="/properties" 
              className="group relative overflow-hidden bg-white text-primary px-8 md:px-12 py-3 md:py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 shadow-xl text-center"
            >
              <span className="relative z-10">
                {isMobile ? 'View Properties →' : 'Discover Exclusive Rentals →'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </Link>
            
            {!isMobile && (
              <Link 
                to="/contact" 
                className="group relative overflow-hidden bg-transparent text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-bold border-2 border-white/50 hover:border-white transition-all duration-300 hover:bg-white/10 text-center"
              >
                <span className="relative z-10">Schedule Private Viewing</span>
                <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </Link>
            )}
          </div>

          {/* Mobile-only quick contact */}
          {isMobile && (
            <div className="mt-6 animate-fade-in-up delay-700">
              <a 
                href="tel:+15551234567" 
                className="inline-flex items-center gap-2 text-white text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Agent: (555) 123-4567
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

      {/* Featured Properties Section */}
      <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-20">
            <span className="text-accent font-semibold tracking-widest text-sm md:text-lg uppercase block mb-2 md:mb-4 animate-fade-in-down">
              CURATED SELECTION
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 md:mb-8 leading-tight animate-slide-up">
              Signature <span className="text-accent">Residences</span>
            </h2>
            <p className="text-base md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-300">
              Each property in our portfolio is meticulously selected to represent the pinnacle of luxury living and architectural excellence.
            </p>
          </div>

          {/* Properties Grid - Different layout for mobile vs desktop */}
          <div className={
            isMobile 
              ? 'space-y-6'  // Stacked on mobile
              : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'  // Grid on desktop
          }>
            {featuredProperties.map((property, index) => (
              <div 
                key={property.id}
                className={`group relative bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  !isMobile ? 'hover:-translate-y-2' : ''
                } overflow-hidden animate-fade-in-up`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Property Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      property.type === 'Premium' ? 'bg-accent text-white' :
                      property.type === 'Exclusive' ? 'bg-red-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {property.type}
                    </span>
                  </div>
                  
                  {/* Hover Overlay (Desktop only) */}
                  {!isMobile && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                      <div className="p-6 text-white w-full">
                        <div className="text-2xl font-bold">${property.price.toLocaleString()}/month</div>
                        <div className="text-sm opacity-90">{property.location}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {property.amenities.slice(0, 2).map((amenity, i) => (
                            <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Property Details */}
                <div className="p-4 md:p-6">
                  {/* Mobile Layout */}
                  {isMobile ? (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <svg className="w-4 h-4 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {property.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">${property.price.toLocaleString()}<span className="text-sm font-normal text-gray-600">/mo</span></div>
                        <div className="text-xs text-gray-500">{property.squareFeet.toLocaleString()} sq ft</div>
                      </div>
                    </div>
                  ) : (
                    /* Desktop Layout */
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h3>
                        <div className="flex items-center text-gray-600 mb-3">
                          <svg className="w-5 h-5 mr-2 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>{property.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-accent">${property.price.toLocaleString()}<span className="text-lg font-normal text-gray-600">/month</span></div>
                        <div className="text-sm text-gray-500">{property.squareFeet.toLocaleString()} sq ft</div>
                      </div>
                    </div>
                  )}

                  {/* Property Features */}
                  <div className="border-t border-gray-200 pt-4 md:pt-6">
                    {/* Features Grid */}
                    <div className="flex justify-between text-gray-600 mb-4 md:mb-6">
                      <div className="text-center">
                        <div className={`font-bold text-primary ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                          {property.bedrooms}
                        </div>
                        <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                          Bed{property.bedrooms !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold text-primary ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                          {property.bathrooms}
                        </div>
                        <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                          Bath{property.bathrooms !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold text-primary ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                          {property.type === 'Premium' ? '3' : property.type === 'Exclusive' ? 'Infinity' : 'Rooftop'}
                        </div>
                        <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {property.type === 'Premium' ? 'Garage' : property.type === 'Exclusive' ? 'Pool' : 'Terrace'}
                        </div>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <Link 
                      to={`/properties/${property.id}`}
                      className="block w-full text-center bg-primary text-white py-3 md:py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors duration-300 group"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                        View Property Details →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12 md:mt-20">
            <Link 
              to="/properties" 
              className="inline-flex items-center gap-3 md:gap-4 text-primary text-lg md:text-2xl font-semibold hover:text-accent transition-colors duration-300 group"
            >
              <span>Explore Our Complete Portfolio</span>
              <svg className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} group-hover:translate-x-2 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Different for mobile/desktop */}
      <section className={`${isMobile ? 'py-12' : 'py-20 md:py-24'} bg-primary relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className={`max-w-6xl mx-auto ${isMobile ? 'px-4' : 'px-6'} text-center relative z-10`}>
          <h2 className={`font-bold text-white mb-4 md:mb-8 ${
            isMobile ? 'text-2xl' : 'text-4xl md:text-5xl lg:text-7xl'
          }`}>
            Experience <span className="text-accent">Unparalleled</span> Service
          </h2>
          <p className={`text-white/90 mb-6 md:mb-12 max-w-3xl mx-auto leading-relaxed ${
            isMobile ? 'text-sm' : 'text-xl md:text-2xl'
          }`}>
            Our dedicated team of luxury property specialists is committed to providing exceptional service tailored to your unique requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center">
            <Link 
              to="/contact" 
              className={`group relative overflow-hidden bg-accent text-white font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 shadow-xl text-center ${
                isMobile 
                  ? 'px-8 py-3 rounded-lg text-base'
                  : 'px-12 py-4 rounded-full text-lg md:text-xl'
              }`}
            >
              <span className="relative z-10">
                {isMobile ? 'Contact Agent' : 'Contact Luxury Advisor'}
              </span>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </Link>
            
     