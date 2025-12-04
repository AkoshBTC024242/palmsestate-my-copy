import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, TrendingUp, Users, Shield, CheckCircle2, Home } from "lucide-react";
import { toast } from "sonner";

export default function PropertyOwners() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    owner_name: "",
    email: "",
    phone: "",
    property_address: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    inquiry_type: "",
    expected_rent: "",
    message: ""
  });

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.PropertyOwnerInquiry.create(data);
      
      // Send email to admin
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Real Estate",
        to: "devbreed@hotmail.com",
        subject: "New Property Owner Inquiry",
        body: `New property owner inquiry received:

Owner: ${data.owner_name}
Email: ${data.email}
Phone: ${data.phone}
Property: ${data.property_address}
Type: ${data.property_type}
Bedrooms: ${data.bedrooms || 'N/A'}
Bathrooms: ${data.bathrooms || 'N/A'}
Service Needed: ${data.inquiry_type}
Expected Rent: ${data.expected_rent ? '$' + data.expected_rent : 'N/A'}

Message:
${data.message || 'No additional message'}

Please follow up with this property owner.`
      });

      // Confirmation to owner
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Real Estate",
        to: data.email,
        subject: "We Received Your Property Management Inquiry",
        body: `Dear ${data.owner_name},

Thank you for your interest in our property management and rental marketing services!

We have received your inquiry about your property at ${data.property_address}.

Our team will review your information and contact you within 24-48 hours to discuss how we can help you maximize your rental income and manage your property professionally.

Best regards,
Palms Real Estate Team
Phone: (828) 623-9765
Email: devbreed@hotmail.com`
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Inquiry submitted successfully!");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const services = [
    {
      icon: Building2,
      title: "Full Property Management",
      description: "Complete management of your rental property including tenant screening, maintenance, and rent collection"
    },
    {
      icon: TrendingUp,
      title: "Rental Marketing",
      description: "Professional marketing services to find quality tenants quickly and maximize your rental income"
    },
    {
      icon: Users,
      title: "Tenant Relations",
      description: "Handle all tenant communications, requests, and issues professionally"
    },
    {
      icon: Shield,
      title: "Legal Compliance",
      description: "Ensure your property meets all legal requirements and lease agreements are properly executed"
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center shadow-xl">
            <CardContent className="p-12">
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-[#1a1f35] mb-4">Inquiry Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest. Our team will contact you within 24-48 hours to discuss your property management needs.
              </p>
              <Button onClick={() => window.location.href = createPageUrl("Home")} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Property Owners</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Looking for professional property management or help marketing your rental? We're here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <service.icon className="w-12 h-12 text-[#ff6b35] mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <p className="text-gray-600">Tell us about your property and we'll get in touch</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Your Name *</Label>
                    <Input
                      required
                      value={formData.owner_name}
                      onChange={(e) => setFormData({...formData, owner_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Address *</Label>
                    <Input
                      required
                      value={formData.property_address}
                      onChange={(e) => setFormData({...formData, property_address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Type *</Label>
                    <Select value={formData.property_type} onValueChange={(value) => setFormData({...formData, property_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single_family">Single Family Home</SelectItem>
                        <SelectItem value="multi_family">Multi-Family</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="apartment_building">Apartment Building</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Service Needed *</Label>
                    <Select value={formData.inquiry_type} onValueChange={(value) => setFormData({...formData, inquiry_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="property_management">Property Management</SelectItem>
                        <SelectItem value="rental_marketing">Rental Marketing</SelectItem>
                        <SelectItem value="both">Both Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Monthly Rent</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 1500"
                      value={formData.expected_rent}
                      onChange={(e) => setFormData({...formData, expected_rent: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Information</Label>
                  <Textarea
                    rows={4}
                    placeholder="Tell us more about your property and what you're looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white text-lg py-6"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}