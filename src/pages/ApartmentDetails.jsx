import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MapPin, Bed, Bath, Square, DollarSign, Calendar, CheckCircle2, 
  ArrowLeft, X, Send 
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ApartmentDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const apartmentId = urlParams.get('id');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    apartment_id: apartmentId,
    apartment_title: "",
    full_name: "",
    email: "",
    phone: "",
    current_address: "",
    employment_status: "",
    employer_name: "",
    monthly_income: "",
    desired_move_in_date: "",
    number_of_occupants: 1,
    has_pets: false,
    pet_details: "",
    additional_notes: ""
  });

  const { data: apartment, isLoading } = useQuery({
    queryKey: ['apartment', apartmentId],
    queryFn: async () => {
      const apts = await base44.entities.Apartment.filter({ id: apartmentId });
      return apts[0];
    },
    enabled: !!apartmentId
  });

  const createApplicationMutation = useMutation({
    mutationFn: (data) => base44.entities.RentalApplication.create(data),
    onSuccess: () => {
      setApplicationSubmitted(true);
      toast.success("Application submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit application. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createApplicationMutation.mutate({
      ...formData,
      apartment_title: apartment.title,
      monthly_income: parseFloat(formData.monthly_income) || 0
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-4">Apartment not found</p>
          <Link to={createPageUrl("Apartments")}>
            <Button variant="outline">Back to Apartments</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (applicationSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#1a1f35] mb-4">Application Submitted!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for applying to {apartment.title}. Our team will review your application and contact you within 2-3 business days.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to={createPageUrl("Apartments")}>
              <Button variant="outline">View More Apartments</Button>
            </Link>
            <Link to={createPageUrl("Home")}>
              <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a]">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={createPageUrl("Apartments")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Apartments
          </Button>
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {apartment.images && apartment.images.length > 0 ? (
            <>
              <div className="md:col-span-2 h-96 rounded-2xl overflow-hidden">
                <img
                  src={apartment.images[0]}
                  alt={apartment.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {apartment.images.slice(1, 3).map((img, idx) => (
                <div key={idx} className="h-64 rounded-2xl overflow-hidden">
                  <img src={img} alt={`${apartment.title} ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </>
          ) : (
            <div className="md:col-span-2 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-gray-400 text-xl">No Images Available</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-[#1a1f35] mb-2">{apartment.title}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{apartment.address}</span>
                </div>
              </div>
              <Badge className={`text-lg px-4 py-2 ${
                apartment.status === 'available' ? 'bg-green-500' :
                apartment.status === 'pending' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}>
                {apartment.status}
              </Badge>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Bed className="w-8 h-8 text-[#ff6b35] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1a1f35]">{apartment.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Bath className="w-8 h-8 text-[#ff6b35] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1a1f35]">{apartment.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Square className="w-8 h-8 text-[#ff6b35] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#1a1f35]">{apartment.square_feet}</div>
                <div className="text-sm text-gray-600">Sq Ft</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-8 h-8 text-[#ff6b35] mx-auto mb-2" />
                <div className="text-sm font-bold text-[#1a1f35]">
                  {apartment.available_from ? format(new Date(apartment.available_from), 'MMM d') : 'Now'}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>

            {/* Description */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#1a1f35] mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{apartment.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {apartment.amenities && apartment.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#1a1f35] mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {apartment.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#ff6b35]" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-4xl font-bold text-[#ff6b35] mb-2">
                    <DollarSign className="w-8 h-8" />
                    {apartment.monthly_rent?.toLocaleString()}
                  </div>
                  <span className="text-gray-600">per month</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-semibold">${apartment.security_deposit?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lease Term</span>
                    <span className="font-semibold">{apartment.lease_term?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilities</span>
                    <span className="font-semibold">{apartment.utilities_included ? 'Included' : 'Not Included'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking</span>
                    <span className="font-semibold">{apartment.parking_available ? 'Available' : 'Not Available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pets</span>
                    <span className="font-semibold">{apartment.pets_allowed ? 'Allowed' : 'Not Allowed'}</span>
                  </div>
                </div>

                {apartment.status === 'available' && (
                  <Button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white h-12 text-lg rounded-xl"
                  >
                    Apply Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1a1f35]">Rental Application</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowApplicationForm(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      required
                      value={formData.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Employment Status *</Label>
                    <Select value={formData.employment_status} onValueChange={(value) => handleChange("employment_status", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self_employed">Self-Employed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Address</Label>
                  <Input
                    value={formData.current_address}
                    onChange={(e) => handleChange("current_address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Employer Name</Label>
                    <Input
                      value={formData.employer_name}
                      onChange={(e) => handleChange("employer_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Income</Label>
                    <Input
                      type="number"
                      value={formData.monthly_income}
                      onChange={(e) => handleChange("monthly_income", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Desired Move-in Date</Label>
                    <Input
                      type="date"
                      value={formData.desired_move_in_date}
                      onChange={(e) => handleChange("desired_move_in_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Occupants</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.number_of_occupants}
                      onChange={(e) => handleChange("number_of_occupants", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_pets"
                    checked={formData.has_pets}
                    onCheckedChange={(checked) => handleChange("has_pets", checked)}
                  />
                  <label htmlFor="has_pets" className="text-sm font-medium">
                    I have pets
                  </label>
                </div>

                {formData.has_pets && (
                  <div className="space-y-2">
                    <Label>Pet Details</Label>
                    <Textarea
                      value={formData.pet_details}
                      onChange={(e) => handleChange("pet_details", e.target.value)}
                      placeholder="Type, breed, weight, etc."
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={formData.additional_notes}
                    onChange={(e) => handleChange("additional_notes", e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createApplicationMutation.isPending}
                  className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-12"
                >
                  {createApplicationMutation.isPending ? "Submitting..." : (
                    <>
                      Submit Application
                      <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}