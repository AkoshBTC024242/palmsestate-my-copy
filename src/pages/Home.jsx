import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties, testConnection } from '../lib/supabase';
import { 
  ArrowRight, Shield, Star, Globe, Clock, 
  Search, Filter, Users, Building2, ChevronRight,
  Sparkles, Home as HomeIcon, CheckCircle, Award,
  MapPin, Bed, Bath, Maximize, Eye, Heart
} from 'lucide-react';

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    countries: 0,
    satisfiedClients: 0,
    responseTime: 0
  });

  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    loadData();
    // Trigger hero animation
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    try {
      const connection = await testConnection();
      console.log('Connection test result:', connection);
      
      const properties = await fetchProperties();
      console.log('Properties loaded:', properties.length);
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

  // Luxury sunset villa images
  const heroImages = {
    mobile: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    tablet: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
    desktop: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2500&q=80'
  };

  // Featured luxury properties for showcase
  const luxuryShowcase = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Seaside Villa Mirage',
      location: 'Monte Carlo, Monaco',
      price: '$85,000',
      period: '/month',
      beds: 8,
      baths: 10,
      sqft: '25,000'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1613977257362-21c8ed85e0c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Skyline Penthouse',
      location: 'New York, USA',
      price: '$125,000',
      period: '/month',
      beds: 6,
      baths: 8,
      sqft: '12,500'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1613977257364-21c8ed85e0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Alpine Chalet',
      location: 'Swiss Alps, Switzerland',
      price: '$65,000',
      period: '/month',
      beds: 10,
      baths: 12,
      sqft: '18,000'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ===== HERO SECTION - SCREAMING PROFESSIONAL ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Full-screen Luxury Villa Sunset Background */}
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 640px)" srcSet={heroImages.mobile} />
            <source media="(max-width: 1024px)" srcSet={heroImages.tablet} />
            <img
              src={heroImages.desktop}
              alt="Luxury Villa Sunset"
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                heroLoaded ? 'scale-100' : 'scale-110'
              }`}
              loading="eager"
              onLoad={() => setHeroLoaded(true)}
            />
          </picture>
          
          {/* Multi-layer Gradient Overlay for Depth */}
          <div className={`absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-primary-900/50 transition-opacity duration-1000 ${
            heroLoaded ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Subtle Texture Overlay - FIXED */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z%22 fill=%22%23fff%22 fill-opacity=%220.1%22 fill-rule=%22evenodd%22/%3E%3C/svg%3E')]" />
        </div>

        {/* Main Content with Glassmorphism */}
        <div className="container-fluid relative z-10">
          <div className={`max-w-4xl transition-all duration-1000 ${
            heroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Luxury Badge - Glass Effect */}
            <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-amber-500/15 border border-orange-400/30 rounded-full px-6 py-3 mb-8 shadow-2xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-sm md:text-base font-semibold text-white tracking-widest uppercase">
                WORLD-CLASS RESIDENCES
              </span>
            </div>

            {/* Main Headline - Elegant Typography */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Exceptional <span className="text-amber-300">Living</span><br />
              <span className="text-4xl md:text-6xl lg:text-7xl block mt-4">Awaits</span>
            </h1>

            {/* Subtitle - Sophisticated */}
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed font-sans tracking-wide">
              Access premium residences through our exclusive property portfolio. 
              Experience unparalleled service and discretion in every detail.
            </p>

            {/* CTA Buttons - Premium Styling */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                to="/properties"
                className="group flex items-center justify-center gap-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold py-5 px-10 rounded-2xl hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all duration-300 min-h-[60px] touch-manipulation"
              >
                <span className="text-lg">View Properties</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link
                to="/contact"
                className="group flex items-center justify-center gap-4 backdrop-blur-xl bg-white/15 text-white font-bold py-5 px-10 rounded-2xl border-2 border-white/30 hover:bg-white/25 hover:border-white/40 transition-all duration-300 min-h-[60px] touch-manipulation"
              >
                <span className="text-lg">Request Information</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Quick Search - Glass Style Form */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Search className="w-6 h-6 text-amber-300" />
                  Find Your Luxury Residence
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Destination
                    </label>
                    <input
                      type="text"
                      placeholder="Monte Carlo, Monaco"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent text-lg backdrop-blur-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <HomeIcon className="w-4 h-4" />
                      Residence Type
                    </label>
                    <select className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent text-lg backdrop-blur-sm">
                      <option value="" className="bg-gray-900">All Types</option>
                      <option value="villa" className="bg-gray-900">Villa</option>
                      <option value="penthouse" className="bg-gray-900">Penthouse</option>
                      <option value="estate" className="bg-gray-900">Private Estate</option>
                      <option value="mansion" className="bg-gray-900">Mansion</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Budget Range
                    </label>
                    <select className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent text-lg backdrop-blur-sm">
                      <option value="" className="bg-gray-900">Any Budget</option>
                      <option value="50k" className="bg-gray-900">$50,000+ /month</option>
                      <option value="100k" className="bg-gray-900">$100,000+ /month</option>
                      <option value="250k" className="bg-gray-900">$250,000+ /month</option>
                      <option value="500k" className="bg-gray-900">$500,000+ /month</option>
                    </select>
                  </div>
                </div>
                
                <button className="mt-6 w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-3">
                  <Search className="w-5 h-5" />
                  Search Luxury Properties
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 ${
          heroLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-white/60 text-sm mb-2 tracking-wider">EXPLORE</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-amber-300/80 rounded-full mt-2 animate-scroll"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LUXURY SHOWCASE ===== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-fluid">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/80 border border-gray-200 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
                CURATED SELECTION
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-primary-600">Properties</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each residence is meticulously selected to represent the pinnacle of luxury living and architectural excellence.
            </p>
          </div>

          {/* Luxury Property Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {luxuryShowcase.map((property) => (
              <div 
                key={property.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
                      <span className="font-bold">{property.price}</span>
                      <span className="text-sm opacity-90">{property.period}</span>
                    </div>
                  </div>
                  
                  {/* Favorite Button */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  
                  {/* Property Features */}
                  <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Bed className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">{property.beds}</span>
                      </div>
                      <span className="text-xs text-gray-500">BEDS</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Bath className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">{property.baths}</span>
                      </div>
                      <span className="text-xs text-gray-500">BATHS</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Maximize className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">{property.sqft}</span>
                      </div>
                      <span className="text-xs text-gray-500">SQ FT</span>
                    </div>
                  </div>
                  
                  {/* View Details Button */}
                  <Link
                    to={`/properties/${property.id}`}
                    className="mt-6 block w-full text-center bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors group/view"
                  >
                    <span className="flex items-center justify-center gap-2">
                      View Details
                      <Eye className="w-4 h-4 group-hover/view:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Properties Button */}
          <div className="text-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-orange-500 text-white font-bold py-4 px-10 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <span>Explore All Properties</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-950">
        <div className="container-fluid">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(stats).map(([key, value], index) => (
              <div 
                key={key}
                className={`text-center p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {value}{key === 'properties' || key === 'satisfiedClients' ? '+' : ''}
                </div>
                <p className="text-gray-300 font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20 bg-white">
        <div className="container-fluid">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-primary-600">Palms Estate</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide exceptional service and access to premium residences worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Verified Properties',
                description: 'Every property undergoes thorough verification for quality and authenticity.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: '24/7 Support',
                description: 'Our team is available around the clock to assist with any requests.',
                color: 'from-green-500 to-emerald-600'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Personalized Service',
                description: 'Tailored assistance to meet your specific needs and preferences.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-orange-500 to-amber-500"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <div className="container-fluid relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white tracking-widest uppercase">
                BEGIN YOUR JOURNEY
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your <span className="text-amber-200">Dream Residence</span>
            </h2>
            
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join clients who have found their ideal residence through our exclusive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-3 bg-white text-primary-700 font-bold py-4 px-10 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-2xl hover:bg-white/10 transition-all duration-300"
              >
                <span>Schedule Consultation</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0.3; }
        }
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;
