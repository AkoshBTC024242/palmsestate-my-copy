import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function PaymentPortal({ user, activeLease, payments }) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: activeLease?.monthly_rent || 0,
    payment_method: "bank_transfer",
    month_year: format(new Date(), 'yyyy-MM')
  });

  const queryClient = useQueryClient();

  const makePaymentMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.RentPayment.create({
        ...data,
        tenant_email: user?.email,
        tenant_name: user?.full_name,
        apartment_id: activeLease?.apartment_id,
        apartment_title: activeLease?.apartment_title,
        payment_date: new Date().toISOString().split('T')[0],
        status: 'completed',
        confirmation_number: `PAY-${Date.now()}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-payments'] });
      toast.success("Payment recorded successfully!");
      setShowPaymentForm(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeLease) {
      toast.error("No active lease found");
      return;
    }
    makePaymentMutation.mutate(formData);
  };

  const statusConfig = {
    pending: { color: "bg-yellow-500", icon: Clock, label: "Pending" },
    completed: { color: "bg-green-500", icon: CheckCircle2, label: "Completed" },
    failed: { color: "bg-red-500", icon: XCircle, label: "Failed" }
  };

  return (
    <div className="space-y-6">
      {!activeLease && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">You need an active lease to make payments.</p>
        </div>
      )}

      {activeLease && (
        <>
          <Card className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white border-0">
            <CardContent className="p-6">
              <p className="text-white/80 text-sm mb-1">Monthly Rent</p>
              <p className="text-4xl font-bold">${activeLease.monthly_rent?.toLocaleString()}</p>
              <p className="text-white/80 text-sm mt-2">{activeLease.apartment_title}</p>
            </CardContent>
          </Card>

          <Button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Make Payment
          </Button>
        </>
      )}

      {showPaymentForm && (
        <Card className="border-2 border-[#ff6b35]">
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="month_year">Payment For (Month/Year) *</Label>
                <Input
                  id="month_year"
                  type="month"
                  value={formData.month_year}
                  onChange={(e) => setFormData({...formData, month_year: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select value={formData.payment_method} onValueChange={(val) => setFormData({...formData, payment_method: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a payment recording system. Please complete your actual payment through your bank or payment provider, then record it here for tracking.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={makePaymentMutation.isPending} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                  {makePaymentMutation.isPending ? "Recording..." : "Record Payment"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment History</h3>
        {payments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No payments recorded yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {payments.map((payment) => {
              const status = statusConfig[payment.status];
              const StatusIcon = status.icon;

              return (
                <Card key={payment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-[#1a1f35]">
                          ${payment.amount?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(new Date(payment.month_year + '-01'), 'MMMM yyyy')}
                        </p>
                      </div>
                      <Badge className={`${status.color} text-white flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Method:</span> {payment.payment_method.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {format(new Date(payment.payment_date), 'MMM d, yyyy')}
                      </div>
                      {payment.confirmation_number && (
                        <div>
                          <span className="font-medium">Confirmation:</span> {payment.confirmation_number}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}