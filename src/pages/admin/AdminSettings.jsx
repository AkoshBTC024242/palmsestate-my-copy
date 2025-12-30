import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Settings as SettingsIcon, Bell, Shield, Database, 
  CreditCard, Globe, Save, RefreshCw, AlertTriangle,
  Mail, Lock, Users, Cloud
} from 'lucide-react';

function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    site_name: 'Palms Estate',
    site_description: 'Premium Luxury Rentals',
    contact_email: 'admin@palmsestate.org',
    support_phone: '+1 (828) 623-9765',
    maintenance_mode: false,
    enable_registration: true,
    require_email_verification: true,
    default_user_role: 'user',
    currency: 'USD',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY',
    enable_test_mode: false,
    stripe_test_mode: false,
    stripe_public_key: '',
    stripe_secret_key: ''
  });

  const [testMode, setTestMode] = useState({
    enabled: false,
    skip_payments: false,
    auto_approve_applications: false,
    disable_email_notifications: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Load system settings from database (you might want to create a settings table)
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (!error && data) {
        setSystemSettings(data.settings || systemSettings);
        setTestMode(data.test_mode || testMode);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const settingsData = {
        settings: systemSettings,
        test_mode: testMode,
        updated_at: new Date().toISOString(),
        updated_by: 'admin' // You can get this from auth context
      };

      // Use upsert to create if doesn't exist
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          id: 1, // Single settings record
          ...settingsData
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      alert('Settings saved successfully!');
      
      // Apply test mode to current admin if enabled
      if (testMode.enabled) {
        await enableAdminTestMode();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const enableAdminTestMode = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update user_roles table to enable test mode for admin
        const { error } = await supabase
          .from('user_roles')
          .upsert({
            user_id: user.id,
            test_mode: testMode.enabled,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) throw error;
        
        if (testMode.enabled) {
          console.log('✅ Test mode enabled for admin');
        }
      }
    } catch (error) {
      console.error('Error enabling test mode:', error);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSystemSettings({
        site_name: 'Palms Estate',
        site_description: 'Premium Luxury Rentals',
        contact_email: 'admin@palmsestate.org',
        support_phone: '+1 (828) 623-9765',
        maintenance_mode: false,
        enable_registration: true,
        require_email_verification: true,
        default_user_role: 'user',
        currency: 'USD',
        timezone: 'UTC',
        date_format: 'MM/DD/YYYY',
        enable_test_mode: false,
        stripe_test_mode: false,
        stripe_public_key: '',
        stripe_secret_key: ''
      });
      
      setTestMode({
        enabled: false,
        skip_payments: false,
        auto_approve_applications: false,
        disable_email_notifications: false
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Configure system preferences and options</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Reset Defaults
            </button>
            
            <button
              onClick={saveSettings}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* General Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
              General Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={systemSettings.site_name}
                  onChange={(e) => setSystemSettings({...systemSettings, site_name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={systemSettings.contact_email}
                  onChange={(e) => setSystemSettings({...systemSettings, contact_email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">Temporarily disable public access</p>
                </div>
                <button
                  onClick={() => setSystemSettings({...systemSettings, maintenance_mode: !systemSettings.maintenance_mode})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    systemSettings.maintenance_mode ? 'bg-amber-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Enable Registration</p>
                  <p className="text-sm text-gray-600">Allow new users to sign up</p>
                </div>
                <button
                  onClick={() => setSystemSettings({...systemSettings, enable_registration: !systemSettings.enable_registration})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    systemSettings.enable_registration ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemSettings.enable_registration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Test Mode Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Test Mode Configuration
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Enable Test Mode</p>
                  <p className="text-sm text-gray-600">Allow admin to bypass payment for testing</p>
                </div>
                <button
                  onClick={() => setTestMode({...testMode, enabled: !testMode.enabled})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    testMode.enabled ? 'bg-amber-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      testMode.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {testMode.enabled && (
                <div className="space-y-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-amber-800">Skip Payments</p>
                      <p className="text-sm text-amber-700">Admin applications skip payment</p>
                    </div>
                    <button
                      onClick={() => setTestMode({...testMode, skip_payments: !testMode.skip_payments})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        testMode.skip_payments ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          testMode.skip_payments ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-amber-800">Auto-approve Applications</p>
                      <p className="text-sm text-amber-700">Admin applications auto-approved</p>
                    </div>
                    <button
                      onClick={() => setTestMode({...testMode, auto_approve_applications: !testMode.auto_approve_applications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        testMode.auto_approve_applications ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          testMode.auto_approve_applications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <h3 className="font-serif font-bold text-gray-900 mb-6">System Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">Database</span>
              </div>
              <p className="text-sm text-emerald-700">Connected and responsive</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Supabase</span>
              </div>
              <p className="text-sm text-blue-700">Auth service active</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Security</span>
              </div>
              <p className="text-sm text-purple-700">All systems secure</p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">Users</span>
              </div>
              <p className="text-sm text-amber-700">Active user sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
