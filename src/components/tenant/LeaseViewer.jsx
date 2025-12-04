import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, CheckCircle2, Clock, FileSignature } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function LeaseViewer({ leases, user }) {
  const [signingLease, setSigningLease] = useState(null);
  const [signature, setSignature] = useState("");
  const queryClient = useQueryClient();

  const signLeaseMutation = useMutation({
    mutationFn: async ({ leaseId, signature }) => {
      return await base44.entities.LeaseAgreement.update(leaseId, {
        tenant_signature: signature,
        signed_date: new Date().toISOString(),
        status: 'signed'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-leases'] });
      toast.success("Lease signed successfully!");
      setSigningLease(null);
      setSignature("");
    }
  });

  const handleSign = (lease) => {
    if (!signature || signature.toLowerCase() !== user?.full_name.toLowerCase()) {
      toast.error("Please type your full name exactly as shown");
      return;
    }
    signLeaseMutation.mutate({ leaseId: lease.id, signature });
  };

  const downloadLease = (lease) => {
    const content = `
LEASE AGREEMENT

Property: ${lease.apartment_title}
Address: ${lease.apartment_address}

Tenant: ${lease.tenant_name}
Email: ${lease.tenant_email}

Lease Term: ${format(new Date(lease.lease_start_date), 'MMMM d, yyyy')} to ${format(new Date(lease.lease_end_date), 'MMMM d, yyyy')}

Monthly Rent: $${lease.monthly_rent}
Security Deposit: $${lease.security_deposit}

Terms and Conditions:
${lease.terms || 'Standard lease terms apply.'}

${lease.tenant_signature ? `Signed by: ${lease.tenant_signature}\nDate: ${format(new Date(lease.signed_date), 'MMMM d, yyyy h:mm a')}` : 'Not yet signed'}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lease-${lease.apartment_title.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusConfig = {
    draft: { color: "bg-gray-500", icon: Clock, label: "Draft" },
    sent: { color: "bg-blue-500", icon: FileSignature, label: "Awaiting Signature" },
    signed: { color: "bg-green-500", icon: CheckCircle2, label: "Signed" },
    active: { color: "bg-[#ff6b35]", icon: CheckCircle2, label: "Active" },
    expired: { color: "bg-gray-400", icon: Clock, label: "Expired" }
  };

  if (leases.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No leases available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {leases.map((lease) => {
        const status = statusConfig[lease.status];
        const StatusIcon = status.icon;

        return (
          <Card key={lease.id} className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{lease.apartment_title}</CardTitle>
                  <p className="text-gray-600 mt-1">{lease.apartment_address}</p>
                </div>
                <Badge className={`${status.color} text-white flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Lease Period</p>
                  <p className="font-medium">
                    {format(new Date(lease.lease_start_date), 'MMM d, yyyy')} - {format(new Date(lease.lease_end_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Rent</p>
                  <p className="font-medium text-[#ff6b35]">${lease.monthly_rent?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Security Deposit</p>
                  <p className="font-medium">${lease.security_deposit?.toLocaleString()}</p>
                </div>
                {lease.signed_date && (
                  <div>
                    <p className="text-sm text-gray-500">Signed On</p>
                    <p className="font-medium">{format(new Date(lease.signed_date), 'MMM d, yyyy')}</p>
                  </div>
                )}
              </div>

              {lease.terms && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Terms & Conditions</p>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">{lease.terms}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => downloadLease(lease)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>

                {lease.status === 'sent' && !lease.tenant_signature && (
                  <Button
                    onClick={() => setSigningLease(lease.id)}
                    className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white flex items-center gap-2"
                  >
                    <FileSignature className="w-4 h-4" />
                    Sign Lease
                  </Button>
                )}
              </div>

              {/* Digital Signature Form */}
              {signingLease === lease.id && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="signature">Digital Signature</Label>
                      <p className="text-xs text-gray-600 mb-2">
                        Type your full name: <strong>{user?.full_name}</strong>
                      </p>
                      <Input
                        id="signature"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Type your full name"
                        className="font-serif text-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      By signing, you agree to all terms and conditions of this lease agreement.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSign(lease)}
                        disabled={signLeaseMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {signLeaseMutation.isPending ? "Signing..." : "Confirm & Sign"}
                      </Button>
                      <Button
                        onClick={() => {
                          setSigningLease(null);
                          setSignature("");
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}