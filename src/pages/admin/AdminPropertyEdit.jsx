import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Save, X, Upload, Camera, Home, MapPin, DollarSign,
  BedDouble, Bath, Square, CheckCircle, AlertCircle
} from 'lucide-react';

function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [property, setProperty] = useState({
    title: '',
    description: '',
    location: '',
    price_per_week: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    category: 'luxury',
    status: 'available',
    amenities: [],
    image_url: '',
    features: []
  });

  const [amenitiesList] = useState([
    'Swimming Pool',
    'Gym',
    'Garden',
    'Parking',
    'Security',
    'Elevator',
    'Balcony',
    'Fireplace',
    'Air Conditioning',
    'Heating',
    'WiFi',
    'Pet Friendly',
    'Furnished'
  ]);

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setProperty({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          price_per_week: data.price_per_week || '',
          bedrooms: data.bedrooms || '',
          bathrooms: data.bathrooms || '',
          square_feet: data.square_feet || '',
          category: data.category || 'luxury',
          status: data.status || 'available',
          amenities: data.amenities || [],
          image_url: data.image_url || '',
          features: data.features || []
        });
      }
    } catch (error) {
      console.error('Error loading property:', error);
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'location', 'price_per_week'];
      const missingFields = requiredFields.filter(field => !property[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Prepare data
      const propertyData = {
        title: property.title,
        description: property.description,
        location: property.location,
        price_per_week: parseFloat(property.price_per_week),
        bedrooms: parseInt(property.bedrooms) || 0,
        bathrooms: parseInt(property.bathrooms) || 0,
        square_feet: parseInt(property.square_feet) || 0,
        category: property.category,
        status: property.status,
        amenities: property.amenities,
        features: property.features,
        image_url: property.image_url,
        updated_at: new Date().toISOString()
      };

      if (isNew) {
        propertyData.created_at = new Date().toISOString();
        propertyData.created_by = 'admin'; // You can get this from auth context
        
        const { data, error } = await supabase
          .from('properties')
          .insert([propertyData])
          .select()
          .single();

        if (error) throw error;
        setSuccess('Property created successfully!');
        setTimeout(() => navigate('/admin/properties'), 2000);
      } else {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);

        if (error) throw error;
        setSuccess('Property updated successfully!');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `property-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      setProperty({ ...property, image_url: publicUrl });
      setSuccess('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity) => {
    setProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (loading && !isNew) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading property...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/properties')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
          >
            ← Back to Properties
          </button>
          
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            {isNew ? 'Add New Property' : 'Edit Property'}
          </h1>
          <p className="text-gray-600">
            {isNew ? 'Create a new luxury property listing' : 'Update property details'}
          </p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
            <p className="text-rose-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
            <p className="text-emerald-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h2 className="font-serif font-bold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={property.title}
                  onChange={(e) => setProperty({...property, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g., Oceanfront Luxury Villa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={property.description}
                  onChange={(e) => setProperty({...property, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Describe the property in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={property.location}
                  onChange={(e) => setProperty({...property, location: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g., Monte Carlo, Monaco"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h2 className="font-serif font-bold text-gray-900 mb-6">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price per Week *
                  </div>
                </label>
                <input
                  type="number"
                  value={property.price_per_week}
                  onChange={(e) => setProperty({...property, price_per_week: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g., 35000"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4" />
                    Bedrooms
                  </div>
                </label>
                <input
                  type="number"
                  value={property.bedrooms}
                  onChange={(e) => setProperty({...property, bedrooms: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g., 5"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4" />
                    Bathrooms
                  </div>
                </label>
                <input
                  type="number"
                  value={property.bathrooms}
                  onChange={(e) => setProperty({...property, bathrooms: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g., 6"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    Square Feet
                  </div>
                </label>
                <input
                  type="number"
                  value={property.square_feet}
                  onChange={(e) => setProperty({...property, square_feet: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="e.g., 12500"
                  min="0"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={property.status}
                onChange={(e) => setProperty({...property, status: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h2 className="font-serif font-bold text-gray-900 mb-6">Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    property.amenities.includes(amenity)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{amenity}</span>
                    {property.amenities.includes(amenity) && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h2 className="font-serif font-bold text-gray-900 mb-6">Property Image</h2>
            
            <div className="space-y-4">
              {property.image_url ? (
                <div className="relative">
                  <img
                    src={property.image_url}
                    alt="Property"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setProperty({...property, image_url: ''})}
                    className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload property image</p>
                  <p className="text-sm text-gray-500 mb-4">JPG, PNG up to 5MB</p>
                  <label className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
                    <Upload className="w-5 h-5" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (alternative)
                </label>
                <input
                  type="url"
                  value={property.image_url}
                  onChange={(e) => setProperty({...property, image_url: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/properties')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isNew ? 'Create Property' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPropertyEdit;
