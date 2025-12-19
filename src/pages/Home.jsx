import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../lib/supabase';
import { ArrowRight, Shield, Star, Globe, Clock, Search, Filter, Check } from 'lucide-react';

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
    loadFeaturedProperties();
    loadStats();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const properties = await fetchProperties();
      setFeaturedProperties(properties.slice(0, 6));
    } catch (error) {
      console.error('Failed to load featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    // Mock stats - in production, fetch from API
    setStats({
      properties: 156,
      countries: 24,
      satisfiedClients: 892,
      responseTime: 15
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-950 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Villa"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Star className="w-3 h-3 mr-2" />
              <span className="text-xs font-medium uppercase tracking-wider">PREMIUM LUXURY RENTALS</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Discover <span className="text-primary-400">Exclusive</span><br />
              Living Experiences
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl">
              Access the world's most prestigious residences through our curated portfolio of luxury properties. Experience unparalleled service and privacy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300"
              >
                Explore Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Schedule Consultation
              </Link>
            </div>

            {/* Quick Search Bar */}
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Location</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter city, country, or region"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Property Type</label>
                  </div>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">All Types</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="estate">Estate</option>
                    <option value="chalet">Chalet</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-xl transition-all">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.properties}+</div>
              <p className="text-gray-600 font-medium">Premium Properties</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.countries}</div>
              <p className="text-gray-600 font-medium">Countries</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.satisfiedClients}+</div>
              <p className="text-gray-600 font-medium">Satisfied Clients</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.responseTime}</div>
              <p className="text-gray-600 font-medium">Minute Response Time</p>
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
                Curated Selection
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Each property is meticulously selected to represent the pinnacle of luxury living, architectural excellence, and uncompromising privacy.
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
                  <div className="h-64 shimmer"></div>
                  <div className="p-6">
                    <div className="h-6 w-3/4 shimmer mb-3"></div>
                    <div className="h-4 w-1/2 shimmer mb-4"></div>
                    <div className="h-4 w-full shimmer"></div>
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
                      src={property.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4'}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
              We provide an unmatched luxury rental experience with personalized service and exclusive access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Properties</h3>
              <p className="text-gray-600">
                Every property undergoes thorough verification to ensure quality, safety, and authenticity.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Concierge</h3>
              <p className="text-gray-600">
                Our dedicated team is available around the clock to assist with any requests or concerns.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary-50 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exclusive Access</h3>
              <p className="text-gray-600">
                Gain access to properties not available on the general market through our private network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-orange-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Luxury Retreat?
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have found their perfect luxury rental through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;