import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminApplications() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Applications Management</h1>
            <p className="text-gray-600">Review and manage property applications</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Applications management page will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminApplications;
