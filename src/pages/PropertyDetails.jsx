import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, Bed, Bath, Square, Calendar, 
  CheckCircle, ArrowLeft, Loader,
  Wifi, Car, Coffee, Dumbbell, Waves, Tv,
  Shield, Wind, Thermometer, Droplets
} from 'lucide-react';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Property not found');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForRental = () => {
    if (!user) {
      // Not logged in - redirect to sign up with return path
      navigate('/signup', { 
        state: { 
          message: 'Please create an account to apply for this rental',
          redirectTo: `/property/${id}/apply`
        } 
      });
    } else {
      // Logged in - go to application form
      navigate(`/property/${id}/apply`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-amber-50">
        <Loader className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist.</p>
          <Link
            to="/properties"
            className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-sans font-semibold hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Transform property data for display
  const displayProperty = {
    ...property,
    price_per_week: property.price,
    square_feet: property.sqft,
    category: property.price > 50000 ? 'Exclusive' : 
              property.price > 35000 ? 'Premium' : 'Luxury'
  };

  // Amenities based on property type
  const getAmenities = () => {
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
        { icon: <Thermometer className="w-5 h-5" />, name: 'Smart Climate' },
      ];
    }

    return baseAmenities;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/properties"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-sans font-medium group"
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
                {displayProperty.category}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                property.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {property.status === 'available' ? 'Available' : 'Pending'}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{property.location}</span>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-amber-600 mb-1">
                ${displayProperty.price_per_week?.toLocaleString()}
              </div>
              <div className="text-gray-600 font-sans">per week</div>
              <button
                onClick={handleApplyForRental}
                className="mt-4 w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white font-sans font-semibold py-3 px-8 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Apply for Rental
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {user ? 'Proceed to application form' : 'Sign up required to apply'}
              </p>
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={property.image_url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                alt={property.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="rounded-2xl overflow-hidden shadow-lg">
                <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-200 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">View {num}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Amenities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-lg">
              <h2 className="font-serif text-2xl font-bold text-gray-800 mb-4">Property Description</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {property.description || 'A magnificent luxury residence offering unparalleled comfort and sophistication.'}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Experience the pinnacle of luxury living with this exquisite property. Meticulously designed with 
                  attention to every detail, this residence offers a perfect blend of elegance, comfort, and modern convenience.
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-lg">
              <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Amenities & Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getAmenities().map((amenity, index) => (
                  <div key={index} className="flex items-center p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                      <span className="text-amber-600">{amenity.icon}</span>
                    </div>
                    <span className="font-sans font-medium text-gray-800">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-8">
            {/* Property Stats */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-lg">
              <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Property Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                      <Bed className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-sans font-medium text-gray-800">Bedrooms</div>
                      <div className="text-sm text-gray-600">Spacious suites</div>
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-600">
                    {property.bedrooms}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                      <Bath className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-sans font-medium text-gray-800">Bathrooms</div>
                      <div className="text-sm text-gray-600">Luxury finishes</div>
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-600">
                    {property.bathrooms}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                      <Square className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-sans font-medium text-gray-800">Square Feet</div>
                      <div className="text-sm text-gray-600">Living area</div>
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-600">
                    {displayProperty.square_feet?.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Application Process */}
              <div className="mt-8 pt-8 border-t border-amber-100">
                <h3 className="font-sans font-semibold text-gray-800 mb-4">Application Process</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      user ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {user ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    <span className={`${user ? 'text-green-700' : 'text-gray-500'}`}>
                      {user ? 'Account verified' : 'Create account'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700">Submit application form</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700">Pay $50 application fee</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700">Receive approval decision</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Status Card */}
            <div className={`rounded-3xl p-8 shadow-2xl ${
              user 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-amber-600 to-orange-500'
            }`}>
              <h3 className="font-serif text-2xl font-bold text-white mb-4">
                {user ? 'Ready to Apply!' : 'Get Started'}
              </h3>
              <p className="text-white/90 mb-6">
                {user 
                  ? 'Your account is ready. Complete your application to schedule a private tour.'
                  : 'Create an account to start your rental application process.'
                }
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleApplyForRental}
                  className="w-full bg-white text-amber-700 font-sans font-semibold py-3 px-6 rounded-xl hover:bg-amber-50 transition-colors"
                >
                  {user ? 'Continue Application' : 'Sign Up to Apply'}
                </button>
                
                {user && (
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full bg-transparent border-2 border-white text-white font-sans font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Request More Information
                  </button>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/30">
                <p className="text-sm text-white/80">
                  Application fee is non-refundable and covers administrative processing.
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