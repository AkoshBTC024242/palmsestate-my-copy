import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Home, Shield, FileText } from "lucide-react";

export default function CostCalculator({ apartment }) {
  const monthlyRent = apartment?.monthly_rent || 0;
  const securityDeposit = apartment?.security_deposit || 0;
  const applicationFee = apartment?.application_fee || 85;
  const moveInTotal = monthlyRent + securityDeposit + applicationFee;

  const costs = [
    {
      icon: Home,
      label: "First Month's Rent",
      amount: monthlyRent,
      color: "text-blue-600"
    },
    {
      icon: Shield,
      label: "Security Deposit",
      amount: securityDeposit,
      color: "text-green-600"
    },
    {
      icon: FileText,
      label: "Application Fee",
      amount: applicationFee,
      color: "text-orange-600"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-[#ff6b35]/5 to-[#ff8c5a]/5 border-[#ff6b35]/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#ff6b35]" />
          <h3 className="text-lg font-bold text-[#1a1f35]">Move-in Cost Breakdown</h3>
        </div>

        <div className="space-y-3 mb-4">
          {costs.map((cost, idx) => {
            const Icon = cost.icon;
            return (
              <div key={idx} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${cost.color}`} />
                  <span className="text-gray-700">{cost.label}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  ${cost.amount.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t-2 border-[#ff6b35]/30">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#1a1f35]">Total Move-in Cost</span>
            <span className="text-2xl font-bold text-[#ff6b35]">
              ${moveInTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Security deposit is refundable at the end of your lease, subject to property condition
        </p>
      </CardContent>
    </Card>
  );
}