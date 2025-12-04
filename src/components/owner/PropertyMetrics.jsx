import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageCircle, FileCheck, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function PropertyMetrics({ userEmail }) {
  const { data: inquiries = [] } = useQuery({
    queryKey: ['owner-property-inquiries', userEmail],
    queryFn: () => base44.entities.PropertyOwnerInquiry.filter({ email: userEmail }),
    initialData: []
  });

  const { data: allApartments = [] } = useQuery({
    queryKey: ['all-apartments'],
    queryFn: () => base44.entities.Apartment.list(),
    initialData: []
  });

  const { data: views = [] } = useQuery({
    queryKey: ['property-views'],
    queryFn: () => base44.entities.PropertyView.list('-created_date'),
    initialData: []
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['all-applications'],
    queryFn: () => base44.entities.RentalApplication.list(),
    initialData: []
  });

  // Group metrics by property
  const propertyMetrics = allApartments.map(apt => {
    const aptViews = views.filter(v => v.apartment_id === apt.id);
    const aptApplications = applications.filter(a => a.apartment_id === apt.id);
    
    return {
      apartment: apt,
      totalViews: aptViews.length,
      detailViews: aptViews.filter(v => v.page === 'details').length,
      applications: aptApplications.length,
      applicationRate: aptViews.length > 0 ? ((aptApplications.length / aptViews.length) * 100).toFixed(1) : 0
    };
  });

  const statusColors = {
    'new': 'bg-blue-500',
    'contacted': 'bg-yellow-500',
    'in_discussion': 'bg-purple-500',
    'agreement_signed': 'bg-green-500',
    'declined': 'bg-gray-500'
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-[#ff6b35]" />
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold">{views.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Inquiries</p>
                <p className="text-2xl font-bold">{inquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Avg. Rate</p>
                <p className="text-2xl font-bold">
                  {views.length > 0 ? ((applications.length / views.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {propertyMetrics.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No properties found</p>
          ) : (
            <div className="space-y-4">
              {propertyMetrics.map(metric => (
                <div key={metric.apartment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{metric.apartment.title}</h3>
                      <p className="text-sm text-gray-500">{metric.apartment.location}</p>
                    </div>
                    <Badge className={metric.apartment.available ? 'bg-green-500' : 'bg-gray-500'}>
                      {metric.apartment.available ? 'Available' : 'Rented'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Views</p>
                      <p className="text-xl font-bold text-[#ff6b35]">{metric.totalViews}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Detail Views</p>
                      <p className="text-xl font-bold text-blue-600">{metric.detailViews}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Applications</p>
                      <p className="text-xl font-bold text-green-600">{metric.applications}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Conversion</p>
                      <p className="text-xl font-bold text-purple-600">{metric.applicationRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No inquiries yet</p>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 5).map(inquiry => (
                <div key={inquiry.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{inquiry.owner_name}</h4>
                      <p className="text-sm text-gray-500">{inquiry.property_address}</p>
                    </div>
                    <Badge className={statusColors[inquiry.status] || 'bg-gray-500'}>
                      {inquiry.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(inquiry.created_date), 'MMM d, yyyy')}
                    </span>
                    <span>{inquiry.inquiry_type.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}