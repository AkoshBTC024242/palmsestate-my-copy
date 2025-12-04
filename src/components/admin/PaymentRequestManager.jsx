import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Send, CheckCircle2, Clock, XCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function PaymentRequestManager() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentForMonth, setPaymentForMonth] = useState("");
  const [stripeLink, setStripeLink] = useState("");
  const [paypalLink, setPaypalLink] = useState("");
  const queryClient = useQueryClient();

  const { data: leases = [] } = useQuery({
    queryKey: ['active-leases'],
    queryFn: () => base44.entities.LeaseAgreement.list('-created_date'),
    initialData: []
  });

  // Filter for active and signed leases
  const activeLeases = leases.filter(l => l.status === 'active' || l.status === 'signed' || l.status === 'sent');

  const { data: payments = [] } = useQuery({
    queryKey: ['rent-payments'],
    queryFn: () => base44.entities.RentPayment.list('-created_date'),
    initialData: []
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const payment = await base44.entities.RentPayment.create(paymentData);
      
      // Send email notification to tenant
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Estate",
        to: paymentData.tenant_email,
        subject: `Rent Payment Request - ${paymentData.payment_for_month}`,
        body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .amount-box { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 25px 0; border: 2px solid #3b82f6; }
    .amount { font-size: 48px; font-weight: bold; color: #1e40af; margin: 10px 0; }
    .payment-buttons { display: flex; gap: 15px; margin: 30px 0; }
    .pay-button { display: block; padding: 18px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; text-align: center; font-size: 16px; }
    .stripe-btn { background: #635bff; color: white; }
    .paypal-btn { background: #0070ba; color: white; }
    .info-box { background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b35; margin: 20px 0; }
    .footer { background-color: #1a1f35; color: #ffffff; padding: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 Rent Payment Request</h1>
    </div>
    
    <div class="content">
      <h2 style="color: #1a1f35; margin-top: 0;">Dear ${paymentData.tenant_name},</h2>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        Your rent payment for <strong>${paymentData.payment_for_month}</strong> is now ready for payment.
      </p>

      <div class="amount-box">
        <p style="color: #3b82f6; font-size: 14px; margin: 0;">Amount Due</p>
        <div class="amount">$${paymentData.amount.toLocaleString()}</div>
        <p style="color: #64748b; font-size: 14px; margin: 0;">for ${paymentData.apartment_title}</p>
      </div>

      <div class="info-box">
        <p style="margin: 5px 0;"><strong>Property:</strong> ${paymentData.apartment_title}</p>
        <p style="margin: 5px 0;"><strong>Amount:</strong> $${paymentData.amount.toLocaleString()}</p>
        <p style="margin: 5px 0;"><strong>For Month:</strong> ${paymentData.payment_for_month}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> Pending Payment</p>
      </div>

      <h3 style="color: #1a1f35; text-align: center;">Choose Your Payment Method</h3>
      
      <div class="payment-buttons">
        ${stripeLink ? `<a href="${stripeLink}" class="pay-button stripe-btn">💳 Pay with Stripe</a>` : ''}
        ${paypalLink ? `<a href="${paypalLink}" class="pay-button paypal-btn">💰 Pay with PayPal</a>` : ''}
      </div>

      <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0;">
        You can also view this payment request in your tenant portal.
      </p>

      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">

      <div style="text-align: center;">
        <p style="color: #6b7280; margin: 5px 0;">📞 <a href="tel:8286239765" style="color: #ff6b35; text-decoration: none;">(828) 623-9765</a></p>
        <p style="color: #6b7280; margin: 5px 0;">✉️ <a href="mailto:devbreed@hotmail.com" style="color: #ff6b35; text-decoration: none;">devbreed@hotmail.com</a></p>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0; font-weight: bold;">Palms Estate</p>
      <p style="opacity: 0.8; font-size: 14px;">© ${new Date().getFullYear()} All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
      });

      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] });
      toast.success("Payment request sent to tenant!");
      handleCloseModal();
    },
    onError: () => {
      toast.error("Failed to create payment request");
    }
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.RentPayment.update(id, { payment_status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] });
      toast.success("Payment status updated");
    }
  });

  const handleOpenModal = (lease) => {
    setSelectedLease(lease);
    setAmount(lease.monthly_rent.toString());
    const currentMonth = format(new Date(), 'MMMM yyyy');
    setPaymentForMonth(currentMonth);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLease(null);
    setAmount("");
    setPaymentForMonth("");
    setStripeLink("");
    setPaypalLink("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLease || !amount || !paymentForMonth) {
      toast.error("Please fill all required fields");
      return;
    }

    createPaymentMutation.mutate({
      tenant_email: selectedLease.tenant_email,
      tenant_name: selectedLease.tenant_name,
      lease_id: selectedLease.id,
      apartment_title: selectedLease.apartment_title,
      amount: parseFloat(amount),
      payment_method: stripeLink ? 'stripe' : paypalLink ? 'paypal' : 'bank_transfer',
      payment_status: 'pending',
      payment_for_month: paymentForMonth,
      stripe_link: stripeLink,
      paypal_link: paypalLink
    });
  };

  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
    completed: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "Completed" },
    failed: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Failed" }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#ff6b35]" />
              Payment Requests
            </CardTitle>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowModal(true);
              }} 
              className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
            >
              <Send className="w-4 h-4 mr-2" />
              New Payment Request
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No payment requests yet</p>
            ) : (
              payments.map((payment) => {
                const StatusIcon = statusConfig[payment.payment_status]?.icon || Clock;
                return (
                  <Card key={payment.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{payment.tenant_name}</h4>
                            <Badge className={statusConfig[payment.payment_status]?.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[payment.payment_status]?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{payment.apartment_title}</p>
                          <p className="text-sm text-gray-500">For: {payment.payment_for_month}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-2xl font-bold text-[#ff6b35]">
                              ${payment.amount?.toLocaleString()}
                            </span>
                            {payment.stripe_link && (
                              <a
                                href={payment.stripe_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                Stripe Link <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {payment.paypal_link && (
                              <a
                                href={payment.paypal_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                PayPal Link <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                        {payment.payment_status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updatePaymentMutation.mutate({ id: payment.id, status: 'completed' });
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Mark Paid
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updatePaymentMutation.mutate({ id: payment.id, status: 'failed' });
                              }}
                            >
                              Mark Failed
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Payment Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Lease</Label>
              <Select
                value={selectedLease?.id}
                onValueChange={(value) => {
                  const lease = activeLeases.find(l => l.id === value);
                  handleOpenModal(lease);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {activeLeases.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">No active leases found</div>
                  ) : (
                    activeLeases.map((lease) => (
                      <SelectItem key={lease.id} value={lease.id}>
                        {lease.tenant_name} - {lease.apartment_title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedLease && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount ($) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1500.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>For Month *</Label>
                    <Input
                      value={paymentForMonth}
                      onChange={(e) => setPaymentForMonth(e.target.value)}
                      placeholder="January 2025"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">💡 Payment Links</p>
                  <p className="text-xs text-blue-700">
                    Create payment links using Stripe or PayPal's payment link generator, then paste them below.
                    Tenants will receive these links via email.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Stripe Payment Link (Optional)</Label>
                  <Input
                    value={stripeLink}
                    onChange={(e) => setStripeLink(e.target.value)}
                    placeholder="https://buy.stripe.com/..."
                  />
                  <p className="text-xs text-gray-500">
                    Create at: <a href="https://dashboard.stripe.com/payment-links" target="_blank" className="text-blue-600 hover:underline">dashboard.stripe.com/payment-links</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>PayPal Payment Link (Optional)</Label>
                  <Input
                    value={paypalLink}
                    onChange={(e) => setPaypalLink(e.target.value)}
                    placeholder="https://www.paypal.com/paypalme/..."
                  />
                  <p className="text-xs text-gray-500">
                    Create at: <a href="https://www.paypal.com/paypalme/" target="_blank" className="text-blue-600 hover:underline">paypal.com/paypalme</a>
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createPaymentMutation.isPending}
                    className="flex-1 bg-[#ff6b35] hover:bg-[#ff8c5a]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {createPaymentMutation.isPending ? "Sending..." : "Send Payment Request"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}