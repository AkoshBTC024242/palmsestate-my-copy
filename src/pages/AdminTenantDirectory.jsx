import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, Mail, Phone, Home, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function AdminTenantDirectory() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: leases = [], isLoading } = useQuery({
    queryKey: ['all-leases'],
    queryFn: () => base44.entities.LeaseAgreement.list('-created_date'),
    initialData: []
  });

  const { data: apartments = [] } = useQuery({
    queryKey: ['apartments'],
    queryFn: () => base44.entities.Apartment.list(),
    initialData: []
  });

  // Get unique active tenants
  const activeLeases = leases.filter(l => l.status === 'active' || l.status === 'signed');
  
  const tenants = activeLeases.map(lease => {
    const apartment = apartments.find(apt => apt.id === lease.apartment_id);
    return {
      ...lease,
      apartment_details: apartment
    };
  });

  const filteredTenants = tenants.filter(tenant =>
    tenant.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.tenant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.apartment_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1f35] mb-2">Tenant Directory</h1>
          <p className="text-gray-600">View and manage all active tenants</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#ff6b35]" />
                <div>
                  <p className="text-sm text-gray-600">Total Tenants</p>
                  <p className="text-3xl font-bold">{tenants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Home className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Leases</p>
                  <p className="text-3xl font-bold">{activeLeases.filter(l => l.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Signed Leases</p>
                  <p className="text-3xl font-bold">{activeLeases.filter(l => l.status === 'signed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-3xl font-bold">
                    {tenants.filter(t => {
                      const daysUntilExpiry = Math.ceil((new Date(t.lease_end_date) - new Date()) / (1000 * 60 * 60 * 24));
                      return daysUntilExpiry <= 60 && daysUntilExpiry > 0;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by tenant name, email, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tenant List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card><CardContent className="p-8 text-center text-gray-500">Loading...</CardContent></Card>
          ) : filteredTenants.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-gray-500">No tenants found</CardContent></Card>
          ) : (
            filteredTenants.map(tenant => {
              const daysUntilExpiry = Math.ceil((new Date(tenant.lease_end_date) - new Date()) / (1000 * 60 * 60 * 24));
              const isExpiringSoon = daysUntilExpiry <= 60 && daysUntilExpiry > 0;
              
              return (
                <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-[#ff6b35] text-white rounded-full flex items-center justify-center text-xl font-bold">
                            {tenant.tenant_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#1a1f35]">{tenant.tenant_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={
                                tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }>
                                {tenant.status}
                              </Badge>
                              {isExpiringSoon && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Expires in {daysUntilExpiry} days
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${tenant.tenant_email}`} className="hover:text-[#ff6b35]">
                              {tenant.tenant_email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Home className="w-4 h-4" />
                            <span>{tenant.apartment_title}</span>
                          </div>
                        </div>

                        {tenant.apartment_details && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2"><strong>Property Details:</strong></p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500">Address</p>
                                <p className="font-medium">{tenant.apartment_details.address || tenant.apartment_details.location}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Monthly Rent</p>
                                <p className="font-medium">${tenant.monthly_rent?.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Lease Start</p>
                                <p className="font-medium">{format(new Date(tenant.lease_start_date), 'MMM d, yyyy')}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Lease End</p>
                                <p className="font-medium">{format(new Date(tenant.lease_end_date), 'MMM d, yyyy')}</p>
                              </div>
                              {tenant.approval_date && (
                                <div>
                                  <p className="text-gray-500">Approved On</p>
                                  <p className="font-medium">{format(new Date(tenant.approval_date), 'MMM d, yyyy')}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <a href={`mailto:${tenant.tenant_email}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 md:flex-none w-full"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                        </a>
                        {tenant.lease_document_url && (
                          <a href={tenant.lease_document_url} target="_blank" rel="noopener noreferrer">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 md:flex-none w-full"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Lease
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}