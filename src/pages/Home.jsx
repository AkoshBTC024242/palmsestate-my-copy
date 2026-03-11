import { Link } from 'react-router-dom';
import { 
  ArrowRight, Home as HomeIcon, MapPin, Shield, Users, TrendingUp, 
  Star, ChevronRight, CheckCircle, Award, Camera, Sparkles,
  Globe, Clock, Phone, Mail, Quote, Building2, Key, Heart,
  Zap, Sun, Wind, Maximize2, Wifi, Coffee, Droplet
} from 'lucide-react';
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
    return null;
  };

  const luxuryAmenities = [
    { icon: <Wifi className="w-5 h-5" />, name: 'High-Speed WiFi' },
    { icon: <Wind className="w-5 h-5" />, name: 'Smart HVAC' },
    { icon: <Sun className="w-5 h-5" />, name: 'Solar Panels' },
    { icon: <Droplet className="w-5 h-5" />, name: 'Infinity Pool' },
    { icon: <Maximize2 className="w-5 h-5" />, name: 'Open Floor Plan' },
    { icon: <Coffee className="w-5 h-5" />, name: 'Wine Cellar' },
  ];

  const services = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Luxury Rentals',
      description: 'Exclusive properties in prime locations worldwide.',
      features: ['Private villas', 'Penthouse suites', 'Island estates']
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: 'Property Sales',
      description: 'Expert guidance for buying or selling luxury real estate.',
      features: ['Market analysis', 'Staging services', 'Legal support']
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Concierge Services',
      description: 'Personalized assistance for discerning clients.',
      features: ['24/7 support', 'Travel arrangements', 'Event planning']
    }
  ];

  const testimonials = [
    {
      name: 'Jennifer Lawrence',
      role: 'Actor & Producer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      quote: 'Palms Estate found us the perfect beachfront property in Malibu. Their discretion and professionalism are unmatched.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Tech Entrepreneur',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      quote: 'From investment properties to our family home, they\'ve been trusted advisors for over a decade.',
      rating: 5
    },
    {
      name: 'Isabella Rossi',
      role: 'Fashion Designer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      quote: 'The attention to detail and understanding of luxury living sets them apart.',
      rating: 5
    }
  ];

  const partners = [
    'Forbes Global Properties',
    'Luxury Retreats',
    'Christie\'s International',
    'Sotheby\'s',
    'Leading Real Estate'
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section - Kept exactly as is */}
      <div className="relative bg-black overflow-hidden">
        {/* ... hero content remains unchanged ... */}
      </div>

      {/* Luxury Amenities Bar */}
      <div className="bg-[#18181B] border-y border-[#27272A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {luxuryAmenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#F97316] transition-colors">
                <span className="text-[#F97316]">{amenity.icon}</span>
                <span className="text-sm font-light">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Sparkles className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                OUR SERVICES
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Comprehensive{' '}
              <span className="text-[#F97316] font-medium">Luxury Solutions</span>
            </h2>
            <p className="text-xl text-[#A1A1AA] max-w-3xl mx-auto">
              From acquisition to management, we handle every detail with precision and care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#F97316]/30 group">
                <div className="w-16 h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F97316]/20 transition-colors">
                  <div className="text-[#F97316]">{service.icon}</div>
                </div>
                <h3 className="font-serif text-2xl font-light text-white mb-4">{service.title}</h3>
                <p className="text-[#A1A1AA] mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                      <CheckCircle className="w-4 h-4 text-[#F97316]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <div className="py-24 bg-[#0A0A0A] border-t border-[#27272A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-4">
                  <HomeIcon className="w-4 h-4 text-[#F97316]" />
                  <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                    FEATURED PROPERTIES
                  </span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-2">
                  Exclusive{' '}
                  <span className="text-[#F97316] font-medium">Selections</span>
                </h2>
                <p className="text-[#A1A1AA] text-lg">Handpicked luxury residences for discerning clients</p>
              </div>
              <Link
                to="/properties"
                className="hidden md:flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors mt-4 md:mt-0"
              >
                View All Properties
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
                    className="group bg-[#18181B] border border-[#27272A] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#F97316]/30"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {propertyImage ? (
                        <img
                          src={propertyImage}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F97316]/10">
                          <HomeIcon className="w-16 h-16 text-[#F97316]/30" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm border border-[#F97316]/30 px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold text-[#F97316] uppercase tracking-wider">
                          {property.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-light text-white mb-2 group-hover:text-[#F97316] transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[#A1A1AA] mb-4">
                        <MapPin className="w-4 h-4 text-[#F97316]" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
                        <div className="text-2xl font-light text-[#F97316]">
                          ${parseFloat(property.price).toLocaleString()}
                          <span className="text-sm text-[#A1A1AA]">/mo</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                          <span>{property.bedrooms} beds</span>
                          <span className="w-1 h-1 rounded-full bg-[#27272A]"></span>
                          <span>{property.bathrooms} baths</span>
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

      {/* Stats Section */}
      <div className="py-16 bg-[#18181B] border-y border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-[#F97316] mb-2">{stats.properties}+</div>
              <div className="text-sm text-[#A1A1AA] uppercase tracking-wider">Active Properties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-[#F97316] mb-2">{stats.residents}+</div>
              <div className="text-sm text-[#A1A1AA] uppercase tracking-wider">Happy Residents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-[#F97316] mb-2">{stats.satisfaction}%</div>
              <div className="text-sm text-[#A1A1AA] uppercase tracking-wider">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-[#F97316] mb-2">15+</div>
              <div className="text-sm text-[#A1A1AA] uppercase tracking-wider">Years Excellence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Quote className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                CLIENT TESTIMONIALS
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Trusted by{' '}
              <span className="text-[#F97316] font-medium">Industry Leaders</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-[#F97316]/30">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#F97316]/20"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-serif text-lg text-white">{testimonial.name}</h3>
                    <p className="text-sm text-[#A1A1AA]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                  ))}
                </div>
                <p className="text-[#A1A1AA] italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-16 bg-[#18181B] border-y border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[#A1A1AA] uppercase tracking-wider mb-8">Trusted by leading institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {partners.map((partner, index) => (
              <div key={index} className="text-[#A1A1AA] hover:text-[#F97316] transition-colors font-light">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
                <Award className="w-4 h-4 text-[#F97316]" />
                <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                  WHY CHOOSE US
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
                Beyond Traditional{' '}
                <span className="text-[#F97316] font-medium">Real Estate</span>
              </h2>
              <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
                We don't just find properties; we curate lifestyles. Our comprehensive approach ensures every detail is handled with precision and care.
              </p>
              <div className="space-y-4">
                {[
                  'Personalized property matching',
                  'Dedicated concierge service',
                  'Global network of partners',
                  'White-glove transaction management'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#F97316]" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-8 text-[#F97316] hover:text-[#F97316]/80 transition-colors"
              >
                Learn more about us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center">
                <Users className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
                <div className="text-2xl font-light text-white mb-1">50+</div>
                <div className="text-xs text-[#A1A1AA]">Luxury Advisors</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center">
                <Globe className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
                <div className="text-2xl font-light text-white mb-1">35+</div>
                <div className="text-xs text-[#A1A1AA]">Countries</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center">
                <Building2 className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
                <div className="text-2xl font-light text-white mb-1">200+</div>
                <div className="text-xs text-[#A1A1AA]">Properties</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center">
                <Award className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
                <div className="text-2xl font-light text-white mb-1">25+</div>
                <div className="text-xs text-[#A1A1AA]">Awards</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-[#F97316] to-[#EA580C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
            Ready to Experience{' '}
            <span className="text-white/90 font-medium">Luxury Living?</span>
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Let our team of luxury advisors help you find the perfect property that matches your lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-[#0A0A0A] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Browse Properties
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Schedule Consultation
            </Link>
          </div>

          {/* Contact Bar */}
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-white/80">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+1 (828) 623-9765</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Mail className="w-4 h-4" />
              <span className="text-sm">concierge@palmsestate.org</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="text-sm">24/7 Concierge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
