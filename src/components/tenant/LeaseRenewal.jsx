import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { format, addYears } from "date-fns";
import { toast } from "sonner";

export default function LeaseRenewal({ userEmail }) {
  const [renewalData, setRenewalData] = useState({});
  const queryClient = useQueryClient();

  const { data: leases = [] } = useQuery({
    queryKey: ['active-leases', userEmail],
    queryFn: () => base44.entities.LeaseAgreement.filter({ 
      tenant_email: userEmail,
      status: { $in: ['signed', 'active'] }
    }),
    initialData: []
  });

  const requestRenewalMutation = useMutation({
    mutationFn: async ({ leaseId, newEndDate }) => {
      const lease = leases.find(l => l.id === leaseId);
      
      // Create renewal request record
      await base44.entities.LeaseRenewalRequest.create({
        tenant_email: lease.tenant_email,
        tenant_name: lease.tenant_name,
        lease_id: lease.id,
        apartment_id: lease.apartment_id,
        apartment_title: lease.apartment_title,
        current_lease_end_date: lease.lease_end_date,
        requested_end_date: newEndDate,
        current_monthly_rent: lease.monthly_rent,
        status: 'pending'
      });
      
      // Send renewal request to property manager
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Real Estate - Tenant Portal",
        to: "devbreed@hotmail.com",
        subject: `Lease Renewal Request - ${lease.apartment_title}`,
        body: `Lease renewal request received:

Tenant: ${lease.tenant_name}
Email: ${lease.tenant_email}
Property: ${lease.apartment_title}
Current Lease End: ${format(new Date(lease.lease_end_date), 'MMMM d, yyyy')}
Requested New End Date: ${format(new Date(newEndDate), 'MMMM d, yyyy')}
Monthly Rent: $${lease.monthly_rent}

Please review and process this renewal request in the admin dashboard.`
      });

      // Notify tenant
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Real Estate",
        to: lease.tenant_email,
        subject: "Lease Renewal Request Received",
        body: `Dear ${lease.tenant_name},

We have received your lease renewal request for ${lease.apartment_title}.

Current Lease End: ${format(new Date(lease.lease_end_date), 'MMMM d, yyyy')}
Requested Extension To: ${format(new Date(newEndDate), 'MMMM d, yyyy')}

Our property management team will review your request and contact you within 3-5 business days.

Thank you for choosing Palms Real Estate!

Best regards,
Palms Real Estate Team`
      });

      return lease;
    },
    onSuccess: () => {
      toast.success("Renewal request submitted!");
      setRenewalData({});
    }
  });

  const handleRenewalRequest = (leaseId) => {
    const newEndDate = renewalData[leaseId];
    if (!newEndDate) {
      toast.error("Please select a new lease end date");
      return;
    }
    requestRenewalMutation.mutate({ leaseId, newEndDate });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Lease Renewals</h2>
        <p className="text-gray-600">Manage your lease renewal options</p>
      </div>

      <div className="space-y-4">
        {leases.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active leases found</p>
            </CardContent>
          </Card>
        ) : (
          leases.map((lease) => (
            <Card key={lease.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{lease.apartment_title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{lease.apartment_address}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#ff6b35]" />
                    <div>
                      <p className="text-sm text-gray-600">Monthly Rent</p>
                      <p className="font-semibold">${lease.monthly_rent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#ff6b35]" />
                    <div>
                      <p className="text-sm text-gray-600">Lease Start</p>
                      <p className="font-semibold">{format(new Date(lease.lease_start_date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Lease End</p>
                      <p className="font-semibold">{format(new Date(lease.lease_end_date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Request Lease Renewal</h4>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label>New Lease End Date</Label>
                      <Input
                        type="date"
                        min={lease.lease_end_date}
                        value={renewalData[lease.id] || ''}
                        onChange={(e) => setRenewalData({ ...renewalData, [lease.id]: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={() => handleRenewalRequest(lease.id)}
                      disabled={requestRenewalMutation.isPending}
                      className="bg-[#ff6b35] hover:bg-[#ff8c5a] mt-6"
                    >
                      {requestRenewalMutation.isPending ? "Submitting..." : "Request Renewal"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}