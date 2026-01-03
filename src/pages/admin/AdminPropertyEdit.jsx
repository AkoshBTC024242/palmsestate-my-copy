// src/pages/admin/AdminPropertyEdit.jsx - COMPLETE VERSION
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Upload, X, Image, MapPin,
  DollarSign, Bed, Bath, Square, Home, Globe,
  Calendar, CheckCircle, AlertCircle, Loader2,
  Plus, Minus, Tag, Building2, Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    price_per_week: '',
    bedrooms: '3',
    bathrooms: '3',
    square_feet: '5000',
    sqft: '5000',
    category: 'Luxury',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
    amenities: 'Swimming Pool, Gym, Garden, Security, Parking',
    featured: false,
    year_built: new Date().getFullYear().toString()
  });

  // Load property data if editing
  useEffect(() => {
    if (isEditing) {
      loadProperty();
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
        .single();
      
      if (fetchError) throw fetchError;
      
      if (data) {
        // Convert numbers to strings for form inputs
        const formattedData = {
          ...data,
          price: data.price?.toString() || '',
          price_per_week: data.price_per_week?.toString() || '',
          bedrooms: data.bedrooms?.toString() || '3',
          bathrooms: data.bathrooms?.toString() || '3',
          square_feet: data.square_feet?.toString() || '5000',
          sqft: data.sqft?.toString() || '5000',
          year_built: data.year_built?.toString() || new Date().getFullYear().toString(),
          amenities: data.amenities || 'Swimming Pool, Gym, Garden, Security, Parking'
        };
        
        setFormData(formattedData);
        setImagePreview(formattedData.image_url);
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Failed to load property. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const handleNumberChange = (name, value) => {
    // Allow only numbers
    const numValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      
      // For now, we'll just use the file for preview
      // In production, upload to Supabase Storage
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
      
      // Prepare data for submission
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        price_per_week: parseFloat(formData.price_per_week || formData.price),
        bedrooms: parseInt(formData.bedrooms) || 3,
        bathrooms: parseInt(formData.bathrooms) || 3,
        square_feet: parseInt(formData.square_feet) || 5000,
        sqft: parseInt(formData.sqft) || 5000,
        year_built: parseInt(formData.year_built) || new Date().getFullYear(),
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (isEditing) {
        // Update existing property
        const { data, error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        result = data;
      } else {
        // Create new property
        propertyData.created_at = new Date().toISOString();
        
        const { data, error: insertError } = await supabase
          .from('properties')
          .insert([propertyData])
          .select()
          .single();
        
        if (insertError) throw insertError;
        result = data;
      }
      
      setSuccess(`Property ${isEditing ? 'updated' : 'created'} successfully!`);
      
      // Redirect after successful save
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Properties
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update property details' : 'Create a new property listing'}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}
      </div>

      {/* Property Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe the property features, amenities, and unique selling points..."
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Maldives, Beachfront Area"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Pricing & Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Price ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={(e) => handleNumberChange('price', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="35000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Price (Calculated)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={formData.price ? (parseFloat(formData.price) * 4).toLocaleString() : ''}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="140000"
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <div className="relative">
                  <Square className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="square_feet"
                    value={formData.square_feet}
                    onChange={(e) => handleNumberChange('square_feet', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="5000"
                  />
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="2023"
                />
              </div>
            </div>
          </div>

          {/* Amenities Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-600" />
              Amenities
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities (comma-separated)
              </label>
              <textarea
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Swimming Pool, Gym, Garden, Security, Parking, Wi-Fi, Air Conditioning"
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate amenities with commas
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Image & Settings */}
        <div className="space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-emerald-600" />
              Property Image
            </h2>
            
            <div className="mb-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Property preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
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
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="block w-full text-center border-2 border-gray-300 border-dashed hover:border-emerald-400 text-gray-700 hover:text-emerald-700 font-medium py-3 px-4 rounded-lg cursor-pointer transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Luxury">Luxury</option>
                  <option value="Premium">Premium</option>
                  <option value="Exclusive">Exclusive</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Mark as Featured Property
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Stats</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Price per month:</span>
                    <span className="font-medium">
                      ${formData.price ? (parseFloat(formData.price) * 4).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">
                      {formData.square_feet?.toLocaleString()} sqft
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bed/Bath:</span>
                    <span className="font-medium">
                      {formData.bedrooms} / {formData.bathrooms}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-6">
            <h3 className="font-semibold text-emerald-900 mb-4">Ready to {isEditing ? 'Update' : 'Publish'}?</h3>
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
