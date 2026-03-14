import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl text-white">Dashboard Test</h1>
      <p className="text-[#A1A1AA] mt-2">User: {user?.email}</p>
      <p className="text-green-500 mt-4">✓ If you can see this, React is working!</p>
    </div>
  );
}

export default Dashboard;
