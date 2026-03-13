import { Link } from 'react-router-dom';
import { 
  Building2, Key, Ship, Plane, Shield, Star, Users, Globe,
  Heart, Sparkles, Award, Clock, CheckCircle, ArrowRight,
  Home, Wifi, Wine, Coffee, Dumbbell, Waves, Wind, Sun,
  Camera, Music, Car, Lock, Zap, Briefcase, Gem,
  Crown, Compass, Calendar, Phone, Mail, MapPin,
  Utensils, Droplet, Gauge, Thermometer, Fan, Lightbulb
} from 'lucide-react';

function Services() {
  const services = [
    {
      category: 'Property Services',
      icon: <Building2 className="w-8 h-8" />,
      description: 'Exclusive access to the world\'s most extraordinary properties',
      items: [
        { 
          name: 'Luxury Villa Rentals', 
          description: 'Private villas in the most sought-after destinations worldwide',
          features: ['Beachfront estates', 'Mountain retreats', 'Private islands', 'Celebrity-owned properties']
        },
        { 
          name: 'Penthouse & Apartment Leasing', 
          description: 'Exclusive urban residences in prime city locations',
          features: ['Full-floor penthouses', 'Historic conversions', 'Modern luxury towers', 'Full-service buildings']
        },
        { 
          name: 'Property Sales & Acquisitions', 
          description: 'Strategic guidance for buying or selling luxury real estate',
          features: ['Market analysis', 'Investment strategy', 'Negotiation expertise', 'Legal coordination']
        },
        { 
          name: 'Portfolio Management', 
          description: 'Comprehensive management of multi-property portfolios',
          features: ['Asset optimization', 'Tenant relations', 'Maintenance coordination', 'Financial reporting']
        }
      ]
    },
    {
      category: 'Concierge Services',
      icon: <Heart className="w-8 h-8" />,
      description: 'Personalized assistance for every aspect of luxury living',
      items: [
        { 
          name: 'Lifestyle Management', 
          description: 'Dedicated support for daily needs and special requests',
          features: ['Personal shopping', 'Event planning', 'Travel arrangements', 'Restaurant reservations']
        },
        { 
          name: 'Private Aviation', 
          description: 'Seamless private jet charters and coordination',
          features: ['Fleet access', 'Last-minute booking', 'Ground transportation', 'Catering arrangements']
        },
        { 
          name: 'Yacht Charter & Management', 
          description: 'Luxury yacht experiences in the world\'s best destinations',
          features: ['Crewed charters', 'Crew placement', 'Maintenance oversight', 'Itinerary planning']
        },
        { 
          name: 'Art & Collectibles', 
          description: 'Expert guidance for art acquisition and collection management',
          features: ['Art advisory', 'Auction representation', 'Collection management', 'Installation services']
        }
      ]
    },
    {
      category: 'Investment Services',
      icon: <Briefcase className="w-8 h-8" />,
      description: 'Strategic investment solutions for discerning clients',
      items: [
        { 
          name: 'Real Estate Investment', 
          description: 'Identify and secure high-yield property investments',
          features: ['Market research', 'Due diligence', 'Portfolio diversification', 'Exit strategies']
        },
        { 
          name: 'Development Consulting', 
          description: 'Expert guidance for luxury development projects',
          features: ['Site selection', 'Concept development', 'Project management', 'Marketing strategy']
        },
        { 
          name: 'Tax & Legal Advisory', 
          description: 'Navigate complex international property regulations',
          features: ['International tax planning', 'Legal structure', 'Compliance', 'Wealth preservation']
        },
        { 
          name: 'Private Equity Opportunities', 
          description: 'Access to exclusive investment vehicles',
          features: ['Fund investments', 'Direct investments', 'Joint ventures', 'Syndications']
        }
      ]
    }
  ];

  const amenities = [
    { icon: <Wifi className="w-5 h-5" />, name: 'High-Speed WiFi' },
    { icon: <Wine className="w-5 h-5" />, name: 'Wine Cellar' },
    { icon: <Coffee className="w-5 h-5" />, name: 'Barista Station' },
    { icon: <Dumbbell className="w-5 h-5" />, name: 'Private Gym' },
    { icon: <Waves className="w-5 h-5" />, name: 'Infinity Pool' },
    { icon: <Wind className="w-5 h-5" />, name: 'Smart HVAC' },
    { icon: <Sun className="w-5 h-5" />, name: 'Solar Power' },
    { icon: <Camera className="w-5 h-5" />, name: 'Security System' },
    { icon: <Music className="w-5 h-5" />, name: 'Sonos Audio' },
    { icon: <Car className="w-5 h-5" />, name: 'Auto Lift' },
    { icon: <Utensils className="w-5 h-5" />, name: 'Chef\'s Kitchen' }, // Replaced Chef with Utensils
    { icon: <Lock className="w-5 h-5" />, name: 'Smart Locks' }
  ];

  const destinations = [
    { city: 'Miami', country: 'USA', properties: 45 },
    { city: 'New York', country: 'USA', properties: 62 },
    { city: 'Los Angeles', country: 'USA', properties: 38 },
    { city: 'London', country: 'UK', properties: 41 },
    { city: 'Paris', country: 'France', properties: 27 },
    { city: 'Dubai', country: 'UAE', properties: 33 }
  ];

  const testimonials = [
    {
      quote: "Their attention to detail and understanding of our needs made finding our Miami estate effortless.",
      author: "Robert & Elizabeth Chen",
      service: "Property Acquisition",
      location: "Miami Beach"
    },
    {
      quote: "The concierge team arranged everything from private jet to yacht charter for our Mediterranean vacation.",
      author: "Alexander Sterling",
      service: "Travel Concierge",
      location: "Monaco"
    },
    {
      quote: "They managed our entire property portfolio across three countries with exceptional professionalism.",
      author: "Victoria Hamilton",
      service: "Portfolio Management",
      location: "London"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Sparkles className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                EXCEPTIONAL SERVICES
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              Beyond{' '}
              <span className="text-[#F97316] font-medium">Concierge</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
              A comprehensive suite of luxury services tailored to the world's most discerning individuals. 
              From property acquisition to lifestyle management, we handle every detail with precision and discretion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl hover:shadow-[#F97316]/20 transition-all duration-300 hover:-translate-y-1"
              >
                <Phone className="w-5 h-5" />
                Schedule Consultation
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-full font-medium hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
              >
                <Building2 className="w-5 h-5" />
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      {services.map((category, idx) => (
        <section key={idx} className="py-16 first:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center">
                <div className="text-[#F97316]">{category.icon}</div>
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-2">
                  {category.category}
                </h2>
                <p className="text-[#A1A1AA] text-lg">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.items.map((service, index) => (
                <div 
                  key={index}
                  className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#F97316]/30 group"
                >
                  <h3 className="font-serif text-2xl font-light text-white mb-3 group-hover:text-[#F97316] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-[#A1A1AA] mb-6 leading-relaxed">{service.description}</p>
                  <div className="space-y-3">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                        <span className="text-[#A1A1AA] text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Amenities Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Gem className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                PREMIUM AMENITIES
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Every Luxury{' '}
              <span className="text-[#F97316] font-medium">Imaginable</span>
            </h2>
            <p className="text-xl text-[#A1A1AA] max-w-3xl mx-auto">
              Our properties feature the finest amenities for the most discerning clients.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {amenities.map((amenity, index) => (
              <div 
                key={index}
                className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center hover:border-[#F97316]/30 transition-all duration-300 group"
              >
                <div className="text-[#F97316] mb-3 flex justify-center group-hover:scale-110 transition-transform">
                  {amenity.icon}
                </div>
                <div className="text-white text-sm font-light">{amenity.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Destinations */}
      <section className="py-24 bg-[#0A0A0A] border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Globe className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                GLOBAL PRESENCE
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              World-Class Properties in{' '}
              <span className="text-[#F97316] font-medium">Prime Locations</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, index) => (
              <div 
                key={index}
                className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-white group-hover:text-[#F97316] transition-colors">
                      {dest.city}
                    </h3>
                    <p className="text-[#A1A1AA]">{dest.country}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#F97316] text-3xl font-light">{dest.properties}</div>
                    <div className="text-[#A1A1AA] text-xs uppercase tracking-wider">Properties</div>
                  </div>
                </div>
                <div className="w-full h-1 bg-[#27272A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full"
                    style={{ width: `${(dest.properties / 70) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Star className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                CLIENT EXPERIENCES
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Trusted by{' '}
              <span className="text-[#F97316] font-medium">Discerning Clients</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-[#F97316]/30"
              >
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                    ))}
                  </div>
                  <p className="text-[#E4E4E7] italic leading-relaxed">"{testimonial.quote}"</p>
                </div>
                <div className="border-t border-[#27272A] pt-6">
                  <div className="font-serif text-lg text-white mb-1">{testimonial.author}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#F97316]">{testimonial.service}</span>
                    <span className="text-[#A1A1AA]">•</span>
                    <span className="text-[#A1A1AA]">{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-[#0A0A0A] border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Compass className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                OUR PROCESS
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Seamless{' '}
              <span className="text-[#F97316] font-medium">Experience</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'We learn about your lifestyle, preferences, and aspirations.'
              },
              {
                step: '02',
                title: 'Curated Selection',
                description: 'We present properties and services tailored to your needs.'
              },
              {
                step: '03',
                title: 'Experience',
                description: 'Private viewings and personalized service presentations.'
              },
              {
                step: '04',
                title: 'Lifetime Care',
                description: 'Ongoing support and exclusive access to new opportunities.'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-serif font-light text-[#F97316]/20 mb-4">{item.step}</div>
                <h3 className="font-serif text-2xl font-light text-white mb-3">{item.title}</h3>
                <p className="text-[#A1A1AA]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Experience the{' '}
              <span className="font-medium">Difference</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let our team of luxury advisors create a personalized experience tailored to your unique lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <Calendar className="w-5 h-5" />
                Schedule Consultation
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all duration-300"
              >
                <Building2 className="w-5 h-5" />
                Browse Properties
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-white/80">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (828) 623-9765</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">concierge@palmsestate.org</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Global Offices</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
