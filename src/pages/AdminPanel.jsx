import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Building2, Users, FileText, DollarSign, 
  BarChart3, Settings, Bell, Home, Edit, Plus
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function AdminPanel() {
  const [showApartments, setShowApartments] = React.useState(false);

  const { data: apartments = [] } = useQuery({
    queryKey: ['apartments'],
    queryFn: () => base44.entities.Apartment.list('-created_date'),
    initialData: []
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.RentalApplication.list('-created_date'),
    initialData: []
  });

  const { data: leases = [] } = useQuery({
    queryKey: ['leases'],
    queryFn: () => base44.entities.LeaseAgreement.list('-created_date'),
    initialData: []
  });

  const adminSections = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview and analytics",
      href: createPageUrl("AdminDashboard"),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Apartments",
      icon: Building2,
      description: "Manage properties and listings",
      onClick: () => setShowApartments(true),
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Applications",
      icon: Users,
      description: "Review rental applications",
      href: createPageUrl("AdminApplicants"),
      color: "from-green-500 to-green-600"
    },
    {
      title: "Tenant Onboarding",
      icon: Users,
      description: "Track approved applicants",
      href: createPageUrl("AdminOnboarding"),
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Rentals & Fees",
      icon: FileText,
      description: "Manage fees and payments",
      href: createPageUrl("AdminRentals"),
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Reporting",
      icon: BarChart3,
      description: "Analytics and insights",
      href: createPageUrl("AdminReporting"),
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "Inspections",
      icon: Settings,
      description: "Property inspections",
      href: createPageUrl("AdminInspections"),
      color: "from-teal-500 to-teal-600"
    },
    {
      title: "Settings",
      icon: Settings,
      description: "System configuration",
      href: createPageUrl("AdminSettings"),
      color: "from-gray-600 to-gray-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-800 border-b border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-xl flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="w-7 h-7 text-white" />
                </div>
                Admin Control Panel
              </h1>
              <p className="text-gray-300 mt-2 ml-17 text-lg">Complete property management system</p>
            </div>
            <Link to={createPageUrl("Home")}>
              <button className="flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-white border border-gray-600">
                <Home className="w-4 h-4" />
                <span className="font-medium">Back to Site</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const CardWrapper = section.onClick ? 'div' : Link;
            const cardProps = section.onClick 
              ? { onClick: section.onClick, className: "cursor-pointer" }
              : { to: section.href };
            
            return (
              <CardWrapper key={section.title} {...cardProps}>
                <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-700 bg-gradient-to-br from-gray-800 to-slate-800 overflow-hidden h-full hover:border-[#ff6b35]">
                  <div className={`h-2 bg-gradient-to-r ${section.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <section.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#ff6b35] transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-slate-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">{apartments.length}</div>
                <div className="text-sm opacity-90">Properties</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">{applications.length}</div>
                <div className="text-sm opacity-90">Applications</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">{leases.filter(l => l.status === 'active' || l.status === 'signed').length}</div>
                <div className="text-sm opacity-90">Active Leases</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">${(leases.filter(l => l.status === 'active').reduce((sum, l) => sum + (l.monthly_rent || 0), 0) / 1000).toFixed(1)}k</div>
                <div className="text-sm opacity-90">Revenue</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Apartments Modal */}
      <Dialog open={showApartments} onOpenChange={setShowApartments}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="w-6 h-6 text-[#ff6b35]" />
              Quick Apartment Management
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{apartments.length} total properties</p>
              <Link to={createPageUrl("AdminApartments")}>
                <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Apartment
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apartments.map((apt) => (
                <Card key={apt.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{apt.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{apt.location}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-green-600">${apt.monthly_rent}/mo</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${apt.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {apt.available ? 'Available' : 'Rented'}
                          </span>
                        </div>
                      </div>
                      <Link to={createPageUrl("AdminApartments")}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}