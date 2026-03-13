import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, MapPin, Search, Filter, ArrowRight, 
  Star, Heart, BedDouble, Bath, Square,
  Camera, Wifi, Coffee, Wind, Sun, Waves,
  CheckCircle, Phone, Mail, Calendar, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

function Listings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    waterfront: false,
    newlyListed: false
  });

  useEffect(() => {
    fetchBuffaloProperties();
  }, []);

  const fetchBuffaloProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .ilike('location', '%Buffalo%');

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

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const resetFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      waterfront: false,
      newlyListed: false
    });
    fetchBuffaloProperties();
  };

  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId));
    } else {
      setFavorites([...favorites, propertyId]);
    }
  };

  const neighborhoods = [
    { name: 'Elmwood Village', properties: 24, avgPrice: '$425K' },
    { name: 'North Buffalo', properties: 18, avgPrice: '$380K' },
    { name: 'Allentown', properties: 15, avgPrice: '$450K' },
    { name: 'Delaware District', properties: 22, avgPrice: '$525K' },
    { name: 'Buffalo Niagara', properties: 31, avgPrice: '$350K' }
  ];

  const getPropertyImage = (property) => {
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0];
    }
    if (property.image_url) {
      return property.image_url;
    }
    return null;
  };

  const buffaloStats = [
    { label: 'Active Listings', value: '156' },
    { label: 'Avg. Days on Market', value: '32' },
    { label: 'Price per Sq Ft', value: '$189' },
    { label: 'New This Week', value: '12' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
                <MapPin className="w-5 h-5 text-[#F97316]" />
                <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                  BUFFALO LISTINGS
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6">
                Discover Buffalo's{' '}
                <span className="text-[#F97316] font-medium">Finest Properties</span>
              </h1>
              <p className="text-xl text-[#A1A1AA] mb-8 leading-relaxed">
                From historic Elmwood Village charm to modern waterfront developments, 
                explore the best Buffalo has to offer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl hover:bg-[#EA580C] transition-all duration-300"
                >
                  <Filter className="w-5 h-5" />
                  Search Properties
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Viewing
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {buffaloStats.map((stat, index) => (
                <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                  <div className="text-3xl font-light text-[#F97316] mb-2">{stat.value}</div>
                  <div className="text-[#A1A1AA] text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {showFilters && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-light text-white">Filter Properties</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-[#A1A1AA] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-[#A1A1AA] mb-2">Min Price ($)</label>
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                  placeholder="200,000"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Max Price ($)</label>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                  placeholder="1,500,000"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                >
                  <option value="" className="bg-[#0A0A0A]">Any</option>
                  <option value="1" className="bg-[#0A0A0A]">1+</option>
                  <option value="2" className="bg-[#0A0A0A]">2+</option>
                  <option value="3" className="bg-[#0A0A0A]">3+</option>
                  <option value="4" className="bg-[#0A0A0A]">4+</option>
                  <option value="5" className="bg-[#0A0A0A]">5+</option>
                </select>
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                >
                  <option value="" className="bg-[#0A0A0A]">Any</option>
                  <option value="1" className="bg-[#0A0A0A]">1+</option>
                  <option value="2" className="bg-[#0A0A0A]">2+</option>
                  <option value="3" className="bg-[#0A0A0A]">3+</option>
                  <option value="4" className="bg-[#0A0A0A]">4+</option>
                </select>
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                >
                  <option value="" className="bg-[#0A0A0A]">All Types</option>
                  <option value="single-family" className="bg-[#0A0A0A]">Single Family</option>
                  <option value="condo" className="bg-[#0A0A0A]">Condo</option>
                  <option value="townhouse" className="bg-[#0A0A0A]">Townhouse</option>
                  <option value="multi-family" className="bg-[#0A0A0A]">Multi-Family</option>
                  <option value="commercial" className="bg-[#0A0A0A]">Commercial</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl">
                  <input
                    type="checkbox"
                    checked={filters.waterfront}
                    onChange={(e) => setFilters({...filters, waterfront: e.target.checked})}
                    className="w-5 h-5 text-[#F97316] rounded border-[#27272A] bg-[#0A0A0A] focus:ring-[#F97316]"
                  />
                  <span className="text-white">Waterfront</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl">
                  <input
                    type="checkbox"
                    checked={filters.newlyListed}
                    onChange={(e) => setFilters({...filters, newlyListed: e.target.checked})}
                    className="w-5 h-5 text-[#F97316] rounded border-[#27272A] bg-[#0A0A0A] focus:ring-[#F97316]"
                  />
                  <span className="text-white">Newly Listed</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={applyFilters}
                className="flex-1 bg-[#F97316] text-white py-3 rounded-xl hover:bg-[#EA580C] transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-[#0A0A0A] border border-[#27272A] text-white rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Neighborhood Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <MapPin className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              NEIGHBORHOOD GUIDE
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Find Your Perfect{' '}
            <span className="text-[#F97316] font-medium">Buffalo Neighborhood</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {neighborhoods.map((hood, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-white font-medium mb-2">{hood.name}</h3>
              <div className="text-[#F97316] text-lg font-light mb-1">{hood.properties}</div>
              <div className="text-[#A1A1AA] text-xs mb-2">Properties Available</div>
              <div className="text-white text-sm">Avg. {hood.avgPrice}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl font-light text-white">Available Properties</h2>
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
            {properties.slice(0, 6).map((property) => {
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
                    {property.newlyListed && (
                      <div className="absolute top-4 left-4 bg-[#F97316] text-white px-3 py-1 rounded-full text-xs">
                        New
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif text-xl font-light text-white group-hover:text-[#F97316] transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                        <span className="text-[#A1A1AA] text-sm">4.9</span>
                      </div>
                    </div>
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
                        <Square className="w-4 h-4" /> {property.sqft || '2,200'} sqft
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
                      <div className="text-2xl font-light text-[#F97316]">
                        ${parseFloat(property.price).toLocaleString()}
                      </div>
                      <Link
                        to={`/properties/${property.id}`}
                        className="text-[#A1A1AA] hover:text-[#F97316] transition-colors"
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
            <Home className="w-16 h-16 text-[#F97316]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-light text-white mb-2">No Properties Found</h3>
            <p className="text-[#A1A1AA]">Check back soon for new Buffalo listings.</p>
          </div>
        )}
      </section>

      {/* Why Buffalo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
              <Sun className="w-4 h-4 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                WHY BUFFALO
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              A City on the{' '}
              <span className="text-[#F97316] font-medium">Rise</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
              Buffalo is experiencing a renaissance, with historic preservation, new development, 
              and a thriving cultural scene making it one of the most exciting real estate markets 
              in the Northeast.
            </p>
            <div className="space-y-4">
              {[
                'Historic architecture and character homes',
                'Waterfront development along Lake Erie',
                'Thriving arts and culinary scene',
                'Major healthcare and education institutions',
                'Affordable luxury compared to coastal cities'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
            <h3 className="text-xl text-white mb-4">Local Expertise</h3>
            <p className="text-[#A1A1AA] mb-6">
              Our Buffalo team combines deep local knowledge with global luxury standards, 
              ensuring you find the perfect property in this dynamic market.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#F97316]" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Dedicated Buffalo Team</div>
                  <div className="text-[#A1A1AA] text-xs">15+ local specialists</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-[#F97316]" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">150+ Active Listings</div>
                  <div className="text-[#A1A1AA] text-xs">Exclusive Buffalo portfolio</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#F97316]" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">20+ Years Experience</div>
                  <div className="text-[#A1A1AA] text-xs">Serving Buffalo since 2005</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Find Your{' '}
            <span className="font-medium">Buffalo Home?</span>
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Let our local experts guide you to the perfect property in Buffalo's most desirable neighborhoods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Schedule a Tour
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Buffalo Office
            </a>
          </div>
          <div className="mt-8 text-white/80 text-sm">
            <MapPin className="w-4 h-4 inline mr-1" />
            742 Elmwood Avenue, Buffalo, NY 14201
          </div>
        </div>
      </section>
    </div>
  );
}

export default Listings;
