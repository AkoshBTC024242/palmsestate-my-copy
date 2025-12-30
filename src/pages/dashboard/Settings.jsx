import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Lock, Bell, Globe, Shield, FileText, Trash2, 
  Moon, Sun, Globe as Language, Download, Database,
  ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react';

function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY'
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (data?.preferences?.settings) {
        setSettings(data.preferences.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

 const saveSettings = async () => {
  if (!user) return;
  
  setLoading(true);
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError);
      // Create profile if it doesn't exist
      await createProfileIfMissing();
    }

    const updatedPreferences = {
      ...(profile?.preferences || {}),
      settings
    };

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        preferences: updatedPreferences,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) throw error;

    alert('Settings saved successfully!');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Error saving settings: ' + error.message);
  } finally {
    setLoading(false);
  }
};

const createProfileIfMissing = async () => {
  try {
    const newProfile = {
      id: user.id,
      preferences: {
        settings: settings,
        email_notifications: true,
        sms_notifications: false,
        newsletter: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .insert([newProfile]);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating profile:', error);
  }
};

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.new.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new
      });

      if (error) throw error;

      alert('Password changed successfully!');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!window.confirm('This will permanently delete all your data including applications and saved properties. Type DELETE to confirm.')) {
      return;
    }

    setLoading(true);
    try {
      // First delete user data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('applications')
        .delete()
        .eq('user_id', user.id);

      // Then sign out and delete auth user
      await supabase.auth.signOut();
      alert('Account deleted successfully. You will be redirected to the home page.');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeSection="settings" setActiveSection={() => {}}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              Security Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Change Password</h4>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading || !passwordData.current || !passwordData.new || !passwordData.confirm}
                    className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white font-medium py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">2FA Status</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Moon className="w-5 h-5 text-gray-600" />
              Appearance
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSettings({...settings, theme: 'light'})}
                    className={`flex-1 flex flex-col items-center p-4 rounded-lg border ${
                      settings.theme === 'light' 
                        ? 'border-amber-500 bg-amber-50' 
                        : 'border-gray-200 hover:border-amber-200'
                    }`}
                  >
                    <Sun className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setSettings({...settings, theme: 'dark'})}
                    className={`flex-1 flex flex-col items-center p-4 rounded-lg border ${
                      settings.theme === 'dark' 
                        ? 'border-amber-500 bg-amber-50' 
                        : 'border-gray-200 hover:border-amber-200'
                    }`}
                  >
                    <Moon className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              Privacy & Data
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Privacy Policy</p>
                    <p className="text-sm text-gray-600">Review our privacy practices</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Export Data</p>
                    <p className="text-sm text-gray-600">Download your personal data</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Data Retention</p>
                    <p className="text-sm text-gray-600">Manage your data storage</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-gray-600" />
              Account Management
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-2">Danger Zone</h4>
                <p className="text-sm text-amber-700 mb-4">
                  These actions are irreversible. Please proceed with caution.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all your saved properties?')) {
                        // Implement clear saved properties
                      }
                    }}
                    className="w-full text-left p-3 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors text-amber-700"
                  >
                    <p className="font-medium">Clear Saved Properties</p>
                    <p className="text-sm">Remove all properties from your saved list</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Delete all your application history?')) {
                        // Implement clear applications
                      }
                    }}
                    className="w-full text-left p-3 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors text-amber-700"
                  >
                    <p className="font-medium">Clear Application History</p>
                    <p className="text-sm">Remove all your past applications</p>
                  </button>
                  
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm">Permanently delete your account and all data</p>
                      </div>
                      <Trash2 className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
