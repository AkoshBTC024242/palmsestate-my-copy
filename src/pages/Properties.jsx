// src/pages/Properties.jsx - FIXED VERSION
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, Bed, Bath, Square, Loader, Home, 
  Shield, Star, Heart, Eye, ChevronRight,
  Sparkles, Filter, ArrowUpDown, Search,
  CheckCircle, Loader2, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import PropertyFavoriteButton from '../components/PropertyFavoriteButton'; // IMPORT OUR COMPONENT

function Properties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 100000],
    bedrooms: 'all',
    propertyType: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, filters, searchQuery]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProperties(data);
        setFilteredProperties(data);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(property => property.category === filters.category);
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'all') {
      filtered = filtered.filter(property => 
        filters.bedrooms === '4+' 
          ? property.bedrooms >= 4
          : property.bedrooms === parseInt(filters.bedrooms)
      );
    }

    // Property type filter
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(property => property.property_type === filters.propertyType);
    }

    // Price range filter
    filtered = filtered.filter(property => {
      const price = parseFloat(property.price) || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    setFilteredProperties(filtered);
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

  const formatPrice = (property) => {
    const price = parseFloat(property.price) || 0;
    
    const typeConfig = {
      villa: { label: '/week', field: 'price_per_week' },
      penthouse: { label: '/week', field: 'price_per_week' },
      chalet: { label: '/week', field: 'price_per_week' },
      cottage: { label: '/week', field: 'price_per_week' },
      apartment: { label: '/month', field: 'rent_amount' },
      mansion: { label: '/month', field: 'rent_amount' },
      townhouse: { label: '/month', field: 'rent_amount' },
      condo: { label: '', field: 'price' }
    };

    const config = typeConfig[property.property_type] || { label: '/week', field: 'price' };
    const displayPrice = property[config.field] || price;
    
    if (displayPrice >= 10000) {
      return `$${(displayPrice / 1000).toFixed(0)}k${config.label}`;
    }
    return `$${displayPrice.toLocaleString()}${config.label}`;
  };

  const getAmenitiesList = (property) => {
    if (!property.amenities) return [];
    
    try {
      return property.amenities
        .split(',')
        .map(amenity => amenity.trim())
        .filter(amenity => amenity.length > 0);
    } catch (error) {
      console.error('Error parsing amenities:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <Loader className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Luxury Properties</h3>
            <p className="text-gray-600">Discovering exceptional residences for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Properties</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={loadProperties}
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Simple Notification */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 pt-20">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-current" />
                <span>Premium Luxury Collection</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Signature Properties
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
                Each residence is meticulously selected for architectural excellence, premium amenities, and uncompromising luxury living.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by location, property name, or feature..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {[
                  { label: 'Properties', value: properties.length },
                  { label: 'Available Now', value: properties.filter(p => p.status === 'available').length },
                  { label: 'Featured', value: properties.filter(p => p.featured).length },
                  { label: 'Luxury', value: properties.filter(p => p.category === 'Luxury').length }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-orange-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="sticky top-20 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <span className="text-sm bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                    {filteredProperties.length}
                  </span>
                </button>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort by:
                  <select className="bg-transparent border-none focus:outline-none font-medium">
                    <option>Featured First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-orange-600">{filteredProperties.length}</span> of {properties.length} properties
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="all">All Types</option>
                      <option value="villa">Villa</option>
                      <option value="apartment">Apartment</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="mansion">Mansion</option>
                      <option value="chalet">Chalet</option>
                      <option value="cottage">Cottage</option>
                      <option value="condo">Condominium</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Premium">Premium</option>
                      <option value="Exclusive">Exclusive</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="all">Any</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4+">4+ Bedrooms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => {
                const propertyImage = getPropertyImage(property);
                const amenities = getAmenitiesList(property);

                return (
                  <div 
                    key={property.id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Property Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                      {/* Image Link */}
                      <Link to={`/properties/${property.id}`} className="block h-full">
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
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-16 h-16 text-white" />
                          </div>
                        )}
                      </Link>

                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {property.featured && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full text-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 font-semibold rounded-full text-xs capitalize">
                          {property.property_type}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 backdrop-blur-md bg-black/50 border border-white/20 rounded-xl p-3">
                        <div className="text-lg font-bold text-white">
                          {formatPrice(property)}
                        </div>
                      </div>

                      {/* FIXED: Use PropertyFavoriteButton component */}
                      <div className="absolute bottom-4 right-4 z-10">
                        <PropertyFavoriteButton 
                          propertyId={property.id}
                          size="md"
                        />
                      </div>

                      {/* Quick View */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold">
                          <Eye className="w-4 h-4" />
                          Quick View
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-6">
                      <Link to={`/properties/${property.id}`} className="block">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                              {property.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              property.status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : property.status === 'rented'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {property.status === 'available' ? 'Available' : 
                               property.status === 'rented' ? 'Rented' : 'Maintenance'}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                            <span className="truncate">{property.location}</span>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {property.description || 'Premium luxury property with exceptional features and amenities.'}
                          </p>
                        </div>
                      </Link>

                      {/* Property Stats */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Bed className="w-5 h-5 text-orange-600" />
                            <div className="font-bold text-gray-900">{property.bedrooms || 0}</div>
                          </div>
                          <div className="text-xs text-gray-600">Bedrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Bath className="w-5 h-5 text-orange-600" />
                            <div className="font-bold text-gray-900">{property.bathrooms || 0}</div>
                          </div>
                          <div className="text-xs text-gray-600">Bathrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Square className="w-5 h-5 text-orange-600" />
                            <div className="font-bold text-gray-900">
                              {property.sqft ? (property.sqft / 1000).toFixed(1) + 'k' : 'N/A'}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600">Sq Ft</div>
                        </div>
                      </div>

                      {/* Quick Amenities */}
                      {amenities.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {amenities.slice(0, 3).map((amenity, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-full"
                              >
                                <span className="text-xs text-orange-700 font-medium">{amenity}</span>
                              </span>
                            ))}
                            {amenities.length > 3 && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full">
                                <span className="text-xs text-gray-600 font-medium">
                                  +{amenities.length - 3} more
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          property.category === 'Luxury' 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                            : property.category === 'Premium'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : property.category === 'Exclusive'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        }`}>
                          {property.category || 'Premium'}
                        </span>
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/properties/${property.id}`}
                        className="block w-full text-center bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          View Full Details
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setFilters({
                      category: 'all',
                      priceRange: [0, 100000],
                      bedrooms: 'all',
                      propertyType: 'all'
                    });
                    setSearchQuery('');
                  }}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
                <Link
                  to="/contact"
                  className="border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>
          )}

          {/* Load More */}
          {filteredProperties.length > 0 && (
            <div className="mt-12 text-center">
              <button
                onClick={loadProperties}
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all"
              >
                Load More Properties
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Years Experience', value: '15+' },
                { label: 'Properties Listed', value: properties.length },
                { label: 'Happy Residents', value: '2,500+' },
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

        {/* CTA Section */}
        <div className="py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-orange-100 mb-10">
              Join thousands of satisfied residents who found their perfect home with us.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Contact Concierge
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Properties;
