// src/contexts/DashboardContext.jsx - FIXED VERSION
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    savedProperties: 0,
    upcomingPayments: 0
  });
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Cache and cleanup references
  const fetchTimeoutRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const isFetchingRef = useRef(false);
  const cleanupRef = useRef(null);

  // Optimized fetch function with debouncing and caching
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    if (!user || isFetchingRef.current) return;
    
    // Debounce: Don't fetch more than once every 5 seconds
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTimeRef.current < 5000) {
      return;
    }
    
    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;
    
    try {
      setLoading(true);

      // Use Promise.all to fetch all data in parallel
      const [
        totalPromise,
        pendingPromise,
        approvedPromise,
        savedPromise,
        recentPromise
      ] = await Promise.allSettled([
        // Total applications
        supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        
        // Pending applications
        supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'submitted'),
        
        // Approved applications
        supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'approved'),
        
        // Saved properties
        supabase
          .from('saved_properties')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        
        // Recent applications (last 5)
        supabase
          .from('applications')
          .select(`
            *,
            property:property_id (
              title,
              location,
              main_image_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Process results
      const totalCount = totalPromise.status === 'fulfilled' ? (totalPromise.value.count || 0) : 0;
      const pendingCount = pendingPromise.status === 'fulfilled' ? (pendingPromise.value.count || 0) : 0;
      const approvedCount = approvedPromise.status === 'fulfilled' ? (approvedPromise.value.count || 0) : 0;
      const savedCount = savedPromise.status === 'fulfilled' ? (savedPromise.value.count || 0) : 0;
      const recentApps = recentPromise.status === 'fulfilled' ? (recentPromise.value.data || []) : [];

      setDashboardStats({
        totalApplications: totalCount,
        pendingApplications: pendingCount,
        approvedApplications: approvedCount,
        savedProperties: savedCount,
        upcomingPayments: 0
      });

      setRecentApplications(recentApps);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user]);

  // Setup real-time listeners for applications and saved properties
  const setupRealtimeListeners = useCallback(() => {
    if (!user) return;

    // Clean up existing listeners
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Subscribe to applications changes
    const applicationsSubscription = supabase
      .channel(`applications-${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'applications',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          // Debounced refetch
          if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
          }
          fetchTimeoutRef.current = setTimeout(() => {
            fetchDashboardData(true);
          }, 1000);
        }
      )
      .subscribe();

    // Subscribe to saved properties changes
    const savedSubscription = supabase
      .channel(`saved-${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'saved_properties',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          // Debounced refetch
          if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
          }
          fetchTimeoutRef.current = setTimeout(() => {
            fetchDashboardData(true);
          }, 1000);
        }
      )
      .subscribe();

    // Store cleanup function
    cleanupRef.current = () => {
      applicationsSubscription.unsubscribe();
      savedSubscription.unsubscribe();
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [user, fetchDashboardData]);

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.message || 'Failed to update profile';
    }
  };

  // Main effect - fetch data and setup listeners
  useEffect(() => {
    if (user) {
      fetchDashboardData();
      setupRealtimeListeners();
    }

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [user, fetchDashboardData, setupRealtimeListeners]);

  const value = {
    dashboardStats,
    recentApplications,
    loading,
    fetchDashboardData: () => fetchDashboardData(true),
    updateProfile,
    refreshData: () => fetchDashboardData(true)
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
