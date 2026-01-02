// src/pages/dashboard/Profile.jsx - FINAL FIX
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    avatar_url: ''
  });

  // Test database connection and permissions
  const testDatabase = async () => {
    try {
      setDebugInfo('Testing database connection...\n');
      
      // Test 1: Basic connection
      const { data: connData, error: connError } = await supabase
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      if (connError) {
        setDebugInfo(prev => prev + `❌ Connection failed: ${connError.code} - ${connError.message}\n`);
        return false;
      }
      
      setDebugInfo(prev => prev + '✅ Database connection OK\n');
      
      // Test 2: Try to create a test profile
      const testData = {
        id: user.id,
        email: user.email,
        first_name: 'Test',
        last_name: 'User',
        updated_at: new Date().toISOString()
      };
      
      setDebugInfo(prev => prev + `Attempting test upsert for user ${user.id.substring(0, 8)}...\n`);
      
      const { error: testError } = await supabase
        .from('profiles')
        .upsert(testData, { 
          onConflict: 'id',
          returning: 'minimal'
        });
      
      if (testError) {
        setDebugInfo(prev => prev + `❌ Test upsert failed: ${testError.code} - ${testError.message}\n`);
        
        // Check if it's a specific RLS issue
        if (testError.code === '42501') {
          setDebugInfo(prev => prev + '\n🔍 RLS Issue Detected!\n');
          setDebugInfo(prev => prev + 'Even though policies are set, the JWT might not be reaching the database.\n');
          setDebugInfo(prev => prev + 'Possible causes:\n');
          setDebugInfo(prev => prev + '1. Supabase client not properly configured\n');
          setDebugInfo(prev => prev + '2. Auth token expired\n');
          setDebugInfo(prev => prev + '3. Database session context issue\n');
        }
        return false;
      }
      
      setDebugInfo(prev => prev + '✅ Test upsert succeeded!\n');
      setDebugInfo(prev => prev + '✅ RLS is working correctly!\n');
      return true;
      
    } catch (error) {
      setDebugInfo(prev => prev + `❌ Unexpected test error: ${error.message}\n`);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
      testDatabase();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setStatus('');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile exists yet
          setStatus('info:No existing profile found. Create one below.');
        } else {
          console.error('Load error:', error);
          setStatus(`error:Failed to load profile: ${error.message}`);
        }
      }

      if (data) {
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          address: data.address || '',
          date_of_birth: data.date_of_birth || '',
          avatar_url: data.avatar_url || ''
        });
        setStatus('success:Profile loaded successfully');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setStatus('error:Unexpected error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');

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

      // IMPORTANT: Log what we're sending
      console.log('Profile update payload:', updates);
      console.log('Current user:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updates, { 
          onConflict: 'id'
        });

      if (error) {
        console.error('Save error details:', error);
        
        // Check for specific error types
        if (error.code === '42501') {
          setStatus('error:RLS Permission denied. The database policy exists but your session token might be invalid. Try logging out and back in.');
        } else if (error.code === 'PGRST301') {
          setStatus('error:Missing authorization header. Supabase client might not be sending the JWT.');
        } else {
          setStatus(`error:Save failed: ${error.message}`);
        }
      } else {
        console.log('Save successful:', data);
        setStatus('success:Profile saved successfully!');
        
        // Refresh the profile
        setTimeout(() => loadProfile(), 1000);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setStatus('error:Unexpected error saving profile');
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

  const handleLogoutLogin = async () => {
    await supabase.auth.signOut();
    window.location.href = '/signin';
  };

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      setStatus(`error:Failed to refresh session: ${error.message}`);
    } else {
      setStatus('success:Session refreshed. Try saving again.');
    }
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

  const [statusType, statusMessage] = status.split(':');
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
      <p className="text-gray-600 mb-6">Update your personal information</p>

      {/* Debug Panel */}
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800">Database Status</h3>
          <div className="flex gap-2">
            <button
              onClick={testDatabase}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Test Connection
            </button>
            <button
              onClick={refreshSession}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Refresh Session
            </button>
          </div>
        </div>
        <div className="h-40 overflow-y-auto bg-black text-green-400 p-3 rounded font-mono text-xs">
          {debugInfo || 'Run test to see debug info...'}
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`mb-6 p-4 rounded-lg ${
          statusType === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          statusType === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{statusMessage}</p>
              {statusType === 'error' && statusMessage.includes('RLS') && (
                <div className="mt-3">
                  <h4 className="font-medium mb-2">Quick Fixes:</h4>
                  <ol className="text-sm list-decimal pl-5 space-y-1">
                    <li>Click "Refresh Session" button above</li>
                    <li>If that doesn't work, <button onClick={handleLogoutLogin} className="text-blue-600 underline">logout and login again</button></li>
                    <li>Check your Supabase client configuration</li>
                  </ol>
                </div>
              )}
            </div>
            {statusType === 'error' && (
              <button
                onClick={() => setStatus('')}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Profile Form */}
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

      {/* Check Supabase Client Configuration */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">If still having issues, check:</h3>
        <ol className="text-sm text-yellow-700 list-decimal pl-5 space-y-1">
          <li>
            <strong>Supabase Client Config</strong> - Make sure your `lib/supabase.js` is properly configured:
            <pre className="mt-1 p-2 bg-black text-white rounded text-xs overflow-x-auto">
{`import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})`}
            </pre>
          </li>
          <li>
            <strong>Environment Variables</strong> - Check that REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set
          </li>
          <li>
            <strong>Browser Console</strong> - Check for any auth errors in the console
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Profile;
