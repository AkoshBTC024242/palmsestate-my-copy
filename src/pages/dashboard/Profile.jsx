// src/pages/dashboard/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile exists yet - this is fine
          console.log('No existing profile');
        } else {
          console.error('Load error:', error);
          setError(`Load failed: ${error.message}`);
        }
      }

      if (data) {
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: user.email || data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          date_of_birth: data.date_of_birth || '',
          avatar_url: data.avatar_url || ''
        });
      } else {
        // Initialize with user email
        setFormData(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error loading profile');
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
      const updates = {
        id: user.id,
        email: user.email,
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        phone: formData.phone || null,
        address: formData.address || null,
        date_of_birth: formData.date_of_birth || null,
        avatar_url: formData.avatar_url || null,
        updated_at: new Date().toISOString()
      };

      console.log('Saving profile:', updates);

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updates, { 
          onConflict: 'id',
          returning: 'minimal'
        });

      if (error) {
        console.error('Save error:', error);
        
        if (error.code === '42501') {
          setError('Permission denied. RLS policies need to be fixed. Run the cleanup SQL.');
        } else {
          setError(`Save failed: ${error.message}`);
        }
      } else {
        setSuccess('Profile saved successfully!');
        console.log('Profile saved:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error saving profile');
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
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
      <p className="text-gray-600 mb-6">Update your personal information</p>

      {/* Debug Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Database Status:</strong> RLS is enabled. After cleanup, you should have 1 policy.
          {error && error.includes('42501') && (
            <span className="block mt-1 text-red-600">
              ⚠️ Still getting permission errors? Refresh the page and try again.
            </span>
          )}
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name *</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Last Name *</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">Contact support to change email</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="(123) 456-7890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter your complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={loadProfile}
            className="px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={saving}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Quick Fix Reminder */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">If you still get permission errors:</h3>
        <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
          <li>Make sure you ran the cleanup SQL above</li>
          <li>Refresh this page and try saving again</li>
          <li>Check browser console for detailed error messages</li>
        </ol>
      </div>
    </div>
  );
}

export default Profile;
