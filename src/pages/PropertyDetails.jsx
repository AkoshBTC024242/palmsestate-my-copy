import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Bed, Bath, Square, Loader, ArrowLeft } from 'lucide-react';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error:', error);
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

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <Link to="/property" className="text-amber-600 hover:text-amber-700">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link to="/property" className="inline-flex items-center text-amber-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Link>

        {/* Property Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {property.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600">
                ${property.price?.toLocaleString()}/week
              </div>
              <div className="text-gray-600">Rental Price</div>
            </div>
          </div>

          {/* Property Image */}
          <div className="mb-8">
            <img
              src={property.image_url}
              alt={property.title}
              className="w-full h-96 object-cover rounded-xl"
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Description</h3>
              <p className="text-gray-600 mb-6">{property.description}</p>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">Features</h3>
              <div className="flex flex-wrap gap-2">
                {['Luxury Finish', 'Concierge', 'Security', 'Parking'].map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Facts</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <div className="font-semibold">{property.bedrooms} Bedrooms</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <div className="font-semibold">{property.bathrooms} Bathrooms</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Square className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <div className="font-semibold">{property.sqft?.toLocaleString()} Sq Ft</div>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => alert('Application feature coming soon! Will redirect to Stripe payment.')}
                className="w-full mt-8 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
              >
                Apply for Rental - $50 Fee
              </button>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                Non-refundable application fee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;