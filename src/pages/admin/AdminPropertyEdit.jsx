// src/pages/admin/AdminPropertyEdit.jsx - FINAL VERSION
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Upload, X, Image, MapPin,
  DollarSign, Bed, Bath, Square, Home, Globe,
  Calendar, CheckCircle, AlertCircle, Loader2,
  Tag, Building2, Eye, Check, Wifi,
  Car, Dumbbell, Waves, Snowflake, Tv,
  Shield, Utensils, Sun, Droplets, Thermometer,
  Users, Coffee, Wind, Snowflake as SnowflakeIcon,
  Layers, ChevronRight, Key, CalendarDays,
  PawPrint, Sofa, FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Amenities options
const AMENITIES_OPTIONS = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'pool', label: 'Swimming Pool', icon: Waves },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
  { id: 'heating', label: 'Heating', icon: Thermometer },
  { id: 'tv', label: 'Smart TV', icon: Tv },
  { id: 'security', label: 'Security System', icon: Shield },
  { id: 'kitchen', label: 'Fully Equipped Kitchen', icon: Utensils },
  { id: 'laundry', label: 'Laundry Facilities', icon: Droplets },
  { id: 'balcony', label: 'Balcony/Terrace', icon: Sun },
  { id: 'view', label: 'Ocean View', icon: Eye },
  { id: 'concierge', label: 'Concierge Service', icon: Users },
  { id: 'maid', label: 'Daily Maid Service', icon: Coffee },
  { id: 'spa', label: 'Spa Services', icon: Wind },
  { id: 'hot_tub', label: 'Hot Tub/Jacuzzi', icon: Waves },
];

