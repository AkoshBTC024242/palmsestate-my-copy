import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

function Settings() {
  const [activeSection, setActiveSection] = useState('settings');

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">This is the dedicated Settings page.</p>
            <p className="text-sm text-gray-500">For now, use the main dashboard's settings section.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
