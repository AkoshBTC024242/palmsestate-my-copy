// src/pages/dashboard/ApplicationDetail.jsx - MINIMAL VERSION
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ApplicationDetail: ID =', id);
    console.log('ApplicationDetail: User =', user);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id, user]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p>Loading application {id}...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Application #{id}</h1>
      <p className="mb-4">User ID: {user?.id}</p>
      <p className="mb-6">This is a minimal test view.</p>
      <button
        onClick={() => navigate('/dashboard/applications')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Applications
      </button>
    </div>
  );
}

export default ApplicationDetail;
