import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  User, Mail, Phone, Calendar, CheckCircle, Edit, Save, X,
  Shield, CreditCard, Bell, Globe, Upload, Camera
} from 'lucide-react';

function Profile() {
  const { user, userProfile: authProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    preferences: {
      email_notifications: true,
      sms_notifications: false,
      newsletter: true
    }
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Try to load from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          preferences: data.preferences || {
            email_notifications: true,
            sms_notifications: false,
            newsletter: true
          }
        });
      } else {
        // Create profile if doesn't exist
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          phone: '',
          preferences: {
            email_notifications: true,
            sms_notifications: false,
            newsletter: true
          }
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert(newProfile);

        if (!insertError) {
          setProfile(newProfile);
          setFormData(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          preferences: formData.preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile({ ...profile, ...formData });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout activeSection="profile" setActiveSection={() => {}}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeSection="profile" setActiveSection={() => {}}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              <Edit className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    full_name: profile?.full_name || '',
                    phone: profile?.phone || '',
                    preferences: profile?.preferences || {
                      email_notifications: true,
                      sms_notifications: false,
                      newsletter: true
                    }
                  });
                }}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium px-4 py-2"
                disabled={saving}
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-md disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h3 className="font-serif font-bold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </div>
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Primary email (cannot be changed)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </div>
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{profile?.phone || 'Not set'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h3 className="font-serif font-bold text-gray-900 mb-6">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates about your applications</p>
                  </div>
                  {editing ? (
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          email_notifications: !formData.preferences.email_notifications
                        }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.preferences.email_notifications ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.preferences.email_notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {profile?.preferences?.email_notifications ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive text message updates</p>
                  </div>
                  {editing ? (
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          sms_notifications: !formData.preferences.sms_notifications
                        }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.preferences.sms_notifications ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.preferences.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {profile?.preferences?.sms_notifications ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Newsletter</p>
                    <p className="text-sm text-gray-600">Receive luxury property updates</p>
                  </div>
                  {editing ? (
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          newsletter: !formData.preferences.newsletter
                        }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.preferences.newsletter ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.preferences.newsletter ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {profile?.preferences?.newsletter ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Account Info */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h3 className="font-serif font-bold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(user?.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verification</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium">Premium Member</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-6 text-white">
              <h3 className="font-serif font-bold mb-4">Account Security</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <span>Change Password</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Methods</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <span>Notification Settings</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Profile Photo Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
              <h3 className="font-serif font-bold text-gray-900 mb-4">Profile Photo</h3>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center mb-4">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <button className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
