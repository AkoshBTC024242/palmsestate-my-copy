import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Bed, Bath, Square, ChevronDown, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

function Properties() {
  // State for filters
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 100000],
    bedrooms: '',
    propertyType: '',
    amenities: []
  });
  
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample property data (in real app, this would come from API)
  const sampleProperties = [
    {
      id: '1',
      title: 'Oceanfront Villa Bianca',
      location: 'Maldives',
      price: 35000,
      pricePer: 'week',
      image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 5,
      bathrooms: 6,
      squareFeet: 12500,
      amenities: ['Infinity Pool', 'Private Beach', 'Helipad', 'Spa', 'Wine Cellar', 'Smart Home'],
      type: 'Exclusive',
      featured: true
    },
    {
      id: '2',
      title: 'Skyline Penthouse',
      location: 'Manhattan, NY',
      price: 45000,
      pricePer: 'month',
      image: 'https://images.unsplash.com/photo-1560448075-bb485b4d6e49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 4,
      bathrooms: 5,
      squareFeet: 8500,
      amenities: ['360° Views', 'Private Elevator', 'Smart Home', 'Wine Room', 'Terrace', 'Concierge'],
      type: 'Penthouse',
      featured: true
    },
    {
      id: '3',
      title: 'Mediterranean Estate',
      location: 'Saint-Tropez, France',
      price: 75000,
      pricePer: 'week',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 8,
      bathrooms: 10,
      squareFeet: 22000,
      amenities: ['Vineyard', 'Infinity Pool', 'Tennis Court', 'Home Theater', 'Staff Quarters'],
      type: 'Exclusive',
      featured: true
    },
    {
      id: '4',
      title: 'Modern Cliffside Villa',
      location: 'Big Sur, CA',
      price: 28000,
      pricePer: 'week',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 6,
      bathrooms: 7,
      squareFeet: 9800,
      amenities: ['Ocean Views', 'Glass Walls', 'Infinity Pool', 'Home Gym', 'Library'],
      type: 'Premium',
      featured: false
    },
    {
      id: '5',
      title: 'Alpine Chalet',
      location: 'Aspen, CO',
      price: 32000,
      pricePer: 'week',
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
      bedrooms: 7,
      bathrooms: 8,
      squareFeet: 13500,
      amenities: ['Ski-in/Ski-out', 'Indoor Pool', 'Spa', 'Game Room', 'Wine Cellar'],
      type: 'Exclusive',
      featured: false
    },
    {
      id: '6',
      title: 'Urban Penthouse Loft',
      location: 'Miami Beach, FL',
      price: 38000,
      pricePer: 'month',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 3,
      bathrooms: 4,
      squareFeet: 6800,
      amenities: ['Rooftop Pool', 'Private Bar', 'Smart Home', 'Panoramic Views', 'Concierge'],
      type: 'Penthouse',
      featured: false
    },
    {
      id: '7',
      title: 'Island Paradise Resort',
      location: 'Bora Bora, French Polynesia',
      price: 55000,
      pricePer: 'week',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80',
      bedrooms: 12,
      bathrooms: 14,
      squareFeet: 28000,
      amenities: ['Private Island', 'Multiple Pools', 'Spa', 'Helipad', 'Yacht Dock'],
      type: 'Resort',
      featured: true
    },
    {
      id: '8',
      title: 'Modernist Glass House',
      location: 'Los Angeles, CA',
      price: 42000,
      pricePer: 'month',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 5,
      bathrooms: 6,
      squareFeet: 9200,
      amenities: ['Architectural Design', 'Smart Home', 'Home Theater', 'Wine Cellar', 'Gardens'],
      type: 'Architectural',
      featured: false
    },
    {
      id: '9',
      title: 'Historic Château',
      location: 'Loire Valley, France',
      price: 65000,
      pricePer: 'week',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      bedrooms: 15,
      bathrooms: 20,
      squareFeet: 35000,
      amenities: ['Historic Estate', 'Wine Cellar', 'Formal Gardens', 'Staff', 'Helipad'],
      type: 'Château',
      featured: true
    }
  ];

  const locations = ['All Locations', 'Maldives', 'Manhattan, NY', 'Saint-Tropez, France', 'Big Sur, CA', 'Aspen, CO', 'Miami Beach, FL', 'Bora Bora', 'Los Angeles, CA', 'Loire Valley, France'];
  const propertyTypes = ['All Types', 'Exclusive', 'Penthouse', 'Premium', 'Resort', 'Architectural', 'Château'];
  const amenitiesList = ['Infinity Pool', 'Private Beach', 'Helipad', 'Spa', 'Wine Cellar', 'Smart Home', 'Home Theater', 'Tennis Court', 'Concierge', 'Private Bar'];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProperties(sampleProperties);
      setFilteredProperties(sampleProperties);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy, searchQuery]);

  const applyFilters = () => {
    let filtered = [...properties];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (filters.location && filters.location !== 'All Locations') {
      filtered = filtered.filter(property => property.location === filters.location);
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }

    // Property type filter
    if (filters.propertyType && filters.propertyType !== 'All Types') {
      filtered = filtered.filter(property => property.type === filters.propertyType);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.every(amenity => property.amenities.includes(amenity))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'bedrooms':
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case 'featured':
        filtered.sort((a, b) => b.featured - a.featured);
        break;
      default:
        break;
    }

    setFilteredProperties(filtered);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      priceRange: [0, 100000],
      bedrooms: '',
      propertyType: '',
      amenities: []
    });
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block backdrop-blur-md bg-white/60 border border-gray-200/50 rounded-2xl px-8 py-4 mb-6">
            <span className="font-sans text-amber-600 font-semibold tracking-widest text-sm md:text-base uppercase">
              EXCLUSIVE PORTFOLIO
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Global <span className="text-amber-600">Properties</span>
          </h1>
          <p className="font-sans text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our curated collection of the world's most extraordinary residences, 
            each selected for its architectural excellence and unparalleled luxury.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search properties by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-2xl font-sans font-semibold hover:shadow-lg transition-shadow"
            >
              <Filter size={20} />
              Filters
              {Object.values(filters).some(val => 
                Array.isArray(val) ? val.length > 0 : val !== '' && val !== 0
              ) && (
                <span className="ml-2 px-2 py-1 bg-white text-amber-600 text-xs rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-2xl pl-4 pr-12 py-4 font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="bedrooms">Most Bedrooms</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="font-sans text-sm text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <label className="block font-sans font-semibold text-gray-700 mb-2">
                    <MapPin className="inline-block w-4 h-4 mr-2" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    className="w-full bg-white/50 border border-gray-300 rounded-xl px-4 py-3 font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label className="block font-sans font-semibold text-gray-700 mb-2">
                    <DollarSign className="inline-block w-4 h-4 mr-2" />
                    Price Range: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}/week
                  </label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Bedrooms Filter */}
                <div className="mb-6">
                  <label className="block font-sans font-semibold text-gray-700 mb-2">
                    <Bed className="inline-block w-4 h-4 mr-2" />
                    Bedrooms (min)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        onClick={() => updateFilter('bedrooms', num === filters.bedrooms ? '' : num)}
                        className={`flex-1 py-3 rounded-xl font-sans font-medium transition-colors ${
                          filters.bedrooms === num
                            ? 'bg-amber-600 text-white'
                            : 'bg-white/50 border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type Filter */}
                <div className="mb-6">
                  <label className="block font-sans font-semibold text-gray-700 mb-2">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    {propertyTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => updateFilter('propertyType', type === filters.propertyType ? '' : type)}
                        className={`block w-full text-left px-4 py-3 rounded-xl font-sans transition-colors ${
                          filters.propertyType === type
                            ? 'bg-amber-600 text-white'
                            : 'bg-white/50 border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="mb-6">
                  <label className="block font-sans font-semibold text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    {amenitiesList.map(amenity => (
                      <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="h-5 w-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                        />
                        <span className="font-sans text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters */}
                {Object.values(filters).some(val => 
                  Array.isArray(val) ? val.length > 0 : val !== '' && val !== 0
                ) && (
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <h4 className="font-sans font-semibold text-gray-700 mb-2">Active Filters</h4>
                    <div className="flex flex-wrap gap-2">
                      {filters.location && filters.location !== 'All Locations' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-sans">
                          Location: {filters.location}
                          <button onClick={() => updateFilter('location', '')} className="ml-2">
                            <X size={14} />
                          </button>
                        </span>
                      )}
                      {filters.bedrooms && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-sans">
                          {filters.bedrooms}+ Bedrooms
                          <button onClick={() => updateFilter('bedrooms', '')} className="ml-2">
                            <X size={14} />
                          </button>
                        </span>
                      )}
                      {filters.propertyType && filters.propertyType !== 'All Types' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-sans">
                          {filters.propertyType}
                          <button onClick={() => updateFilter('propertyType', '')} className="ml-2">
                            <X size={14} />
                          </button>
                        </span>
                      )}
                      {filters.amenities.map(amenity => (
                        <span key={amenity} className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-sans">
                          {amenity}
                          <button onClick={() => toggleAmenity(amenity)} className="ml-2">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 md:mb-8">
              <p className="font-sans text-gray-600">
                Showing <span className="font-bold text-amber-600">{filteredProperties.length}</span> of{' '}
                <span className="font-bold text-gray-800">{properties.length}</span> properties
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-3xl shadow-lg animate-pulse">
                    <div className="h-64 bg-gray-300 rounded-t-3xl"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-6"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-16 backdrop-blur-md bg-white/60 border border-gray-200/50 rounded-3xl">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-amber-100 rounded-full">
                    <Search className="h-12 w-12 text-amber-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">No Properties Found</h3>
                  <p className="font-sans text-gray-600 mb-8">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-8 py-3 rounded-full font-sans font-semibold hover:shadow-lg transition-shadow"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity backdrop-blur-sm bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-2xl font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile filter content */}
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Add mobile filter inputs here */}
                  <div>
                    <label className="block font-sans font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => updateFilter('location', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 font-sans"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Other mobile filters... */}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-sans font-semibold"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-sans font-semibold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties;