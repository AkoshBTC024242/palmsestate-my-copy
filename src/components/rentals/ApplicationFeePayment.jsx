import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Upload, CheckCircle2, Mail, ArrowRight, Loader2, CreditCard, Building2, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ApplicationFeePayment({ apartment, applicantInfo, onPaymentVerified }) {
  const [step, setStep] = useState(1); // 1: Name & Email, 2: Payment Method, 3: Confirmation
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(applicantInfo?.email || "");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ONLY prefill email when component mounts - NEVER prefill full name
  React.useEffect(() => {
    if (applicantInfo?.email) {
      setEmail(applicantInfo.email);
    }
  }, []);

  const createFeeRequestMutation = useMutation({
    mutationFn: async ({ name, email, method }) => {
      console.log("Creating fee request...", { name, email, method });
      
      // Generate unique tracking code
      const trackingCode = 'PF-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      
      // Create pending application fee request
      const fee = await base44.entities.ApplicationFee.create({
        applicant_name: name,
        applicant_email: email,
        applicant_phone: "",
        apartment_id: apartment.id,
        apartment_title: apartment.title,
        amount: apartment.application_fee || 85,
        payment_method: method,
        transaction_id: trackingCode,
        payment_tag: "Awaiting Tag",
        payment_id: "Awaiting ID",
        status: "pending"
      });
      
      console.log("Fee created successfully:", fee);

      // Notify admin about new applicant fee request - ACTION REQUIRED from admin
      console.log("Attempting to send admin email to devbreed@hotmail.com");
      try {
        const adminEmailResult = await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate System",
          to: "koshbtc@gmail.com",
          subject: `🔔 New Payment Request - ACTION REQUIRED for ${name}`,
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1f35; margin: 0; padding: 0; }
    .container { max-width: 650px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #1a1f35 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .urgent { background: #fef3c7; border: 3px solid #f59e0b; padding: 20px; margin: 20px; border-radius: 10px; }
    .urgent strong { color: #92400e; font-size: 18px; }
    .tracking-code { background: #e0f2fe; border: 4px solid #0284c7; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 20px; }
    .code { font-family: 'Courier New', monospace; font-size: 28px; font-weight: bold; color: #0c4a6e; letter-spacing: 3px; margin: 10px 0; }
    .info-section { background: #f9fafb; border-left: 5px solid #ff6b35; padding: 20px; margin: 20px; border-radius: 8px; }
    .info-section p { margin: 8px 0; font-size: 15px; }
    .content { padding: 20px; }
    .steps { color: #4b5563; line-height: 2; padding-left: 25px; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; border-top: 2px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Payment Request</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Application Fee Payment Details Required</p>
    </div>
    
    <div class="content">
      <div class="urgent">
        <strong>⏰ ACTION REQUIRED:</strong> Send payment ID to applicant
      </div>

      <div class="tracking-code">
        <p style="margin: 0 0 10px 0; color: #0369a1; font-weight: 600; font-size: 14px; text-transform: uppercase;">Tracking Code</p>
        <div class="code">${fee.transaction_id}</div>
        <p style="margin: 10px 0 0 0; color: #0369a1; font-size: 13px;">Use this to locate the request in admin panel</p>
      </div>

      <div class="info-section">
        <h3 style="margin: 0 0 15px 0; color: #1a1f35; font-size: 18px;">📋 Applicant Details</h3>
        <p><strong>Applicant:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #ff6b35; text-decoration: none;">${email}</a></p>
        <p><strong>Property:</strong> ${apartment.title}</p>
        <p><strong>Payment Method:</strong> ${method === 'zelle' ? 'Zelle' : 'Chime'}</p>
        <p><strong>Amount:</strong> <span style="color: #059669; font-weight: bold; font-size: 18px;">$${apartment.application_fee || 85}.00</span></p>
      </div>

      <div style="margin: 20px; padding: 25px; background: white; border: 2px solid #e5e7eb; border-radius: 12px;">
        <h3 style="color: #1a1f35; margin: 0 0 15px 0; font-size: 18px; border-bottom: 3px solid #ff6b35; padding-bottom: 10px;">📋 Next Steps for Admin:</h3>
        <ol class="steps">
          <li><strong>Go to Admin Panel → Rentals & Fees → Application Fees tab</strong></li>
          <li>Find request with code: <code style="background: #e0f2fe; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${fee.transaction_id}</code></li>
          <li>Click "Review" to open the fee details</li>
          <li>Enter your <strong>${method === 'zelle' ? 'Zelle' : 'Chime'} Payment Tag</strong> (your ${method} username/ID)</li>
          <li>Enter a unique <strong>Payment ID</strong> for tracking this transaction</li>
          <li>Click "Send Instructions" - system will automatically email applicant with payment details</li>
          <li>Applicant receives email with payment info and upload link</li>
          <li>Applicant pays and uploads proof via the link</li>
          <li>You verify payment in admin panel and approve</li>
          <li>Application form is automatically sent to applicant</li>
        </ol>
      </div>
      
      <div style="margin: 20px; padding: 20px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          💡 <strong>Important:</strong> The applicant is waiting for your payment instructions. They cannot proceed until you provide the ${method === 'zelle' ? 'Zelle' : 'Chime'} payment details in the admin panel.
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0; color: #6b7280; font-size: 13px;">Palms Estate - Admin Notification System</p>
    </div>
  </div>
</body>
</html>
          `
        });
        console.log("Admin email sent successfully:", adminEmailResult);
      } catch (emailError) {
        console.error("Failed to send admin email (non-critical):", emailError);
        // Continue anyway - email failure shouldn't block the process
      }
      
      return fee;
    },
    onSuccess: (data) => {
      console.log("Mutation success, fee tracking code:", data.transaction_id);
      setTrackingCode(data.transaction_id);
      setStep(3);
      toast.success("Request submitted! Save your tracking code: " + data.transaction_id);
    },
    onError: (error) => {
      console.error("Error creating fee request:", error);
      toast.error(`Failed to submit request: ${error.message}`);
    }
  });




  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error("Please enter your full name and email");
      return;
    }
    setStep(2);
  };

  const handlePaymentMethodSelect = (method) => {
    console.log("=== PAYMENT METHOD SELECTED ===");
    console.log("Method:", method);
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Is Pending:", createFeeRequestMutation.isPending);
    
    setPaymentMethod(method);
    createFeeRequestMutation.mutate({ name: fullName, email, method });
  };



  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= num ? 'bg-[#ff6b35] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
                </div>
                {num < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${step > num ? 'bg-[#ff6b35]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 px-2">
            <span>Info</span>
            <span>Method</span>
            <span>Done</span>
          </div>
        </div>
      )}

      {/* Step 1: Name & Email */}
      {step === 1 && (
        <Card className="border-2 border-[#ff6b35]/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-full mb-4">
                <Mail className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a1f35] mb-2">Application Fee Required</h3>
              <p className="text-gray-600 mb-4">Enter your details to continue</p>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">${apartment.application_fee || 85}.00</span>
              </div>
            </div>

            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Full Name *</Label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="h-12 text-base"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Email Address *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="h-12 text-base"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 text-base">
                Continue to Payment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Payment Method */}
      {step === 2 && (
        <Card className="border-2 border-[#ff6b35]/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-full mb-4">
                <CreditCard className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a1f35] mb-2">Choose Payment Method</h3>
              <p className="text-gray-600">Select your preferred payment method below</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("ZELLE BUTTON CLICKED");
                  handlePaymentMethodSelect('zelle');
                }}
                disabled={createFeeRequestMutation.isPending}
                className="h-auto p-6 border-2 border-gray-200 rounded-lg hover:border-[#ff6b35] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center pointer-events-none">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-1 text-gray-900">Zelle</h4>
                  <p className="text-sm text-gray-500">Fast & Secure</p>
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("CHIME BUTTON CLICKED");
                  handlePaymentMethodSelect('chime');
                }}
                disabled={createFeeRequestMutation.isPending}
                className="h-auto p-6 border-2 border-gray-200 rounded-lg hover:border-[#ff6b35] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center pointer-events-none">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-1 text-gray-900">Chime</h4>
                  <p className="text-sm text-gray-500">Quick Transfer</p>
                </div>
              </button>
            </div>

            {createFeeRequestMutation.isPending && (
              <div className="text-center mt-6">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ff6b35]" />
                <p className="text-sm text-gray-600 mt-2">Processing...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation - Show tracking code */}
      {step === 3 && (
        <Card className="border-2 border-blue-500/30">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a1f35] mb-2">Request Submitted Successfully!</h3>
              <p className="text-gray-600 mb-4">Save your tracking code below</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-blue-700 font-semibold mb-2">🎫 YOUR TRACKING CODE</p>
                <div className="bg-white rounded-lg py-4 px-6 inline-block shadow-sm">
                  <p className="font-mono text-2xl font-bold text-blue-900 tracking-wider">{trackingCode}</p>
                </div>
                <p className="text-xs text-blue-600 mt-3">📌 Save this code! You'll need it to track your application.</p>
              </div>
            </div>

            {/* Portal Link Section */}
            <div className="bg-gradient-to-r from-[#ff6b35]/5 to-[#ff8c5a]/10 border-2 border-[#ff6b35]/30 rounded-xl p-5 mb-6">
              <div className="text-center">
                <p className="text-sm text-[#1a1f35] font-semibold mb-3">📊 Monitor Your Application Status</p>
                <p className="text-xs text-gray-600 mb-4">Track your payment verification progress and receive real-time updates</p>
                <a 
                  href="/ApplicantDashboard" 
                  className="inline-flex items-center gap-2 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
                >
                  <Clock className="w-4 h-4" />
                  View Application Status
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-xs text-gray-500 mt-3">Sign in with your email to access your applicant portal</p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5 mb-6">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                What Happens Next?
              </h4>
              <ol className="text-sm text-green-800 space-y-2 ml-6 list-decimal">
                <li>Our admin will review your request and send <strong>{paymentMethod === 'zelle' ? 'Zelle' : 'Chime'} payment details</strong> to your email: <strong>{email}</strong></li>
                <li>The email will include payment instructions and a <strong>direct link to upload your payment proof</strong></li>
                <li>Click the link in the email after making your payment</li>
                <li>Upload your payment screenshot on the linked page</li>
                <li>Admin will verify your payment and send you the application form</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
              <p className="text-sm text-yellow-900">
                <strong>⏳ Please check your email ({email}) for payment instructions.</strong>
              </p>
              <p className="text-xs text-yellow-700 mt-2">Usually sent within a few hours.</p>
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Questions? Contact us at <strong className="text-[#ff6b35]">(828) 623-9765</strong></p>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}