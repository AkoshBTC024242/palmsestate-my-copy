import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2, XCircle, AlertCircle, Loader2, FileText, DollarSign, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function TenantScreening({ application }) {
  const [screeningData, setScreeningData] = useState({
    background_check_status: application.screening?.background_check_status || 'pending',
    background_check_notes: application.screening?.background_check_notes || '',
    credit_check_status: application.screening?.credit_check_status || 'pending',
    credit_score: application.screening?.credit_score || '',
    credit_check_notes: application.screening?.credit_check_notes || '',
    employment_verification_status: application.screening?.employment_verification_status || 'pending',
    employment_verification_notes: application.screening?.employment_verification_notes || '',
    overall_recommendation: application.screening?.overall_recommendation || 'pending'
  });

  const queryClient = useQueryClient();

  const updateScreeningMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.RentalApplication.update(application.id, {
        screening: data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-applications'] });
      toast.success("Screening information updated");
    },
    onError: () => {
      toast.error("Failed to update screening");
    }
  });

  const handleSave = () => {
    updateScreeningMutation.mutate(screeningData);
  };

  const statusConfig = {
    pending: { icon: AlertCircle, color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    in_progress: { icon: Loader2, color: "bg-blue-100 text-blue-800", label: "In Progress" },
    passed: { icon: CheckCircle2, color: "bg-green-100 text-green-800", label: "Passed" },
    failed: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Failed" },
    not_required: { icon: CheckCircle2, color: "bg-gray-100 text-gray-800", label: "Not Required" }
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Background Check */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-purple-600" />
            Background Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select 
                value={screeningData.background_check_status} 
                onValueChange={(val) => setScreeningData({...screeningData, background_check_status: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="not_required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <StatusBadge status={screeningData.background_check_status} />
            </div>
          </div>

          <div>
            <Label>Notes & Findings</Label>
            <Textarea
              value={screeningData.background_check_notes}
              onChange={(e) => setScreeningData({...screeningData, background_check_notes: e.target.value})}
              placeholder="Criminal history, eviction records, rental history..."
              rows={3}
            />
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Third-party integrations:</strong> Connect to services like TransUnion SmartMove, 
              MyRental, or RentPrep for automated background checks.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Credit Check */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Credit Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select 
                value={screeningData.credit_check_status} 
                onValueChange={(val) => setScreeningData({...screeningData, credit_check_status: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="not_required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Credit Score</Label>
              <input
                type="number"
                value={screeningData.credit_score}
                onChange={(e) => setScreeningData({...screeningData, credit_score: e.target.value})}
                placeholder="e.g., 720"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={screeningData.credit_check_status} />
            {screeningData.credit_score && (
              <Badge className={`${
                screeningData.credit_score >= 700 ? 'bg-green-100 text-green-800' :
                screeningData.credit_score >= 600 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              } border-0`}>
                Score: {screeningData.credit_score}
              </Badge>
            )}
          </div>

          <div>
            <Label>Notes & Analysis</Label>
            <Textarea
              value={screeningData.credit_check_notes}
              onChange={(e) => setScreeningData({...screeningData, credit_check_notes: e.target.value})}
              placeholder="Debt-to-income ratio, payment history, bankruptcies..."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Recommended:</strong> Credit score of 620+ for approval. Consider income ratio (rent should be ≤30% of monthly income).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Employment Verification */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-green-600" />
            Employment Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select 
                value={screeningData.employment_verification_status} 
                onValueChange={(val) => setScreeningData({...screeningData, employment_verification_status: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="passed">Verified</SelectItem>
                  <SelectItem value="failed">Could Not Verify</SelectItem>
                  <SelectItem value="not_required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <StatusBadge status={screeningData.employment_verification_status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Employer</p>
              <p className="font-medium">{application.employer_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Monthly Income</p>
              <p className="font-medium text-green-600">${application.monthly_income?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>

          <div>
            <Label>Verification Notes</Label>
            <Textarea
              value={screeningData.employment_verification_notes}
              onChange={(e) => setScreeningData({...screeningData, employment_verification_notes: e.target.value})}
              placeholder="Contacted HR, verified employment dates, confirmed salary..."
              rows={3}
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Verification methods:</strong> Contact employer directly, request pay stubs, 
              W-2 forms, or use services like The Work Number.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Overall Recommendation */}
      <Card className="border-2 border-[#ff6b35]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-[#ff6b35]" />
            Overall Screening Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Final Recommendation</Label>
            <Select 
              value={screeningData.overall_recommendation} 
              onValueChange={(val) => setScreeningData({...screeningData, overall_recommendation: val})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="recommend_approval">Recommend Approval</SelectItem>
                <SelectItem value="conditional_approval">Conditional Approval</SelectItem>
                <SelectItem value="recommend_rejection">Recommend Rejection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {screeningData.overall_recommendation === 'recommend_approval' && (
              <Badge className="bg-green-100 text-green-800 border-0 text-base px-4 py-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Recommend Approval
              </Badge>
            )}
            {screeningData.overall_recommendation === 'conditional_approval' && (
              <Badge className="bg-yellow-100 text-yellow-800 border-0 text-base px-4 py-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                Conditional Approval
              </Badge>
            )}
            {screeningData.overall_recommendation === 'recommend_rejection' && (
              <Badge className="bg-red-100 text-red-800 border-0 text-base px-4 py-2">
                <XCircle className="w-4 h-4 mr-2" />
                Recommend Rejection
              </Badge>
            )}
          </div>

          <Button 
            onClick={handleSave} 
            disabled={updateScreeningMutation.isPending}
            className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 text-base"
          >
            {updateScreeningMutation.isPending ? "Saving..." : "Save Screening Results"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}