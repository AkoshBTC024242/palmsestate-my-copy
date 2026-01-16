// src/pages/Properties.jsx - UPDATED VERSION
import { useState, useEffect } from 'react';
import { fetchProperties } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import { Search, Filter, MapPin, Grid, List, Loader2 } from 'lucide-react';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [bedrooms, setBedrooms] = useState('any');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch properties
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProperties();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      setError('Failed to load properties. Please try again.');
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    if (!properties.length) return;

    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(property => 
        property.type?.toLowerCase() === selectedType.toLowerCase() ||
        property.category?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Price filter
    filtered = filtered.filter(property => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Bedrooms filter
    if (bedrooms !== 'any') {
      const bedCount = parseInt(bedrooms);
      filtered = filtered.filter(property => property.bedrooms >= bedCount);
    }

    setFilteredProperties(filtered);
  }, [searchQuery, selectedType, priceRange, bedrooms, properties]);

  const propertyTypes = ['all', 'exclusive', 'premium', 'luxury', 'penthouse'];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Loading Properties</h3>
            <p className="text-gray-600 mt-2">Fetching the latest listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-red-600 text-2xl">!</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Error Loading Properties</h3>
            <p className="text-gray-600 mt-2 mb-6">{error}</p>
            <button
              onClick={loadProperties}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Luxury Properties
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium rentals and exclusive residences
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by location, property name, or feature..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Property Type */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedType === type
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="any">Any</option>
                  <option value="1">1+ Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>

              {/* View Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Available Properties
              </h2>
              <p className="text-gray-600">
                Showing {filteredProperties.length} of {properties.length} properties
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                {filteredProperties.length} results
              </span>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            // List View (simplified for now)
            <div className="space-y-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-2" />
                            {property.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${property.price?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">per week</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <Bed className="w-5 h-5 text-amber-600" />
                          <span className="font-medium">{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="w-5 h-5 text-amber-600" />
                          <span className="font-medium">{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Square className="w-5 h-5 text-amber-600" />
                          <span className="font-medium">{property.squareFeet?.toLocaleString()} sq ft</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {property.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          property.type === 'Exclusive' ? 'bg-red-100 text-red-800' :
                          property.type === 'Premium' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {property.type}
                        </span>
                        <a
                          href={`/properties/${property.id}`}
                          className="px-6 py-2 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // No Results
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No properties found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setBedrooms('any');
                setPriceRange([0, 100000]);
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Footer Note */}
        {filteredProperties.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 inline-block">
              <p className="text-gray-700">
                Found what you're looking for?{' '}
                <a href="/contact" className="text-orange-600 font-bold hover:text-orange-700">
                  Contact our agents
                </a>{' '}
                for personalized assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
