// src/pages/dashboard/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  User, Mail, Phone, MapPin, Calendar,
  Save, Upload, Camera, Shield, CheckCircle,
  Home, Navigation, AlertCircle, Info
} from 'lucide-react';

function Profile() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [availableFields, setAvailableFields] = useState({
    first_name: true,
    last_name: true,
    phone: false,
    address: false,
    date_of_birth: false,
    avatar_url: true
  });
  
  // Initialize with safe defaults
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Try to load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.log('Profile load error (may be expected if no profile yet):', profileError.message);
      }

      // Set form data with safe defaults
      setFormData({
        first_name: profileData?.first_name || '',
        last_name: profileData?.last_name || '',
        email: user?.email || '',
        phone: profileData?.phone || '',
        address: profileData?.address || '',
        date_of_birth: profileData?.date_of_birth || '',
        avatar_url: profileData?.avatar_url || ''
      });

      // Check which fields are available in the database
      await checkAvailableFields();

    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load profile data. Please refresh the page.'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAvailableFields = async () => {
    try {
      // We'll test each field by trying to update with a dummy value
      const testFields = ['phone', 'address', 'date_of_birth'];
      const fieldResults = {};

      for (const field of testFields) {
        try {
          // Try a minimal update with just the field we're testing
          const testUpdate = { 
            id: user.id,
            updated_at: new Date().toISOString()
          };
          
          // Add test value for the field
          if (field === 'phone') testUpdate.phone = '123';
          if (field === 'address') testUpdate.address = 'test';
          if (field === 'date_of_birth') testUpdate.date_of_birth = '2000-01-01';

          const { error } = await supabase
            .from('profiles')
            .upsert(testUpdate, { onConflict: 'id' });

          fieldResults[field] = !error;
        } catch (e) {
          fieldResults[field] = false;
        }
      }

      setAvailableFields(prev => ({
        ...prev,
        ...fieldResults
      }));

    } catch (error) {
      console.log('Field check error:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Start with required fields that should always exist
      const updates = {
        id: user.id,
        updated_at: new Date().toISOString(),
        email: user.email
      };

      // Add basic fields (should exist in most setups)
      if (formData.first_name !== undefined) updates.first_name = formData.first_name;
      if (formData.last_name !== undefined) updates.last_name = formData.last_name;
      
      // Add optional fields only if they're available and have values
      if (availableFields.phone && formData.phone) {
        updates.phone = formData.phone;
      }
      
      if (availableFields.avatar_url && formData.avatar_url) {
        updates.avatar_url = formData.avatar_url;
      }
      
      // These fields might not exist in the database
      if (availableFields.address && formData.address) {
        updates.address = formData.address;
      }
      
      if (availableFields.date_of_birth && formData.date_of_birth) {
        updates.date_of_birth = formData.date_of_birth;
      }

      console.log('Attempting to update profile with:', updates);
      console.log('Available fields:', availableFields);

      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      let result;
      
      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist yet, try to insert
        console.log('Profile does not exist, attempting INSERT...');
        result = await supabase
          .from('profiles')
          .insert([updates])
          .select()
          .single();
      } else {
        // Profile exists, update it
        console.log('Profile exists, attempting UPDATE...');
        result = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });

        // Handle specific error cases
        if (error.code === '42501') {
          // RLS policy violation
          setMessage({
            type: 'error',
            text: 'Permission denied. Database security policy is blocking this action.'
          });
          console.error('RLS Policy Error: User does not have permission to perform this action.');
        } else if (error.code === '23505') {
          // Unique violation
          setMessage({
            type: 'error',
            text: 'Profile already exists with this information.'
          });
        } else if (error.code === '23502') {
          // Not null violation
          setMessage({
            type: 'error',
            text: 'Required field is missing. Please fill in all required fields.'
          });
        } else if (error.message.includes('column') && error.message.includes('does not exist')) {
          // Column doesn't exist
          const columnName = error.message.match(/column "([^"]+)"/)?.[1];
          setMessage({
            type: 'warning',
            text: `Field "${columnName}" is not available in the database. Some features may be limited.`
          });
          
          // Remove the problematic field and retry
          const safeUpdates = { ...updates };
          delete safeUpdates[columnName];
          
          console.log('Retrying with safe updates (without', columnName, '):', safeUpdates);
          
          const { error: retryError } = await supabase
            .from('profiles')
            .upsert(safeUpdates, { onConflict: 'id' });
            
          if (retryError) throw retryError;
          
          // Update available fields
          setAvailableFields(prev => ({
            ...prev,
            [columnName]: false
          }));
          
          // Show success message for partial update
          setMessage({
            type: 'success',
            text: `Profile updated successfully! (Note: ${columnName} field is not available)`
          });
          
          // Update local state with successful updates
          updateUserProfile(safeUpdates);
          setSaving(false);
          return;
        } else {
          // Generic error
          throw error;
        }
        return;
      }

      console.log('Profile updated successfully:', data);
      
      // Update local state
      updateUserProfile(data);
      
      // Refresh available fields
      await checkAvailableFields();
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: `Failed to update profile: ${error.message || 'Unknown error occurred'}`
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setMessage({
        type: 'error',
        text: 'Please upload an image file (JPG, PNG, etc.)'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({
        type: 'error',
        text: 'Image file size must be less than 5MB'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        if (uploadError.message.includes('bucket')) {
          setMessage({
            type: 'error',
            text: 'Storage bucket not configured. Please contact support.'
          });
          return;
        }
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update form data
      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      // Auto-save the avatar URL
      if (availableFields.avatar_url) {
        const { error: saveError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
          .eq('id', user.id);

        if (saveError) {
          console.error('Error saving avatar URL:', saveError);
          setMessage({
            type: 'warning',
            text: 'Image uploaded but failed to save to profile. Please try saving again.'
          });
        } else {
          updateUserProfile({ avatar_url: publicUrl });
          setMessage({
            type: 'success',
            text: 'Profile picture updated successfully!'
          });
        }
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({
        type: 'error',
        text: error.message.includes('permission') 
          ? 'Permission denied for file upload. Please contact support.'
          : 'Failed to upload image. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldStatus = (fieldName) => {
    if (!availableFields[fieldName]) {
      return {
        available: false,
        message: 'This field is not available in your current database setup.',
        icon: <Info className="w-4 h-4 text-amber-500" />
      };
    }
    return {
      available: true,
      message: '',
      icon: null
    };
  };

  if (loading && !saving) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
      </div>

      {/* Status Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : message.type === 'warning'
            ? 'bg-amber-50 text-amber-800 border border-amber-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          ) : message.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          ) : (
            <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="font-medium">{message.text}</p>
            {message.type === 'error' && (
              <p className="text-sm mt-1">
                If this continues, please contact support or try again later.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Database Status Info */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Database Status</p>
            <p className="text-xs text-blue-700 mt-1">
              Some fields may not be available in your current database setup.
              {!availableFields.phone && ' Phone field is disabled.'}
              {!availableFields.address && ' Address field is disabled.'}
              {!availableFields.date_of_birth && ' Date of Birth field is disabled.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Picture Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <div class="w-16 h-16 text-orange-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-orange-600" />
                  </div>
                )}
                
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg"
                  title="Upload profile picture"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading || !availableFields.avatar_url}
                  />
                </label>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {formData.first_name || 'User'} {formData.last_name || ''}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm text-gray-500">
                  {availableFields.avatar_url ? (
                    'Click the camera icon to upload a profile picture'
                  ) : (
                    <span className="text-amber-600">Profile pictures not available</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your first name"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Contact support to change your email
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
                {!availableFields.phone && (
                  <span className="text-xs text-amber-600 ml-2">(Not Available)</span>
                )}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!availableFields.phone}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    !availableFields.phone 
                      ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  placeholder={availableFields.phone ? "(123) 456-7890" : "Field not available"}
                />
              </div>
              {!availableFields.phone && (
                <p className="text-xs text-amber-600 mt-2">
                  Phone field is not available in your database setup
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
                {!availableFields.address && (
                  <span className="text-xs text-amber-600 ml-2">(Not Available)</span>
                )}
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!availableFields.address}
                  rows="2"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${
                    !availableFields.address 
                      ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                  placeholder={availableFields.address ? "Enter your complete address" : "Field not available"}
                />
              </div>
              {!availableFields.address && (
                <p className="text-xs text-amber-600 mt-2">
                  Address field is not available in your database setup
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
                {!availableFields.date_of_birth && (
                  <span className="text-xs text-amber-600 ml-2">(Not Available)</span>
                )}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={!availableFields.date_of_birth}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    !availableFields.date_of_birth 
                      ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {!availableFields.date_of_birth && (
                <p className="text-xs text-amber-600 mt-2">
                  Date of Birth field is not available in your database setup
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>Fields marked with * are required</p>
              <p className="mt-1">Some fields may be unavailable due to database configuration</p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium px-8 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Account Created</h4>
            <p className="font-medium">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'N/A'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Last Login</h4>
            <p className="font-medium">
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Recently'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">User ID</h4>
            <p className="font-medium text-sm font-mono text-gray-600 truncate">
              {user?.id || 'N/A'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Database Status</h4>
            <p className="font-medium">
              {availableFields.phone && availableFields.address && availableFields.date_of_birth 
                ? 'All fields available' 
                : 'Limited fields available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
