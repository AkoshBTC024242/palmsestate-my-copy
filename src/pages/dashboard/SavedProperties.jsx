import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Heart, Building2, MapPin, Bed, Bath, Maximize, 
  DollarSign, Eye, Trash2, Search, Filter, PlusCircle,
  ArrowRight, Home, Calendar, Share2, X
} from 'lucide-react';

function SavedProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSavedProperties();
  }, [user]);

  const loadSavedProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          *,
          properties (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedProperties = (data || []).map(item => ({
        id: item.properties.id,
        saved_id: item.id,
        title: item.properties.title,
        location: item.properties.location,
        price_per_week: item.properties.price_per_week,
        image_url: item.properties.image_url,
        bedrooms: item.properties.bedrooms,
        bathrooms: item.properties.bathrooms,
        square_feet: item.properties.square_feet,
        saved_date: item.created_at,
        status: item.properties.status
      }));
      
      setSavedProperties(formattedProperties);
    } catch (error) {
      console.error('Error loading saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (savedId) => {
    if (!window.confirm('Remove this property from your saved list?')) return;
    
    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('id', savedId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      alert('Property removed from saved list');
      loadSavedProperties();
    } catch (error) {
      console.error('Error removing saved property:', error);
      alert('Error removing saved property');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredProperties = savedProperties.filter(property => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      property.title?.toLowerCase().includes(searchLower) ||
      property.location?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading saved properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-amber-50/20 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Saved Properties</h1>
              <p className="text-gray-600">Your curated collection of luxury residences</p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
            >
              <PlusCircle className="w-5 h-5" />
              Browse More Properties
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
              <p className="text-sm text-gray-600 mb-1">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900">{savedProperties.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
              <p className="text-sm text-gray-600 mb-1">Average Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {savedProperties.length > 0 
                  ? formatCurrency(savedProperties.reduce((sum, p) => sum + (p.price_per_week || 0), 0) / savedProperties.length)
                  : '$0'
                }
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
              <p className="text-sm text-gray-600 mb-1">Recently Added</p>
              <p className="text-2xl font-bold text-gray-900">
                {savedProperties.length > 0 ? formatDate(savedProperties[0].saved_date) : 'None'}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved properties..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
              >
                <option value="all">All Properties</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold/Leased</option>
              </select>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search ? 'No Properties Found' : 'No Saved Properties'}
            </h3>
            <p className="text-gray-600 mb-6">
              {search 
                ? 'Try adjusting your search criteria' 
                : 'Start saving properties you\'re interested in'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/properties')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <Building2 className="w-5 h-5" />
                Browse Properties
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div 
                key={property.saved_id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={property.image_url || 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4'}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemoveSaved(property.saved_id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-lg mb-1">{property.title}</h3>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Bed className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{property.bedrooms || 3}</span>
                      </div>
                      <p className="text-xs text-gray-500">Beds</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Bath className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{property.bathrooms || 3}</span>
                      </div>
                      <p className="text-xs text-gray-500">Baths</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Maximize className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {(property.square_feet || 2500)?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Sq Ft</p>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(property.price_per_week || 35000)}
                      </p>
                      <p className="text-sm text-gray-600">per week</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                      property.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {property.status || 'available'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className="flex items-center justify-center gap-2 bg-amber-600 text-white font-medium py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/properties/${property.id}/apply`)}
                      className="flex items-center justify-center gap-2 border border-amber-600 text-amber-600 font-medium py-2 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Apply Now
                    </button>
                  </div>

                  {/* Saved Info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Saved {formatDate(property.saved_date)}</span>
                      </div>
                      <button className="text-amber-600 hover:text-amber-700">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/properties')}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 text-left hover:border-amber-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-gray-900">Browse Properties</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Explore our collection of luxury residences</p>
            <div className="flex items-center text-amber-600 font-medium">
              <span>View Properties</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>

          <button className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 text-left hover:border-amber-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-gray-900">Schedule Tours</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Book viewings for your saved properties</p>
            <div className="flex items-center text-blue-600 font-medium">
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>

          <button className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 text-left hover:border-amber-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-gray-900">Share Collection</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Share your saved properties with others</p>
            <div className="flex items-center text-purple-600 font-medium">
              <span>Share List</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SavedProperties;