// Property Type Configuration - MAPPED TO YOUR ACTUAL SCHEMA
const PROPERTY_TYPE_CONFIG = {
  villa: {
    name: 'Villa',
    icon: Home,
    fields: [
      { name: 'has_private_pool', label: 'Private Pool', type: 'checkbox', dbField: 'amenities', value: 'Private Pool' },
      { name: 'garden_size_sqft', label: 'Garden Size (sqft)', type: 'number', dbField: 'property_size_sqft' },
      { name: 'staff_quarters', label: 'Staff Quarters', type: 'checkbox', dbField: 'amenities', value: 'Staff Quarters' },
      { name: 'private_beach_access', label: 'Private Beach Access', type: 'checkbox', dbField: 'amenities', value: 'Private Beach' },
    ]
  },
  apartment: {
    name: 'Apartment',
    icon: Building2,
    fields: [
      { name: 'apartment_floor', label: 'Floor Number', type: 'number', dbField: 'custom_fields', subfield: 'floor' },
      { name: 'has_concierge', label: '24/7 Concierge', type: 'checkbox', dbField: 'amenities', value: 'Concierge' },
      { name: 'parking_spots', label: 'Parking Spaces', type: 'number', dbField: 'parking_spots' },
      { name: 'has_elevator', label: 'Building Elevator', type: 'checkbox', dbField: 'amenities', value: 'Elevator' },
    ]
  },
  penthouse: {
    name: 'Penthouse',
    icon: Layers,
    fields: [
      { name: 'rooftop_access', label: 'Private Rooftop', type: 'checkbox', dbField: 'amenities', value: 'Rooftop' },
      { name: 'private_elevator', label: 'Private Elevator', type: 'checkbox', dbField: 'amenities', value: 'Private Elevator' },
      { name: 'panoramic_view', label: 'Panoramic View', type: 'checkbox', dbField: 'amenities', value: 'Panoramic View' },
      { name: 'terrace_size_sqft', label: 'Terrace Size (sqft)', type: 'number', dbField: 'custom_fields', subfield: 'terrace_size' },
    ]
  },
  mansion: {
    name: 'Mansion',
    icon: Home,
    fields: [
      { name: 'estate_size_acres', label: 'Estate Size (acres)', type: 'number', dbField: 'custom_fields', subfield: 'estate_size' },
      { name: 'guest_houses', label: 'Guest Houses', type: 'number', dbField: 'custom_fields', subfield: 'guest_houses' },
      { name: 'tennis_court', label: 'Tennis Court', type: 'checkbox', dbField: 'amenities', value: 'Tennis Court' },
      { name: 'wine_cellar', label: 'Wine Cellar', type: 'checkbox', dbField: 'amenities', value: 'Wine Cellar' },
    ]
  },
  chalet: {
    name: 'Chalet',
    icon: Home,
    fields: [
      { name: 'ski_in_out', label: 'Ski-In/Ski-Out', type: 'checkbox', dbField: 'amenities', value: 'Ski Access' },
      { name: 'fireplace', label: 'Fireplace', type: 'checkbox', dbField: 'amenities', value: 'Fireplace' },
      { name: 'sauna', label: 'Private Sauna', type: 'checkbox', dbField: 'amenities', value: 'Sauna' },
      { name: 'mountain_view', label: 'Mountain View', type: 'checkbox', dbField: 'amenities', value: 'Mountain View' },
    ]
  },
  cottage: {
    name: 'Cottage',
    icon: Home,
    fields: [
      { name: 'waterfront', label: 'Waterfront', type: 'checkbox', dbField: 'amenities', value: 'Waterfront' },
      { name: 'boat_dock', label: 'Boat Dock', type: 'checkbox', dbField: 'amenities', value: 'Boat Dock' },
      { name: 'fire_pit', label: 'Fire Pit', type: 'checkbox', dbField: 'amenities', value: 'Fire Pit' },
      { name: 'rustic_features', label: 'Rustic Features', type: 'checkbox', dbField: 'amenities', value: 'Rustic' },
    ]
  },
  condo: {
    name: 'Condominium',
    icon: Building2,
    fields: [
      { name: 'hoa_fee', label: 'HOA Fee ($/month)', type: 'number', dbField: 'custom_fields', subfield: 'hoa_fee' },
      { name: 'unit_number', label: 'Unit Number', type: 'text', dbField: 'custom_fields', subfield: 'unit_number' },
      { name: 'reserved_parking', label: 'Reserved Parking', type: 'checkbox', dbField: 'amenities', value: 'Reserved Parking' },
      { name: 'building_amenities', label: 'Building Amenities', type: 'checkbox', dbField: 'amenities', value: 'Building Amenities' },
    ]
  },
  townhouse: {
    name: 'Townhouse',
    icon: Home,
    fields: [
      { name: 'shared_walls', label: 'Shared Walls', type: 'number', dbField: 'custom_fields', subfield: 'shared_walls' },
      { name: 'private_entrance', label: 'Private Entrance', type: 'checkbox', dbField: 'amenities', value: 'Private Entrance' },
      { name: 'small_garden', label: 'Private Garden', type: 'checkbox', dbField: 'amenities', value: 'Private Garden' },
      { name: 'community_pool', label: 'Community Pool', type: 'checkbox', dbField: 'amenities', value: 'Community Pool' },
    ]
  }
};

