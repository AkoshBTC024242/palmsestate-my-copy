// src/pages/dashboard/SavedProperties.jsx - COMPLETE FIXED VERSION
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchSavedProperties, unsaveProperty } from '../../lib/supabase';
import {
  Heart, Building2, MapPin, DollarSign, BedDouble,
  Bath, Square, X, Eye, CalendarDays, Loader2, AlertCircle
} from 'lucide-react';

function SavedProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (user) {
      loadSavedProperties();
    }
  }, [user]);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading saved properties for user:', user.id);
      
      // Use the helper function
      const result = await fetchSavedProperties(user.id);
      
      if (result.success) {
        console.log('Saved properties loaded:', result.data?.length || 0);
        
        // Transform the data to match your component structure
        const properties = result.data?.map(item => {
          const property = item.properties || {};
          return {
            savedId: item.id,
            savedAt: item.created_at,
            id: property.id,
            title: property.title,
            location: property.location,
            price: property.price || 0,
            // Removed property_type - not in your database
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            square_feet: property.square_feet,
            // Try multiple image URL fields
            main_image_url: property.image_url || property.main_image_url || null,
            created_at: property.created_at,
            category: property.category // Use category instead of property_type
          };
        }) || [];
        
        console.log('Transformed properties:', properties);
        setSavedProperties(properties);
      } else {
        setError(result.error || 'Failed to load saved properties');
      }
    } catch (err) {
      console.error('Error loading saved properties:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedId, propertyId) => {
    try {
      setRemovingId(savedId);
      
      const result = await unsaveProperty(user.id, propertyId);
      
      if (result.success) {
        // Remove from local state
        setSavedProperties(prev => prev.filter(p => p.savedId !== savedId));
      } else {
        alert('Failed to remove property: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error removing saved property:', error);
      alert('Failed to remove property. Please try again.');
    } finally {
      setRemovingId(null);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your saved properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Saved Properties</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadSavedProperties}
                className="inline-flex items-center gap-2 bg-orange-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                <Loader2 className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
        <p className="text-gray-600 mt-2">
          Your favorite properties ({savedProperties.length})
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
            <Heart className="w-10 h-10 text-rose-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Saved Properties Yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start building your dream home collection by saving properties that catch your eye.
            Click the heart icon on any property to save it here.
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
                  onClick={() => handleUnsave(property.savedId, property.id)}
                  disabled={removingId === property.savedId}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50"
                >
                  {removingId === property.savedId ? (
                    <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 text-gray-700" />
                  )}
                </button>
                
                {/* Saved Badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-pink-600 text-white text-xs font-medium rounded-full">
                    <Heart className="w-3 h-3" />
                    <span>Saved</span>
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute top-12 left-3">
                  <div className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white font-sans font-bold rounded-full text-sm">
                    {formatPrice(property.price)}/week
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
                    <span className="text-xs font-medium">{property.price ? `${property.price}/wk` : 'N/A'}</span>
                    <span className="text-xs text-gray-500">Rent</span>
                  </div>
                </div>

                {/* Category (replacing property_type) */}
                {property.category && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {property.category}
                    </span>
                  </div>
                )}

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
