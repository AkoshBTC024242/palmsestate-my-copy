import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../lib/supabase';
import { ArrowRight, Shield, Star, Globe, Clock } from 'lucide-react';

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const properties = await fetchProperties();
      // Show first 3 properties as featured
      setFeaturedProperties(properties.slice(0, 3));
    } catch (error) {
      console.error('Failed to load featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Professional Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-orange-900/10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811')] bg-cover bg-center opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">WORLD'S FINEST LUXURY RENTALS</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Discover <span className="text-amber-400">Extraordinary</span> Living
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl">
              Exclusive access to the world's most prestigious residences, curated for those who appreciate uncompromising excellence in luxury living.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-8 py-4 rounded-lg font-sans font-semibold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                Explore Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-sans font-semibold hover:bg-white/20 transition-colors"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-sans font-semibold text-gray-800 mb-2">Verified Properties</h3>
              <p className="text-gray-600 text-sm">Thoroughly vetted luxury residences</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Globe className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-sans font-semibold text-gray-800 mb-2">Global Portfolio</h3>
              <p className="text-gray-600 text-sm">Prime locations worldwide</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-sans font-semibold text-gray-800 mb-2">5-Star Service</h3>
              <p className="text-gray-600 text-sm">Dedicated concierge team</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-sans font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Always available for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Curated Selections
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Each property in our portfolio represents the pinnacle of luxury living, architectural excellence, and uncompromising privacy.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.image_url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white text-gray-800 font-sans font-semibold rounded-full text-xs">
                        ${property.price_per_week?.toLocaleString()}/week
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-4">{property.location}</p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-800">{property.bedrooms}</span> beds ·{' '}
                        <span className="font-medium text-gray-800">{property.bathrooms}</span> baths
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {property.status === 'available' ? 'Available' : 'Reserved'}
                      </span>
                    </div>
                    
                    <Link
                      to={`/property/${property.id}`}
                      className="block w-full text-center bg-amber-50 text-amber-700 font-sans font-semibold py-3 px-6 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-sans font-semibold text-lg"
            >
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;