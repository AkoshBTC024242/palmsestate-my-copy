import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Search, MapPin, DollarSign, TrendingUp, 
  Shield, CheckCircle, ArrowRight, Calculator,
  FileText, Users, Star, Calendar, Filter,
  ChevronDown, Heart, BedDouble, Bath, Square,
  Compass, BookOpen, Award, Phone, Mail
} from 'lucide-react';
import { supabase } from '../lib/supabase';

function Buyers() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loanCalculator, setLoanCalculator] = useState({
    price: 1000000,
    downPayment: 200000,
    interestRate: 5.5,
    loanTerm: 30
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available');

      // Apply filters
      if (filters.priceMin) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters.priceMax) {
        query = query.lte('price', filters.priceMax);
      }
      if (filters.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await query.limit(6);

      if (!error && data) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchProperties();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      location: ''
    });
    setTimeout(() => fetchProperties(), 100);
  };

  const calculateMonthlyPayment = () => {
    const principal = loanCalculator.price - loanCalculator.downPayment;
    const monthlyRate = loanCalculator.interestRate / 100 / 12;
    const numberOfPayments = loanCalculator.loanTerm * 12;
    
    if (principal <= 0 || monthlyRate <= 0) return 0;
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return Math.round(monthlyPayment);
  };

  const guides = [
    {
      title: 'First-Time Buyer Guide',
      description: 'Everything you need to know about purchasing your first luxury property.',
      icon: <BookOpen className="w-6 h-6" />,
      readTime: '10 min read'
    },
    {
      title: 'Financing Options',
      description: 'Explore mortgage options, rates, and pre-approval processes.',
      icon: <Calculator className="w-6 h-6" />,
      readTime: '8 min read'
    },
    {
      title: 'Property Inspection Tips',
      description: 'What to look for during viewings and professional inspections.',
      icon: <Search className="w-6 h-6" />,
      readTime: '12 min read'
    },
    {
      title: 'Negotiation Strategies',
      description: 'Expert tips for negotiating the best price and terms.',
      icon: <TrendingUp className="w-6 h-6" />,
      readTime: '15 min read'
    }
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
                <Home className="w-5 h-5 text-[#F97316]" />
                <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                  FOR BUYERS
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6">
                Find Your{' '}
                <span className="text-[#F97316] font-medium">Dream Property</span>
              </h1>
              <p className="text-xl text-[#A1A1AA] mb-8 leading-relaxed">
                Discover exceptional luxury properties curated for discerning buyers. 
                From urban penthouses to private estates, we'll guide you home.
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
                  <Users className="w-5 h-5" />
                  Talk to an Advisor
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                <div className="text-3xl font-light text-[#F97316] mb-2">200+</div>
                <div className="text-[#A1A1AA] text-sm">Luxury Listings</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                <div className="text-3xl font-light text-[#F97316] mb-2">24h</div>
                <div className="text-[#A1A1AA] text-sm">Response Time</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                <div className="text-3xl font-light text-[#F97316] mb-2">98%</div>
                <div className="text-[#A1A1AA] text-sm">Client Satisfaction</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                <div className="text-3xl font-light text-[#F97316] mb-2">50+</div>
                <div className="text-[#A1A1AA] text-sm">Global Locations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      {showFilters && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-light text-white">Filter Properties</h2>
              <button onClick={() => setShowFilters(false)} className="text-[#A1A1AA] hover:text-white">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-[#A1A1AA] mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="City, State, or ZIP"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Min Price ($)</label>
                <input
                  type="number"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  placeholder="500,000"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Max Price ($)</label>
                <input
                  type="number"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  placeholder="10,000,000"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Bedrooms</label>
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
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
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                >
                  <option value="" className="bg-[#0A0A0A]">Any</option>
                  <option value="1" className="bg-[#0A0A0A]">1+</option>
                  <option value="2" className="bg-[#0A0A0A]">2+</option>
                  <option value="3" className="bg-[#0A0A0A]">3+</option>
                  <option value="4" className="bg-[#0A0A0A]">4+</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-[#F97316] text-white px-6 py-3 rounded-xl hover:bg-[#EA580C] transition-colors"
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
          </div>
        </section>
      )}

      {/* Property Listings */}
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
            {properties.map((property) => {
              const propertyImage = getPropertyImage(property);
              return (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
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
                    <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm border border-[#F97316]/30 px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-[#F97316]">FOR SALE</span>
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
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-[#A1A1AA]">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-4 h-4" /> {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" /> {property.bathrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="w-4 h-4" /> {property.sqft || '2,500'} sqft
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
                      <div className="text-2xl font-light text-[#F97316]">
                        ${parseFloat(property.price).toLocaleString()}
                      </div>
                      <button className="text-[#A1A1AA] hover:text-[#F97316] transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#18181B] border border-[#27272A] rounded-3xl">
            <Search className="w-16 h-16 text-[#F97316]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-light text-white mb-2">No Properties Found</h3>
            <p className="text-[#A1A1AA]">Try adjusting your filters or contact an advisor for personalized assistance.</p>
          </div>
        )}
      </section>

      {/* Buyer's Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <BookOpen className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              BUYER'S GUIDES
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Resources for{' '}
            <span className="text-[#F97316] font-medium">Smart Buyers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-[#F97316]">{guide.icon}</div>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{guide.title}</h3>
              <p className="text-[#A1A1AA] text-sm mb-4">{guide.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A1A1AA]">{guide.readTime}</span>
                <ArrowRight className="w-4 h-4 text-[#F97316]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mortgage Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
              <Calculator className="w-4 h-4 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                MORTGAGE CALCULATOR
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Estimate Your{' '}
              <span className="text-[#F97316] font-medium">Monthly Payment</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8">
              Get a quick estimate of your potential monthly mortgage payment based on current rates.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[#A1A1AA] mb-2">Property Price ($)</label>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="50000"
                  value={loanCalculator.price}
                  onChange={(e) => setLoanCalculator(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                  className="w-full accent-[#F97316]"
                />
                <div className="text-white mt-2">${loanCalculator.price.toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Down Payment ($)</label>
                <input
                  type="range"
                  min="0"
                  max={loanCalculator.price}
                  step="10000"
                  value={loanCalculator.downPayment}
                  onChange={(e) => setLoanCalculator(prev => ({ ...prev, downPayment: parseInt(e.target.value) }))}
                  className="w-full accent-[#F97316]"
                />
                <div className="text-white mt-2">${loanCalculator.downPayment.toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-2">Interest Rate (%)</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.1"
                  value={loanCalculator.interestRate}
                  onChange={(e) => setLoanCalculator(prev => ({ ...prev, interestRate: parseFloat(e.target.value) }))}
                  className="w-full accent-[#F97316]"
                />
                <div className="text-white mt-2">{loanCalculator.interestRate}%</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center">
            <div className="text-white/80 text-lg mb-2">Estimated Monthly Payment</div>
            <div className="text-6xl font-light text-white mb-4">
              ${calculateMonthlyPayment().toLocaleString()}
            </div>
            <div className="text-white/60 text-sm mb-8">*Principal & Interest only</div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              <Phone className="w-4 h-4" />
              Speak with a Lender
            </Link>
          </div>
        </div>
      </section>

      {/* Why Buy With Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6">
              <Shield className="w-8 h-8 text-[#F97316] mb-4" />
              <h3 className="text-white font-medium mb-2">Exclusive Access</h3>
              <p className="text-[#A1A1AA] text-sm">Off-market properties before public listing</p>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6">
              <Users className="w-8 h-8 text-[#F97316] mb-4" />
              <h3 className="text-white font-medium mb-2">Dedicated Advisor</h3>
              <p className="text-[#A1A1AA] text-sm">Personal guidance through every step</p>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6">
              <FileText className="w-8 h-8 text-[#F97316] mb-4" />
              <h3 className="text-white font-medium mb-2">Market Analysis</h3>
              <p className="text-[#A1A1AA] text-sm">Data-driven insights for smart decisions</p>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6">
              <Award className="w-8 h-8 text-[#F97316] mb-4" />
              <h3 className="text-white font-medium mb-2">Negotiation Power</h3>
              <p className="text-[#A1A1AA] text-sm">Expert negotiators for the best terms</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
              <Star className="w-4 h-4 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                WHY CHOOSE US
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Your Trusted{' '}
              <span className="text-[#F97316] font-medium">Partner</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
              With over a decade of experience in luxury real estate, we provide buyers with 
              unparalleled market knowledge, exclusive access, and white-glove service.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors"
            >
              Learn more about us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Find Your{' '}
            <span className="font-medium">Dream Home?</span>
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Let our team of luxury property advisors help you find the perfect property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Buyers;
