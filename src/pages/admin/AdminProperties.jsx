import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminProperties() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('properties');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Properties Management</h1>
            <p className="text-gray-600">Manage all luxury properties in the system</p>
          </div>
          <button
            onClick={() => navigate('/admin/properties/new')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Add New Property
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Properties management page will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProperties;
