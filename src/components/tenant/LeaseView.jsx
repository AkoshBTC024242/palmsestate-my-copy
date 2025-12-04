import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Calendar, DollarSign, Home, CheckCircle2, Download, Brain } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import AILeaseAnalyzer from "../admin/AILeaseAnalyzer";

export default function LeaseView({ leases, userEmail }) {
  const [selectedLease, setSelectedLease] = useState(null);
  const [signature, setSignature] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const queryClient = useQueryClient();

  const signLeaseMutation = useMutation({
    mutationFn: async ({ leaseId, signature }) => {
      return await base44.entities.LeaseAgreement.update(leaseId, {
        tenant_signature: signature,
        tenant_signed_date: new Date().toISOString(),
        status: 'signed'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tenant-leases']);
      toast.success("Lease signed successfully!");
      setSelectedLease(null);
      setSignature("");
    }
  });

  const handleSign = () => {
    if (!signature.trim()) {
      toast.error("Please enter your full name to sign");
      return;
    }
    signLeaseMutation.mutate({ leaseId: selectedLease.id, signature });
  };

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    signed: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-4">
      {leases.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No lease agreements found</p>
        </div>
      ) : (
        leases.map((lease) => (
          <Card key={lease.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{lease.apartment_title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{lease.apartment_address}</p>
                </div>
                <Badge className={statusColors[lease.status]}>
                  {lease.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#ff6b35]" />
                  <div>
                    <p className="text-sm text-gray-600">Monthly Rent</p>
                    <p className="font-semibold">${lease.monthly_rent?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#ff6b35]" />
                  <div>
                    <p className="text-sm text-gray-600">Lease Period</p>
                    <p className="font-semibold">
                      {format(new Date(lease.lease_start_date), 'MMM d, yyyy')} - {format(new Date(lease.lease_end_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#ff6b35]" />
                  <div>
                    <p className="text-sm text-gray-600">Security Deposit</p>
                    <p className="font-semibold">${lease.security_deposit?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {lease.tenant_signed_date && (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Signed on {format(new Date(lease.tenant_signed_date), 'MMM d, yyyy')}</span>
                </div>
              )}

              <div className="flex gap-2">
                {lease.status === 'sent' && !lease.tenant_signature && (
                  <Button
                    onClick={() => setSelectedLease(lease)}
                    className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Sign Lease
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedLease(lease)}>
                  <FileText className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {selectedLease && (
        <Dialog open={!!selectedLease} onOpenChange={() => setSelectedLease(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lease Agreement</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-4">Property Details</h3>
                <p className="mb-2"><strong>Property:</strong> {selectedLease.apartment_title}</p>
                <p className="mb-2"><strong>Address:</strong> {selectedLease.apartment_address}</p>
                <p className="mb-2"><strong>Tenant:</strong> {selectedLease.tenant_name}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-4">Lease Terms</h3>
                <p className="mb-2"><strong>Monthly Rent:</strong> ${selectedLease.monthly_rent?.toLocaleString()}</p>
                <p className="mb-2"><strong>Security Deposit:</strong> ${selectedLease.security_deposit?.toLocaleString()}</p>
                <p className="mb-2"><strong>Lease Start:</strong> {format(new Date(selectedLease.lease_start_date), 'MMMM d, yyyy')}</p>
                <p className="mb-2"><strong>Lease End:</strong> {format(new Date(selectedLease.lease_end_date), 'MMMM d, yyyy')}</p>
              </div>

              {selectedLease.terms && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Full Lease Agreement</h3>
                  <pre className="whitespace-pre-wrap text-xs">{selectedLease.terms}</pre>
                </div>
              )}

              {/* AI Analysis Toggle */}
              <div>
                <Button
                  variant={showAnalysis ? "default" : "outline"}
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="w-full"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {showAnalysis ? "Hide AI Analysis" : "View AI Analysis"}
                </Button>
              </div>

              {showAnalysis && (
                <div className="border-t pt-6">
                  <AILeaseAnalyzer lease={selectedLease} hideFlaggedItems={true} />
                </div>
              )}

              {selectedLease.status === 'sent' && !selectedLease.tenant_signature && (
                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">Digital Signature</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    By typing your full name below, you agree to the terms of this lease agreement.
                    This constitutes a legally binding electronic signature.
                  </p>
                  <input
                    type="text"
                    placeholder="Type your full name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full p-3 border rounded-lg mb-4"
                  />
                  <Button
                    onClick={handleSign}
                    disabled={signLeaseMutation.isPending}
                    className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a]"
                  >
                    {signLeaseMutation.isPending ? "Signing..." : "Sign Lease Agreement"}
                  </Button>
                </div>
              )}

              {selectedLease.tenant_signature && (
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Lease Signed</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Signed by {selectedLease.tenant_signature} on {format(new Date(selectedLease.tenant_signed_date), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}