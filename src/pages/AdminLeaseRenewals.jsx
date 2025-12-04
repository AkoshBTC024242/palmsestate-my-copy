import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Clock, RefreshCw, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminLeaseRenewals() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminNotes, setAdminNotes] = useState("");
  const [newRent, setNewRent] = useState("");

  const queryClient = useQueryClient();

  const { data: renewalRequests = [], isLoading } = useQuery({
    queryKey: ['lease-renewal-requests'],
    queryFn: () => base44.entities.LeaseRenewalRequest.list('-created_date'),
    initialData: []
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, notes, newRent }) => {
      const request = renewalRequests.find(r => r.id === requestId);
      
      await base44.entities.LeaseRenewalRequest.update(requestId, {
        status,
        admin_notes: notes,
        new_monthly_rent: newRent ? parseFloat(newRent) : request.current_monthly_rent
      });

      // Send email notification to tenant
      const statusText = status === 'approved' ? 'approved' : 'declined';
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Real Estate",
        to: request.tenant_email,
        subject: `Lease Renewal Request ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
        body: `Dear ${request.tenant_name},

Your lease renewal request for ${request.apartment_title} has been ${statusText}.

${status === 'approved' ? `
Approved Details:
- New Lease End Date: ${format(new Date(request.requested_end_date), 'MMMM d, yyyy')}
- Monthly Rent: $${newRent || request.current_monthly_rent}
${notes ? `\nAdditional Notes:\n${notes}` : ''}

We will send you the updated lease agreement shortly for your signature.
` : `
${notes ? `Reason:\n${notes}` : ''}

If you have any questions or would like to discuss alternative options, please contact us.
`}

Best regards,
Palms Real Estate Team
Phone: (828) 623-9765
Email: devbreed@hotmail.com`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lease-renewal-requests'] });
      toast.success("Renewal request updated successfully");
      setShowModal(false);
      setSelectedRequest(null);
      setAdminNotes("");
      setNewRent("");
    }
  });

  const filteredRequests = renewalRequests.filter(req => 
    statusFilter === "all" || req.status === statusFilter
  );

  const statusCounts = {
    pending: renewalRequests.filter(r => r.status === 'pending').length,
    approved: renewalRequests.filter(r => r.status === 'approved').length,
    rejected: renewalRequests.filter(r => r.status === 'rejected').length
  };

  const handleApprove = () => {
    updateRequestMutation.mutate({
      requestId: selectedRequest.id,
      status: 'approved',
      notes: adminNotes,
      newRent: newRent
    });
  };

  const handleReject = () => {
    updateRequestMutation.mutate({
      requestId: selectedRequest.id,
      status: 'rejected',
      notes: adminNotes,
      newRent: null
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1f35]">Lease Renewal Management</h1>
          <p className="text-gray-600 mt-2">Review and manage tenant lease renewal requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold">{statusCounts.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-3xl font-bold">{statusCounts.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold">{statusCounts.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Label>Filter by Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card><CardContent className="p-8 text-center text-gray-500">Loading...</CardContent></Card>
          ) : filteredRequests.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-gray-500">No renewal requests found</CardContent></Card>
          ) : (
            filteredRequests.map(request => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#1a1f35]">{request.tenant_name}</h3>
                        <Badge className={
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{request.apartment_title}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Current End Date</p>
                          <p className="font-medium">{format(new Date(request.current_lease_end_date), 'MMM d, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Requested End Date</p>
                          <p className="font-medium">{format(new Date(request.requested_end_date), 'MMM d, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Rent</p>
                          <p className="font-medium">${request.current_monthly_rent?.toLocaleString()}/mo</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Submitted</p>
                          <p className="font-medium">{format(new Date(request.created_date), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      {request.admin_notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600"><strong>Admin Notes:</strong> {request.admin_notes}</p>
                        </div>
                      )}
                    </div>
                    {request.status === 'pending' && (
                      <Button
                        onClick={() => {
                          setSelectedRequest(request);
                          setNewRent(request.current_monthly_rent);
                          setShowModal(true);
                        }}
                        className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white"
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Review Modal */}
        {showModal && selectedRequest && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Review Lease Renewal Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Tenant:</strong> {selectedRequest.tenant_name}</p>
                  <p><strong>Property:</strong> {selectedRequest.apartment_title}</p>
                  <p><strong>Current End Date:</strong> {format(new Date(selectedRequest.current_lease_end_date), 'MMMM d, yyyy')}</p>
                  <p><strong>Requested End Date:</strong> {format(new Date(selectedRequest.requested_end_date), 'MMMM d, yyyy')}</p>
                  <p><strong>Current Rent:</strong> ${selectedRequest.current_monthly_rent?.toLocaleString()}/month</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newRent">New Monthly Rent (if approved)</Label>
                  <Input
                    id="newRent"
                    type="number"
                    value={newRent}
                    onChange={(e) => setNewRent(e.target.value)}
                    placeholder={selectedRequest.current_monthly_rent}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about this decision..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={updateRequestMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve Renewal
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={updateRequestMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Renewal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}