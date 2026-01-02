// src/pages/Properties.jsx - UPDATED
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Loader } from 'lucide-react';
import { fetchProperties } from '../lib/supabase';
import SaveButton from '../components/SaveButton'; // Add this import

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Error Loading Properties</h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={loadProperties}
            className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-sans font-semibold hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-gray-800 mb-4">
            Signature Residences
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Each property is meticulously selected for luxury living, architectural excellence, and uncompromising privacy.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Property Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={property.image_url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-amber-600 text-white font-sans font-semibold rounded-full text-sm">
                    {property.category || 'Exclusive'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 font-sans font-bold rounded-full">
                    ${property.price_per_week?.toLocaleString()}/week
                  </span>
                </div>
                
                {/* ADD SAVE BUTTON HERE */}
                <div className="absolute top-20 right-4">
                  <SaveButton propertyId={property.id} size="md" />
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  {property.location}
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                  <div className="text-center">
                    <Bed className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <span className="font-sans font-semibold text-gray-800">{property.bedrooms}</span>
                    <p className="text-xs text-gray-600">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <span className="font-sans font-semibold text-gray-800">{property.bathrooms}</span>
                    <p className="text-xs text-gray-600">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <Square className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <span className="font-sans font-semibold text-gray-800">{property.square_feet?.toLocaleString()}</span>
                    <p className="text-xs text-gray-600">Sq Ft</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {property.status === 'available' ? 'Available' : 'Pending'}
                  </span>
                </div>

                {/* Action Button */}
                <Link
                  to={`/properties/${property.id}`}
                  className="block w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white font-sans font-semibold py-3 px-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 mt-4"
                >
                  View Details & Apply
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {properties.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-8">Check back soon for new luxury listings.</p>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-sans font-semibold hover:shadow-lg transition-all"
            >
              Contact Concierge
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
