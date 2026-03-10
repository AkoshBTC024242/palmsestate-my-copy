import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon, MapPin, Shield, Users, TrendingUp, Star, ChevronRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Hero from '../components/Hero'; // Import the Hero component

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [stats, setStats] = useState({ properties: 0, residents: 0, satisfaction: 0 });

  useEffect(() => {
    fetchFeaturedProperties();
    fetchStats();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .limit(3);

      if (!error && data) {
        setFeaturedProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: propertyCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      const { count: residentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        properties: propertyCount || 250,
        residents: residentCount || 800,
        satisfaction: 98
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Helper function to get property image
  const getPropertyImage = (property) => {
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0];
    }
    if (property.image_url) {
      return property.image_url;
    }
    // Return placeholder gradient
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Use the Hero component */}
      <Hero />

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Palms Estate Rentals?</h2>
            <p className="text-xl text-gray-600">Experience the best in rental property services</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Rentals',
                description: 'Your safety is our priority. All rental agreements are protected and verified.',
                color: 'orange'
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: 'Professional team ready to assist you every step of the rental process.',
                color: 'orange'
              },
              {
                icon: TrendingUp,
                title: 'Best Value',
                description: 'Competitive rental rates with the best properties across the United States.',
                color: 'orange'
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Rental Properties</h2>
                <p className="text-xl text-gray-600">Handpicked rental selections just for you</p>
              </div>
              <Link
                to="/properties"
                className="hidden sm:flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => {
                const propertyImage = getPropertyImage(property);

                return (
                  <Link
                    key={property.id}
                    to={`/properties/${property.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                      {propertyImage ? (
                        <img
                          src={propertyImage}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HomeIcon className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-600 capitalize">
                        {property.status}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-orange-600">
                          ${parseFloat(property.price).toLocaleString()}/mo
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.bedrooms} beds • {property.bathrooms} baths
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Dream Rental?
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            Join thousands of satisfied renters who found their perfect property with us.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Browse Rentals
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Years Experience', value: '15+' },
              { label: 'Rentals Available', value: '800+' },
              { label: 'Happy Renters', value: '2,500+' },
              { label: 'Awards Won', value: '35+' }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold text-orange-600">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}