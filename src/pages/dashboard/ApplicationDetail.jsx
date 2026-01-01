// DEBUG VERSION - src/pages/dashboard/ApplicationDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('DEBUG - ApplicationDetail mounted');
    console.log('ID from URL:', id);
    console.log('User:', user);
    
    setDebugInfo({
      id,
      userExists: !!user,
      userId: user?.id,
      timestamp: new Date().toISOString()
    });
  }, [id, user]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Application Detail</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Temporary Debug View</h3>
          <p className="text-yellow-700">
            This is a debug view. The real application detail page will load here once the issue is fixed.
          </p>
          <p className="text-yellow-700 mt-2">
            Application ID from URL: <span className="font-bold">{id}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/applications')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Applications
        </button>
      </div>
    </DashboardLayout>
  );
}

export default ApplicationDetail;
