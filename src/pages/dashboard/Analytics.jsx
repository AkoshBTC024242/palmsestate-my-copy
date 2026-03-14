// src/pages/dashboard/Analytics.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BarChart, TrendingUp, Eye, Heart,
  Calendar, Download, Loader2, ArrowUp,
  ArrowDown, Users, Home, DollarSign
} from 'lucide-react';

function DashboardAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    savedSearches: 0,
    applicationViews: 0,
    averageResponse: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch profile views
      const { count: viewsCount } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch saved searches
      const { count: searchesCount } = await supabase
        .from('saved_searches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch application views
      const { count: appViews } = await supabase
        .from('application_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      setAnalytics({
        profileViews: viewsCount || 0,
        savedSearches: searchesCount || 0,
        applicationViews: appViews || 0,
        averageResponse: 2.5 // Mock data for now
      });

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentActivity(activity || []);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Analytics</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">Track your engagement and activity</p>
        </div>
        
        <button className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <div className="text-2xl font-light text-white mb-1">{analytics.profileViews}</div>
          <div className="text-sm text-[#A1A1AA]">Profile Views</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">
              +5%
            </span>
          </div>
          <div className="text-2xl font-light text-white mb-1">{analytics.savedSearches}</div>
          <div className="text-sm text-[#A1A1AA]">Saved Searches</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              +8%
            </span>
          </div>
          <div className="text-2xl font-light text-white mb-1">{analytics.applicationViews}</div>
          <div className="text-sm text-[#A1A1AA]">Application Views</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="text-2xl font-light text-white mb-1">{analytics.averageResponse}h</div>
          <div className="text-sm text-[#A1A1AA]">Avg. Response Time</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <h3 className="text-white font-light mb-4">Weekly Activity</h3>
          <div className="h-64 flex items-center justify-center text-[#A1A1AA]">
            Chart component would go here
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <h3 className="text-white font-light mb-4">Engagement Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A1A1AA]">Profile Completion</span>
                <span className="text-sm text-white">85%</span>
              </div>
              <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
                <div className="h-full bg-[#F97316] rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A1A1AA]">Application Success Rate</span>
                <span className="text-sm text-white">72%</span>
              </div>
              <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A1A1AA]">Response Rate</span>
                <span className="text-sm text-white">94%</span>
              </div>
              <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#27272A]">
          <h3 className="text-white font-light">Recent Activity</h3>
        </div>
        <div className="divide-y divide-[#27272A]">
          {recentActivity.map((activity, index) => (
            <div key={index} className="px-6 py-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#F97316]" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.description}</p>
                <p className="text-[#A1A1AA] text-xs mt-1">
                  {new Date(activity.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;
