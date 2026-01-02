// src/pages/dashboard/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  User, Mail, Phone, MapPin, Calendar,
  Save, Upload, Camera, Shield, CheckCircle,
  Home, Navigation, AlertCircle, Info,
  Database
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
      checkDatabaseSchema();
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

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile load error:', profileError);
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

      // Update available fields based on actual data
      if (profileData) {
        setAvailableFields(prev => ({
          ...prev,
          phone: profileData.phone !== undefined,
          address: profileData.address !== undefined,
          date_of_birth: profileData.date_of_birth !== undefined,
        }));
      }

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

  const checkDatabaseSchema = async () => {
    try {
      // Instead of trying to update, let's check if we can query the table schema
      // We'll do this by making a minimal safe query
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Database connection error:', error);
        return;
      }

      // If we get here, the table exists
      // Now let's check specific columns by trying a broader query
      try {
        const { data: schemaData, error: schemaError } = await supabase
          .from('profiles')
          .select('phone, address, date_of_birth')
          .limit(0); // Limit 0 to get metadata without data

        if (!schemaError) {
          // These fields exist in the database
          setAvailableFields(prev => ({
            ...prev,
            phone: true,
            address: true,
            date_of_birth: true
          }));
        } else if (schemaError && schemaError.message) {
          // Parse error message to see which fields are missing
          const errorMessage = schemaError.message.toLowerCase();
          
          setAvailableFields(prev => ({
            ...prev,
            phone: !errorMessage.includes('phone'),
            address: !errorMessage.includes('address'),
            date_of_birth: !errorMessage.includes('date_of_birth')
          }));
        }
      } catch (schemaCheckError) {
        console.log('Schema check error (this is expected for missing columns):', schemaCheckError.message);
      }

    } catch (error) {
      console.log('Database schema check error:', error.message);
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

      // Add basic fields
      updates.first_name = formData.first_name || '';
      updates.last_name = formData.last_name || '';
      
      // Add optional fields only if they're enabled in the form
      if (availableFields.phone) updates.phone = formData.phone || null;
      if (availableFields.avatar_url) updates.avatar_url = formData.avatar_url || null;
      if (availableFields.address) updates.address = formData.address || null;
      if (availableFields.date_of_birth) updates.date_of_birth = formData.date_of_birth || null;

      console.log('Updating profile with:', updates);
      console.log('Available fields:', availableFields);

      // Use upsert to handle both insert and update
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updates, { 
          onConflict: 'id',
          returning: 'minimal'
        });

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle specific error cases
        if (error.code === '42501') {
          setMessage({
            type: 'error',
            text: 'Permission denied. Please contact support.'
          });
        } else if (error.message.includes('column') && error.message.includes('does not exist')) {
          // Extract column name from error
          const columnMatch = error.message.match(/column "([^"]+)"/);
          const columnName = columnMatch ? columnMatch[1] : 'unknown';
          
          setMessage({
            type: 'warning',
            text: `Field "${columnName}" is not available in your database.`
          });
          
          // Update available fields to disable this field
          setAvailableFields(prev => ({
            ...prev,
            [columnName]: false
          }));
          
          // Retry without the problematic field
          const safeUpdates = { ...updates };
          delete safeUpdates[columnName];
          
          const { error: retryError } = await supabase
            .from('profiles')
            .upsert(safeUpdates, { onConflict: 'id' });
            
          if (retryError) throw retryError;
          
          // Show success message
          setMessage({
            type: 'success',
            text: 'Profile updated successfully! (Some fields were skipped)'
          });
          
          updateUserProfile(safeUpdates);
          setSaving(false);
          return;
        } else {
          throw error;
        }
      } else {
        // Success
        console.log('Profile updated successfully');
        
        // Update local state with all submitted data
        updateUserProfile(updates);
        
        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({
        type: 'error',
        text: 'Please upload an image file'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: 'Image must be less than 5MB'
      });
      return;
    }

    try {
      setLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Check if avatars bucket exists by listing buckets
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError) {
          setMessage({
            type: 'error',
            text: 'Storage service unavailable. Please contact support.'
          });
          return;
        }

        const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
        
        if (!avatarBucketExists) {
          setMessage({
            type: 'error',
            text: 'Profile pictures are not configured. Please contact support.'
          });
          return;
        }
      } catch (bucketCheckError) {
        console.log('Bucket check error:', bucketCheckError);
      }

      // Upload file
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
            text: 'Profile pictures storage not available.'
          });
        } else {
          throw uploadError;
        }
        return;
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

      // Auto-save if avatar field is available
      if (availableFields.avatar_url) {
        const { error: saveError } = await supabase
          .from('profiles')
          .update({ 
            avatar_url: publicUrl, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', user.id);

        if (!saveError) {
          updateUserProfile({ avatar_url: publicUrl });
          setMessage({
            type: 'success',
            text: 'Profile picture updated!'
          });
        }
      }

    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to upload image. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Count available fields for status display
  const availableFieldCount = Object.values(availableFields).filter(Boolean).length;
  const totalFields = Object.keys(availableFields).length;

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
          </div>
        </div>
      )}

      {/* Database Status Card */}
      <div className={`mb-6 rounded-lg p-4 border ${
        availableFieldCount === totalFields 
          ? 'bg-green-50 border-green-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start gap-3">
          <Database className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
            availableFieldCount === totalFields ? 'text-green-600' : 'text-blue-600'
          }`} />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-800">Database Status</p>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                availableFieldCount === totalFields 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {availableFieldCount}/{totalFields} fields available
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              {availableFieldCount === totalFields 
                ? 'All profile fields are available in your database.'
                : 'Some fields may not be available in your current database setup:'}
            </p>
            {availableFieldCount !== totalFields && (
              <div className="mt-2 flex flex-wrap gap-2">
                {!availableFields.phone && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    <Phone className="w-3 h-3" /> Phone
                  </span>
                )}
                {!availableFields.address && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    <Home className="w-3 h-3" /> Address
                  </span>
                )}
                {!availableFields.date_of_birth && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    <Calendar className="w-3 h-3" /> Date of Birth
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Picture */}
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
                
                {availableFields.avatar_url && (
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
                      disabled={loading}
                    />
                  </label>
                )}
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
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {availableFields.avatar_url 
                    ? 'Click the camera icon to upload a profile picture'
                    : 'Profile pictures are not available in your current setup'}
                </p>
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

            {/* Email */}
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Contact support to change your email
              </p>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                {!availableFields.phone && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Unavailable</span>
                )}
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!availableFields.phone}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg ${
                    !availableFields.phone 
                      ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed' 
                      : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  placeholder={availableFields.phone ? "(123) 456-7890" : "Field unavailable"}
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                {!availableFields.address && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Unavailable</span>
                )}
              </div>
              <div className="relative">
                <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!availableFields.address}
                  rows="2"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg resize-none ${
                    !availableFields.address 
                      ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed' 
                      : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  placeholder={availableFields.address ? "Enter your complete address" : "Field unavailable"}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                {!availableFields.date_of_birth && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Unavailable</span>
                )}
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={!availableFields.date_of_birth}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg ${
                    !availableFields.date_of_birth 
                      ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed' 
                      : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>Fields marked with * are required</p>
              {availableFieldCount !== totalFields && (
                <p className="mt-1 text-amber-600">
                  Some fields are disabled due to database configuration
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={loadProfileData}
                className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium px-8 py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Database Compatibility</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                  style={{ width: `${(availableFieldCount / totalFields) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((availableFieldCount / totalFields) * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {availableFieldCount === totalFields 
                ? 'All profile fields are available'
                : `${totalFields - availableFieldCount} field(s) are not available in your database`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
