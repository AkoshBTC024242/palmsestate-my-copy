import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';

function Dashboard() {
  const { user } = useAuth();
  const dashboardContext = useDashboard();
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Dashboard mounted');
    console.log('User:', user);
    console.log('Dashboard Context:', dashboardContext);
    
    // Check for errors in context
    try {
      if (dashboardContext.error) {
        setError(dashboardContext.error);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="p-8 bg-[#18181B] rounded-xl border border-red-500/30">
        <h2 className="text-xl text-red-500 mb-4">Error Loading Dashboard</h2>
        <p className="text-[#A1A1AA] mb-4">{error}</p>
        <pre className="bg-black/50 p-4 rounded-lg text-xs text-[#A1A1AA] overflow-auto">
          {JSON.stringify({ user, dashboardContext }, null, 2)}
        </pre>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#F97316] text-white rounded-lg"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#A1A1AA]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl text-white">Dashboard Debug View</h1>
      <p className="text-[#A1A1AA] mt-2">User: {user?.email || 'Not logged in'}</p>
      <p className="text-green-500 mt-4">✓ Dashboard is rendering!</p>
      
      <div className="mt-8 bg-[#18181B] p-4 rounded-lg">
        <h2 className="text-white mb-2">Context Data:</h2>
        <pre className="text-xs text-[#A1A1AA] overflow-auto">
          {JSON.stringify(dashboardContext, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default Dashboard;
