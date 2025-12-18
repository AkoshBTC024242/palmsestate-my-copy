import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, DollarSign, Bed, Bath, Square, Car, 
  Heart, Share2, Phone, Mail, Calendar, Clock, Check,
  Maximize2, ChevronLeft, ChevronRight, Star, Users,
  Home, Waves, Coffee, Wifi, Tv, Wind, Droplets, Shield
} from 'lucide-react';

// Mock property data - in real app, this would come from API
const properties = [
  {
    id: '1',
    title: 'Oceanfront Villa Bianca',
    location: 'Maldives',
    price: 35000,
    pricePer: 'week',
    images: [
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1560448075-bb485b4d6e49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    ],
    description: 'An architectural masterpiece nestled on a private island in the Maldives, Villa Bianca redefines oceanfront luxury. This exclusive estate features direct beach access, panoramic ocean views from every room, and unparalleled privacy for discerning guests seeking the ultimate retreat.',
    detailedDescription: 'Designed by award-winning architect Marco Bianca, this villa seamlessly blends modern minimalism with traditional Maldivian craftsmanship. The property spans 1.25 acres of pristine beachfront, featuring a main residence with 5 bedroom suites, 2 guest bungalows, and staff quarters. The infinity pool appears to merge with the Indian Ocean horizon, creating a breathtaking visual experience.',
    bedrooms: 5,
    bathrooms: 6,
    squareFeet: 12500,
    yearBuilt: 2022,
    propertyType: 'Luxury Villa',
    status: 'Available',
    features: [
      { icon: <Waves size={20} />, label: 'Direct Beach Access', value: 'Private 200ft beachfront' },
      { icon: <Maximize2 size={20} />, label: 'Living Area', value: '12,500 sq ft' },
      { icon: <Users size={20} />, label: 'Max Guests', value: '12 adults' },
      { icon: <Car size={20} />, label: 'Parking', value: 'Garage for 4 vehicles' },
      { icon: <Home size={20} />, label: 'Stories', value: '2' },
      { icon: <Coffee size={20} />, label: 'Kitchen', value: 'Professional chef\'s kitchen' },
    ],
    amenities: [
      'Infinity Saltwater Pool',
      'Private White Sand Beach',
      'Helipad with Landing Rights',
      'Full-Service Spa & Wellness Center',
      'Temperature-Controlled Wine Cellar (500+ bottles)',
      'Smart Home Automation System',
      'Home Theater with 4K Projection',
      'Professional Fitness Center',
      'Yoga Pavilion',
      'Private Dock for Yachts up to 150ft',
      'Organic Garden & Orchard',
      '24/7 Security & Surveillance',
      'Dedicated Concierge Service',
      'Housekeeping & Chef Services',
      'Electric Car Charging Stations',
    ],
    includedServices: [
      'Daily housekeeping',
      'Private chef (8 hours daily)',
      '24/7 security personnel',
      'Concierge service',
      'Pool & garden maintenance',
      'Utilities (water, electricity, internet)',
    ],
    agent: {
      name: 'Eleanor Sterling',
      title: 'Senior Luxury Property Director',
      phone: '+1 (828) 623-9765',
      email: 'eleanor@palmsestate.org',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      experience: '12+ years in luxury real estate',
      languages: ['English', 'French', 'Spanish'],
      bio: 'Eleanor specializes in ultra-luxury island properties and has curated some of the most exclusive vacation rentals in the Indian Ocean.',
    },
    neighborhood: {
      title: 'Private Island, Maldives',
      description: 'Located on a private island in the North Malé Atoll, this property offers complete seclusion while being just a 25-minute seaplane ride from Velana International Airport. The surrounding waters are part of a marine protected area, offering exceptional diving and snorkeling opportunities.',
      attractions: [
        'Coral reef diving (50m from shore)',
        'Five-star resort amenities nearby',
        'Deep-sea fishing charters',
        'Spa & wellness retreats',
        'Fine dining restaurants',
      ]
    },
    virtualTour: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    floorPlans: [
      { name: 'Ground Floor', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { name: 'Upper Level', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    ]
  },
  {
    id: '2',
    title: 'Skyline Penthouse',
    location: 'Manhattan, NY',
    price: 45000,
    pricePer: 'month',
    images: [
      'https://images.unsplash.com/photo-1560448075-bb485b4d6e49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    ],
    description: 'Perched atop one of Manhattan\'s most exclusive towers, this triplex penthouse offers 360-degree views of Central Park and the Manhattan skyline.',
    bedrooms: 4,
    bathrooms: 5,
    squareFeet: 8500,
    amenities: [
      '360° Views',
      'Private Elevator',
      'Smart Home',
      'Wine Room',
      'Terrace',
      'Concierge',
    ],
    agent: {
      name: 'Marcus Chen',
      phone: '+1 (555) 987-6543',
      email: 'marcus@palmsestate.org',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    }
  },
];

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    monthlyIncome: '',
    moveInDate: '',
    additionalNotes: '',
  });

  const property = properties.find(p => p.id === id);

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [id]);

  const handleImageNavigation = (direction) => {
    if (direction === 'next') {
      setSelectedImage(prev => (prev + 1) % property.images.length);
    } else {
      setSelectedImage(prev => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out ${property.title} on Palms Estate`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to your backend
    alert('Application submitted! Our concierge will contact you within 24 hours.');
    setShowApplication(false);
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-24">
        <div className="text-center backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-12 max-w-2xl mx-4">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-6">Property Not Found</h1>
          <p className="font-sans text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/properties" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-8 py-4 rounded-full font-sans font-bold hover:shadow-xl transition-shadow"
          >
            <ArrowLeft size={20} />
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-24 pb-20">
      {/* Property Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors mb-4 font-sans"
            >
              <ArrowLeft size={20} />
              Back to Properties
            </button>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 font-sans">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-amber-500" />
                {property.location}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-600 font-medium">{property.status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-sans font-medium transition-colors ${
                saved 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Heart size={20} className={saved ? 'fill-red-600' : ''} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl font-sans font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Image */}
          <div className="lg:col-span-2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img 
                src={property.images[selectedImage]} 
                alt={property.title}
                className="w-full h-64 md:h-[500px] object-cover cursor-pointer"
                onClick={() => setShowLightbox(true)}
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={() => handleImageNavigation('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 backdrop-blur-md bg-white/30 border border-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => handleImageNavigation('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 backdrop-blur-md bg-white/30 border border-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={24} />
              </button>
              
              {/* Expand Button */}
              <button
                onClick={() => setShowLightbox(true)}
                className="absolute bottom-4 right-4 backdrop-blur-md bg-black/40 border border-white/20 text-white px-4 py-2 rounded-xl font-sans font-medium flex items-center gap-2 hover:bg-black/60 transition-colors"
              >
                <Maximize2 size={20} />
                Expand
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-amber-500 shadow-lg' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${property.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Info & CTA */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
              <div className="mb-6">
                <div className="font-serif text-5xl font-bold text-amber-600 mb-2">
                  ${property.price.toLocaleString()}
                </div>
                <div className="font-sans text-gray-600">
                  per {property.pricePer} • Security Deposit: ${(property.price * 2).toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowApplication(true)}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-sans font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg"
                >
                  Apply for Rental
                </button>
                
                <button className="w-full border-2 border-amber-600 text-amber-600 py-4 rounded-xl font-sans font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-3">
                  <Calendar size={20} />
                  Schedule Private Viewing
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-4 rounded-xl font-sans font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                  <Phone size={20} />
                  Call Agent Directly
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Property Highlights</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bed className="w-6 h-6 text-amber-600" />
                    <div className="font-serif text-3xl font-bold">{property.bedrooms}</div>
                  </div>
                  <div className="font-sans text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bath className="w-6 h-6 text-amber-600" />
                    <div className="font-serif text-3xl font-bold">{property.bathrooms}</div>
                  </div>
                  <div className="font-sans text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Square className="w-6 h-6 text-amber-600" />
                    <div className="font-serif text-3xl font-bold">{(property.squareFeet / 1000).toFixed(1)}k</div>
                  </div>
                  <div className="font-sans text-sm text-gray-600">Square Feet</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Car className="w-6 h-6 text-amber-600" />
                    <div className="font-serif text-3xl font-bold">4</div>
                  </div>
                  <div className="font-sans text-sm text-gray-600">Garage</div>
                </div>
              </div>
            </div>

            {/* Agent Card */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <img 
                  src={property.agent.image} 
                  alt={property.agent.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-200"
                />
                <div>
                  <div className="font-serif text-xl font-bold text-gray-900">{property.agent.name}</div>
                  <div className="font-sans text-amber-600 text-sm mb-1">{property.agent.title}</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                    <span className="font-sans text-gray-600 text-sm ml-1">5.0 (42 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <a 
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl text-amber-700 font-sans font-medium hover:bg-amber-100 transition-colors"
                >
                  <Phone size={18} />
                  {property.agent.phone}
                </a>
                <a 
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-700 font-sans font-medium hover:bg-gray-100 transition-colors"
                >
                  <Mail size={18} />
                  {property.agent.email}
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="font-sans text-sm text-gray-600">
                  <span className="font-bold text-gray-900">Languages: </span>
                  {property.agent.languages?.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Property Description</h2>
              <div className="space-y-6">
                <p className="font-sans text-gray-700 leading-relaxed text-lg">
                  {property.description}
                </p>
                {property.detailedDescription && (
                  <p className="font-sans text-gray-600 leading-relaxed">
                    {property.detailedDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl">
                    <Check className="w-5 h-5 text-amber-600" />
                    <span className="font-sans text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Property Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.features?.map((feature, index) => (
                  <div key={index} className="text-center p-6 bg-white/50 border border-gray-200/50 rounded-2xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl text-amber-600">
                      {feature.icon}
                    </div>
                    <div className="font-serif text-xl font-bold text-gray-900 mb-1">{feature.value}</div>
                    <div className="font-sans text-gray-600">{feature.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Tour */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Virtual Experience</h2>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src={property.virtualTour}
                  title={`${property.title} Virtual Tour`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            {/* Neighborhood */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">Neighborhood</h3>
              <p className="font-sans text-gray-600 mb-6">
                {property.neighborhood?.description}
              </p>
              <div className="space-y-3">
                {property.neighborhood?.attractions.map((attraction, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="font-sans text-gray-700">{attraction}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included Services */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">Included Services</h3>
              <div className="space-y-3">
                {property.includedServices?.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span className="font-sans text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Terms */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">Rental Terms</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="font-sans text-gray-600">Minimum Lease</span>
                  <span className="font-sans font-bold text-gray-900">12 months</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="font-sans text-gray-600">Security Deposit</span>
                  <span className="font-sans font-bold text-gray-900">${(property.price * 2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="font-sans text-gray-600">Pets Allowed</span>
                  <span className="font-sans font-bold text-gray-900">Case by case approval</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="font-sans text-gray-600">Available From</span>
                  <span className="font-sans font-bold text-gray-900">Immediate</span>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-6 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">Similar Properties</h3>
              <div className="space-y-4">
                {properties
                  .filter(p => p.id !== property.id)
                  .slice(0, 2)
                  .map(similar => (
                    <Link 
                      key={similar.id}
                      to={`/properties/${similar.id}`}
                      className="flex items-center gap-4 p-4 bg-white/50 rounded-xl hover:bg-white transition-colors group"
                    >
                      <img 
                        src={similar.images[0]} 
                        alt={similar.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-sans font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                          {similar.title}
                        </div>
                        <div className="font-sans text-sm text-gray-600">{similar.location}</div>
                        <div className="font-sans font-bold text-amber-600">
                          ${similar.price.toLocaleString()}/{similar.pricePer}
                        </div>
                      </div>
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-6xl w-full">
            <img 
              src={property.images[selectedImage]} 
              alt={property.title}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <button
              onClick={() => handleImageNavigation('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => handleImageNavigation('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setShowApplication(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-gray-900">Rental Application</h2>
                    <p className="font-sans text-gray-600 mt-1">for {property.title}</p>
                  </div>
                  <button 
                    onClick={() => setShowApplication(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="font-serif text-2xl font-bold text-gray-900">$50 Application Fee</div>
                      <div className="font-sans text-gray-600">Non-refundable • Required for processing</div>
                    </div>
                  </div>
                  <div className="font-sans text-sm text-gray-600">
                    This fee covers background checks and administrative processing. You'll be contacted within 24-48 hours after submission.
                  </div>
                </div>

                <form onSubmit={handleApplicationSubmit} className="space-y-6">
                  <div>
                    <label className="block font-sans font-medium text-gray-700 mb-2">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={applicationForm.fullName}
                      onChange={(e) => setApplicationForm({...applicationForm, fullName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans"
                      placeholder="John Michael Smith"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-sans font-medium text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans"
                        placeholder="john.smith@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-sans font-medium text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-sans font-medium text-gray-700 mb-2">Monthly Income</label>
                      <input 
                        type="text" 
                        value={applicationForm.monthlyIncome}
                        onChange={(e) => setApplicationForm({...applicationForm, monthlyIncome: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans"
                        placeholder="$15,000+"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-sans font-medium text-gray-700 mb-2">Desired Move-in Date</label>
                      <input 
                        type="date" 
                        value={applicationForm.moveInDate}
                        onChange={(e) => setApplicationForm({...applicationForm, moveInDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-sans font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea 
                      value={applicationForm.additionalNotes}
                      onChange={(e) => setApplicationForm({...applicationForm, additionalNotes: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans h-32"
                      placeholder="Tell us about your rental needs, special requirements, or questions..."
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-sans font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      Submit Application & Continue to Payment
                    </button>
                    <p className="text-center font-sans text-sm text-gray-500 mt-4">
                      By submitting, you agree to our <a href="/terms" className="text-amber-600 hover:underline">Terms</a> and <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;