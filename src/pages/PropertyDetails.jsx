// src/pages/PropertyDetails.jsx - COMPLETE FIXED VERSION
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, fetchPropertyById, saveProperty, unsaveProperty, isPropertySaved } from '../lib/supabase';
import {
  MapPin, Bed, Bath, Square, Calendar,
  CheckCircle, ArrowLeft, Heart, Loader2,
  Wifi, Car, Coffee, Dumbbell, Waves, Tv,
  Shield, Wind, Thermometer, Droplets, CreditCard,
  Lock, Users, DollarSign, Home
} from 'lucide-react';

// Mock properties for fallback (keep your existing array)
const mockProperties = [
  {
    id: "1",
    title: "Oceanfront Luxury Villa",
    description: "Exclusive beachfront property with panoramic ocean views and private amenities. This stunning villa features floor-to-ceiling windows, a private infinity pool, and direct beach access. The interior boasts marble flooring, custom Italian cabinetry, and a gourmet chef's kitchen with top-of-the-line appliances.",
    location: "Maldives",
    price: 35000,
    sqft: 12500,
    image_url: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4",
    bedrooms: 5,
    bathrooms: 6,
    status: "available",
    property_type: "Villa",
    amenities: ["Infinity Pool", "Private Beach", "Home Theater", "Wine Cellar", "Smart Home", "Gym"]
  },
  {
    id: "2",
    title: "Manhattan Skyline Penthouse",
    description: "Modern penthouse with 360° city views and premium finishes. Located in the heart of Manhattan, this residence features custom millwork, imported stone surfaces, and a private rooftop terrace. The master suite includes a spa-like bathroom with dual vanities and a steam shower.",
    location: "New York, NY",
    price: 45000,
    sqft: 8500,
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
    bedrooms: 4,
    bathrooms: 5,
    status: "available",
    property_type: "Penthouse",
    amenities: ["Rooftop Terrace", "Concierge", "Private Elevator", "Wine Cellar", "Smart Home"]
  }
];

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [id, user]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Supabase first
      const propertyId = parseInt(id);
      if (!isNaN(propertyId)) {
        const supabaseProperty = await fetchPropertyById(propertyId);
        
        if (supabaseProperty) {
          console.log('Property loaded from Supabase:', supabaseProperty);
          setProperty({
            ...supabaseProperty,
            id: supabaseProperty.id.toString(),
            price: supabaseProperty.price,
            sqft: supabaseProperty.square_feet,
            image_url: supabaseProperty.image_url,
            description: supabaseProperty.description || 'Luxury property with premium amenities.',
            amenities: supabaseProperty.amenities || []
          });
        } else {
          // Fallback to mock data
          console.log('Using mock data');
          const foundProperty = mockProperties.find(p => p.id === id);
          setProperty(foundProperty);
        }
      } else {
        // Use mock data for non-numeric IDs
        const foundProperty = mockProperties.find(p => p.id === id);
        setProperty(foundProperty);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      const foundProperty = mockProperties.find(p => p.id === id);
      setProperty(foundProperty);
    } finally {
      setLoading(false);
    }
  };

  // Check if property is saved
  useEffect(() => {
    if (property && user) {
      checkIfSaved();
    } else {
      setCheckingSaved(false);
    }
  }, [property, user]);

  const checkIfSaved = async () => {
    try {
      setCheckingSaved(true);
      const propertyId = parseInt(property.id);
      if (!isNaN(propertyId)) {
        const result = await isPropertySaved(user.id, propertyId);
        setIsSaved(result.success ? result.isSaved : false);
      }
    } catch (error) {
      console.error('Error checking if saved:', error);
    } finally {
      setCheckingSaved(false);
    }
  };

  const handleSaveProperty = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      setSaving(true);
      const propertyId = parseInt(property.id);
      
      if (isNaN(propertyId)) {
        console.error('Invalid property ID for saving');
        return;
      }

      if (isSaved) {
        // Unsave
        const result = await unsaveProperty(user.id, propertyId);
        if (result.success) {
          setIsSaved(false);
        }
      } else {
        // Save
        const result = await saveProperty(user.id, propertyId);
        if (result.success) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyForRental = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    navigate(`/properties/${id}/initial-apply`);
  };

  const displayProperty = property ? {
    ...property,
    price_per_week: property.price,
    square_feet: property.sqft,
    category: property.price > 50000 ? 'Exclusive' :
      property.price > 35000 ? 'Premium' : 'Luxury'
  } : null;

  const getAmenities = () => {
    if (!displayProperty) return [];

    const baseAmenities = [
      { icon: <Wifi className="w-5 h-5" />, name: 'High-Speed WiFi' },
      { icon: <Shield className="w-5 h-5" />, name: '24/7 Security' },
      { icon: <Car className="w-5 h-5" />, name: 'Private Parking' },
      { icon: <Coffee className="w-5 h-5" />, name: 'Gourmet Kitchen' },
    ];

    if (displayProperty.category === 'Exclusive') {
      return [
        ...baseAmenities,
        { icon: <Waves className="w-5 h-5" />, name: 'Infinity Pool' },
        { icon: <Dumbbell className="w-5 h-5" />, name: 'Private Gym' },
        { icon: <Tv className="w-5 h-5" />, name: 'Home Theater' },
        { icon: <Thermometer className="w-5 h-5" />, name: 'Smart Climate Control' },
      ];
    }
    return baseAmenities;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            to="/properties"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            to="/properties"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
          <Link to="/properties" className="text-blue-600 hover:text-blue-700">
            Browse all properties →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 pt-20">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/properties"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Properties
        </Link>
      </div>
      
      {/* Property Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-4 py-1.5 bg-amber-600 text-white font-sans font-semibold rounded-full text-sm">
                {displayProperty?.category}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                property?.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {property?.status === 'available' ? 'Available Now' : 'Pending'}
              </span>
              
              {/* Save Button */}
              {user && (
                <button
                  onClick={handleSaveProperty}
                  disabled={saving || checkingSaved}
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-300 hover:border-amber-300 hover:bg-amber-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : checkingSaved ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSaved ? (
                    <>
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      Save Property
                    </>
                  )}
                </button>
              )}
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              {property?.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-amber-500" />
              <span className="text-lg">{property?.location}</span>
            </div>
          </div>
         
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-amber-600 mb-1">
                ${displayProperty?.price_per_week?.toLocaleString()}
              </div>
              <div className="text-gray-600 font-sans">per week</div>
              <div className="mt-2 text-sm text-gray-500">
                Security deposit: ${(displayProperty?.price_per_week * 2)?.toLocaleString()}
              </div>
              <button
                onClick={handleApplyForRental}
                className="mt-4 w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white font-sans font-semibold py-3 px-8 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Apply for Rental
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {user ? 'Click to start your application' : 'Sign in to start your application'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Property Images */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <img
                src={property.image_url}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{property?.description}</p>
            </div>
            
            {/* Amenities */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {getAmenities().map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-amber-600">
                      {amenity.icon}
                    </div>
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{property?.property_type || 'Luxury Villa'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms</span>
                  <span className="font-medium">{property?.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms</span>
                  <span className="font-medium">{property?.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Feet</span>
                  <span className="font-medium">{property?.sqft?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">{property?.status || 'Available'}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  to={`/apply/${property.id}`}
                  className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Apply for this Property
                </Link>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Complete the application form to request this property
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
