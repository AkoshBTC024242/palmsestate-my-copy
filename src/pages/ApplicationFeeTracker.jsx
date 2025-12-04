import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Clock, XCircle, DollarSign, Home, Calendar, FileText, AlertCircle, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ApplicationFeeTracker() {
  const [trackingCode, setTrackingCode] = useState("");
  const [searchedCode, setSearchedCode] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Auto-populate tracking code from URL if present
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setTrackingCode(code);
      setSearchedCode(code);
    }
  }, []);

  const { data: applicationFee, isLoading } = useQuery({
    queryKey: ['application-fee-tracking', searchedCode],
    queryFn: async () => {
      if (!searchedCode) return null;
      const fees = await base44.entities.ApplicationFee.filter({
        transaction_id: searchedCode
      }, '-created_date', 1);
      return fees[0] || null;
    },
    enabled: !!searchedCode
  });

  const uploadProofMutation = useMutation({
    mutationFn: async () => {
      if (!proofFile) {
        throw new Error("Please select a payment proof file");
      }

      let proofUrl = "";
      setUploading(true);
      try {
        const uploadResult = await base44.integrations.Core.UploadFile({ file: proofFile });
        proofUrl = uploadResult.file_url;
      } finally {
        setUploading(false);
      }

      return await base44.entities.ApplicationFee.update(applicationFee.id, {
        payment_proof_url: proofUrl,
        transaction_id: transactionId || applicationFee.transaction_id
      });
    },
    onSuccess: () => {
      toast.success("Payment proof uploaded! Awaiting admin verification.");
      queryClient.invalidateQueries(['application-fee-tracking', searchedCode]);
      setProofFile(null);
      setTransactionId("");
    },
    onError: (error) => {
      toast.error(`Failed to upload: ${error.message}`);
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedCode(trackingCode.trim());
  };

  const handleProofUpload = (e) => {
    e.preventDefault();
    uploadProofMutation.mutate();
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Payment Under Review",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      description: "Your payment proof has been submitted and is awaiting verification by our team."
    },
    verified: {
      icon: CheckCircle2,
      label: "Payment Verified",
      color: "bg-green-100 text-green-800 border-green-300",
      description: "Your payment has been verified. The rental application form has been sent to your email."
    },
    rejected: {
      icon: XCircle,
      label: "Payment Issues",
      color: "bg-red-100 text-red-800 border-red-300",
      description: "There was an issue with your payment. Please review the admin notes below and contact us."
    }
  };

  const status = applicationFee ? statusConfig[applicationFee.status] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1a1f35] mb-3">Track Application Fee</h1>
          <p className="text-gray-600 text-lg">
            Enter your tracking code to check your application fee status
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Tracking Code</Label>
                <div className="flex gap-3">
                  <Input
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="PF-12345678-ABCD"
                    className="h-12 text-base font-mono"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={!trackingCode.trim() || isLoading}
                    className="bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 px-8"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Track
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Enter the tracking code you received when submitting your application fee
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-[#ff6b35]">
              <div className="w-6 h-6 border-3 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Searching...</span>
            </div>
          </div>
        )}

        {/* Not Found */}
        {searchedCode && !isLoading && !applicationFee && (
          <Card className="border-2 border-red-200">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1f35] mb-2">Tracking Code Not Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find an application fee with code: <strong className="font-mono">{searchedCode}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please verify your tracking code and try again. If the issue persists, contact us at (828) 623-9765
              </p>
            </CardContent>
          </Card>
        )}

        {/* Application Fee Details */}
        {applicationFee && status && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className={`border-2 ${status.color.replace('bg-', 'border-').replace('text-', 'border-')}`}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${status.color.split(' ')[0]}`}>
                    <status.icon className={`w-8 h-8 ${status.color.split(' ')[1]}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1a1f35] mb-2">{status.label}</h3>
                    <p className="text-gray-700 leading-relaxed">{status.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Home className="w-5 h-5 text-[#ff6b35]" />
                    Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Apartment</p>
                    <p className="font-semibold text-[#1a1f35]">{applicationFee.apartment_title}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5 text-[#ff6b35]" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Amount</p>
                    <p className="font-semibold text-[#1a1f35]">${applicationFee.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Method</p>
                    <p className="font-semibold text-[#1a1f35] capitalize">{applicationFee.payment_method}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-[#ff6b35]" />
                    Applicant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-semibold text-[#1a1f35]">{applicationFee.applicant_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-[#1a1f35]">{applicationFee.applicant_email}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-[#ff6b35]" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Submitted</p>
                    <p className="font-semibold text-[#1a1f35]">
                      {new Date(applicationFee.created_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {applicationFee.verified_date && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Verified</p>
                      <p className="font-semibold text-[#1a1f35]">
                        {new Date(applicationFee.verified_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upload Payment Proof - Only if pending and no proof yet */}
            {applicationFee.status === 'pending' && !applicationFee.payment_proof_url && (
              <Card className="border-2 border-[#ff6b35]/30 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#ff6b35]" />
                    Upload Payment Proof
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Please upload a screenshot of your payment confirmation to proceed with verification.
                  </p>
                  <form onSubmit={handleProofUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Payment Proof Screenshot *</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProofFile(e.target.files[0])}
                        required
                        className="h-11"
                      />
                      <p className="text-xs text-gray-500">Upload screenshot showing successful payment</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Transaction Reference (Optional)</Label>
                      <Input
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter transaction number if available"
                        className="h-11"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={uploadProofMutation.isPending || uploading}
                      className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 text-base font-semibold"
                    >
                      {uploadProofMutation.isPending || uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {uploading ? "Uploading..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Submit Payment Proof
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Proof - Show if already uploaded */}
            {applicationFee.payment_proof_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Proof Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={applicationFee.payment_proof_url}
                    alt="Payment Proof"
                    className="w-full max-w-md rounded-lg border-2 border-gray-200"
                  />
                </CardContent>
              </Card>
            )}

            {/* Admin Notes */}
            {applicationFee.admin_notes && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Admin Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{applicationFee.admin_notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Help Section */}
            <Card className="bg-gradient-to-br from-[#ff6b35]/10 to-[#ff8c5a]/10 border-2 border-[#ff6b35]/20">
              <CardContent className="p-6 text-center">
                <p className="text-gray-700 mb-4">Need assistance with your application fee?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="tel:8286239765" className="text-[#ff6b35] font-semibold hover:underline">
                    📞 (828) 623-9765
                  </a>
                  <span className="hidden sm:inline text-gray-400">|</span>
                  <a href="mailto:devbreed@hotmail.com" className="text-[#ff6b35] font-semibold hover:underline">
                    ✉️ devbreed@hotmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}