// src/pages/PropertyDetails.jsx - UPDATED WITH IMAGE CLICK AND REORGANIZED CONTENT
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  MapPin, Bed, Bath, Square, Calendar,
  CheckCircle, ArrowLeft, Heart, Loader2,
  Wifi, Car, Coffee, Dumbbell, Waves, Tv,
  Shield, Wind, Thermometer, Droplets, CreditCard,
  Lock, Users, DollarSign, Home, Star, Sparkles,
  ChevronRight, ChevronLeft, Eye, Settings,
  ShieldCheck, Home as HomeIcon, Building, Castle, Mountain,
  Warehouse, Building as BuildingIcon, Map,
  Phone, Mail, Globe, Award, Clock, Key,
  Sun, Snowflake, Utensils, Cloud, TreePine,
  FireExtinguisher, Microwave, Refrigerator,
  Fan, Printer, Gamepad2, Projector, Piano,
  Wine, Bike, Zap, Settings as SettingsIcon, Camera,
  FileText, MessageSquare, X, Maximize2
} from 'lucide-react';

// Property Type Configuration for Icons and Labels
const PROPERTY_TYPE_CONFIG = {
  villa: {
    name: 'Villa',
    icon: HomeIcon,
    pricingLabel: 'Weekly Rate',
    pricingField: 'price_per_week',
  },
  apartment: {
    name: 'Apartment',
    icon: Building,
    pricingLabel: 'Monthly Rent',
    pricingField: 'rent_amount',
  },
  penthouse: {
    name: 'Penthouse',
    icon: Castle,
    pricingLabel: 'Weekly Luxury Rate',
    pricingField: 'price_per_week',
  },
  mansion: {
    name: 'Mansion',
    icon: Castle,
    pricingLabel: 'Monthly Estate Rate',
    pricingField: 'rent_amount',
  },
  chalet: {
    name: 'Chalet',
    icon: Mountain,
    pricingLabel: 'Weekly Seasonal Rate',
    pricingField: 'price_per_week',
  },
  cottage: {
    name: 'Cottage',
    icon: HomeIcon,
    pricingLabel: 'Weekly Rental',
    pricingField: 'price_per_week',
  },
  condo: {
    name: 'Condominium',
    icon: BuildingIcon,
    pricingLabel: 'Purchase Price',
    pricingField: 'price',
  },
  townhouse: {
    name: 'Townhouse',
    icon: Warehouse,
    pricingLabel: 'Monthly Rent',
    pricingField: 'rent_amount',
  }
};

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  useEffect(() => {
    if (property && user) {
      checkIfSaved();
    } else {
      setCheckingSaved(false);
    }
  }, [property, user]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      
      // Fetch property with minimal data first for faster loading
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;

      if (data) {
        // Parse custom fields JSON
        const customFields = typeof data.custom_fields === 'string' 
          ? JSON.parse(data.custom_fields || '{}') 
          : (data.custom_fields || {});
        
        // Parse amenities from string
        const amenitiesList = data.amenities 
          ? data.amenities.split(',').map(a => a.trim()).filter(a => a.length > 0)
          : [];
        
        // Get images - ensure it's an array
        let images = [];
        if (data.images && Array.isArray(data.images)) {
          images = data.images;
        } else if (data.image_url) {
          images = [data.image_url];
        }
        
        setProperty({
          ...data,
          custom_fields: customFields,
          amenities: amenitiesList,
          images: images,
        });
      } else {
        navigate('/properties');
      }
    } catch (error) {
      console.error('Error loading property:', error);
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      setCheckingSaved(true);
      const propertyId = parseInt(property.id);
      if (!isNaN(propertyId)) {
        const { data } = await supabase
          .from('saved_properties')
          .select('*')
          .eq('user_id', user.id)
          .eq('property_id', propertyId)
          .maybeSingle();
        
        setIsSaved(!!data);
      }
    } catch (error) {
      console.error('Error checking if saved:', error);
      // If table doesn't exist, just continue
      if (error.code !== '42P01') {
        console.log('Saved properties table might not exist');
      }
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
      
      if (isNaN(propertyId)) return;

      if (isSaved) {
        // Unsave
        await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);
        
        setIsSaved(false);
      } else {
        // Save
        await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: propertyId,
            saved_at: new Date().toISOString()
          });
        
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setSaving(false);
    }
  };

 const handleApplyForRental = () => {
  if (!user) {
    // User is not logged in - redirect to signin with property context
    navigate(`/signin?redirect=/properties/${id}/apply&propertyId=${id}`);
  } else {
    // User is logged in - go directly to application
    navigate(`/properties/${id}/apply`);
  }
};

  const handleContactAgent = () => {
    navigate('/contact', {
      state: {
        propertyInquiry: true,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyType: property.property_type,
        propertyPrice: property.price
      }
    });
  };

  const handleScheduleTour = () => {
    navigate('/contact', {
      state: {
        scheduleTour: true,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location
      }
    });
  };

  const handleCallAgent = () => {
    window.location.href = 'tel:+12345678900';
  };

  const handleEmailInquiry = () => {
    const subject = `Inquiry about ${property.title} (ID: ${property.id})`;
    const body = `Hello Palms Estate Team,\n\nI'm interested in the property "${property.title}" located at ${property.location}.\n\nPlease contact me with more information.\n\nBest regards,`;
    window.location.href = `mailto:info@palmsestate.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleNextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const handlePrevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleOpenLightbox = (index) => {
    setLightboxImageIndex(index);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = 'auto';
  };

  const handleNextLightboxImage = () => {
    if (property.images && property.images.length > 0) {
      setLightboxImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const handlePrevLightboxImage = () => {
    if (property.images && property.images.length > 0) {
      setLightboxImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const getCurrentTypeConfig = () => {
    return PROPERTY_TYPE_CONFIG[property?.property_type] || PROPERTY_TYPE_CONFIG.villa;
  };

  const getPropertyPrice = () => {
    if (!property) return { label: '', amount: 0 };
    
    const typeConfig = getCurrentTypeConfig();
    const priceField = typeConfig.pricingField;
    const amount = property[priceField] || property.price || 0;
    
    return {
      label: typeConfig.pricingLabel,
      amount: parseFloat(amount)
    };
  };

  const getAllFeatures = () => {
    if (!property) return [];
    
    const features = [];
    
    // Add basic features
    if (property.bedrooms) {
      features.push({
        icon: Bed,
        label: `${property.bedrooms} Bedrooms`,
        value: property.bedrooms
      });
    }
    
    if (property.bathrooms) {
      features.push({
        icon: Bath,
        label: `${property.bathrooms} Bathrooms`,
        value: property.bathrooms
      });
    }
    
    if (property.sqft) {
      features.push({
        icon: Square,
        label: 'Square Feet',
        value: `${property.sqft.toLocaleString()} sqft`
      });
    }
    
    if (property.property_size_sqft) {
      features.push({
        icon: Home,
        label: 'Total Area',
        value: `${property.property_size_sqft.toLocaleString()} sqft`
      });
    }
    
    if (property.year_built) {
      features.push({
        icon: Calendar,
        label: 'Year Built',
        value: property.year_built
      });
    }
    
    if (property.parking_spots) {
      features.push({
        icon: Car,
        label: 'Parking Spaces',
        value: property.parking_spots
      });
    }
    
    // Add property type specific features from custom_fields
    if (property.custom_fields) {
      Object.entries(property.custom_fields).forEach(([key, value]) => {
        if (value && value !== '') {
          features.push({
            icon: Settings,
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value
          });
        }
      });
    }
    
    // Add boolean features
    if (property.pet_friendly) {
      features.push({
        icon: Sparkles,
        label: 'Pet Friendly',
        value: 'Yes'
      });
    }
    
    if (property.furnished) {
      features.push({
        icon: Home,
        label: 'Furnished',
        value: 'Fully'
      });
    }
    
    if (property.featured) {
      features.push({
        icon: Star,
        label: 'Featured',
        value: 'Premium'
      });
    }
    
    return features;
  };

  const getAmenitiesWithIcons = () => {
    if (!property || !property.amenities) return [];
    
    const iconMap = {
      'Wi-Fi': Wifi,
      'Parking': Car,
      'Swimming Pool': Waves,
      'Gym': Dumbbell,
      'Air Conditioning': Snowflake,
      'Heating': Thermometer,
      'Smart TV': Tv,
      'Security System': Shield,
      'Fully Equipped Kitchen': Utensils,
      'Laundry Facilities': Droplets,
      'Balcony/Terrace': Sun,
      'Ocean View': Eye,
      'Concierge Service': Users,
      'Daily Maid Service': Coffee,
      'Spa Services': Wind,
      'Hot Tub/Jacuzzi': Waves,
      'Private Pool': Waves,
      'Staff Quarters': Users,
      'Private Beach': Sun,
      'Concierge': Users,
      'Elevator': Settings,
      'Rooftop': Eye,
      'Private Elevator': Settings,
      'Panoramic View': Eye,
      'Tennis Court': Dumbbell,
      'Wine Cellar': Wine,
      'Ski Access': Mountain,
      'Fireplace': FireExtinguisher,
      'Sauna': Wind,
      'Mountain View': Mountain,
      'Waterfront': Waves,
      'Boat Dock': Waves,
      'Fire Pit': FireExtinguisher,
      'Rustic': TreePine,
      'Reserved Parking': Car,
      'Building Amenities': Building,
      'Private Entrance': Key,
      'Private Garden': TreePine,
      'Community Pool': Waves,
    };
    
    return property.amenities.map(amenity => {
      const Icon = iconMap[amenity] || CheckCircle;
      return {
        name: amenity,
        icon: Icon
      };
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-amber-100 text-amber-800';
      case 'unavailable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available Now';
      case 'rented': return 'Currently Rented';
      case 'maintenance': return 'Under Maintenance';
      case 'unavailable': return 'Currently Unavailable';
      default: return status;
    }
  };

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseLightbox();
          break;
        case 'ArrowRight':
          handleNextLightboxImage();
          break;
        case 'ArrowLeft':
          handlePrevLightboxImage();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, lightboxImageIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            to="/properties"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Property Details</h3>
            <p className="text-gray-600">Preparing your luxury viewing experience...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            to="/properties"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <Home className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h1>
          <Link 
            to="/properties" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            Browse Available Properties
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = getCurrentTypeConfig();
  const TypeIcon = typeConfig.icon;
  const priceInfo = getPropertyPrice();
  const allFeatures = getAllFeatures();
  const amenitiesWithIcons = getAmenitiesWithIcons();
  const displayedAmenities = showAllAmenities 
    ? amenitiesWithIcons 
    : amenitiesWithIcons.slice(0, 12);
  const displayedFeatures = showAllFeatures
    ? allFeatures
    : allFeatures.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 pt-20">
      {/* Image Lightbox Modal */}
      {showLightbox && property.images && property.images.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full h-full max-w-7xl mx-auto p-4">
            {/* Close button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevLightboxImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextLightboxImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={property.images[lightboxImageIndex]}
                alt={`${property.title} - Image ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {lightboxImageIndex + 1} / {property.images.length}
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 mt-4">
                {property.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      lightboxImageIndex === index 
                        ? 'border-white' 
                        : 'border-transparent hover:border-white/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-orange-300 hover:text-orange-600 font-medium mb-4 group transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Properties
        </Link>
      </div>
      
      {/* Property Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                {getStatusText(property.status)}
              </span>
              
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full text-sm">
                <TypeIcon className="w-4 h-4" />
                <span className="capitalize">{property.property_type}</span>
              </span>
              
              <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full text-sm">
                {property.category || 'Premium'}
              </span>
              
              {property.featured && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full text-sm">
                  <Sparkles className="w-4 h-4" />
                  Featured Property
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {property.title}
            </h1>
            
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-lg">{property.location}</span>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSaveProperty}
                disabled={saving || checkingSaved}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:border-orange-300 text-gray-700 hover:text-orange-700 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving || checkingSaved ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSaved ? (
                  <>
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    Saved to Favorites
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    Save to Favorites
                  </>
                )}
              </button>
              
              <button 
                onClick={handleScheduleTour}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-700 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Eye className="w-5 h-5" />
                Schedule Tour
              </button>
            </div>
          </div>
         
          {/* Pricing Card */}
          <div className="w-full lg:w-96">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="mb-6">
                <div className="text-sm text-orange-200 mb-2">{priceInfo.label}</div>
                <div className="text-5xl font-bold mb-2">
                  ${priceInfo.amount.toLocaleString()}
                </div>
                <div className="text-orange-200 text-sm">
                  {property.security_deposit 
                    ? `Security deposit: $${parseFloat(property.security_deposit).toLocaleString()}`
                    : 'No security deposit required'}
                </div>
              </div>
              
              {property.available_from && (
                <div className="mb-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Available From
                  </div>
                  <div className="font-semibold">
                    {new Date(property.available_from).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
              
             <button
               onClick={handleApplyForRental}
               className="w-full bg-white text-orange-600 font-bold py-4 px-6 rounded-xl hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-lg mb-3"
               >
               {user ? 'Apply Now' : 'Sign In to Apply'}
             </button>

              <button
                onClick={handleContactAgent}
                className="w-full bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Contact Agent
              </button>
              
              <p className="text-sm text-orange-200 text-center mt-3">
                {user 
                  ? 'Complete your application in minutes'
                  : 'Create an account to start your application'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Property Images Gallery */}
        <div className="mb-12">
          <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl overflow-hidden">
            {property.images && property.images.length > 0 ? (
              <>
                <div 
                  className="cursor-pointer"
                  onClick={() => handleOpenLightbox(currentImageIndex)}
                >
                  <img
                    src={property.images[currentImageIndex]}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-[500px] object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                    }}
                  />
                </div>
                
                {/* Fullscreen button */}
                <button
                  onClick={() => handleOpenLightbox(currentImageIndex)}
                  className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  title="View fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                
                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-black/40 border border-white/20 rounded-full px-4 py-2 text-white text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
                
                {/* Image Thumbnails */}
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
                    {property.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index 
                            ? 'border-white' 
                            : 'border-transparent hover:border-white/50'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-[500px] flex flex-col items-center justify-center text-white">
                <Camera className="w-24 h-24 mb-4 opacity-50" />
                <p className="text-xl">No images available</p>
              </div>
            )}
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                Property Description
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description || 'Premium luxury property with exceptional features and amenities.'}
                </p>
              </div>
            </div>

            {/* All Property Features */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  Property Features
                </h2>
                <div className="text-sm text-gray-500">
                  {allFeatures.length} features total
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={index} 
                      className="group p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl hover:border-orange-300 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="font-semibold text-gray-800">{feature.label}</div>
                      </div>
                      <div className="text-lg font-bold text-orange-700">
                        {feature.value}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {allFeatures.length > 8 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    {showAllFeatures ? 'Show Less Features' : `View All ${allFeatures.length} Features`}
                    <ChevronRight className={`w-4 h-4 transition-transform ${showAllFeatures ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Amenities */}
            {amenitiesWithIcons.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    Amenities & Facilities
                  </h2>
                  <div className="text-sm text-gray-500">
                    {amenitiesWithIcons.length} amenities
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {displayedAmenities.map((amenity, index) => {
                    const Icon = amenity.icon;
                    return (
                      <div 
                        key={index} 
                        className="group p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                          </div>
                          <div className="font-medium text-gray-700 group-hover:text-gray-900">
                            {amenity.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {amenitiesWithIcons.length > 12 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowAllAmenities(!showAllAmenities)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      {showAllAmenities ? 'Show Less Amenities' : `View All ${amenitiesWithIcons.length} Amenities`}
                      <ChevronRight className={`w-4 h-4 transition-transform ${showAllAmenities ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-8">
            {/* Quick Facts */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Quick Facts</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Type</div>
                      <div className="font-semibold capitalize">{property.property_type}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Square className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Size</div>
                      <div className="font-semibold">
                        {property.sqft?.toLocaleString()} sqft
                        {property.property_size_sqft && ` (${property.property_size_sqft.toLocaleString()} total)`}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Available</div>
                      <div className="font-semibold">
                        {property.status === 'available' ? 'Immediately' : 'Contact for details'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Security</div>
                      <div className="font-semibold">24/7 Monitoring</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="text-sm text-gray-300 mb-3">Need more information?</div>
                <button 
                  onClick={handleContactAgent}
                  className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Contact Agent
                </button>
              </div>
            </div>

            {/* Contact Agent */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
              <p className="text-orange-100 mb-6">
                Our dedicated property specialists are here to help you.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={handleCallAgent}
                  className="w-full flex items-center justify-center gap-3 bg-white text-orange-600 font-bold py-3 px-6 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Agent
                </button>
                
                <button 
                  onClick={handleEmailInquiry}
                  className="w-full flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Email Inquiry
                </button>

                <button 
                  onClick={handleContactAgent}
                  className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contact Form
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/30 text-center">
                <div className="text-sm text-orange-200">
                  Available 7 days a week, 9am - 9pm EST
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REMOVED: Application Requirements Section */}
        {/* That section has been moved to a separate page */}
        
      </div>

      {/* Related Properties Section */}
      <div className="py-16 bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Similar Properties</h2>
              <p className="text-gray-600">You might also be interested in these luxury properties</p>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Placeholder for related properties */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600"></div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Similar Luxury Property</h3>
                  <p className="text-gray-600 text-sm mb-4">Explore other premium options</p>
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                  >
                    Browse Properties
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make This Your Home?
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            Join thousands of satisfied residents who found their perfect home with Palms Estate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleApplyForRental}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <CheckCircle className="w-5 h-5" />
              Apply Now
            </button>
            <button
              onClick={handleContactAgent}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5" />
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
