import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, Users, Home, DollarSign, Calendar } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";

export default function AdminReporting() {
  const [timeRange, setTimeRange] = useState("3months");

  const { data: applications = [] } = useQuery({
    queryKey: ['reporting-applications'],
    queryFn: () => base44.entities.RentalApplication.list('-created_date'),
    initialData: []
  });

  const { data: fees = [] } = useQuery({
    queryKey: ['reporting-fees'],
    queryFn: () => base44.entities.ApplicationFee.list('-created_date'),
    initialData: []
  });

  const { data: apartments = [] } = useQuery({
    queryKey: ['reporting-apartments'],
    queryFn: () => base44.entities.Apartment.list('-created_date'),
    initialData: []
  });

  // Calculate metrics
  const totalApplications = applications.length;
  const verifiedFees = fees.filter(f => f.status === 'verified').length;
  const conversionRate = fees.length > 0 ? ((verifiedFees / fees.length) * 100).toFixed(1) : 0;
  const totalRevenue = fees.filter(f => f.status === 'verified').length * 85;

  // Monthly application trends
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const monthStr = format(date, 'MMM yyyy');
    const count = applications.filter(app => {
      const appDate = new Date(app.created_date);
      return appDate >= startOfMonth(date) && appDate <= endOfMonth(date);
    }).length;
    return { month: monthStr, applications: count };
  });

  // Application status distribution
  const statusData = [
    { name: 'Submitted', value: applications.filter(a => a.status === 'submitted').length, color: '#3b82f6' },
    { name: 'Under Review', value: applications.filter(a => a.status === 'under_review').length, color: '#f59e0b' },
    { name: 'Approved', value: applications.filter(a => a.status === 'approved').length, color: '#10b981' },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#ef4444' }
  ].filter(d => d.value > 0);

  // Top amenities
  const amenitiesCount = {};
  apartments.forEach(apt => {
    apt.amenities?.forEach(amenity => {
      amenitiesCount[amenity] = (amenitiesCount[amenity] || 0) + 1;
    });
  });
  const topAmenities = Object.entries(amenitiesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // Property performance
  const propertyPerformance = apartments.map(apt => {
    const appCount = applications.filter(app => app.apartment_id === apt.id).length;
    return {
      property: apt.title.substring(0, 20),
      applications: appCount,
      rent: apt.monthly_rent
    };
  }).sort((a, b) => b.applications - a.applications).slice(0, 5);

  const exportReport = () => {
    const report = {
      generated_date: new Date().toISOString(),
      metrics: {
        total_applications: totalApplications,
        verified_fees: verifiedFees,
        conversion_rate: conversionRate + '%',
        total_revenue: '$' + totalRevenue
      },
      monthly_trends: last6Months,
      status_distribution: statusData,
      top_properties: propertyPerformance
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `palms-estate-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    toast.success("Report exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1f35]">Analytics & Reporting</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into property performance</p>
          </div>
          <Button onClick={exportReport} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-[#1a1f35]">{totalApplications}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-green-600">{conversionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-[#ff6b35]">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#ff6b35]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Properties</p>
                  <p className="text-3xl font-bold text-purple-600">{apartments.filter(a => a.available).length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trends */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Application Trends (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={last6Months}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#ff6b35" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={80} fill="#8884d8" dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Properties */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={propertyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="property" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Popular Amenities */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Most Popular Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topAmenities} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}