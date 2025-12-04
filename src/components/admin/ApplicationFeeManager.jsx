import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Clock, CheckCircle2, XCircle, Eye, Mail, Phone, Calendar, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ApplicationFeeManager() {
  const [selectedFee, setSelectedFee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentTag, setPaymentTag] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const queryClient = useQueryClient();

  const { data: fees = [], isLoading } = useQuery({
    queryKey: ['application-fees'],
    queryFn: () => base44.entities.ApplicationFee.list('-created_date'),
    initialData: []
  });

  const updateFeeMutation = useMutation({
    mutationFn: async ({ id, status, paymentTag, paymentId }) => {
      console.log("=== UPDATE FEE MUTATION STARTED ===");
      console.log("ID:", id, "Status:", status, "Tag:", paymentTag, "PaymentID:", paymentId);
      
      const fee = fees.find(f => f.id === id);
      console.log("Found fee:", fee);
      
      const updateData = { 
        status,
        payment_tag: paymentTag,
        payment_id: paymentId,
        amount: 85
      };
      
      if (status === 'verified') {
        updateData.verified_date = new Date().toISOString();
        updateData.application_form_sent_date = new Date().toISOString();
      }

      console.log("Updating fee with data:", updateData);
      const updatedFee = await base44.entities.ApplicationFee.update(id, updateData);
      console.log("Fee updated successfully:", updatedFee);

      // Send payment instructions when BOTH tag and ID are provided and status changes to instructions_sent
      const hasTag = paymentTag && paymentTag !== "Awaiting Tag";
      const hasId = paymentId && paymentId !== "Awaiting ID";
      const needsInstructions = (!fee.payment_tag || fee.payment_tag === "Awaiting Tag") || 
                                (!fee.payment_id || fee.payment_id === "Awaiting ID");
      
      console.log("Email conditions - hasTag:", hasTag, "hasId:", hasId, "needsInstructions:", needsInstructions, "status:", status);
      
      if (hasTag && hasId && needsInstructions && status === 'instructions_sent') {
        console.log("=== SENDING PAYMENT INSTRUCTIONS EMAIL ===");
        const instructionsSentUpdate = await base44.entities.ApplicationFee.update(id, { instructions_sent_date: new Date().toISOString() });
        console.log("Instructions sent date updated:", instructionsSentUpdate);
        
        const uploadLink = `${window.location.origin}/#/UploadPaymentProof?tracking=${fee.transaction_id}`;
        console.log("Upload link generated:", uploadLink);
        
        console.log("Attempting to send email to:", fee.applicant_email);
        console.log("Email parameters:", {
          from_name: "Palms Estate",
          to: fee.applicant_email,
          subject: `📧 Payment Instructions - ${fee.apartment_title}`
        });
        
        const instructionEmailResult = await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate",
          to: fee.applicant_email,
          subject: `📧 Payment Instructions - ${fee.apartment_title}`,
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.8; color: #2c3e50; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 650px; margin: 40px auto; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .letterhead { background: #1a1f35; padding: 30px 40px; border-bottom: 3px solid #ff6b35; }
    .letterhead h1 { color: white; margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 1px; }
    .letterhead p { color: #cbd5e0; margin: 5px 0 0 0; font-size: 13px; }
    .content { padding: 40px 45px; }
    .greeting { font-size: 16px; color: #2c3e50; margin-bottom: 25px; }
    .section { margin: 30px 0; }
    .section-title { font-size: 15px; color: #1a1f35; font-weight: 600; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    .info-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; font-size: 14px; }
    .info-value { color: #1a1f35; font-weight: 600; font-family: 'Courier New', monospace; font-size: 14px; }
    .payment-details { background: #fffbeb; border: 2px solid #f59e0b; border-radius: 4px; padding: 25px; margin: 25px 0; }
    .payment-details h3 { margin: 0 0 20px 0; color: #92400e; font-size: 16px; font-weight: 600; }
    .detail-item { margin: 12px 0; padding: 12px; background: white; border-radius: 4px; }
    .detail-label { color: #78350f; font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px; }
    .detail-value { color: #1a1f35; font-size: 15px; font-family: 'Courier New', monospace; font-weight: 600; }
    .instructions { margin: 25px 0; }
    .instructions ol { padding-left: 20px; }
    .instructions li { margin: 10px 0; color: #475569; font-size: 14px; line-height: 1.7; }
    .footer { background: #f8fafc; padding: 30px 45px; border-top: 1px solid #e2e8f0; }
    .signature { margin: 30px 0; }
    .signature-line { color: #1a1f35; font-weight: 600; margin: 5px 0; }
    .contact-info { font-size: 13px; color: #64748b; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="letterhead">
      <h1>PALMS ESTATE</h1>
      <p>Property Management & Rental Services</p>
    </div>
    
    <div class="content">
      <p style="text-align: right; color: #64748b; font-size: 13px; margin-bottom: 25px;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      
      <div class="greeting">
        <p style="margin: 0;">Dear ${fee.applicant_name},</p>
      </div>
      
      <p style="color: #475569; font-size: 14px; line-height: 1.8; margin-bottom: 25px;">
        Thank you for your interest in <strong>${fee.apartment_title}</strong>. We are pleased to provide you with the payment instructions to process your application fee.
      </p>

      <div class="section">
        <div class="section-title">Application Details</div>
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Property</span>
            <span class="info-value">${fee.apartment_title}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Application Fee</span>
            <span class="info-value">$85.00</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tracking Reference</span>
            <span class="info-value">${fee.transaction_id}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Payment Instructions</div>
        <div class="payment-details">
          <h3>Required Payment Information</h3>
          ${fee.payment_method === 'zelle' ? `
            <div class="detail-item">
              <span class="detail-label">Payment Method</span>
              <span class="detail-value">Zelle</span>
            </div>
          ` : `
            <div class="detail-item">
              <span class="detail-label">Payment Method</span>
              <span class="detail-value">Chime</span>
            </div>
          `}
          <div class="detail-item">
            <span class="detail-label">Payment Tag</span>
            <span class="detail-value">${paymentTag}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Payment Reference ID</span>
            <span class="detail-value">${paymentId}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Processing Steps</div>
        <div class="instructions">
          <ol>
            <li>Open your ${fee.payment_method === 'zelle' ? 'Zelle' : 'Chime'} application</li>
            <li>Initiate a payment of <strong>$85.00</strong> to the specified payment tag</li>
            <li>In the memo or notes field, include both the Payment Tag and Payment Reference ID listed above</li>
            <li>Complete the transaction and save the confirmation receipt (screenshot)</li>
            <li><strong>Click the button below</strong> to upload your payment screenshot</li>
            <li>Our team will verify your payment within 24 business hours</li>
            <li>Upon verification, you will receive the complete rental application form via email</li>
          </ol>
        </div>
      </div>

      <div style="text-align: center; margin: 35px 0;">
        <a href="${uploadLink}" style="display: inline-block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: white; text-decoration: none; padding: 18px 45px; border-radius: 12px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);">
          🔐 Log In & Upload Payment Receipt
        </a>
        <p style="margin-top: 12px; font-size: 13px; color: #64748b;">Sign in to your account and upload your payment receipt</p>
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 1.8; margin: 30px 0;">
        Should you require any assistance or have questions regarding this process, please do not hesitate to contact our office.
      </p>

      <div class="signature">
        <p class="signature-line">Sincerely,</p>
        <p class="signature-line">Palms Estate Management Team</p>
      </div>
    </div>

    <div class="footer">
      <div class="contact-info">
        <p style="margin: 5px 0;"><strong>Palms Estate</strong></p>
        <p style="margin: 5px 0;">Phone: (828) 623-9765</p>
        <p style="margin: 5px 0;">Email: devbreed@hotmail.com</p>
      </div>
    </div>
  </div>
</body>
</html>
          `
        });
        console.log("=== EMAIL SENT SUCCESSFULLY ===");
        console.log("Email result:", instructionEmailResult);
        toast.success("✅ Payment instructions sent to " + fee.applicant_email);
      } else {
        console.log("Skipping payment instructions email - conditions not met");
      }

      // Send confirmation email with application link when verified
      console.log("Checking verified email - status:", status, "old status:", fee.status);
      if (status === 'verified' && status !== fee.status) {
        console.log("=== SENDING VERIFIED EMAIL ===");
        const statusText = status === 'verified' ? 'confirmed' : 'requires attention';
        
        const emailSubject = status === 'verified' 
          ? `✅ Payment Confirmed - Apply Now for ${fee.apartment_title}`
          : `❌ Payment Update - ${fee.apartment_title}`;

        const applicationFormUrl = `${window.location.origin}/#/Rentals`;
        
        console.log("Attempting to send verified email to:", fee.applicant_email);
        console.log("Application form URL:", applicationFormUrl);

        const verifiedEmailResult = await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate",
          to: fee.applicant_email,
          subject: "✅ Payment Verified - Complete Your Application",
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1f35; margin: 0; padding: 0; background: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .status-badge { display: inline-block; padding: 15px 30px; border-radius: 12px; font-weight: bold; margin: 25px 0; font-size: 18px; background: #d1fae5; color: #065f46; border: 3px solid #10b981; }
    .info-box { background: #f9fafb; border-left: 4px solid #ff6b35; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .next-steps { background: #ecfdf5; border: 2px solid #10b981; padding: 25px; border-radius: 12px; margin: 25px 0; }
    .footer { background: #1a1f35; color: white; padding: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Payment Confirmed!</h1>
    </div>
    <div class="content">
      <p style="font-size: 18px;"><strong>Dear ${fee.applicant_name || "Applicant"},</strong></p>
      
      <div class="status-badge">
        ✅ PAYMENT RECEIVED & VERIFIED
      </div>
      
      <div class="info-box">
        <p style="margin: 5px 0;"><strong>Property:</strong> ${fee.apartment_title}</p>
        <p style="margin: 5px 0;"><strong>Amount:</strong> $85.00</p>
        <p style="margin: 5px 0;"><strong>Tracking Code:</strong> <span style="font-family: 'Courier New', monospace; background: white; padding: 4px 10px; border-radius: 6px; font-weight: bold; border: 2px solid #e5e7eb;">${fee.transaction_id}</span></p>
      </div>
      
      <div class="next-steps">
        <h3 style="color: #065f46; margin: 0 0 15px 0;">📋 Next Steps:</h3>
        <ol style="color: #047857; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li><strong>Click the button below</strong> to access your rental application form</li>
          <li><strong>Complete all required fields</strong> in the application</li>
          <li><strong>Submit your application</strong> for admin review</li>
          <li><strong>Track your status</strong> using code: <code style="background: white; padding: 2px 6px; border-radius: 4px;">${fee.transaction_id}</code></li>
          <li><strong>Receive approval</strong> - We'll email you with the decision</li>
        </ol>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${applicationFormUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: white; text-decoration: none; padding: 18px 45px; border-radius: 12px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);">
          🏠 Complete Your Application Now
        </a>
      </div>
      
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="color: #1e40af; font-weight: 600; margin: 0 0 10px 0;">💡 Important:</p>
        <p style="color: #1e3a8a; margin: 0; font-size: 15px;">
          Save your tracking code <strong>${fee.transaction_id}</strong> - you'll need it to check your application status at any time!
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 35px; padding-top: 25px; border-top: 2px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0 0 10px 0;">Need Help?</p>
        <p style="color: #ff6b35; font-weight: 600; margin: 5px 0; font-size: 16px;">📞 (828) 623-9765</p>
        <p style="color: #ff6b35; font-weight: 600; margin: 5px 0; font-size: 16px;">✉️ devbreed@hotmail.com</p>
      </div>
      
      <p style="margin-top: 30px; color: #6b7280;">Best regards,<br><strong style="color: #1a1f35;">Palms Estate Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin: 0; font-size: 18px; font-weight: bold;">Palms Estate</p>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Dream Home Awaits</p>
    </div>
  </div>
</body>
</html>
        `
        });
        console.log("=== VERIFIED EMAIL SENT ===");
        console.log("Result:", verifiedEmailResult);
        toast.success("✅ Application form sent to " + fee.applicant_email);
      } else if (status === 'rejected') {
        console.log("=== SENDING REJECTION EMAIL ===");
        console.log("To:", fee.applicant_email);
        const rejectionEmailResult = await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate",
          to: fee.applicant_email,
          subject: `❌ Payment Update - ${fee.apartment_title}`,
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1f35; margin: 0; padding: 0; background: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .footer { background: #1a1f35; color: white; padding: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Payment Update</h1>
    </div>
    <div class="content">
      <p><strong>Dear ${fee.applicant_name},</strong></p>
      <p>There seems to be an issue with your payment. Please contact us at:</p>
      <p><strong>📞 (828) 623-9765</strong><br><strong>✉️ devbreed@hotmail.com</strong></p>
    </div>
    <div class="footer">
      <p>Palms Estate</p>
    </div>
  </div>
</body>
</html>
          `
        });
        console.log("=== REJECTION EMAIL SENT ===");
        console.log("Result:", rejectionEmailResult);
        toast.success("✅ Rejection email sent to " + fee.applicant_email);
      }
      
      console.log("=== UPDATE FEE MUTATION COMPLETED ===");
      return updatedFee;
    },
    onSuccess: (updatedFee) => {
      console.log("Mutation success, updated fee:", updatedFee);
      queryClient.invalidateQueries({ queryKey: ['application-fees'] });
      toast.success("Status updated successfully!");
      setShowModal(false);
      setSelectedFee(null);
      setPaymentTag("");
      setPaymentId("");
    },
    onError: () => {
      toast.error("Failed to update payment status");
    }
  });

  const handleVerify = (fee, status) => {
    if (status === 'verified' && (!paymentTag || !paymentId)) {
      toast.error("Please enter Payment Tag and Payment ID first");
      return;
    }
    updateFeeMutation.mutate({
      id: fee.id,
      status,
      paymentTag: paymentTag || fee.payment_tag,
      paymentId: paymentId || fee.payment_id
    });
  };

  const pendingFees = fees.filter(f => f.status === 'pending');
  const instructionsSent = fees.filter(f => f.status === 'instructions_sent');
  const paymentPendingVerification = fees.filter(f => f.status === 'payment_pending_verification');
  const verifiedFees = fees.filter(f => f.status === 'verified');
  const rejectedFees = fees.filter(f => f.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-yellow-600">{pendingFees.length}</div>
            <div className="text-sm text-gray-600">Pending Instructions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600">{instructionsSent.length}</div>
            <div className="text-sm text-gray-600">Instructions Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600">{paymentPendingVerification.length}</div>
            <div className="text-sm text-gray-600">Pending Verification</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">{verifiedFees.length}</div>
            <div className="text-sm text-gray-600">Verified & Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-red-600">{rejectedFees.length}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Application Fee Payments</h3>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : fees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No payment confirmations yet</div>
          ) : (
            <div className="space-y-4">
              {fees.map((fee) => {
                const statusConfig = {
                  pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
                  instructions_sent: { bg: "bg-blue-100", text: "text-blue-800", icon: Mail },
                  payment_pending_verification: { bg: "bg-purple-100", text: "text-purple-800", icon: DollarSign },
                  verified: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
                  rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle }
                };
                const config = statusConfig[fee.status] || { bg: "bg-gray-100", text: "text-gray-800", icon: Clock };
                const StatusIcon = config.icon;

                return (
                  <Card key={fee.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-[#1a1f35]">{fee.applicant_name || "Applicant"}</h4>
                            <Badge className={`${config.bg} ${config.text} border-0 flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {fee.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {fee.applicant_email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {fee.applicant_phone}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1"><strong>Property:</strong> {fee.apartment_title}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <strong>$85</strong>
                            </span>
                            <span>via <strong>{fee.payment_method.toUpperCase()}</strong></span>
                            <span className="text-gray-500">ID: {fee.transaction_id}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {format(new Date(fee.created_date), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedFee(fee);
                            setPaymentTag(fee.payment_tag || "");
                            setPaymentId(fee.payment_id || "");
                            setShowModal(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Application Fee Payment</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Applicant</p>
                  <p className="font-semibold">{selectedFee.applicant_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{selectedFee.applicant_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Property</p>
                  <p className="font-semibold">{selectedFee.apartment_title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-green-600">$85</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold">{selectedFee.payment_method.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-semibold font-mono text-sm">{selectedFee.transaction_id}</p>
                </div>
              </div>

              {selectedFee.payment_proof_url && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Payment Proof</p>
                  <img 
                    src={selectedFee.payment_proof_url} 
                    alt="Payment proof" 
                    className="max-w-xs max-h-64 object-contain rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Payment Tag *</label>
                  <Input
                    value={paymentTag}
                    onChange={(e) => setPaymentTag(e.target.value)}
                    placeholder="e.g., devbreed@hotmail.com or $PalmsEstate"
                  />
                  <p className="text-xs text-gray-500 mt-1">The Zelle/Chime identifier for payment</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Payment ID *</label>
                  <Input
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    placeholder="e.g., RENT-2024-001"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier for tracking this payment</p>
                </div>
              </div>

              {selectedFee.status === 'pending' && (
                <Button
                  onClick={() => handleVerify(selectedFee, 'instructions_sent')}
                  disabled={updateFeeMutation.isPending || !paymentTag || !paymentId}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Payment Instructions
                </Button>
              )}

              {selectedFee.status === 'payment_pending_verification' && (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVerify(selectedFee, 'verified');
                    }}
                    disabled={updateFeeMutation.isPending || !paymentTag || !paymentId}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {updateFeeMutation.isPending ? "Processing..." : "Payment Received"}
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVerify(selectedFee, 'rejected');
                    }}
                    disabled={updateFeeMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Payment
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}