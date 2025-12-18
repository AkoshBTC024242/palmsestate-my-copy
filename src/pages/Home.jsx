import { Link } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';

export default function Home() {
  const { device, isMobile } = useDevice();

  // Property data with premium luxury images
  const featuredProperties = [
    {
      id: '1',
      title: 'Oceanfront Villa Bianca',
      location: 'Maldives',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 5,
      bathrooms: 6,
      squareFeet: 12500,
      amenities: ['Infinity Pool', 'Private Beach', 'Helipad', 'Spa', 'Wine Cellar'],
      type: 'Exclusive'
    },
    {
      id: '2',
      title: 'Skyline Penthouse',
      location: 'Manhattan, NY',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1560448075-bb485b4d6e49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 4,
      bathrooms: 5,
      squareFeet: 8500,
      amenities: ['360° Views', 'Private Elevator', 'Smart Home', 'Wine Room', 'Terrace'],
      type: 'Penthouse'
    },
    {
      id: '3',
      title: 'Mediterranean Estate',
      location: 'Saint-Tropez, France',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 8,
      bathrooms: 10,
      squareFeet: 22000,
      amenities: ['Vineyard', 'Infinity Pool', 'Tennis Court', 'Home Theater', 'Staff Quarters'],
      type: 'Exclusive'
    },
    {
      id: '4',
      title: 'Modern Cliffside Villa',
      location: 'Big Sur, CA',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 6,
      bathrooms: 7,
      squareFeet: 9800,
      amenities: ['Ocean Views', 'Glass Walls', 'Infinity Pool', 'Home Gym', 'Library'],
      type: 'Premium'
    },
    {
      id: '5',
      title: 'Alpine Chalet',
      location: 'Aspen, CO',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
      bedrooms: 7,
      bathrooms: 8,
      squareFeet: 13500,
      amenities: ['Ski-in/Ski-out', 'Indoor Pool', 'Spa', 'Game Room', 'Wine Cellar'],
      type: 'Exclusive'
    },
    {
      id: '6',
      title: 'Urban Penthouse Loft',
      location: 'Miami Beach, FL',
      price: 38000,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 3,
      bathrooms: 4,
      squareFeet: 6800,
      amenities: ['Rooftop Pool', 'Private Bar', 'Smart Home', 'Panoramic Views', 'Concierge'],
      type: 'Penthouse'
    }
  ];

  return (
    <>
      {/* Hero Section with Glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background with Sunset Luxury Villa */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-purple-900/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
        
        {/* Hero Content with Glassmorphism Container */}
        <div className="relative z-10 w-full px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-16 shadow-2xl shadow-black/30">
              
              {/* Premium Badge with Glass Effect */}
              <div className={`mb-6 md:mb-10 animate-fade-in-down ${isMobile ? 'flex justify-center' : ''}`}>
                <span className="inline-block backdrop-blur-lg bg-white/20 text-white px-6 py-3 rounded-full text-sm tracking-widest font-sans font-light border border-white/30">
                  ✦ PREMIUM LUXURY ESTATES ✦
                </span>
              </div>
              
              {/* Main Title */}
              <h1 className={`font-serif font-bold text-white mb-4 md:mb-8 tracking-tight animate-slide-up ${
                isMobile ? 'text-4xl md:text-5xl text-center' : 'text-6xl md:text-8xl text-center'
              }`}>
                Palms <span className="text-amber-300">Estate</span>
              </h1>
              
              {/* Accent Line */}
              <div className="h-1.5 w-32 md:w-64 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mb-8 md:mb-12 animate-scale-x rounded-full"></div>
              
              {/* Subtitle */}
              <p className={`font-sans text-white/95 mb-8 md:mb-16 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in delay-300 text-center ${
                isMobile ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'
              }`}>
                Where <span className="font-bold text-amber-300">extraordinary living</span> meets the world's most 
                <span className="font-bold text-amber-300"> exclusive destinations</span>
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center animate-fade-in-up delay-500">
                <Link 
                  to="/properties" 
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-500 text-white px-10 md:px-16 py-4 md:py-5 rounded-full font-sans font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 shadow-xl text-center min-w-[200px]"
                >
                  <span className="relative z-10">
                    {isMobile ? 'View Properties →' : 'Discover Our Collection →'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                </Link>
                
                {!isMobile && (
                  <Link 
                    to="/contact" 
                    className="group relative overflow-hidden backdrop-blur-md bg-white/10 text-white px-10 md:px-16 py-4 md:py-5 rounded-full font-sans font-bold border-2 border-white/40 hover:border-white transition-all duration-300 hover:bg-white/15 text-center min-w-[200px]"
                  >
                    <span className="relative z-10">Schedule Private Viewing</span>
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  </Link>
                )}
              </div>

              {/* Mobile Contact Badge */}
              {isMobile && (
                <div className="mt-8 animate-fade-in-up delay-700 flex justify-center">
                  <div className="inline-flex items-center gap-3 backdrop-blur-md bg-white/15 text-white px-6 py-3 rounded-full border border-white/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-sans font-medium">Concierge: +1 (828) 623-9765</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Desktop Scroll Indicator */}
        {!isMobile && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Properties Section with Glassmorphism */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50/50 relative overflow-hidden">
        {/* Decorative Glass Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-amber-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header with Glassmorphism */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-block backdrop-blur-md bg-white/60 border border-gray-200/50 rounded-2xl px-8 py-4 mb-6 md:mb-10 shadow-lg">
              <span className="font-sans text-amber-600 font-semibold tracking-widest text-sm md:text-base uppercase">
                ✦ CURATED SELECTION ✦
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 md:mb-10 leading-tight animate-slide-up">
              Signature <span className="text-amber-600">Residences</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="font-sans text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed animate-fade-in delay-300">
                Each property in our portfolio is <span className="font-semibold text-gray-800">meticulously selected</span> to represent the pinnacle of luxury living, 
                <span className="font-semibold text-gray-800"> architectural excellence</span>, and <span className="font-semibold text-gray-800">uncompromising privacy</span>.
              </p>
            </div>
          </div>

          {/* Properties Grid with Glass Cards */}
          <div className={
            isMobile 
              ? 'grid grid-cols-1 gap-8'  
              : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'
          }>
            {featuredProperties.map((property, index) => (
              <div 
                key={property.id}
                className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  !isMobile ? 'hover:-translate-y-3' : ''
                } animate-fade-in-up border border-gray-100`}
                style={{ animationDelay: isMobile ? '0ms' : `${index * 100}ms` }}
              >
                {/* Image Container with Glass Overlay */}
                <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Property Type Badge with Glass Effect */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider backdrop-blur-md border ${
                      property.type === 'Exclusive' 
                        ? 'bg-red-500/90 text-white border-red-400/50' 
                        : property.type === 'Penthouse'
                        ? 'bg-blue-500/90 text-white border-blue-400/50'
                        : 'bg-amber-500/90 text-white border-amber-400/50'
                    }`}>
                      {property.type}
                    </span>
                  </div>
                  
                  {/* Price Overlay */}
                  <div className="absolute top-4 right-4 backdrop-blur-md bg-black/40 border border-white/20 rounded-xl px-4 py-2">
                    <div className="font-sans font-bold text-white text-lg">
                      ${property.price.toLocaleString()}<span className="text-sm font-normal opacity-90">/week</span>
                    </div>
                  </div>
                  
                  {/* Hover Glass Overlay */}
                  <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                    <div className="w-full backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="text-2xl font-serif font-bold text-white mb-2">{property.title}</div>
                      <div className="font-sans text-white/90 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {property.location}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="font-sans text-xs bg-white/30 text-white px-3 py-1.5 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6 md:p-8">
                  {/* Property Title and Location */}
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 font-sans">
                      <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{property.location}</span>
                    </div>
                  </div>

                  {/* Property Stats with Glass Effect */}
                  <div className="backdrop-blur-sm bg-gray-50/50 border border-gray-200/50 rounded-2xl p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                        <div className="font-sans text-sm text-gray-600">Bedrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                        <div className="font-sans text-sm text-gray-600">Bathrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-gray-900">
                          {(property.squareFeet / 1000).toFixed(1)}k
                        </div>
                        <div className="font-sans text-sm text-gray-600">Sq Ft</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* View Details Button */}
                  <Link 
                    to={`/properties/${property.id}`}
                    className="block w-full text-center bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-xl font-sans font-bold hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                  >
                    <span className="group-hover:translate-x-2 inline-block transition-transform duration-300">
                      View Property Details →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16 md:mt-24">
            <Link 
              to="/properties" 
              className="inline-flex items-center gap-4 font-sans text-gray-900 text-lg md:text-xl font-semibold hover:text-amber-600 transition-colors duration-300 group"
            >
              <span>Explore Our Complete Portfolio</span>
              <svg className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with Orange Glassmorphism */}
      <section className={`${isMobile ? 'py-16' : 'py-24 md:py-32'} relative overflow-hidden`}>
        {/* Orange Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/95 via-orange-500/95 to-amber-600/95 backdrop-blur-sm"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.8' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className={`max-w-6xl mx-auto ${isMobile ? 'px-4' : 'px-6'} relative z-10`}>
          {/* Glassmorphism Container */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl p-8 md:p-16 text-center shadow-2xl">
            <h2 className={`font-serif font-bold text-white mb-6 md:mb-10 ${
              isMobile ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl lg:text-7xl'
            }`}>
              Experience <span className="text-amber-200">Unparalleled</span> Service
            </h2>
            
            <p className={`font-sans text-white/95 mb-8 md:mb-16 max-w-3xl mx-auto leading-relaxed ${
              isMobile ? 'text-base md:text-lg' : 'text-xl md:text-2xl'
            }`}>
              Our dedicated team of luxury property specialists provides 
              <span className="font-semibold text-amber-200"> white-glove service</span> and 
              <span className="font-semibold text-amber-200"> exclusive access</span> to the world's most sought-after residences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center">
              <Link 
                to="/contact" 
                className={`group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white font-sans font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 shadow-xl text-center ${
                  isMobile 
                    ? 'px-10 py-4 rounded-full text-base min-w-[200px]'
                    : 'px-14 py-5 rounded-full text-lg md:text-xl min-w-[240px]'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {isMobile ? 'Contact Concierge' : 'Contact Luxury Advisor'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </Link>
              
              <Link 
                to="/about" 
                className={`group relative overflow-hidden backdrop-blur-md bg-white/15 text-white font-sans font-bold transition-all duration-300 hover:bg-white/25 text-center border border-white/40 ${
                  isMobile 
                    ? 'px-10 py-4 rounded-full text-base min-w-[200px]'
                    : 'px-14 py-5 rounded-full text-lg md:text-xl min-w-[240px]'
                }`}
              >
                <span className="relative z-10">
                  Meet Our Team
                </span>
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-10 md:mt-16 pt-8 border-t border-white/20">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 font-sans text-white/90">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">+1 (828) 623-9765</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">admin@palmsestate.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Worldwide Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;