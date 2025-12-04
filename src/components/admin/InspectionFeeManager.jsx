import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Clock, CheckCircle2, XCircle, Eye, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function InspectionFeeManager() {
  const [selectedFee, setSelectedFee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: fees = [], isLoading } = useQuery({
    queryKey: ['inspection-fees'],
    queryFn: () => base44.entities.InspectionFee.list('-created_date'),
    initialData: []
  });

  const updateFeeMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const fee = fees.find(f => f.id === id);
      const updatedFee = await base44.entities.InspectionFee.update(id, { status });

      if (status === 'paid') {
        await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate",
          to: fee.applicant_email,
          subject: "✅ Inspection Fee Confirmed",
          body: `
            <div style="font-family: Arial, sans-serif;">
              <h2>Payment Confirmed</h2>
              <p>Dear ${fee.applicant_name},</p>
              <p>Your inspection fee payment has been confirmed.</p>
              <p><strong>Property:</strong> ${fee.apartment_title}</p>
              <p><strong>Amount:</strong> $${fee.amount}</p>
              <p>We'll contact you soon to schedule the inspection.</p>
            </div>
          `
        });
      }

      return updatedFee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspection-fees'] });
      setShowModal(false);
      toast.success("Status updated successfully");
    }
  });

  const statusConfig = {
    pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    paid: { icon: CheckCircle2, color: 'bg-green-100 text-green-800', label: 'Paid' },
    scheduled: { icon: CheckCircle2, color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
    completed: { icon: CheckCircle2, color: 'bg-green-100 text-green-800', label: 'Completed' }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-bold">{fees.filter(f => f.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold">{fees.filter(f => f.status === 'paid').length}</div>
            <div className="text-sm text-gray-600">Paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold">{fees.filter(f => f.status === 'scheduled').length}</div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold">${fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0)}</div>
            <div className="text-sm text-gray-600">Collected</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Inspection Fees</h3>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : fees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No inspection fees yet</div>
          ) : (
            <div className="space-y-4">
              {fees.map((fee) => {
                const config = statusConfig[fee.status];
                const StatusIcon = config.icon;

                return (
                  <Card key={fee.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{fee.applicant_name}</h4>
                            <Badge className={`${config.color} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Property:</strong> {fee.apartment_title}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Amount:</strong> ${fee.amount}
                          </p>
                          {fee.inspection_date && (
                            <p className="text-sm text-gray-600">
                              <strong>Date:</strong> {format(new Date(fee.inspection_date), 'MMM d, yyyy')} at {fee.inspection_time}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedFee(fee);
                            setShowModal(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFee && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inspection Fee Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Applicant</p>
                <p className="font-semibold">{selectedFee.applicant_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property</p>
                <p className="font-semibold">{selectedFee.apartment_title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-semibold text-green-600">${selectedFee.amount}</p>
              </div>
              {selectedFee.payment_proof_url && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Payment Proof</p>
                  <img src={selectedFee.payment_proof_url} alt="Payment proof" className="max-w-xs rounded-lg" />
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={() => updateFeeMutation.mutate({ id: selectedFee.id, status: 'paid' })}
                  disabled={updateFeeMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Mark as Paid
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}