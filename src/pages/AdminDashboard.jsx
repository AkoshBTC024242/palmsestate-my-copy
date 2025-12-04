import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  Users, 
  DollarSign, 
  Bell, 
  Building, 
  ClipboardList,
  Calendar,
  Wrench,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const { data: apartments = [] } = useQuery({
    queryKey: ['apartments'],
    queryFn: () => base44.entities.Apartment.list(),
    initialData: []
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.RentalApplication.list(),
    initialData: []
  });

  const { data: leases = [] } = useQuery({
    queryKey: ['leases'],
    queryFn: () => base44.entities.LeaseAgreement.list(),
    initialData: []
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: () => base44.entities.RentPayment.list(),
    initialData: []
  });

  const { data: maintenance = [] } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => base44.entities.MaintenanceRequest.list(),
    initialData: []
  });

  const stats = [
    {
      title: "Total Properties",
      value: apartments.length,
      subtitle: `${apartments.filter(a => a.available).length} available`,
      icon: Home,
      color: "bg-blue-500",
      link: createPageUrl("AdminApartments")
    },
    {
      title: "Pending Applications",
      value: applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length,
      subtitle: `${applications.length} total`,
      icon: FileText,
      color: "bg-yellow-500",
      link: createPageUrl("AdminRentals")
    },
    {
      title: "Active Leases",
      value: leases.filter(l => l.status === 'active' || l.status === 'signed').length,
      subtitle: `${leases.length} total`,
      icon: Users,
      color: "bg-green-500",
      link: createPageUrl("AdminTenantDirectory")
    },
    {
      title: "Pending Payments",
      value: payments.filter(p => p.payment_status === 'pending').length,
      subtitle: `$${payments.filter(p => p.payment_status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      link: createPageUrl("AdminRentals")
    }
  ];

  const quickActions = [
    {
      title: "Properties",
      description: "Manage apartments and listings",
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: createPageUrl("AdminApartments")
    },
    {
      title: "Applications",
      description: "Review rental applications",
      icon: ClipboardList,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      link: createPageUrl("AdminRentals")
    },
    {
      title: "Tenant Directory",
      description: "View all active tenants",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
      link: createPageUrl("AdminTenantDirectory")
    },
    {
      title: "Lease Renewals",
      description: "Process renewal requests",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: createPageUrl("AdminLeaseRenewals")
    },
    {
      title: "Maintenance",
      description: "Track maintenance requests",
      icon: Wrench,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "#"
    },
    {
      title: "Notifications",
      description: "Send alerts to tenants",
      icon: Bell,
      color: "text-red-600",
      bg: "bg-red-50",
      link: createPageUrl("AdminNotifications")
    }
  ];

  const recentActivity = [
    ...applications.slice(0, 3).map(app => ({
      type: "Application",
      title: `${app.full_name} - ${app.apartment_title}`,
      time: new Date(app.created_date).toLocaleDateString(),
      status: app.status
    })),
    ...maintenance.slice(0, 2).map(req => ({
      type: "Maintenance",
      title: `${req.title} - ${req.apartment_title}`,
      time: new Date(req.created_date).toLocaleDateString(),
      status: req.status
    }))
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a1f35] mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your properties, tenants, and applications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Link key={idx} to={stat.link}>
              <Card className="hover-lift cursor-pointer border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, idx) => (
                    <Link key={idx} to={action.link}>
                      <Card className="hover-lift cursor-pointer border-2 border-gray-100 hover:border-[#ff6b35] transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 ${action.bg} rounded-lg flex items-center justify-center`}>
                              <action.icon className={`w-5 h-5 ${action.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                              <p className="text-xs text-gray-600">{action.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-[#ff6b35] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{activity.type[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{activity.time}</p>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}