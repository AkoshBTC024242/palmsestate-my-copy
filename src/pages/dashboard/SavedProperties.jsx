// src/pages/dashboard/SavedProperties.jsx - FULL UPDATED FILE
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Heart, Building2, MapPin, DollarSign, BedDouble,
  Bath, Square, X, Eye, CalendarDays
} from 'lucide-react';

function SavedProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedProperties();
    }
  }, [user]);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      
      // UPDATED QUERY: Changed price_per_week to price
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          created_at,
          properties (
            id,
            title,
            location,
            price,
            property_type,
            bedrooms,
            bathrooms,
            square_feet,
            main_image_url,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to extract properties
      const properties = data?.map(item => ({
        savedId: item.id,
        savedAt: item.created_at,
        ...item.properties
      })) || [];
      
      setSavedProperties(properties);
    } catch (error) {
      console.error('Error loading saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedId) => {
    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('id', savedId);

      if (error) throw error;
      
      // Remove from local state
      setSavedProperties(prev => prev.filter(p => p.savedId !== savedId));
    } catch (error) {
      console.error('Error removing saved property:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return '$0';
    return `$${price.toLocaleString()}`;
  };

  // REMOVE DashboardLayout wrapper - it's already in App.jsx
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
        <p className="text-gray-600 mt-2">
          Your favorite properties ({savedProperties.length})
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading saved properties...</p>
        </div>
      ) : savedProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
            <Heart className="w-10 h-10 text-rose-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Saved Properties Yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start building your dream home collection by saving properties that catch your eye.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <Building2 className="w-6 h-6" />
            Browse Available Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((property) => (
            <div key={property.savedId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow duration-300">
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {property.main_image_url ? (
                  <img
                    src={property.main_image_url}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Unsave Button */}
                <button
                  onClick={() => handleUnsave(property.savedId)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-all duration-200"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
                
                {/* Saved Badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-pink-600 text-white text-xs font-medium rounded-full">
                    <Heart className="w-3 h-3" />
                    <span>Saved</span>
                  </div>
                </div>

                {/* Price Badge - UPDATED: Changed price_per_week to price */}
                <div className="absolute top-3 right-12">
                  <div className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 font-sans font-bold rounded-full text-sm">
                    ${property.price?.toLocaleString() || '0'}/week
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </div>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <BedDouble className="w-4 h-4 text-gray-500 mb-1" />
                    <span className="text-xs font-medium">{property.bedrooms || 'N/A'}</span>
                    <span className="text-xs text-gray-500">Beds</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <Bath className="w-4 h-4 text-gray-500 mb-1" />
                    <span className="text-xs font-medium">{property.bathrooms || 'N/A'}</span>
                    <span className="text-xs text-gray-500">Baths</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <Square className="w-4 h-4 text-gray-500 mb-1" />
                    <span className="text-xs font-medium">{property.square_feet ? `${property.square_feet.toLocaleString()}` : 'N/A'}</span>
                    <span className="text-xs text-gray-500">Sq Ft</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-gray-500 mb-1" />
                    {/* UPDATED: Changed price_per_week to price */}
                    <span className="text-xs font-medium">{property.price ? `${property.price}/wk` : 'N/A'}</span>
                    <span className="text-xs text-gray-500">Rent</span>
                  </div>
                </div>

                {/* Property Type */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {property.property_type || 'Property'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    Saved {formatDate(property.savedAt)}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className="text-orange-600 hover:text-orange-800 font-medium text-sm flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/properties/${property.id}/initial-apply`)}
                      className="bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:shadow transition-all duration-200"
                    >
                      Apply Now
                    </button>
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

export default SavedProperties;
