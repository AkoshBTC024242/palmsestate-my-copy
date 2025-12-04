import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Shield, FileText, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { getApplicationReceivedEmail } from "../admin/EmailTemplates";

export default function ApplyModal({ apartment, isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [numberOfOccupants, setNumberOfOccupants] = useState("1");
  const [hasPets, setHasPets] = useState("false");
  const [petDetails, setPetDetails] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        if (currentUser) {
          setFullName(currentUser.full_name || "");
          setEmail(currentUser.email || "");
        }
      } catch (error) {
        // User not logged in
      }
    };
    if (isOpen) {
      loadUser();
    }
  }, [isOpen]);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const tracking = 'PA-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      
      const application = await base44.entities.RentalApplication.create({
        ...data,
        tracking_number: tracking,
        status: 'submitted'
      });

      const trackingUrl = `${window.location.origin}/#/ApplicationTracker?code=${tracking}`;
      
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Estate",
        to: email,
        subject: "🏠 Application Received - Your Tracking Number Inside",
        body: getApplicationReceivedEmail({
          fullName,
          apartmentTitle: apartment.title,
          trackingNumber: tracking,
          trackingUrl,
          location: `${apartment.location}${apartment.city ? ', ' + apartment.city : ''}${apartment.state ? ', ' + apartment.state : ''}`,
          rent: apartment.monthly_rent?.toLocaleString(),
          moveInDate: new Date(moveInDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          submittedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        })
      });

      return { application, tracking };
    },
    onSuccess: (data) => {
      setTrackingNumber(data.tracking);
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to submit: ${error.message}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate({
      apartment_id: apartment.id,
      apartment_title: apartment.title,
      full_name: fullName,
      email,
      phone,
      current_address: currentAddress,
      employment_status: employmentStatus,
      employer_name: employerName,
      monthly_income: parseFloat(monthlyIncome) || 0,
      move_in_date: moveInDate,
      number_of_occupants: parseInt(numberOfOccupants),
      has_pets: hasPets === "true",
      pet_details: petDetails,
      additional_info: additionalInfo
    });
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-[#1a1f35] mb-3">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">We'll review your application and contact you within 24-48 hours.</p>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
              <p className="text-sm text-blue-700 font-semibold mb-2">🎫 YOUR TRACKING CODE</p>
              <div className="bg-white rounded-lg py-4 px-6 inline-block shadow-sm">
                <p className="font-mono text-2xl font-bold text-blue-900 tracking-wider">{trackingNumber}</p>
              </div>
              <p className="text-xs text-blue-600 mt-3">📌 Save this code to track your application status anytime</p>
            </div>
            
            <Button onClick={onClose} className="bg-[#ff6b35] hover:bg-[#ff8c5a] w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply for {apartment.title}</DialogTitle>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Application Fee: $85</p>
                <p className="text-sm text-blue-700">
                  This non-refundable fee covers background checks, credit reports, and administrative processing to ensure a smooth rental experience.
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ff6b35]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="(123) 456-7890" />
              </div>
              <div className="space-y-2">
                <Label>Desired Move-in Date *</Label>
                <Input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label>Current Address</Label>
              <Input value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} placeholder="123 Main St, City, State" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#ff6b35]" />
              Employment & Financial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employment Status *</Label>
                <Select value={employmentStatus} onValueChange={setEmploymentStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Employer Name</Label>
                <Input value={employerName} onChange={(e) => setEmployerName(e.target.value)} placeholder="Company Name" />
              </div>
              <div className="space-y-2">
                <Label>Monthly Income</Label>
                <Input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="5000" />
              </div>
              <div className="space-y-2">
                <Label>Number of Occupants</Label>
                <Input type="number" min="1" value={numberOfOccupants} onChange={(e) => setNumberOfOccupants(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">Additional Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Do you have pets?</Label>
                <Select value={hasPets} onValueChange={setHasPets}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasPets === "true" && (
                <div className="space-y-2">
                  <Label>Pet Details</Label>
                  <Input value={petDetails} onChange={(e) => setPetDetails(e.target.value)} placeholder="Dog, medium size, 2 years old" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Additional Information</Label>
                <Textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} rows={4} placeholder="Any additional information you'd like to share..." />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={submitMutation.isPending} className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 text-lg font-semibold">
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}