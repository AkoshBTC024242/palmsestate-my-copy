// contexts/DashboardContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/dashboard/applications/recent')
      ]);
      
      setDashboardStats(statsRes.data);
      setRecentApplications(appsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/api/dashboard/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update profile';
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await api.put('/api/dashboard/profile/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to change password';
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const value = {
    dashboardStats,
    recentApplications,
    savedProperties,
    loading,
    fetchDashboardData,
    updateProfile,
    changePassword,
    refreshData: fetchDashboardData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
