import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties, testConnection } from '../lib/supabase';
import { ArrowRight, Shield, Star, Globe, Clock, Search, Filter, Check, Users } from 'lucide-react';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-950 text-white overflow-hidden">
        {/* Professional Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Estate"
            className="w-full h-full object-cover opacity-40"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Star className="w-3 h-3 mr-2" />
              <span className="text-xs font-medium uppercase tracking-wider">WORLD-CLASS RESIDENCES</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Exceptional <span className="text-primary-400">Living</span><br />
              Awaits
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl">
              Access premium residences through our exclusive property portfolio. Experience unparalleled service and discretion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300"
              >
                View Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Request Information
              </Link>
            </div>

            {/* Quick Search */}
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Destination</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Residence Type</label>
                  </div>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">All Types</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="estate">Estate</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-xl transition-all">
                    Find Properties
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.properties}+</div>
              <p className="text-gray-600 font-medium">Premium Properties</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.countries}</div>
              <p className="text-gray-600 font-medium">Destinations</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.satisfiedClients}+</div>
              <p className="text-gray-600 font-medium">Satisfied Clients</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.responseTime}</div>
              <p className="text-gray-600 font-medium">Minute Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Each residence is selected to represent the highest standard of luxury living and architectural excellence.
              </p>
            </div>
            <Link
              to="/properties"
              className="mt-4 md:mt-0 inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-64 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white text-gray-800 text-xs font-semibold rounded-full">
                        ${property.price_per_week?.toLocaleString()}/week
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status === 'available' ? 'Available' : 'Reserved'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      {property.location}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{property.bedrooms}</span> beds ·{' '}
                        <span className="font-medium text-gray-900">{property.bathrooms}</span> baths ·{' '}
                        <span className="font-medium text-gray-900">{property.square_feet?.toLocaleString()}</span> sq ft
                      </div>
                    </div>
                    
                    <Link
                      to={`/property/${property.id}`}
                      className="block w-full text-center bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
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
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Available</h3>
              <p className="text-gray-600 mb-6">Check back soon for new listings.</p>
              <button
                onClick={loadData}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
              >
                Try Loading Again
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Palms Estate
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide exceptional service and access to premium residences worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Properties</h3>
              <p className="text-gray-600">
                Every property undergoes thorough verification for quality and authenticity.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is available around the clock to assist with any requests.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Service</h3>
              <p className="text-gray-600">
                Tailored assistance to meet your specific needs and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-orange-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Begin Your Journey
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
            Join clients who have found their ideal residence through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Properties
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
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