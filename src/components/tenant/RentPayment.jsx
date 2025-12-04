import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function RentPayment({ userEmail, userName }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    lease_id: "",
    payment_method: "",
    payment_for_month: format(new Date(), 'MMMM yyyy')
  });

  const queryClient = useQueryClient();

  const { data: leases = [] } = useQuery({
    queryKey: ['tenant-leases', userEmail],
    queryFn: () => base44.entities.LeaseAgreement.filter({ 
      tenant_email: userEmail,
      status: { $in: ['signed', 'active'] }
    }),
    initialData: []
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['rent-payments', userEmail],
    queryFn: () => base44.entities.RentPayment.filter({ tenant_email: userEmail }, '-created_date'),
    initialData: []
  });

  const makePaymentMutation = useMutation({
    mutationFn: async (data) => {
      const selectedLease = leases.find(l => l.id === data.lease_id);
      const payment = await base44.entities.RentPayment.create({
        ...data,
        tenant_email: userEmail,
        tenant_name: userName,
        apartment_title: selectedLease.apartment_title,
        amount: selectedLease.monthly_rent,
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        transaction_id: 'TXN-' + Date.now(),
        payment_status: 'completed'
      });

      // Send confirmation email
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Real Estate",
        to: userEmail,
        subject: "Rent Payment Confirmation",
        body: `Dear ${userName},

Your rent payment has been received successfully!

Payment Details:
- Property: ${selectedLease.apartment_title}
- Amount: $${selectedLease.monthly_rent}
- For Month: ${data.payment_for_month}
- Payment Method: ${data.payment_method}
- Transaction ID: ${payment.transaction_id}
- Date: ${format(new Date(), 'MMMM d, yyyy')}

Thank you for your payment.

Best regards,
Palms Real Estate
(828) 623-9765`
      });

      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rent-payments']);
      toast.success("Payment processed successfully!");
      setShowForm(false);
      setFormData({ lease_id: "", payment_method: "", payment_for_month: format(new Date(), 'MMMM yyyy') });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    makePaymentMutation.mutate(formData);
  };

  const statusColors = {
    completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
    failed: { bg: "bg-red-100", text: "text-red-800", icon: XCircle }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rent Payments</h2>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowForm(!showForm);
          }}
          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Pay Rent</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Select Property *</Label>
                <Select
                  value={formData.lease_id}
                  onValueChange={(value) => setFormData({ ...formData, lease_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose property" />
                  </SelectTrigger>
                  <SelectContent>
                    {leases.map(lease => (
                      <SelectItem key={lease.id} value={lease.id}>
                        {lease.apartment_title} - ${lease.monthly_rent}/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment For Month *</Label>
                <Input
                  value={formData.payment_for_month}
                  onChange={(e) => setFormData({ ...formData, payment_for_month: e.target.value })}
                  placeholder="January 2025"
                  required
                />
              </div>

              <div>
                <Label>Payment Method *</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={makePaymentMutation.isPending} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                  {makePaymentMutation.isPending ? "Processing..." : "Process Payment"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {payments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payment history yet</p>
            </CardContent>
          </Card>
        ) : (
          payments.map((payment) => {
            const StatusIcon = statusColors[payment.payment_status]?.icon || Clock;
            return (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#ff6b35]" />
                        <span className="text-2xl font-bold">${payment.amount}</span>
                      </div>
                      <p className="text-gray-600">{payment.apartment_title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>For: {payment.payment_for_month}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Transaction ID: {payment.transaction_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${statusColors[payment.payment_status]?.bg} ${statusColors[payment.payment_status]?.text} mb-2`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {payment.payment_status}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {format(new Date(payment.payment_date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{payment.payment_method}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}