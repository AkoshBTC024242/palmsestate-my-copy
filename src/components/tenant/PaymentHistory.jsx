import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ExternalLink, CheckCircle2, Clock, XCircle, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function PaymentHistory({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: payments = [] } = useQuery({
    queryKey: ['tenant-payments', userEmail],
    queryFn: () => base44.entities.RentPayment.filter({ tenant_email: userEmail }, '-created_date'),
    enabled: !!userEmail,
    initialData: []
  });

  const statusConfig = {
    pending: { 
      color: "bg-yellow-100 text-yellow-800", 
      icon: Clock, 
      label: "Pending Payment",
      description: "Please complete payment using the links below"
    },
    completed: { 
      color: "bg-green-100 text-green-800", 
      icon: CheckCircle2, 
      label: "Paid",
      description: "Payment received successfully"
    },
    failed: { 
      color: "bg-red-100 text-red-800", 
      icon: XCircle, 
      label: "Failed",
      description: "Payment failed, please try again"
    }
  };

  const pendingPayments = payments.filter(p => p.payment_status === 'pending');
  const completedPayments = payments.filter(p => p.payment_status === 'completed');

  return (
    <div className="space-y-6">
      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <Card className="border-2 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-5 h-5" />
              Outstanding Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingPayments.map((payment) => {
              const StatusIcon = statusConfig[payment.payment_status]?.icon;
              return (
                <Card key={payment.id} className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">{payment.apartment_title}</h4>
                        <p className="text-sm text-gray-600">For: {payment.payment_for_month}</p>
                      </div>
                      <Badge className={statusConfig[payment.payment_status]?.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[payment.payment_status]?.label}
                      </Badge>
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Amount Due</p>
                      <p className="text-3xl font-bold text-[#ff6b35]">
                        ${payment.amount?.toLocaleString()}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {statusConfig[payment.payment_status]?.description}
                    </p>

                    <div className="flex flex-col gap-3">
                      {payment.stripe_link && (
                        <a
                          href={payment.stripe_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full bg-[#635bff] hover:bg-[#5145e6] h-12">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay with Stripe
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      )}
                      {payment.paypal_link && (
                        <a
                          href={payment.paypal_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full bg-[#0070ba] hover:bg-[#005ea6] h-12">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Pay with PayPal
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      )}
                      {!payment.stripe_link && !payment.paypal_link && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Please contact property management for payment instructions
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            📞 (828) 623-9765
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#ff6b35]" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payment records yet</p>
            </div>
          ) : completedPayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No completed payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedPayments.map((payment) => {
                const StatusIcon = statusConfig[payment.payment_status]?.icon;
                return (
                  <Card key={payment.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold">{payment.apartment_title}</h4>
                            <Badge className={statusConfig[payment.payment_status]?.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[payment.payment_status]?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{payment.payment_for_month}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(payment.created_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ${payment.amount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            via {payment.payment_method}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}