// src/pages/dashboard/Profile.jsx - WITH COUNTRY & STATE DROPDOWNS
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, saveUserProfile, loadUserProfile } from '../../lib/supabase';
import {
  User, Mail, Phone, Home, Calendar, MapPin, Globe,
  Save, Camera, CheckCircle, AlertCircle,
  Shield, Edit2, Building, ChevronDown
} from 'lucide-react';

// Country list (most common countries first)
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'RU', name: 'Russia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SG', name: 'Singapore' },
];

// US States
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

// Canada Provinces
const CA_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories',
  'Nunavut', 'Yukon'
];

// UK Countries
const UK_COUNTRIES = [
  'England', 'Scotland', 'Wales', 'Northern Ireland'
];

// Australia States/Territories
const AU_STATES = [
  'New South Wales', 'Queensland', 'South Australia', 'Tasmania',
  'Victoria', 'Western Australia', 'Australian Capital Territory',
  'Northern Territory'
];

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
    date_of_birth: '',
    avatar_url: ''
  });

  // Get states/provinces based on selected country
  const getStatesForCountry = () => {
    switch (formData.country) {
      case 'US':
        return US_STATES;
      case 'CA':
        return CA_PROVINCES;
      case 'GB':
        return UK_COUNTRIES;
      case 'AU':
        return AU_STATES;
      default:
        return []; // For other countries, show free text input
    }
  };

  const states = getStatesForCountry();
  const hasStateList = states.length > 0;

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const result = await loadUserProfile(user.id);
      
      if (result.success) {
        if (result.data) {
          // Parse address if it's stored as a single field
          let street_address = '';
          let city = '';
          let state = '';
          let zip_code = '';
          let country = 'US';
          
          if (result.data.address) {
            // Try to parse address string
            const addressParts = result.data.address.split(',');
            if (addressParts.length >= 4) {
              street_address = addressParts[0].trim();
              city = addressParts[1].trim();
              state = addressParts[2].trim();
              zip_code = addressParts[3].trim();
              country = addressParts[4]?.trim() || 'US';
            } else {
              // If not parsable, put entire address in street field
              street_address = result.data.address;
            }
          }
          
          setFormData({
            first_name: result.data.first_name || '',
            last_name: result.data.last_name || '',
            email: result.data.email || user.email || '',
            phone: result.data.phone || '',
            street_address: street_address,
            city: city,
            state: state,
            zip_code: zip_code,
            country: country,
            date_of_birth: result.data.date_of_birth || '',
            avatar_url: result.data.avatar_url || ''
          });
        } else {
          // New user - set email only
          setFormData(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      } else {
        setMessage({ 
          type: 'error', 
          text: `Failed to load profile: ${result.error}` 
        });
      }
    } catch (error) {
      console.error('Load error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Unexpected error loading profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Combine address fields
      const selectedCountry = COUNTRIES.find(c => c.code === formData.country)?.name || formData.country;
      const address = formData.street_address ? 
        `${formData.street_address}, ${formData.city}, ${formData.state} ${formData.zip_code}, ${selectedCountry}`.trim() : 
        null;
      
      const profileData = {
        ...formData,
        address: address
      };
      
      const result = await saveUserProfile(user.id, profileData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        // Check error type
        if (result.code === '42501') {
          setMessage({ 
            type: 'error', 
            text: 'Permission denied. Please try logging out and back in.' 
          });
        } else {
          setMessage({ 
            type: 'error', 
            text: `Save failed: ${result.error}` 
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Unexpected error saving profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset state when country changes
    if (name === 'country') {
      setFormData(prev => ({
        ...prev,
        state: ''
      }));
    }
  };

  const handleSelectState = (state) => {
    setFormData(prev => ({
      ...prev,
      state: state
    }));
    setShowStateDropdown(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Simple base64 conversion for demo
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar_url: reader.result
        }));
        setMessage({
          type: 'success',
          text: 'Profile picture updated. Save your profile to keep the changes.'
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to upload image.'
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2 text-lg">Manage your personal information and account settings</p>
      </div>

      {/* Status Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl shadow-sm flex items-start gap-3 ${
          message.type === 'success' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800' 
            : message.type === 'error'
            ? 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800'
            : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
          ) : message.type === 'error' ? (
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
          ) : (
            <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="font-semibold text-lg">{message.text}</p>
          </div>
          <button
            onClick={() => setMessage({ type: '', text: '' })}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Picture & Account Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 border-4 border-white shadow-lg">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <div class="w-20 h-20 text-orange-500">
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
                      <User className="w-20 h-20 text-orange-500" />
                    </div>
                  )}
                </div>
                
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:from-orange-600 hover:to-amber-600 transition-all shadow-xl transform hover:scale-105"
                  title="Upload profile picture"
                >
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                {formData.first_name || 'Welcome,'} {formData.last_name || 'User'}
              </h2>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              
              <div className="mt-6 w-full">
                <div className="text-sm text-gray-500 mb-1">Profile Completion</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(
                        (formData.first_name ? 10 : 0) +
                        (formData.last_name ? 10 : 0) +
                        (formData.phone ? 10 : 0) +
                        (formData.street_address ? 15 : 0) +
                        (formData.city ? 5 : 0) +
                        (formData.state ? 5 : 0) +
                        (formData.zip_code ? 5 : 0) +
                        (formData.country ? 5 : 0) +
                        (formData.date_of_birth ? 10 : 0) +
                        (formData.avatar_url ? 10 : 0)
                      )}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-right">
                  {(
                    (formData.first_name ? 10 : 0) +
                    (formData.last_name ? 10 : 0) +
                    (formData.phone ? 10 : 0) +
                    (formData.street_address ? 15 : 0) +
                    (formData.city ? 5 : 0) +
                    (formData.state ? 5 : 0) +
                    (formData.zip_code ? 5 : 0) +
                    (formData.country ? 5 : 0) +
                    (formData.date_of_birth ? 10 : 0) +
                    (formData.avatar_url ? 10 : 0)
                  )}% Complete
                </div>
              </div>
            </div>
          </div>

          {/* Account Info Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-500" />
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="font-medium text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium text-gray-900">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Recently'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium text-sm text-gray-600 truncate">
                  {user?.id?.substring(0, 16)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Edit2 className="w-6 h-6 text-orange-600" />
                Personal Information
              </h3>
              <p className="text-gray-600 mt-1">Update your contact details and personal information</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Contact support to change your email address
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section Header */}
                <div className="md:col-span-2 pt-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Address Information
                  </h4>
                </div>

                {/* Street Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Home className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="street_address"
                        value={formData.street_address}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="123 Main St, Apt 4B"
                      />
                    </div>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="Los Angeles"
                      />
                    </div>
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200 appearance-none cursor-pointer"
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* State/Province - Conditional Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.country === 'US' ? 'State' : 
                     formData.country === 'CA' ? 'Province' : 
                     formData.country === 'GB' ? 'Country' : 
                     formData.country === 'AU' ? 'State/Territory' : 
                     'State/Province'}
                  </label>
                  
                  {hasStateList ? (
                    <div className="relative">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                          <div
                            onClick={() => setShowStateDropdown(!showStateDropdown)}
                            className="w-full pl-12 pr-10 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200 cursor-pointer flex items-center justify-between"
                          >
                            <span className={formData.state ? 'text-gray-900' : 'text-gray-400'}>
                              {formData.state || `Select ${formData.country === 'US' ? 'State' : 'Province'}`}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
                          </div>
                          
                          {/* Dropdown */}
                          {showStateDropdown && (
                            <>
                              <div 
                                className="fixed inset-0 z-20" 
                                onClick={() => setShowStateDropdown(false)}
                              />
                              <div className="absolute z-30 mt-1 w-full max-h-60 bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto">
                                {states.map((state) => (
                                  <div
                                    key={state}
                                    onClick={() => handleSelectState(state)}
                                    className={`px-4 py-3 cursor-pointer hover:bg-orange-50 transition-colors ${
                                      formData.state === state ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                                    }`}
                                  >
                                    {state}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                          placeholder="Enter state/province"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ZIP/Postal Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.country === 'US' ? 'ZIP Code' : 
                     formData.country === 'GB' ? 'Postcode' : 
                     formData.country === 'CA' ? 'Postal Code' : 
                     'Postal Code'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder={formData.country === 'US' ? '90210' : 
                                  formData.country === 'GB' ? 'SW1A 1AA' : 
                                  formData.country === 'CA' ? 'M5V 2T6' : 'Postal Code'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <span className="text-red-500">*</span> Required fields
                  </p>
                  <p className="mt-1 text-xs">All information is securely stored and protected</p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={loadProfile}
                    className="px-8 py-3.5 text-gray-700 hover:text-gray-900 font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold px-10 py-3.5 rounded-xl hover:shadow-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative flex items-center gap-3">
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Update Profile
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Help Card */}
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl">
            <h4 className="font-bold text-blue-900 mb-2">Need Help?</h4>
            <p className="text-blue-700 text-sm">
              If you're having trouble updating your profile or need to change your email address, 
              please contact our support team at support@palmsestate.org
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
