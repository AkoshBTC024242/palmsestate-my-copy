import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon, MapPin, Shield, Users, TrendingUp, Star, ChevronRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
        properties: propertyCount || 150,
        residents: residentCount || 500,
        satisfaction: 98
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Orange Theme */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-current" />
                <span>Trusted by 500+ Happy Residents</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Dream Home <br />
                <span className="text-orange-200">Awaits You</span>
              </h1>

              <p className="text-xl text-orange-100 leading-relaxed">
                Discover premium properties in prime locations. Experience luxury living with Palms Estate - where comfort meets elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/properties"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Explore Properties
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold">{stats.properties}+</div>
                  <div className="text-orange-200 text-sm">Properties</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.residents}+</div>
                  <div className="text-orange-200 text-sm">Happy Residents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.satisfaction}%</div>
                  <div className="text-orange-200 text-sm">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                          <HomeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Modern Villa</div>
                          <div className="text-sm text-gray-600">Lagos, Nigeria</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">₦45M</div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Luxury Apartment</div>
                          <div className="text-sm text-gray-600">Lekki, Lagos</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">₦28M</div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white text-center">
                      <div className="text-3xl font-bold mb-1">500+</div>
                      <div className="text-orange-100">Properties Listed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Palms Estate?</h2>
            <p className="text-xl text-gray-600">Experience the best in real estate services</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Transactions',
                description: 'Your safety is our priority. All transactions are protected and verified.',
                color: 'orange'
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: 'Professional team ready to assist you every step of the way.',
                color: 'orange'
              },
              {
                icon: TrendingUp,
                title: 'Best Value',
                description: 'Competitive pricing with the best properties in premium locations.',
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
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Properties</h2>
                <p className="text-xl text-gray-600">Handpicked selections just for you</p>
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
              {featuredProperties.map((property) => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HomeIcon className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-600">
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
                        ₦{parseFloat(property.price).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.bedrooms} beds • {property.bathrooms} baths
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            Join thousands of satisfied residents who found their perfect property with us.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Browse Properties
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
              { label: 'Years Experience', value: '10+' },
              { label: 'Properties Sold', value: '1000+' },
              { label: 'Happy Clients', value: '500+' },
              { label: 'Awards Won', value: '25+' }
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
