// src/pages/dashboard/Properties.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Building2, Search, Filter, MapPin, Heart,
  BedDouble, Bath, Square, ArrowRight, Loader2,
  Grid3x3, List, SlidersHorizontal, X,
  ChevronDown, Home, Star, Eye, Clock
} from 'lucide-react';

function DashboardProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    status: 'available'
  });

  useEffect(() => {
    fetchProperties();
    fetchSavedProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

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

  const fetchSavedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', user?.id);

      if (!error && data) {
        setSavedProperties(data.map(item => item.property_id));
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    }
  };

  const toggleSaveProperty = async (propertyId) => {
    try {
      if (savedProperties.includes(propertyId)) {
        // Remove from saved
        await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user?.id)
          .eq('property_id', propertyId);

        setSavedProperties(prev => prev.filter(id => id !== propertyId));
      } else {
        // Add to saved
        await supabase
          .from('saved_properties')
          .insert([{
            user_id: user?.id,
            property_id: propertyId
          }]);

        setSavedProperties(prev => [...prev, propertyId]);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = (!filters.priceMin || property.price >= parseInt(filters.priceMin)) &&
                        (!filters.priceMax || property.price <= parseInt(filters.priceMax));
    
    const matchesBedrooms = !filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms);
    const matchesBathrooms = !filters.bathrooms || property.bathrooms >= parseInt(filters.bathrooms);
    
    return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms;
  });

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      status: 'available'
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Properties</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">Browse available luxury properties</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#18181B] border border-[#27272A] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#F97316] text-white' 
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#F97316] text-white' 
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search by property name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-[#18181B] border border-[#27272A] rounded-xl text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-6 bg-[#18181B] border border-[#27272A] rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-light">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-[#F97316] hover:text-[#F97316]/80"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[#A1A1AA] text-xs mb-2">Min Price ($)</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                placeholder="Any"
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316]/50"
              />
            </div>
            <div>
              <label className="block text-[#A1A1AA] text-xs mb-2">Max Price ($)</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                placeholder="Any"
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316]/50"
              />
            </div>
            <div>
              <label className="block text-[#A1A1AA] text-xs mb-2">Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316]/50"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-[#A1A1AA] text-xs mb-2">Bathrooms</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316]/50"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-[#A1A1AA]">
        Showing {filteredProperties.length} properties
      </div>

      {/* Properties Grid/List */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-[#18181B] border border-[#27272A] rounded-xl">
          <Building2 className="w-12 h-12 text-[#F97316]/30 mx-auto mb-4" />
          <h3 className="text-white font-light mb-2">No properties found</h3>
          <p className="text-[#A1A1AA] text-sm">Try adjusting your filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden hover:border-[#F97316]/30 transition-all hover:-translate-y-1 group"
            >
              <Link to={`/properties/${property.id}`}>
                <div className="relative h-48 bg-gradient-to-br from-[#F97316]/10 to-[#EA580C]/10">
                  {property.images?.[0] ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-[#F97316]/30" />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSaveProperty(property.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-[#F97316] transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${
                      savedProperties.includes(property.id) ? 'fill-white text-white' : 'text-white'
                    }`} />
                  </button>
                  {property.isNew && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-[#F97316] text-white text-xs rounded-lg">
                      New
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/properties/${property.id}`}>
                  <h3 className="text-white font-medium mb-2 hover:text-[#F97316] transition-colors">
                    {property.title}
                  </h3>
                </Link>
                
                <p className="text-[#A1A1AA] text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> {property.location}
                </p>

                <div className="flex items-center gap-3 text-xs text-[#A1A1AA] mb-3">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-3 h-3" /> {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3" /> {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-3 h-3" /> {property.sqft || '—'} sqft
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#27272A]">
                  <span className="text-[#F97316] font-light">
                    ${property.price?.toLocaleString()}
                    {property.status === 'rent' && <span className="text-xs text-[#A1A1AA]">/mo</span>}
                  </span>
                  <Link
                    to={`/properties/${property.id}`}
                    className="text-[#A1A1AA] hover:text-[#F97316] text-sm flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 hover:border-[#F97316]/30 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <Link to={`/properties/${property.id}`} className="md:w-48 h-32 bg-gradient-to-br from-[#F97316]/10 to-[#EA580C]/10 rounded-lg overflow-hidden">
                  {property.images?.[0] ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-[#F97316]/30" />
                    </div>
                  )}
                </Link>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/properties/${property.id}`}>
                        <h3 className="text-white font-medium hover:text-[#F97316] transition-colors">
                          {property.title}
                        </h3>
                      </Link>
                      <p className="text-[#A1A1AA] text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {property.location}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSaveProperty(property.id)}
                      className="p-2 hover:bg-[#0A0A0A] rounded-lg transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${
                        savedProperties.includes(property.id) ? 'fill-pink-500 text-pink-500' : 'text-[#A1A1AA]'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[#A1A1AA] mt-3">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.sqft || '—'} sqft</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#27272A]">
                    <span className="text-[#F97316] font-light text-lg">
                      ${property.price?.toLocaleString()}
                      {property.status === 'rent' && <span className="text-xs text-[#A1A1AA]">/mo</span>}
                    </span>
                    <Link
                      to={`/properties/${property.id}`}
                      className="px-4 py-2 bg-[#F97316] text-white text-sm rounded-lg hover:bg-[#EA580C] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardProperties;
