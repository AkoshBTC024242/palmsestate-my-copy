// src/pages/dashboard/Analytics.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BarChart, TrendingUp, Eye, Heart, FileText,
  Calendar, Download, Loader2, Clock, Activity,
  Users, Home, DollarSign, ArrowUp, ArrowDown,
  PieChart, Target, Award, Star, ChevronRight
} from 'lucide-react';

function DashboardAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week'); // week, month, year
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    savedSearches: 0,
    applicationViews: 0,
    averageResponse: 0,
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0
  });

  const [trends, setTrends] = useState({
    views: '+12%',
    applications: '+8%',
    approvals: '+15%',
    responses: '-2h'
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // For demo, use mock data instead of failing Supabase queries
      const mockAnalytics = {
        profileViews: 156,
        savedSearches: 23,
        applicationViews: 89,
        averageResponse: 2.5,
        totalApplications: 12,
        approvedApplications: 4,
        pendingApplications: 6
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityData = () => {
    // Mock data for charts
    const weekData = [12, 19, 15, 22, 24, 18, 25];
    const monthData = [45, 52, 48, 61, 55, 67, 58, 72, 68, 75, 82, 78];
    
    return timeframe === 'week' ? weekData : monthData;
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
        
        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-[#18181B] border border-[#27272A] rounded-lg p-1">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                timeframe === 'week' 
                  ? 'bg-[#F97316] text-white' 
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                timeframe === 'month' 
                  ? 'bg-[#F97316] text-white' 
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                timeframe === 'year' 
                  ? 'bg-[#F97316] text-white' 
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Year
            </button>
          </div>
          
          <button className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:border-[#F97316]/30 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              {trends.views}
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
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
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
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              {trends.applications}
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
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowDown className="w-3 h-3" />
              {trends.responses}
            </span>
          </div>
          <div className="text-2xl font-light text-white mb-1">{analytics.averageResponse}h</div>
          <div className="text-sm text-[#A1A1AA]">Avg. Response Time</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Chart - Simplified visualization */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-light">Activity Overview</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A1A1AA]">Views</span>
              <span className="text-xs text-[#F97316]">Applications</span>
            </div>
          </div>
          
          <div className="h-48 flex items-end gap-2">
            {getActivityData().map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#F97316]/20 rounded-t-lg relative" style={{ height: `${(value / 100) * 100}px` }}>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#F97316] rounded-t-lg"></div>
                </div>
                <span className="text-xs text-[#A1A1AA]">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <h3 className="text-white font-light mb-6">Engagement Metrics</h3>
          <div className="space-y-5">
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

      {/* Application Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <h3 className="text-white font-light mb-4">Application Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1A1AA]">Total Applications</span>
              <span className="text-lg text-white">{analytics.totalApplications}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1A1AA]">Approved</span>
              <span className="text-lg text-green-500">{analytics.approvedApplications}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1A1AA]">Pending</span>
              <span className="text-lg text-yellow-500">{analytics.pendingApplications}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <h3 className="text-white font-light mb-4">Top Performing</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-[#F97316]" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Luxury Condo</p>
                <p className="text-[#A1A1AA] text-xs">45 views this week</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Waterfront Estate</p>
                <p className="text-[#A1A1AA] text-xs">32 views this week</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
          <h3 className="text-white font-light mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg hover:bg-[#F97316]/10 transition-colors">
              <span className="text-white text-sm">View Full Report</span>
              <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg hover:bg-[#F97316]/10 transition-colors">
              <span className="text-white text-sm">Export Data</span>
              <Download className="w-4 h-4 text-[#A1A1AA]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;
