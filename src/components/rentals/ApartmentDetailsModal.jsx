import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin, DollarSign, Check, CheckCircle2, Car, Home, ExternalLink, Loader2, Calendar, Clock, Shield } from "lucide-react";
import ImageGallery from "./ImageGallery";
import ViewingScheduler from "./ViewingScheduler";
import CostCalculator from "./CostCalculator";
import VirtualTour from "../shared/VirtualTour";
import AmenityIcon from "../shared/AmenityIcon";
import ApplicationFeePayment from "./ApplicationFeePayment";
import { getApplicationReceivedEmail } from "../admin/EmailTemplates";

export default function ApartmentDetailsModal({ apartment, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("details");
  const [submitting, setSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [applicationFee, setApplicationFee] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
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

  // Check for existing verified payment
  const { data: existingFee } = useQuery({
    queryKey: ['application-fee-check', apartment.id, email],
    queryFn: async () => {
      if (!email) return null;
      const fees = await base44.entities.ApplicationFee.filter({
        apartment_id: apartment.id,
        applicant_email: email,
        status: 'verified'
      }, '-created_date', 1);
      return fees[0] || null;
    },
    enabled: !!email && activeTab === "apply"
  });

  const resetForm = () => {
    setActiveTab("details");
    setSubmitting(false);
    setTrackingNumber("");
    setApplicationFee(null);
    setShowSuccess(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setCurrentAddress("");
    setEmploymentStatus("");
    setEmployerName("");
    setMonthlyIncome("");
    setMoveInDate("");
    setNumberOfOccupants("1");
    setHasPets("false");
    setPetDetails("");
    setAdditionalInfo("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim() || !phone.trim() || !employmentStatus || !moveInDate) {
      alert("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const tracking = 'PA-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      
      const applicationData = {
        apartment_id: apartment.id,
        apartment_title: apartment.title,
        full_name: fullName,
        email: email,
        phone: phone,
        current_address: currentAddress || "",
        employment_status: employmentStatus,
        employer_name: employerName || "",
        monthly_income: parseFloat(monthlyIncome) || 0,
        move_in_date: moveInDate,
        number_of_occupants: parseInt(numberOfOccupants) || 1,
        has_pets: hasPets === "true",
        pet_details: petDetails || "",
        additional_info: additionalInfo || "",
        tracking_number: tracking,
        status: 'submitted'
      };
      
      await base44.entities.RentalApplication.create(applicationData);
      
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
      
      setTrackingNumber(tracking);
      setShowSuccess(true);
      
    } catch (error) {
      alert(`Failed to submit application: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-[#1a1f35] mb-3">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your application. Our team will review it and contact you within 24-48 hours.
            </p>
            
            <div className="bg-[#ff6b35]/10 border-2 border-[#ff6b35] rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Tracking Number</p>
              <p className="text-2xl font-bold text-[#ff6b35] tracking-wider mb-3">{trackingNumber}</p>
              <p className="text-xs text-gray-500">
                Save this number to track your application status on our website
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Please save your tracking number - you can use it to check your application status anytime.
            </p>
            
            <Button
              onClick={handleClose}
              className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Modal
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a1f35]">{apartment.title}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Tour</TabsTrigger>
            <TabsTrigger value="apply">Apply</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {apartment.images?.length > 0 && (
              <ImageGallery images={apartment.images} apartmentTitle={apartment.title} />
            )}

            {apartment.virtual_tour_url && (
              <VirtualTour url={apartment.virtual_tour_url} title={apartment.title} />
            )}

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-[#ff6b35]" />
                  <span className="text-3xl font-bold text-[#1a1f35]">
                    ${apartment.monthly_rent?.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-lg">/month</span>
                </div>
                {apartment.security_deposit > 0 && (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      Security Deposit: <strong className="text-blue-600">${apartment.security_deposit?.toLocaleString()}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-[#ff6b35]" />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold">{apartment.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-[#ff6b35]" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold">{apartment.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-[#ff6b35]" />
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-semibold">{apartment.size_sqft} sqft</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#1a1f35] mb-2">Description</h3>
              <p className="text-gray-600">{apartment.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#1a1f35] mb-2">Location</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                  <div>
                    <p className="font-medium">{apartment.location}</p>
                    <p className="text-sm">{[apartment.city, apartment.state, apartment.zip_code].filter(Boolean).join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {apartment.amenities?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-[#1a1f35] mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {apartment.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <AmenityIcon amenity={amenity} className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {apartment.parking && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  Parking Available
                </Badge>
              )}
              {apartment.pets_allowed && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Pets Allowed
                </Badge>
              )}
              {apartment.furnishing && (
                <Badge variant="outline">{apartment.furnishing}</Badge>
              )}
            </div>

            <CostCalculator monthlyRent={apartment.monthly_rent} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setActiveTab("schedule")}
                variant="outline"
                className="h-12 border-2 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Tour
              </Button>
              <Button
                onClick={() => setActiveTab("apply")}
                className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl h-12"
              >
                Apply Now
              </Button>
            </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-6">
            <ViewingScheduler apartment={apartment} />
            </TabsContent>

          <TabsContent value="apply" className="space-y-4 mt-6">
            {!applicationFee && !existingFee ? (
              <div className="space-y-4">
                <ApplicationFeePayment
                  apartment={apartment}
                  applicantInfo={{ fullName, email, phone }}
                  onPaymentVerified={(fee) => {
                    setApplicationFee(fee);
                  }}
                />
              </div>
            ) : applicationFee?.status === 'pending' || existingFee?.status === 'pending' ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
                  <Clock className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1f35] mb-3">Payment Under Review</h3>
                <p className="text-gray-600 mb-6">
                  Your payment is being verified by our admin team. You'll receive an email once approved.
                </p>
                <Button onClick={handleClose} variant="outline">
                  Close
                </Button>
              </div>
            ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label>Desired Move-in Date *</Label>
                  <Input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Address</Label>
                <Input
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  placeholder="123 Main St, City, State"
                />
              </div>

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
                  <Input
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Income</Label>
                  <Input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Occupants</Label>
                  <Input
                    type="number"
                    min="1"
                    value={numberOfOccupants}
                    onChange={(e) => setNumberOfOccupants(e.target.value)}
                  />
                </div>
              </div>

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
                  <Input
                    value={petDetails}
                    onChange={(e) => setPetDetails(e.target.value)}
                    placeholder="Dog, medium size, 2 years old"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Additional Information</Label>
                <Textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={4}
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl h-12 text-lg font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
              </form>
              )}
              </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}