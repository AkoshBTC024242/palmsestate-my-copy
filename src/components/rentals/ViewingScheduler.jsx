import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import ApplicationFeePayment from "./ApplicationFeePayment";

export default function ViewingScheduler({ apartment }) {
  const [step, setStep] = useState("payment"); // "payment" or "schedule"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [applicationFee, setApplicationFee] = useState(null);

  // Check for existing verified payment
  const { data: existingFee } = useQuery({
    queryKey: ['viewing-fee-check', apartment.id, email],
    queryFn: async () => {
      if (!email) return null;
      const fees = await base44.entities.ApplicationFee.filter({
        apartment_id: apartment.id,
        applicant_email: email,
        status: 'verified'
      }, '-created_date', 1);
      return fees[0] || null;
    },
    enabled: !!email && step === "payment"
  });

  const scheduleMutation = useMutation({
    mutationFn: async (data) => {
      const request = await base44.entities.ViewingRequest.create(data);
      
      // Notify admin
      try {
        await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate System",
          to: "koshbtc@gmail.com",
          subject: `🏠 New Viewing Request - ${data.apartment_title}`,
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1f35; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
    .header { background: #1a1f35; color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; }
    .info-box { background: #f9fafb; border-left: 4px solid #ff6b35; padding: 15px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🏠 New Viewing Request</h2>
    </div>
    <div class="content">
      <div class="info-box">
        <p><strong>Property:</strong> ${data.apartment_title}</p>
        <p><strong>Name:</strong> ${data.full_name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Preferred Date:</strong> ${new Date(data.preferred_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Preferred Time:</strong> ${data.preferred_time}</p>
        ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
      </div>
      <p>Log in to the admin panel to confirm or reschedule this viewing.</p>
    </div>
  </div>
</body>
</html>
          `
        });
      } catch (error) {
        console.log("Admin notification failed (non-critical):", error);
      }
      
      return request;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Viewing request submitted!");
    },
    onError: () => {
      toast.error("Failed to submit request");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleMutation.mutate({
      apartment_id: apartment.id,
      apartment_title: apartment.title,
      full_name: fullName,
      email: email,
      phone: phone,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      message: message,
      status: "pending"
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#1a1f35] mb-2">Viewing Request Submitted!</h3>
        <p className="text-gray-600 mb-4">
          We'll contact you within 24 hours to confirm your viewing appointment.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setStep("payment");
          }}
          variant="outline"
          className="mt-4"
        >
          Schedule Another Viewing
        </Button>
      </div>
    );
  }

  // Step 1: Payment
  if (step === "payment" && !applicationFee && !existingFee) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Application Fee Required</span>
          </div>
          <p className="text-sm text-blue-600">
            A ${apartment.application_fee || 85} application fee is required before scheduling a viewing for {apartment.title}
          </p>
        </div>
        <ApplicationFeePayment
          apartment={apartment}
          applicantInfo={{ fullName, email, phone }}
          onPaymentVerified={(fee) => {
            setApplicationFee(fee);
            if (fee.status === 'verified') {
              setStep("schedule");
            }
          }}
        />
      </div>
    );
  }

  // Payment pending
  if (step === "payment" && (applicationFee?.status === 'pending' || existingFee?.status === 'pending')) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-[#1a1f35] mb-3">Payment Under Review</h3>
        <p className="text-gray-600 mb-6">
          Your payment is being verified. You'll be able to schedule a viewing once approved.
        </p>
        <Button onClick={() => setStep("payment")} variant="outline">
          Back
        </Button>
      </div>
    );
  }

  // Step 2: Schedule viewing (payment verified)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-[#ff6b35]/10 border border-[#ff6b35]/20 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 text-[#ff6b35] mb-2">
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">Schedule a Property Viewing</span>
        </div>
        <p className="text-sm text-gray-600">
          Book a tour of {apartment.title} at a time that works for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Phone *</Label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(123) 456-7890"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Preferred Date *</Label>
          <Input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Preferred Time *</Label>
          <Select value={preferredTime} onValueChange={setPreferredTime} required>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9:00 AM">9:00 AM</SelectItem>
              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
              <SelectItem value="11:00 AM">11:00 AM</SelectItem>
              <SelectItem value="12:00 PM">12:00 PM</SelectItem>
              <SelectItem value="1:00 PM">1:00 PM</SelectItem>
              <SelectItem value="2:00 PM">2:00 PM</SelectItem>
              <SelectItem value="3:00 PM">3:00 PM</SelectItem>
              <SelectItem value="4:00 PM">4:00 PM</SelectItem>
              <SelectItem value="5:00 PM">5:00 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Message (Optional)</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Any specific questions or requirements?"
        />
      </div>

      <Button
        type="submit"
        disabled={scheduleMutation.isPending}
        className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl h-12"
      >
        <Clock className="w-5 h-5 mr-2" />
        {scheduleMutation.isPending ? "Submitting..." : "Schedule Viewing"}
      </Button>
    </form>
  );
}