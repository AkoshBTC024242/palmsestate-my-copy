// src/pages/dashboard/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  User, Mail, Phone, MapPin, Calendar,
  Save, Upload, Camera, Shield, CheckCircle,
  Home, AlertCircle, Info, Database, Lock
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
      
      // First, let's check if profiles table exists and we have access
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.log('Profile load error:', profileError);
        
        if (profileError.code === '42501') {
          setMessage({
            type: 'error',
            text: 'Database access denied. RLS policies may be blocking access.'
          });
        } else if (profileError.code === 'PGRST116') {
          // Profile doesn't exist yet - this is fine
          console.log('No profile exists yet for this user');
        } else {
          // Try a different approach - check table structure
          await checkTableStructure();
        }
      } else {
        // Profile exists, load the data
        setFormData({
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
          email: user?.email || '',
          phone: profileData?.phone || '',
          address: profileData?.address || '',
          date_of_birth: profileData?.date_of_birth || '',
          avatar_url: profileData?.avatar_url || ''
        });

        // Determine which fields are available
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
        text: 'Failed to load profile data.'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkTableStructure = async () => {
    try {
      // Try to get table info with a simple query
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error && error.code === '42501') {
        console.log('RLS blocking table access');
        return;
      }

      // If we can query, try to get column info
      const { data: sampleData, error: sampleError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (!sampleError && sampleData && sampleData.length > 0) {
        // Check which columns exist in the first row
        const firstRow = sampleData[0];
        setAvailableFields({
          first_name: 'first_name' in firstRow,
          last_name: 'last_name' in firstRow,
          phone: 'phone' in firstRow,
          address: 'address' in firstRow,
          date_of_birth: 'date_of_birth' in firstRow,
          avatar_url: 'avatar_url' in firstRow
        });
      }
    } catch (error) {
      console.log('Table structure check error:', error.message);
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
      // Prepare updates
      const updates = {
        id: user.id,
        updated_at: new Date().toISOString(),
        email: user.email,
        first_name: formData.first_name || '',
        last_name: formData.last_name || ''
      };

      // Only add optional fields if they're enabled
      if (availableFields.phone && formData.phone) {
        updates.phone = formData.phone;
      }
      if (availableFields.avatar_url && formData.avatar_url) {
        updates.avatar_url = formData.avatar_url;
      }
      if (availableFields.address && formData.address) {
        updates.address = formData.address;
      }
      if (availableFields.date_of_birth && formData.date_of_birth) {
        updates.date_of_birth = formData.date_of_birth;
      }

      console.log('Attempting to save profile with RLS...');

      // Try upsert first
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updates, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Supabase RLS error:', error);
        
        // Handle RLS permission error
        if (error.code === '42501') {
          setMessage({
            type: 'error',
            text: 'Permission denied by database security policies. This is a server-side configuration issue.'
          });
          
          // Try an alternative approach - use a stored procedure or direct insert
          await tryAlternativeSave(updates);
          return;
        }
        
        throw error;
      }

      // Success
      updateUserProfile(updates);
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });

    } catch (error) {
      console.error('Profile save error:', error);
      setMessage({
        type: 'error',
        text: `Save failed: ${error.message || 'Unknown error'}`
      });
    } finally {
      setSaving(false);
    }
  };

  const tryAlternativeSave = async (updates) => {
    try {
      console.log('Trying alternative save method...');
      
      // Method 1: Try using the auth.users metadata
      const { data: userData, error: userError } = await supabase.auth.updateUser({
        data: {
          first_name: updates.first_name,
          last_name: updates.last_name,
          phone: updates.phone,
          address: updates.address
        }
      });

      if (!userError) {
        console.log('Saved to auth metadata successfully');
        updateUserProfile(updates);
        setMessage({
          type: 'success',
          text: 'Profile saved to user metadata! (Note: Some features may be limited)'
        });
        return;
      }

      // Method 2: Try creating profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([updates]);

      if (!insertError) {
        console.log('Profile created successfully');
        updateUserProfile(updates);
        setMessage({
          type: 'success',
          text: 'Profile created successfully!'
        });
        return;
      }

      // Method 3: Last resort - save to localStorage
      localStorage.setItem('user_profile', JSON.stringify(updates));
      updateUserProfile(updates);
      setMessage({
        type: 'warning',
        text: 'Profile saved locally (database access restricted). Changes will be lost if you clear browser data.'
      });

    } catch (altError) {
      console.error('All save methods failed:', altError);
      setMessage({
        type: 'error',
        text: 'All save methods failed. Please contact support to fix database permissions.'
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Simple upload without storage bucket checks
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setFormData(prev => ({
          ...prev,
          avatar_url: base64Data
        }));
        setMessage({
          type: 'success',
          text: 'Image loaded locally. Save your profile to persist it.'
        });
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Image upload error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load image.'
      });
    } finally {
      setLoading(false);
    }
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
        <p className="text-gray-600 mt-2">Manage your personal information</p>
      </div>

      {/* RLS Warning Banner */}
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Database Security Alert</p>
            <p className="text-xs text-red-700 mt-1">
              Your database has Row Level Security (RLS) policies that may prevent profile updates.
              <br />
              <a 
                href="https://supabase.com/docs/guides/auth/row-level-security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-red-800"
              >
                Learn about fixing RLS policies
              </a>
            </p>
          </div>
        </div>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Picture Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                {formData.avatar_url ? (
                  formData.avatar_url.startsWith('data:') ? (
                    <img
                      src={formData.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
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
                  )
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
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading}
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
              <p className="text-sm text-gray-500 mt-4">
                Upload a profile picture (saved locally)
              </p>
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
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Fields marked with * are required
              </p>
              <p className="mt-2 text-xs text-red-600">
                Note: Due to RLS policies, changes may be saved locally
              </p>
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

      {/* Quick Fix Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          How to Fix Database Permissions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Option 1: Enable RLS Policies in Supabase</h4>
            <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-1">
              <li>Go to your Supabase Dashboard</li>
              <li>Navigate to Authentication → Policies</li>
              <li>Find the 'profiles' table</li>
              <li>Enable these policies:</li>
              <ul className="list-disc pl-5 mt-1">
                <li><code>Users can view their own profile</code></li>
                <li><code>Users can update their own profile</code></li>
                <li><code>Users can insert their own profile</code></li>
              </ul>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Option 2: Run SQL in Supabase Editor</h4>
            <pre className="bg-blue-900 text-blue-100 p-4 rounded-lg text-xs overflow-x-auto">
{`-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
