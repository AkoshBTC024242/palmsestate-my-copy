import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties, testConnection } from '../lib/supabase';
import { 
  ArrowRight, Shield, Clock, Users, Search, Filter,
  Building2, MapPin, Bed, Bath, Maximize, Eye, Heart,
  CheckCircle, Award, Sparkles, ChevronRight
} from 'lucide-react';

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [stats, setStats] = useState({
    properties: 0,
    countries: 0,
    satisfiedClients: 0,
    responseTime: 0
  });

  useEffect(() => {
    loadData();
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    try {
      const connection = await testConnection();
      const properties = await fetchProperties();
      setFeaturedProperties(properties.slice(0, 6));
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

  // Premium luxury property showcase
  const luxuryShowcase = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Seaside Villa Mirage',
      location: 'Monte Carlo, Monaco',
      price: '$85,000',
      period: '/month',
      beds: 8,
      baths: 10,
      sqft: '25,000',
      features: ['Ocean View', 'Infinity Pool', 'Private Beach', 'Smart Home']
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1613977257362-21c8ed85e0c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Skyline Penthouse',
      location: 'New York, USA',
      price: '$125,000',
      period: '/month',
      beds: 6,
      baths: 8,
      sqft: '12,500',
      features: ['Panoramic Views', 'Private Elevator', 'Wine Cellar', '24/7 Concierge']
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1613977257364-21c8ed85e0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Alpine Chalet',
      location: 'Swiss Alps, Switzerland',
      price: '$65,000',
      period: '/month',
      beds: 10,
      baths: 12,
      sqft: '18,000',
      features: ['Ski-in/Ski-out', 'Spa', 'Home Theater', 'Wine Cellar']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* ===== PREMIUM HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Full-screen luxury villa background - High resolution */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-gray-900/10 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=3000&q=80"
            alt="Luxury Villa Sunset"
            className="w-full h-full object-cover"
            loading="eager"
            onLoad={() => setHeroLoaded(true)}
          />
        </div>

        {/* Hero Content - Centered and Elegant */}
        <div className="container-fluid relative z-20">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Subtle Tagline */}
            <div className="mb-8">
              <span className="text-sm tracking-[0.3em] uppercase text-white/80 font-medium">
                Exclusive Properties Worldwide
              </span>
            </div>

            {/* Main Headline - Elegant Serif Typography */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1]">
              Exceptional <span className="text-amber-400">Living</span> Awaits
            </h1>

            {/* Subtitle - Clean and Professional */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-sans tracking-wide">
              Access premium residences through our exclusive property portfolio. 
              Experience unparalleled service and discretion in every detail.
            </p>

            {/* CTA Button - Large and Elegant */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold text-lg py-5 px-12 rounded-none hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-w-[240px]"
              >
                <span>View Properties</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-4 border-2 border-white text-white font-bold text-lg py-5 px-12 rounded-none hover:bg-white/10 transition-all duration-300 min-w-[240px]"
              >
                <span>Request Information</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Minimal */}
        <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 ${
          heroLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex flex-col items-center">
            <span className="text-white/60 text-xs tracking-[0.3em] uppercase mb-3">EXPLORE</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/80 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION - Clean and Minimal ===== */}
      <section className="py-20 bg-white">
        <div className="container-fluid">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { value: '250+', label: 'Premium Properties', icon: <Building2 className="w-6 h-6" /> },
              { value: '24', label: 'Destinations', icon: <MapPin className="w-6 h-6" /> },
              { value: '892+', label: 'Satisfied Clients', icon: <Users className="w-6 h-6" /> },
              { value: '15', label: 'Minute Response', icon: <Clock className="w-6 h-6" /> }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-amber-200"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-amber-50 text-amber-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 font-serif">
                  {stat.value}
                </div>
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES - Premium Showcase ===== */}
      <section className="py-24 bg-gray-50">
        <div className="container-fluid">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                Curated Selection
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-amber-600">Properties</span>
            </h2>
            <p className="text-lg text-gray-600">
              Each residence is selected to represent the highest standard of luxury living and architectural excellence.
            </p>
          </div>

          {/* Premium Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {luxuryShowcase.map((property) => (
              <div 
                key={property.id}
                className="group bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl"
              >
                {/* Property Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Price Tag */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white px-4 py-2 shadow-lg">
                      <span className="font-bold text-gray-900">{property.price}</span>
                      <span className="text-gray-600 text-sm">{property.period}</span>
                    </div>
                  </div>
                  
                  {/* Favorite Button */}
                  <button className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                
                {/* Property Details */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">{property.title}</h3>
                  <p className="text-gray-600 mb-6 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  
                  {/* Property Features */}
                  <div className="flex items-center justify-between py-6 border-t border-b border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Bed className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">{property.beds}</span>
                      </div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Beds</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Bath className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">{property.baths}</span>
                      </div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Baths</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Maximize className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">{property.sqft}</span>
                      </div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Sq Ft</span>
                    </div>
                  </div>
                  
                  {/* View Details Button */}
                  <Link
                    to={`/properties/${property.id}`}
                    className="mt-8 block w-full text-center border-2 border-gray-900 text-gray-900 font-semibold py-4 px-6 hover:bg-gray-900 hover:text-white transition-all duration-300 group"
                  >
                    <span className="flex items-center justify-center gap-3">
                      View Details
                      <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-4 border-2 border-amber-600 text-amber-600 font-bold py-4 px-12 hover:bg-amber-600 hover:text-white transition-all duration-300"
            >
              <span>Explore All Properties</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US - Clean and Professional ===== */}
      <section className="py-24 bg-white">
        <div className="container-fluid">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-amber-600">Palms Estate</span>
            </h2>
            <p className="text-lg text-gray-600">
              We provide exceptional service and access to premium residences worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Verified Properties',
                description: 'Every property undergoes thorough verification for quality and authenticity.',
                color: 'bg-blue-50 text-blue-600'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: '24/7 Support',
                description: 'Our team is available around the clock to assist with any requests.',
                color: 'bg-emerald-50 text-emerald-600'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Personalized Service',
                description: 'Tailored assistance to meet your specific needs and preferences.',
                color: 'bg-amber-50 text-amber-600'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="text-center p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mx-auto mb-8`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEARCH FORM - Elegant and Functional ===== */}
      <section className="py-20 bg-gray-900">
        <div className="container-fluid">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Find Your <span className="text-amber-300">Dream Residence</span>
              </h2>
              <p className="text-lg text-gray-300">
                Begin your journey to exceptional living.
              </p>
            </div>

            {/* Clean Search Form */}
            <div className="bg-white p-8 md:p-12 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Search className="w-6 h-6 text-amber-600" />
                Search Luxury Properties
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Destination</label>
                  <input
                    type="text"
                    placeholder="Monaco, New York, Dubai..."
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Residence Type</label>
                  <select className="w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                    <option value="">All Types</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="estate">Private Estate</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Budget Range</label>
                  <select className="w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                    <option value="">Any Budget</option>
                    <option value="50k">$50,000+ /month</option>
                    <option value="100k">$100,000+ /month</option>
                    <option value="250k">$250,000+ /month</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
                <Search className="w-5 h-5" />
                Search Properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA - Premium Call to Action ===== */}
      <section className="py-24 bg-white">
        <div className="container-fluid">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Begin Your <span className="text-amber-600">Journey</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join clients who have found their ideal residence through our exclusive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold text-lg py-5 px-12 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-w-[240px]"
              >
                <span>View Properties</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-4 border-2 border-gray-900 text-gray-900 font-bold text-lg py-5 px-12 hover:bg-gray-900 hover:text-white transition-all duration-300 min-w-[240px]"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
