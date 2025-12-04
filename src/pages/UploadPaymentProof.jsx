import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Upload, Loader2, Clock, XCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function UploadPaymentReceipt() {
  const [trackingCode, setTrackingCode] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('tracking');
    if (code) {
      setTrackingCode(code);
    }
  }, []);

  const { data: fee, isLoading } = useQuery({
    queryKey: ['payment-proof-fee', trackingCode],
    queryFn: async () => {
      const fees = await base44.entities.ApplicationFee.filter({ 
        transaction_id: trackingCode 
      });
      return fees[0] || null;
    },
    enabled: !!trackingCode
  });

  const uploadReceiptMutation = useMutation({
    mutationFn: async () => {
      if (!receiptFile) {
        throw new Error("Please select a receipt file");
      }

      let receiptUrl = "";
      setUploading(true);
      try {
        const uploadResult = await base44.integrations.Core.UploadFile({ file: receiptFile });
        receiptUrl = uploadResult.file_url;
      } finally {
        setUploading(false);
      }

      return await base44.entities.ApplicationFee.update(fee.id, {
        payment_proof_url: receiptUrl,
        status: 'payment_pending_verification'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-proof-fee', trackingCode] });
      setSubmitted(true);
      toast.success("Payment receipt submitted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to submit: " + error.message);
    }
  });

  if (!trackingCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
            <p className="text-gray-600">This link appears to be invalid or expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
      </div>
    );
  }

  if (!fee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Record Not Found</h2>
            <p className="text-gray-600">No payment request found with this tracking code.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (fee.status === 'verified') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Verified</h2>
            <p className="text-gray-600">Your payment has already been verified. Check your email for the application form.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted || fee.status === 'payment_pending_verification') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Clock className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Under Review</h2>
              <p className="text-gray-600 text-lg mb-6">
                Thank you for submitting your payment receipt!
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-blue-700 font-semibold mb-2">🎫 YOUR TRACKING CODE</p>
                <div className="bg-white rounded-lg py-4 px-6 inline-block shadow-sm">
                  <p className="font-mono text-2xl font-bold text-blue-900 tracking-wider">{trackingCode}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
              <h4 className="font-semibold text-yellow-900 mb-3">📋 What Happens Next:</h4>
              <ol className="text-sm text-yellow-800 space-y-2 ml-6 list-decimal">
                <li>Our admin is reviewing your payment receipt</li>
                <li>You'll receive an email within 24 hours once verified</li>
                <li>The email will contain a direct link to complete your rental application form</li>
                <li>Fill out the application and submit it</li>
                <li>Admin will review and update your application status</li>
              </ol>
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Questions? Contact us at <strong className="text-[#ff6b35]">(828) 623-9765</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-[#ff6b35]/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-full mb-4">
                <Upload className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Payment Receipt</h2>
              <p className="text-gray-600">Complete your application fee payment verification</p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">Payment Details:</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Property:</strong> {fee.apartment_title}</p>
                <p><strong>Amount:</strong> $85.00</p>
                <p><strong>Payment Method:</strong> {fee.payment_method?.toUpperCase()}</p>
                {fee.payment_tag && fee.payment_tag !== "Awaiting Tag" && (
                  <p><strong>Payment Tag:</strong> <span className="font-mono bg-white px-2 py-1 rounded">{fee.payment_tag}</span></p>
                )}
                {fee.payment_id && fee.payment_id !== "Awaiting ID" && (
                  <p><strong>Payment ID:</strong> <span className="font-mono bg-white px-2 py-1 rounded">{fee.payment_id}</span></p>
                )}
                <p><strong>Tracking Code:</strong> <span className="font-mono bg-white px-2 py-1 rounded">{trackingCode}</span></p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); uploadReceiptMutation.mutate(); }} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Payment Receipt *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files[0])}
                  required
                  className="h-12"
                />
                <p className="text-xs text-gray-500">Upload a clear screenshot showing your payment receipt</p>
              </div>

              <Button
                type="submit"
                disabled={uploadReceiptMutation.isPending || uploading || !receiptFile}
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 text-base font-semibold"
              >
                {uploadReceiptMutation.isPending || uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {uploading ? "Uploading Receipt..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Submit Payment Receipt
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Questions? Contact us at <strong className="text-[#ff6b35]">(828) 623-9765</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}