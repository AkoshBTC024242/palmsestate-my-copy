import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties, testConnection } from '../lib/supabase';
import { ArrowRight, Shield, Star, Globe, Clock, Search, Filter, Check, Users, Building2 } from 'lucide-react';

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    countries: 0,
    satisfiedClients: 0,
    responseTime: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Test connection first
      const connection = await testConnection();
      console.log('Connection test result:', connection);
      
      // Load properties
      const properties = await fetchProperties();
      console.log('Properties loaded:', properties.length);
      setFeaturedProperties(properties.slice(0, 6));
      
      // Set stats
      setStats({
        properties: properties.length,
        countries: 24,
        satisfiedClients: 892,
        responseTime: 15
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - FIXED: Replace max-w-7xl with container-fluid */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-950 text-white overflow-hidden">
        {/* Professional Background Image */}
        <div className="absolute inset-0">
          <picture>
            <source 
              media="(max-width: 640px)" 
              srcSet="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
            />
            <source 
              media="(max-width: 1024px)" 
              srcSet="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=80"
              alt="Luxury Estate"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        
        {/* UPDATED: container-fluid */}
        <div className="container-fluid relative py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Star className="w-3 h-3 mr-2" />
              <span className="text-xs font-medium uppercase tracking-wider">WORLD-CLASS RESIDENCES</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 md:mb-6">
              Exceptional <span className="text-primary-400">Living</span><br />
              Awaits
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl">
              Access premium residences through our exclusive property portfolio. Experience unparalleled service and discretion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-12 md:mb-16">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-orange-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 min-h-[52px] touch-manipulation"
              >
                View Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors min-h-[52px] touch-manipulation"
              >
                Request Information
              </Link>
            </div>

            {/* Quick Search - IMPROVED: Better mobile layout */}
            <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 max-w-3xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Destination</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base md:text-lg"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Residence Type</label>
                  </div>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base md:text-lg">
                    <option value="">All Types</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="estate">Estate</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button className="w-full md:w-auto px-6 md:px-8 py-3 bg-gradient-to-r from-primary-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-xl transition-all min-h-[52px] touch-manipulation">
                    Find Properties
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - FIXED: container-fluid */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-fluid">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-4 md:p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 md:mb-2">{stats.properties}+</div>
              <p className="text-sm md:text-base text-gray-600 font-medium">Premium Properties</p>
            </div>
            
            <div className="text-center p-4 md:p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 md:mb-2">{stats.countries}</div>
              <p className="text-sm md:text-base text-gray-600 font-medium">Destinations</p>
            </div>
            
            <div className="text-center p-4 md:p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 md:mb-2">{stats.satisfiedClients}+</div>
              <p className="text-sm md:text-base text-gray-600 font-medium">Satisfied Clients</p>
            </div>
            
            <div className="text-center p-4 md:p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 md:mb-2">{stats.responseTime}</div>
              <p className="text-sm md:text-base text-gray-600 font-medium">Minute Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - FIXED: container-fluid */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container-fluid">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
                Featured Properties
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl">
                Each residence is selected to represent the highest standard of luxury living and architectural excellence.
              </p>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-base md:text-lg min-h-[44px] touch-manipulation"
            >
              View All Properties
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 md:h-64 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 md:p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 md:top-4 md:left-4">
                      <span className="px-3 py-1 bg-white text-gray-800 text-xs font-semibold rounded-full shadow-md">
                        ${property.price_per_week?.toLocaleString()}/week
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-md ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status === 'available' ? 'Available' : 'Reserved'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-gray-600 mb-3 md:mb-4 flex items-center text-sm md:text-base">
                      <Globe className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div className="text-xs md:text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{property.bedrooms}</span> beds ·{' '}
                        <span className="font-medium text-gray-900">{property.bathrooms}</span> baths ·{' '}
                        <span className="font-medium text-gray-900">{property.square_feet?.toLocaleString()}</span> sq ft
                      </div>
                    </div>
                    
                    <Link
                      to={`/properties/${property.id}`}
                      className="block w-full text-center bg-gray-50 text-gray-700 font-semibold py-3 px-4 md:px-6 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 group-hover:border-primary-300 group-hover:text-primary-700 min-h-[44px] flex items-center justify-center touch-manipulation"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && featuredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Building2 className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No Properties Available</h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Check back soon for new listings.</p>
              <button
                onClick={loadData}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm md:text-base min-h-[44px] touch-manipulation"
              >
                Try Loading Again
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us - FIXED: container-fluid */}
      <section className="bg-white py-12 md:py-20">
        <div className="container-fluid">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Why Choose Palms Estate
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              We provide exceptional service and access to premium residences worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 md:p-8 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-white">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Verified Properties</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Every property undergoes thorough verification for quality and authenticity.
              </p>
            </div>
            
            <div className="text-center p-6 md:p-8 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-white">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">24/7 Support</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Our team is available around the clock to assist with any requests.
              </p>
            </div>
            
            <div className="text-center p-6 md:p-8 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-white">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Personalized Service</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Tailored assistance to meet your specific needs and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - FIXED: container-fluid */}
      <section className="bg-gradient-to-r from-primary-600 to-orange-500 py-12 md:py-20">
        <div className="container-fluid text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            Begin Your Journey
          </h2>
          <p className="text-primary-100 text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
            Join clients who have found their ideal residence through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center bg-white text-primary-700 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors min-h-[52px] touch-manipulation"
            >
              Explore Properties
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors min-h-[52px] touch-manipulation"
            >
              Request Information
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
