import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

function SavedProperties() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('saved');

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Saved Properties</h1>
            <p className="text-gray-600">Your collection of luxury residences</p>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Browse More Properties
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">This is the dedicated Saved Properties page.</p>
            <p className="text-sm text-gray-500">For now, use the main dashboard's saved properties section.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SavedProperties;
