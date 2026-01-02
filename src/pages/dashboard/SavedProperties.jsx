// src/pages/dashboard/SavedProperties.jsx - ENHANCED VERSION
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchSavedProperties, unsaveProperty } from '../../lib/supabase';
import {
  Heart, Building2, MapPin, DollarSign, BedDouble,
  Bath, Square, X, Eye, CalendarDays, Loader2,
  AlertCircle, Home, Trash2, ArrowLeft, ExternalLink,
  CheckCircle, Star
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
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading saved properties for user:', user?.id);
      const result = await fetchSavedProperties(user.id);
      
      if (result.success) {
        console.log(`✅ Loaded ${result.count} saved properties`);
        
        // Transform the data to match your component structure
        const properties = result.data?.map(item => ({
          savedId: item.id,
          savedAt: item.created_at,
          id: item.properties?.id,
          title: item.properties?.title,
          location: item.properties?.location,
          price_per_week: item.properties?.price_per_week,
          property_type: item.properties?.property_type,
          bedrooms: item.properties?.bedrooms,
          bathrooms: item.properties?.bathrooms,
          square_feet: item.properties?.square_feet,
          main_image_url: item.properties?.image_url || item.properties?.main_image_url,
          status: item.properties?.status,
          category: item.properties?.category
        })) || [];
        
        setSavedProperties(properties);
      } else {
        setError(result.error || 'Failed to load saved properties');
      }
    } catch (err) {
      console.error('❌ Error loading saved properties:', err);
      setError('An unexpected error occurred. Please try again.');
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
        alert(result.userMessage || 'Failed to remove property from saved list');
      }
    } catch (error) {
      console.error('Error removing saved property:', error);
      alert('Failed to remove property. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleRemoveAll = async () => {
    if (!savedProperties.length) return;
    
    if (!window.confirm(`Are you sure you want to remove all ${savedProperties.length} saved properties?`)) {
      return;
    }

    try {
      setLoading(true);
      // Remove each saved property one by one
      const promises = savedProperties.map(item => 
        unsaveProperty(user.id, item.id)
      );
      
      await Promise.all(promises);
      setSavedProperties([]);
      
    } catch (error) {
      console.error('Error removing all saved properties:', error);
      alert('Failed to remove all properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPropertyStatus = (property) => {
    if (property.status === 'available') {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Available'
      };
    }
    if (property.status === 'pending') {
      return {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Pending'
      };
    }
    return {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <Home className="w-3 h-3" />,
      label: property.status || 'Unavailable'
    };
  };

  if (loading && savedProperties.length === 0) {
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-gradient-to-br from-red-50 to-orange-50 border border-red-200">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
            </div>
            <p className="text-gray-600">
              Your personal collection of properties you're interested in
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-medium rounded-lg">
              {savedProperties.length} {savedProperties.length === 1 ? 'Property' : 'Properties'}
            </div>
            {savedProperties.length > 0 && (
              <button
                onClick={handleRemoveAll}
                className="inline-flex items-center gap-2 border border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-700 font-medium px-4 py-2 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-orange-600" />
            <p className="text-orange-800 text-sm">
              Click the heart icon on any property to save it here. Click "Apply Now" to start an application.
            </p>
          </div>
        </div>
      </div>

      {/* Saved Properties Grid */}
      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Saved Properties Yet</h3>
            <p className="text-gray-600 mb-8">
              Start building your watchlist by saving properties you're interested in.
              Click the heart icon on any property to add it here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/properties')}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                Browse Properties
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => {
              const status = getPropertyStatus(property);
              
              return (
                <div 
                  key={property.savedId} 
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Property Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {property.main_image_url ? (
                      <img
                        src={property.main_image_url}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                          {status.icon}
                          <span>{status.label}</span>
                        </div>
                        
                        <button
                          onClick={() => handleUnsave(property.savedId, property.id)}
                          disabled={removingId === property.savedId}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors disabled:opacity-50"
                          title="Remove from saved"
                        >
                          {removingId === property.savedId ? (
                            <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Saved badge */}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        <Heart className="w-3 h-3 fill-white" />
                        <span>Saved {formatDate(property.savedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="text-sm truncate">{property.location || 'Location not specified'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPrice(property.price_per_week)}
                          <span className="text-sm text-gray-500 font-normal">/week</span>
                        </div>
                        
                        {property.property_type && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {property.property_type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Property Specs */}
                    <div className="grid grid-cols-4 gap-2 mb-5">
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
                        <span className="text-xs font-medium">{property.price_per_week ? `${property.price_per_week}/wk` : 'N/A'}</span>
                        <span className="text-xs text-gray-500">Rent</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/properties/${property.id}/initial-apply`)}
                        className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {savedProperties.length} saved {savedProperties.length === 1 ? 'property' : 'properties'}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/properties"
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Browse More Properties
                </Link>
                <button
                  onClick={handleRemoveAll}
                  className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Clear All Saved
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SavedProperties;
