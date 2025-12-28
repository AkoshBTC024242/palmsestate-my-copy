import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminSettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Configure system preferences and options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif font-bold text-gray-900 mb-6">General Settings</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Site Configuration</p>
                <p className="text-sm text-gray-600">Configure site settings and options</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Notification Settings</p>
                <p className="text-sm text-gray-600">Configure system notifications</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
            <h3 className="font-serif font-bold text-gray-900 mb-6">System Maintenance</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Database Management</p>
                <p className="text-sm text-gray-600">Manage database backups and maintenance</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Security Settings</p>
                <p className="text-sm text-gray-600">Configure security and access controls</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
