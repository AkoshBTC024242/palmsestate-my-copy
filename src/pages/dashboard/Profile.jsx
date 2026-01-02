// Updated Profile.jsx with detailed debugging
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [debugLog, setDebugLog] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    avatar_url: ''
  });

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setDebugLog(prev => [...prev, { timestamp, message, type }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  useEffect(() => {
    if (user) {
      addLog(`User loaded: ${user.id} (${user.email})`, 'info');
      testRLS();
      loadProfile();
    }
  }, [user]);

  const testRLS = async () => {
    addLog('Testing RLS policies...', 'debug');
    
    try {
      // Test 1: Simple select to see if we can query
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (testError) {
        addLog(`SELECT test failed: ${testError.code} - ${testError.message}`, 'error');
      } else {
        addLog('✅ SELECT test passed', 'success');
      }

      // Test 2: Try to insert/update own profile
      if (user) {
        const testUpdate = {
          id: user.id,
          email: user.email,
          updated_at: new Date().toISOString()
        };
        
        addLog(`Attempting upsert for user ${user.id}`, 'debug');
        
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(testUpdate, { 
            onConflict: 'id',
            returning: 'minimal'
          });
        
        if (upsertError) {
          addLog(`UPSERT test failed: ${upsertError.code} - ${upsertError.message}`, 'error');
          
          // Check if it's an RLS issue
          if (upsertError.code === '42501') {
            addLog('⚠️ RLS Permission denied. Checking policy setup...', 'warning');
            
            // Try to get current policies via REST API
            try {
              const { data: policies, error: policiesError } = await supabase
                .from('pg_policies')
                .select('policyname, cmd')
                .eq('tablename', 'profiles');
              
              if (!policiesError && policies) {
                addLog(`Current policies: ${JSON.stringify(policies)}`, 'info');
              }
            } catch (e) {
              addLog(`Cannot query policies table: ${e.message}`, 'error');
            }
          }
        } else {
          addLog('✅ UPSERT test passed - RLS is working!', 'success');
        }
      }
    } catch (error) {
      addLog(`Test error: ${error.message}`, 'error');
    }
  };

  const loadProfile = async () => {
    try {
      addLog('Loading profile...', 'debug');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        addLog(`Load error: ${error.code} - ${error.message}`, 'error');
        
        // If profile doesn't exist, that's okay
        if (error.code === 'PGRST116') {
          addLog('No existing profile found (this is normal for new users)', 'info');
        }
      } else {
        addLog('Profile loaded successfully', 'success');
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          address: data.address || '',
          date_of_birth: data.date_of_birth || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      addLog(`Unexpected load error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    addLog('Starting save...', 'debug');

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

      addLog(`Sending update: ${JSON.stringify(updates)}`, 'debug');

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updates, { 
          onConflict: 'id',
          returning: 'representation'
        });

      if (error) {
        addLog(`Save error: ${error.code} - ${error.message}`, 'error');
        
        // Try alternative method if RLS fails
        if (error.code === '42501') {
          addLog('Attempting alternative save via auth API...', 'warning');
          await tryAlternativeSave(updates);
        }
      } else {
        addLog('✅ Profile saved successfully!', 'success');
      }
    } catch (error) {
      addLog(`Unexpected save error: ${error.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const tryAlternativeSave = async (updates) => {
    try {
      // Try to update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: updates.first_name,
          last_name: updates.last_name,
          phone: updates.phone,
          address: updates.address
        }
      });

      if (authError) {
        addLog(`Auth update failed: ${authError.message}`, 'error');
        
        // Last resort: localStorage
        localStorage.setItem('user_profile_backup', JSON.stringify(updates));
        addLog('Saved to localStorage as backup', 'warning');
      } else {
        addLog('✅ Saved to auth user metadata', 'success');
      }
    } catch (error) {
      addLog(`Alternative save failed: ${error.message}`, 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const runQuickFix = async () => {
    addLog('Running quick RLS fix...', 'info');
    
    // This is the SQL to run in Supabase
    const fixSql = `-- Quick RLS Fix
BEGIN;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
DO $$ 
DECLARE policy_name TEXT;
BEGIN
    FOR policy_name IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON profiles';
    END LOOP;
END $$;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_full_access" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
COMMIT;`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(fixSql);
    addLog('SQL copied to clipboard. Run it in Supabase SQL Editor.', 'info');
    
    // Test again after suggesting fix
    setTimeout(() => testRLS(), 2000);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
      <p className="text-gray-600 mb-6">Manage your profile information</p>

      {/* Debug Panel */}
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800">Debug Log</h3>
          <button
            onClick={runQuickFix}
            className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
          >
            Copy Fix SQL
          </button>
        </div>
        <div className="h-64 overflow-y-auto bg-black text-green-400 p-3 rounded font-mono text-sm">
          {debugLog.map((log, idx) => (
            <div key={idx} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : 
                                          log.type === 'warning' ? 'text-yellow-400' : 
                                          log.type === 'success' ? 'text-green-400' : 'text-gray-400'}`}>
              [{log.timestamp}] {log.message}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Quick Fix Instructions:</h3>
        <ol className="text-sm text-blue-700 list-decimal pl-5 space-y-1">
          <li>Click "Copy Fix SQL" button above</li>
          <li>Go to Supabase Dashboard → SQL Editor</li>
          <li>Paste and run the SQL</li>
          <li>Refresh this page and try saving again</li>
        </ol>
      </div>

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
              className="w-full p-3 border rounded"
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
              className="w-full p-3 border rounded"
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
            className="w-full p-3 border rounded bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="2"
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={loadProfile}
            className="px-4 py-2 border rounded"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
