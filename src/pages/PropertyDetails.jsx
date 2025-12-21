import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, Bed, Bath, Square, Calendar, 
  CheckCircle, ArrowLeft,
  Wifi, Car, Coffee, Dumbbell, Waves, Tv,
  Shield, Wind, Thermometer, Droplets, CreditCard,
  Lock, Users, DollarSign, Home
} from 'lucide-react';

// Mock data matching Home.jsx properties
const mockProperties = [
  {
    id: '1',
    title: 'Oceanfront Villa Bianca',
    location: 'Maldives',
    price: 35000,
    price_per_week: 35000,
    sqft: 12500,
    bedrooms: 5,
    bathrooms: 6,
    category: 'Exclusive',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    description: 'An architectural masterpiece nestled on a private island in the Maldives, Villa Bianca redefines oceanfront luxury. This exclusive estate features direct beach access, panoramic ocean views from every room, and unparalleled privacy for discerning guests seeking the ultimate retreat.',
  },
  {
    id: '2',
    title: 'Skyline Penthouse',
    location: 'Manhattan, NY',
    price: 45000,
    price_per_week: 45000,
    sqft: 8500,
    bedrooms: 4,
    bathrooms: 5,
    category: 'Premium',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1560448075-bb485b4d6e49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    description: 'Perched atop one of Manhattan\'s most exclusive towers, this triplex penthouse offers 360-degree views of Central Park and the Manhattan skyline. Featuring a private elevator, smart home automation, and a rooftop terrace with outdoor kitchen.',
  },
  {
    id: '3',
    title: 'Mediterranean Estate',
    location: 'Saint-Tropez, France',
    price: 75000,
    price_per_week: 75000,
    sqft: 22000,
    bedrooms: 8,
    bathrooms: 10,
    category: 'Exclusive',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    description: 'A magnificent Mediterranean estate overlooking the French Riviera. This historic property features a private vineyard, infinity pool, tennis court, and staff quarters. Perfect for hosting large gatherings or enjoying a luxurious retreat.',
  },
  {
    id: '4',
    title: 'Modern Cliffside Villa',
    location: 'Big Sur, CA',
    price: 28000,
    price_per_week: 28000,
    sqft: 9800,
    bedrooms: 6,
    bathrooms: 7,
    category: 'Premium',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    description: 'Architectural marvel perched on the cliffs of Big Sur. Floor-to-ceiling glass walls offer breathtaking Pacific Ocean views. Features an infinity edge pool, home theater, wine cellar, and sustainable design elements.',
  },
  {
    id: '5',
    title: 'Alpine Chalet',
    location: 'Aspen, CO',
    price: 32000,
    price_per_week: 32000,
    sqft: 13500,
    bedrooms: 7,
    bathrooms: 8,
    category: 'Exclusive',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    description: 'Luxury ski-in/ski-out chalet in Aspen\'s most exclusive neighborhood. Features heated indoor pool, spa with sauna and steam room, game room with bowling alley, and private ski valet service.',
  },
  {
    id: '6',
    title: 'Urban Penthouse Loft',
    location: 'Miami Beach, FL',
    price: 38000,
    price_per_week: 38000,
    sqft: 6800,
    bedrooms: 3,
    bathrooms: 4,
    category: 'Premium',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    description: 'Sophisticated penthouse loft in the heart of Miami Beach. Features 20-foot ceilings, exposed concrete beams, custom Italian kitchen, and a rooftop pool with panoramic ocean and city views.',
  }
];

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      const foundProperty = mockProperties.find(p => p.id === id);
      setProperty(foundProperty);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id]);

  // UPDATED: Use /properties/:id/apply instead of /property/:id/apply
  const handleApplyForRental = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    navigate(`/properties/${id}/apply`);
  };

  // Transform property data for display
  const displayProperty = property ? {
    ...property,
    price_per_week: property.price,
    square_feet: property.sqft,
    category: property.price > 50000 ? 'Exclusive' : 
              property.price > 35000 ? 'Premium' : 'Luxury'
  } : null;

  // Amenities based on property type
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-amber-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property with ID "{id}" could not be found.</p>
          <p className="text-gray-500 text-sm mb-8">Available IDs: 1-6</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 pt-20">
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
                {property.status === 'available' ? 'Available Now' : 'Pending'}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-amber-500" />
              <span className="text-lg">{property.location}</span>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-amber-600 mb-1">
                ${displayProperty.price_per_week?.toLocaleString()}
              </div>
              <div className="text-gray-600 font-sans">per week</div>
              <div className="mt-2 text-sm text-gray-500">
                Security deposit: ${(displayProperty.price_per_week * 2).toLocaleString()}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={property.image_url}
                alt={property.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
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
                  {property.description}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This exceptional property represents the pinnacle of luxury living, featuring the finest materials, 
                  cutting-edge technology, and unparalleled attention to detail. Perfect for those who appreciate 
                  the very best in design, comfort, and exclusivity.
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
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-green-700">Browse Properties</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700">Submit Application</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700">Pay $50 Application Fee</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700">Receive Approval Decision</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Status Card */}
            <div className="rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-amber-600 to-orange-500">
              <h3 className="font-serif text-2xl font-bold text-white mb-4">
                Start Your Application
              </h3>
              <p className="text-white/90 mb-6">
                Complete your application to schedule a private tour and secure this exclusive property.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleApplyForRental}
                  className="w-full bg-white text-amber-700 font-sans font-semibold py-3 px-6 rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  {user ? 'Apply Now' : 'Sign In to Apply'}
                </button>
                
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-transparent border-2 border-white text-white font-sans font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Request More Information
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/30">
                <p className="text-sm text-white/80">
                  Application fee is non-refundable and covers administrative processing.
                  Average response time: 24-48 hours.
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
