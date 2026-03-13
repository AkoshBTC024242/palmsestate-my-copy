import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, Sparkles, Heart, MapPin, ArrowRight, 
  CheckCircle, Star, BedDouble, Bath, Square,
  Camera, Wifi, Wind, Sun, Waves, Gem,
  Phone, Mail, Calendar, Shield, Award,
  Users, Globe, Lock, Key, Diamond
} from 'lucide-react';
import { supabase } from '../lib/supabase';

function Exclusive() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchExclusiveProperties();
  }, []);

  const fetchExclusiveProperties = async () => {
    try {
      setLoading(true);
      // For demo, we'll fetch premium properties (price > $1M or marked exclusive)
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .gte('price', 1000000)
        .limit(6);

      const { data, error } = await query;

      if (!error && data) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId));
    } else {
      setFavorites([...favorites, propertyId]);
    }
  };

  const getPropertyImage = (property) => {
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0];
    }
    if (property.image_url) {
      return property.image_url;
    }
    return null;
  };

  const exclusiveBenefits = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Off-Market Access',
      description: 'Properties never listed publicly, available only to our exclusive clientele.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Complete Privacy',
      description: 'Discreet transactions with NDAs and confidential handling.'
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Priority Viewings',
      description: 'Be the first to see new exclusive listings before anyone else.'
    },
    {
      icon: <Gem className="w-6 h-6" />,
      title: 'Curated Selection',
      description: 'Each property personally vetted by our executive team.'
    }
  ];

  const featuredExclusives = [
    {
      name: 'Waterfront Estate',
      location: 'Miami Beach, FL',
      price: '$12,500,000',
      features: ['7 beds', '9 baths', '10,000 sqft', 'Private dock'],
      image: '🏖️',
      exclusive: true
    },
    {
      name: 'Penthouse Collection',
      location: 'New York, NY',
      price: '$8,900,000',
      features: ['4 beds', '5 baths', '4,500 sqft', 'Terrace'],
      image: '🗽',
      exclusive: true
    },
    {
      name: 'Private Island',
      location: 'Exuma, Bahamas',
      price: '$25,000,000',
      features: ['6 beds', '7 baths', '15 acres', 'Helipad'],
      image: '🏝️',
      exclusive: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Crown className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                EXCLUSIVE HOMES
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              Beyond the{' '}
              <span className="text-[#F97316] font-medium">Market</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
              A curated collection of the world's most extraordinary properties – many available 
              exclusively through Palms Estate and never seen on public listing sites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl hover:bg-[#EA580C] transition-all duration-300"
              >
                <Diamond className="w-5 h-5" />
                Request Access
              </Link>
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('benefits').offsetTop, behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
            <div className="text-3xl font-light text-[#F97316] mb-2">$2.5B+</div>
            <div className="text-[#A1A1AA] text-sm">Exclusive Portfolio</div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
            <div className="text-3xl font-light text-[#F97316] mb-2">75%</div>
            <div className="text-[#A1A1AA] text-sm">Off-Market Deals</div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
            <div className="text-3xl font-light text-[#F97316] mb-2">150+</div>
            <div className="text-[#A1A1AA] text-sm">Active Exclusives</div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
            <div className="text-3xl font-light text-[#F97316] mb-2">35+</div>
            <div className="text-[#A1A1AA] text-sm">Countries</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Award className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              EXCLUSIVE BENEFITS
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Privileges of the{' '}
            <span className="text-[#F97316] font-medium">Inner Circle</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exclusiveBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-[#F97316]">{benefit.icon}</div>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{benefit.title}</h3>
              <p className="text-[#A1A1AA]">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Exclusives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Gem className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                  FEATURED EXCLUSIVES
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            The World's Finest{' '}
            <span className="text-[#F97316] font-medium">Properties</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredExclusives.map((property, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#18181B] to-[#0A0A0A] border border-[#27272A] rounded-3xl overflow-hidden hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48 bg-gradient-to-br from-[#F97316]/20 to-[#EA580C]/20 flex items-center justify-center">
                <span className="text-7xl">{property.image}</span>
                {property.exclusive && (
                  <div className="absolute top-4 right-4 bg-[#F97316] text-white px-4 py-1 rounded-full text-xs font-medium">
                    Exclusive
                  </div>
                )}
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-light text-white mb-2">{property.name}</h3>
                <div className="flex items-center gap-2 text-[#A1A1AA] mb-4">
                  <MapPin className="w-4 h-4 text-[#F97316]" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#0A0A0A] border border-[#27272A] rounded-full text-xs text-[#A1A1AA]">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
                  <div className="text-2xl font-light text-[#F97316]">{property.price}</div>
                  <Link
                    to="/contact"
                    className="text-[#A1A1AA] hover:text-[#F97316] transition-colors text-sm flex items-center gap-1"
                  >
                    Inquire
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exclusive Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl font-light text-white">Current Exclusive Collection</h2>
          <Link to="/properties" className="text-[#F97316] hover:text-[#F97316]/80 transition-colors flex items-center gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#18181B] border border-[#27272A] rounded-3xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => {
              const propertyImage = getPropertyImage(property);
              return (
                <div
                  key={property.id}
                  className="bg-[#18181B] border border-[#27272A] rounded-3xl overflow-hidden hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    {propertyImage ? (
                      <img
                        src={propertyImage}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F97316]/10 flex items-center justify-center">
                        <Home className="w-16 h-16 text-[#F97316]/30" />
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#F97316] transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(property.id) ? 'fill-white text-white' : 'text-white'}`} />
                    </button>
                    <div className="absolute top-4 left-4 bg-[#F97316] text-white px-3 py-1 rounded-full text-xs">
                      Exclusive
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
                    <div className="flex items-center gap-4 text-sm text-[#A1A1AA] mb-4">
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="w-4 h-4" /> {property.sqft || '3,500'} sqft
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
                      <div className="text-2xl font-light text-[#F97316]">
                        ${parseFloat(property.price).toLocaleString()}
                      </div>
                      <Link
                        to={`/properties/${property.id}`}
                        className="text-[#A1A1AA] hover:text-[#F97316] transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#18181B] border border-[#27272A] rounded-3xl">
            <Crown className="w-16 h-16 text-[#F97316]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-light text-white mb-2">No Exclusive Properties Found</h3>
            <p className="text-[#A1A1AA]">Please contact us for private access to off-market listings.</p>
          </div>
        )}
      </section>

      {/* Private Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-4">
                Private{' '}
                <span className="font-medium">Access</span>
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Many of our most exceptional properties never appear on public listings. 
                Request access to our private portfolio of off-market estates, penthouses, and investment opportunities.
              </p>
              <ul className="space-y-3">
                {[
                  'Off-market properties only',
                  'Pre-qualified buyers only',
                  'Confidential handling guaranteed',
                  'Personal portfolio curation'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="text-xl text-white mb-4">Request Private Access</h3>
              <p className="text-white/80 text-sm mb-6">
                Complete our confidential buyer profile to gain access to our exclusive portfolio.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-black text-white w-full py-4 rounded-xl hover:bg-[#0A0A0A] transition-colors"
              >
                <Lock className="w-5 h-5" />
                Request Access
              </Link>
              <p className="text-white/60 text-xs text-center mt-4">
                All inquiries handled with complete confidentiality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: "The off-market property they found for us exceeded anything we'd seen publicly. True professionals.",
              author: "Elizabeth Wellington",
              role: "Private Client",
              rating: 5
            },
            {
              quote: "Their exclusive network gave us access to properties before they ever hit the market.",
              author: "Robert Chen",
              role: "Collector",
              rating: 5
            },
            {
              quote: "Complete discretion and exceptional properties. The only way to buy luxury real estate.",
              author: "The Hamilton Family",
              role: "Estate Owners",
              rating: 5
            }
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <p className="text-[#E4E4E7] italic mb-6">"{testimonial.quote}"</p>
              <div className="border-t border-[#27272A] pt-4">
                <div className="text-white font-medium">{testimonial.author}</div>
                <div className="text-[#A1A1AA] text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Experience{' '}
            <span className="text-[#F97316] font-medium">True Exclusivity</span>
          </h2>
          <p className="text-[#A1A1AA] text-xl mb-8 max-w-2xl mx-auto">
            Let our team curate a selection of off-market properties tailored to your exact specifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-full hover:bg-[#EA580C] transition-colors"
            >
              <Key className="w-5 h-5" />
              Request Exclusive Access
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] border border-[#27272A] text-white px-8 py-4 rounded-full hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Speak With a Curator
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Exclusive;
