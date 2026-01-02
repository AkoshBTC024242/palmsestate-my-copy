// src/pages/PropertyDetails.jsx - UPDATED WITH SAVE FUNCTIONALITY
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, saveProperty, unsaveProperty, isPropertySaved } from '../lib/supabase';
import {
  MapPin, Bed, Bath, Square, Calendar,
  CheckCircle, ArrowLeft, Heart,
  Wifi, Car, Coffee, Dumbbell, Waves, Tv,
  Shield, Wind, Thermometer, Droplets, CreditCard,
  Lock, Users, DollarSign, Home, Loader2
} from 'lucide-react';

// Keep your mockProperties array as is...

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
        const { data: supabaseProperty, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (!error && supabaseProperty) {
          console.log('Property loaded from Supabase:', supabaseProperty);
          setProperty({
            ...supabaseProperty,
            id: supabaseProperty.id.toString(),
            price: supabaseProperty.price_per_week,
            sqft: supabaseProperty.square_feet,
            image_url: supabaseProperty.main_image_url,
            description: supabaseProperty.description || 'Luxury property with premium amenities.'
          });
        } else {
          // Fallback to mock data
          console.log('Using mock data, Supabase error:', error);
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

  // ... rest of your PropertyDetails component remains the same until the header section

  // In the Property Header section, add Save button:
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
        
        {/* ... rest of your PropertyDetails component remains exactly the same ... */}
      </div>
    </div>
  );
}

export default PropertyDetails;