function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [step, setStep] = useState(isEditing ? 'form' : 'select-type');
  const [typeSpecificData, setTypeSpecificData] = useState({});
  
  // Main form state
  const [formData, setFormData] = useState({
    // Basic fields
    title: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '3',
    bathrooms: '3',
    sqft: '',
    image_url: '',
    status: 'available',
    category: 'Luxury',
    featured: false,
    price_per_week: '',
    property_type: 'villa',
    
    // Schema fields from your database
    security_deposit: '',
    rent_amount: '',
    lease_duration_months: '',
    available_from: '',
    property_size_sqft: '',
    year_built: '',
    parking_spots: '',
    pet_friendly: false,
    furnished: false,
    images: [],
    floor_plan_url: '',
    
    // Custom fields JSON for type-specific data
    custom_fields: {}
  });

  // Load property data if editing
  useEffect(() => {
    if (isEditing) {
      loadProperty();
    } else {
      setStep('select-type');
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (data) {
        console.log('Loaded property:', data);
        
        // Map database fields to form
        const formattedData = {
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          price: data.price?.toString() || '',
          bedrooms: data.bedrooms?.toString() || '3',
          bathrooms: data.bathrooms?.toString() || '3',
          sqft: data.sqft?.toString() || '',
          image_url: data.image_url || '',
          status: data.status || 'available',
          category: data.category || 'Luxury',
          featured: data.featured || false,
          price_per_week: data.price_per_week?.toString() || data.price?.toString() || '',
          property_type: data.property_type || 'villa',
          
          // Schema fields
          security_deposit: data.security_deposit?.toString() || '',
          rent_amount: data.rent_amount?.toString() || '',
          lease_duration_months: data.lease_duration_months?.toString() || '',
          available_from: data.available_from || '',
          property_size_sqft: data.property_size_sqft?.toString() || '',
          year_built: data.year_built?.toString() || '',
          parking_spots: data.parking_spots?.toString() || '',
          pet_friendly: data.pet_friendly || false,
          furnished: data.furnished || false,
          images: data.images || [],
          floor_plan_url: data.floor_plan_url || '',
          
          // Custom fields
          custom_fields: data.custom_fields || {}
        };
        
        setFormData(formattedData);
        setImagePreview(formattedData.image_url);
        
        // Parse amenities
        if (data.amenities) {
          try {
            const amenitiesList = data.amenities
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
            
            const amenityIds = amenitiesList.map(amenity => {
              const found = AMENITIES_OPTIONS.find(a => a.label === amenity);
              return found ? found.id : amenity.toLowerCase().replace(/\s+/g, '_');
            });
            
            setSelectedAmenities(amenityIds);
          } catch (e) {
            console.warn('Error parsing amenities:', e);
          }
        }
        
        // Extract type-specific data
        extractTypeSpecificData(data.property_type || 'villa', formattedData);
        
      } else {
        setError('Property not found');
        navigate('/admin/properties');
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError(`Failed to load property: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractTypeSpecificData = (propertyType, dbData) => {
    const typeConfig = PROPERTY_TYPE_CONFIG[propertyType];
    const extracted = {};
    
    if (typeConfig) {
      typeConfig.fields.forEach(field => {
        if (field.dbField === 'amenities') {
          // Check if amenity exists in the amenities string
          const hasAmenity = dbData.amenities?.includes(field.value) || false;
          extracted[field.name] = hasAmenity;
        } else if (field.dbField === 'custom_fields' && dbData.custom_fields) {
          extracted[field.name] = dbData.custom_fields[field.subfield] || '';
        } else if (dbData[field.dbField] !== undefined) {
          extracted[field.name] = dbData[field.dbField];
        } else {
          extracted[field.name] = field.type === 'checkbox' ? false : '';
        }
      });
    }
    
    setTypeSpecificData(extracted);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
    setSuccess('');
  };

  const handleTypeSpecificChange = (name, value) => {
    setTypeSpecificData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (name, value) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setImageFile(file);
      setFormData(prev => ({
        ...prev,
        image_url: URL.createObjectURL(file)
      }));
      
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePropertyTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      property_type: type
    }));
    
    // Reset type-specific data for new type
    const typeConfig = PROPERTY_TYPE_CONFIG[type];
    const newTypeData = {};
    
    if (typeConfig) {
      typeConfig.fields.forEach(field => {
        newTypeData[field.name] = field.type === 'checkbox' ? false : '';
      });
    }
    
    setTypeSpecificData(newTypeData);
    setStep('form');
  };

  const prepareFormDataForDatabase = () => {
    const propertyData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      price: parseFloat(formData.price) || 0,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      sqft: parseInt(formData.sqft) || 0,
      image_url: formData.image_url,
      status: formData.status,
      category: formData.category,
      featured: formData.featured,
      property_type: formData.property_type,
      updated_at: new Date().toISOString(),
      
      // Schema fields
      security_deposit: formData.security_deposit ? parseFloat(formData.security_deposit) : null,
      rent_amount: formData.rent_amount ? parseFloat(formData.rent_amount) : null,
      lease_duration_months: formData.lease_duration_months ? parseInt(formData.lease_duration_months) : null,
      available_from: formData.available_from || null,
      property_size_sqft: formData.property_size_sqft ? parseInt(formData.property_size_sqft) : null,
      year_built: formData.year_built ? parseInt(formData.year_built) : null,
      parking_spots: formData.parking_spots ? parseInt(formData.parking_spots) : null,
      pet_friendly: formData.pet_friendly,
      furnished: formData.furnished,
      images: formData.images,
      floor_plan_url: formData.floor_plan_url
    };
    
    // Add price_per_week
    if (formData.price_per_week) {
      propertyData.price_per_week = parseFloat(formData.price_per_week);
    } else {
      propertyData.price_per_week = parseFloat(formData.price) || 0;
    }
    
    // Process amenities
    const amenityLabels = selectedAmenities.map(amenityId => {
      const amenity = AMENITIES_OPTIONS.find(a => a.id === amenityId);
      return amenity ? amenity.label : amenityId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    });
    
    // Add type-specific amenities
    const typeConfig = PROPERTY_TYPE_CONFIG[formData.property_type];
    if (typeConfig) {
      typeConfig.fields.forEach(field => {
        if (field.dbField === 'amenities' && typeSpecificData[field.name]) {
          amenityLabels.push(field.value);
        }
      });
    }
    
    propertyData.amenities = amenityLabels.join(', ');
    
    // Build custom_fields JSON
    const customFields = {};
    if (typeConfig) {
      typeConfig.fields.forEach(field => {
        if (field.dbField === 'custom_fields' && typeSpecificData[field.name] !== undefined) {
          customFields[field.subfield] = typeSpecificData[field.name];
        }
      });
    }
    
    propertyData.custom_fields = Object.keys(customFields).length > 0 ? customFields : null;
    
    return propertyData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.location.trim()) {
      setError('Location is required');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const propertyData = prepareFormDataForDatabase();
      console.log('Submitting property data:', propertyData);
      
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);
        
        if (updateError) throw updateError;
        setSuccess('Property updated successfully!');
      } else {
        propertyData.created_at = new Date().toISOString();
        
        const { data, error: insertError } = await supabase
          .from('properties')
          .insert([propertyData])
          .select()
          .single();
        
        if (insertError) throw insertError;
        setSuccess('Property created successfully!');
      }
      
      setTimeout(() => {
        navigate('/admin/properties');
      }, 1500);
      
    } catch (err) {
      console.error('Save error:', err);
      setError(`Failed to ${isEditing ? 'update' : 'create'} property: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/properties');
  };

  // Step 1: Property Type Selection
  if (step === 'select-type') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Select Property Type</h1>
          <p className="text-gray-600">Choose the type of property you want to create</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(PROPERTY_TYPE_CONFIG).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => handlePropertyTypeSelect(type)}
                className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-orange-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900">{config.name}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {config.fields.length} specific fields
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto" />
      </div>
    );
  }

  const currentTypeConfig = PROPERTY_TYPE_CONFIG[formData.property_type] || PROPERTY_TYPE_CONFIG.villa;
  const TypeIcon = currentTypeConfig.icon;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={isEditing ? handleCancel : () => setStep('select-type')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {isEditing ? 'Back to Properties' : 'Change Property Type'}
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h1>
              <span className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                <TypeIcon className="w-4 h-4" />
                <span className="capitalize">{formData.property_type}</span>
              </span>
            </div>
            <p className="text-gray-600">
              {isEditing ? 'Update property details' : `Create a new ${formData.property_type} listing`}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}
      </div>

      {/* Property Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Oceanfront Luxury Villa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the property..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Maldives, Beachfront Area"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <TypeIcon className="w-5 h-5 text-orange-600" />
                  <span className="font-medium capitalize">{formData.property_type}</span>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setStep('select-type')}
                      className="ml-auto text-sm text-orange-600 hover:text-orange-800"
                    >
                      Change Type
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property Type Specific Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TypeIcon className="w-5 h-5 text-orange-600" />
              {currentTypeConfig.name} Specific Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTypeConfig.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'checkbox' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={field.name}
                        checked={typeSpecificData[field.name] || false}
                        onChange={(e) => handleTypeSpecificChange(field.name, e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
                        Yes
                      </label>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={typeSpecificData[field.name] || ''}
                      onChange={(e) => handleTypeSpecificChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              Pricing & Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Week ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={(e) => handleNumberChange('price', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="35000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit ($)
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="security_deposit"
                    value={formData.security_deposit}
                    onChange={(e) => handleNumberChange('security_deposit', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <div className="relative">
                  <Bed className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => handleNumberChange('bedrooms', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <div className="relative">
                  <Bath className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) => handleNumberChange('bathrooms', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet (sqft)
                </label>
                <div className="relative">
                  <Square className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="sqft"
                    value={formData.sqft}
                    onChange={(e) => handleNumberChange('sqft', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Size (sqft)
                </label>
                <input
                  type="text"
                  name="property_size_sqft"
                  value={formData.property_size_sqft}
                  onChange={(e) => handleNumberChange('property_size_sqft', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Total property area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Spots
                </label>
                <input
                  type="text"
                  name="parking_spots"
                  value={formData.parking_spots}
                  onChange={(e) => handleNumberChange('parking_spots', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Luxury">Luxury</option>
                  <option value="Premium">Premium</option>
                  <option value="Exclusive">Exclusive</option>
                  <option value="Standard">Standard</option>
                  <option value="Budget">Budget</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-orange-600" />
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <input
                  type="date"
                  name="available_from"
                  value={formData.available_from}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Duration (months)
                </label>
                <input
                  type="text"
                  name="lease_duration_months"
                  value={formData.lease_duration_months}
                  onChange={(e) => handleNumberChange('lease_duration_months', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="text"
                  name="year_built"
                  value={formData.year_built}
                  onChange={(e) => handleNumberChange('year_built', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Plan URL
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="floor_plan_url"
                    value={formData.floor_plan_url}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/floorplan.pdf"
                  />
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pet_friendly"
                    name="pet_friendly"
                    checked={formData.pet_friendly}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="pet_friendly" className="ml-2 text-sm text-gray-700 flex items-center">
                    <PawPrint className="w-4 h-4 mr-1" />
                    Pet Friendly
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="furnished"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="furnished" className="ml-2 text-sm text-gray-700 flex items-center">
                    <Sofa className="w-4 h-4 mr-1" />
                    Fully Furnished
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-600" />
              Amenities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AMENITIES_OPTIONS.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = selectedAmenities.includes(amenity.id);
                
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-white border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded ${
                      isSelected ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-sm font-medium text-left">{amenity.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-orange-600 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-orange-600" />
              Property Image
            </h2>
            
            <div className="mb-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Property" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image_url: '' }));
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Upload property image</p>
                  <p className="text-xs text-gray-500">JPG, PNG or WebP (max 5MB)</p>
                </div>
              )}
            </div>

            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="block w-full text-center border-2 border-dashed border-gray-300 hover:border-orange-400 text-gray-700 hover:text-orange-700 font-medium py-3 px-4 rounded-lg cursor-pointer transition-colors"
              >
                {uploadingImage ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </span>
                )}
              </label>
              
              {!imagePreview && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or use image URL
                  </label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-600" />
              Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Mark as Featured Property
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Property Summary</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{formData.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Price:</span>
                    <span className="font-medium">
                      ${formData.price ? parseFloat(formData.price).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span className="font-medium">
                      ${formData.security_deposit ? parseFloat(formData.security_deposit).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bed/Bath:</span>
                    <span className="font-medium">
                      {formData.bedrooms} / {formData.bathrooms}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">
                      {formData.sqft?.toLocaleString()} sqft
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amenities:</span>
                    <span className="font-medium">
                      {selectedAmenities.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6">
            <h3 className="font-semibold text-orange-900 mb-4">Ready to {isEditing ? 'Update' : 'Publish'}?</h3>
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Update Property' : 'Publish Property'}
                  </>
                )}
              </button>
              
              <button
                onClick={handleCancel}
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPropertyEdit;
