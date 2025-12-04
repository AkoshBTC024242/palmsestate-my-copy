import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Send, Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function Quote() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    project_type: "",
    project_description: "",
    budget_range: "",
    timeline: "",
    property_address: "",
    property_size: "",
    permits_required: false,
    financing_needed: false,
    preferred_start_date: "",
    preferred_contact_method: "email"
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const createQuoteMutation = useMutation({
    mutationFn: (data) => base44.entities.QuoteRequest.create(data),
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Quote request submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit quote request. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      project_description: `${formData.project_description}\n\nAdditional Details:\n- Property Address: ${formData.property_address || 'N/A'}\n- Property Size: ${formData.property_size || 'N/A'}\n- Permits Required: ${formData.permits_required ? 'Yes' : 'No'}\n- Financing Needed: ${formData.financing_needed ? 'Yes' : 'No'}\n- Preferred Start Date: ${formData.preferred_start_date || 'N/A'}\n- Preferred Contact: ${formData.preferred_contact_method}\n- Uploaded Files: ${uploadedFiles.length > 0 ? uploadedFiles.map(f => f.url).join(', ') : 'None'}`
    };
    createQuoteMutation.mutate(dataToSubmit);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        return { name: file.name, url: file_url };
      });
      
      const uploadedFileData = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...uploadedFileData]);
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload files");
    }
    setUploading(false);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-0 shadow-2xl">
          <CardContent className="text-center pt-12 pb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#1a1f35] mb-4">Request Received!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your interest in Premier Construction. Our team will review your detailed request and get back to you within 24-48 hours with a comprehensive quote.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  full_name: "",
                  email: "",
                  phone: "",
                  project_type: "",
                  project_description: "",
                  budget_range: "",
                  timeline: "",
                  property_address: "",
                  property_size: "",
                  permits_required: false,
                  financing_needed: false,
                  preferred_start_date: "",
                  preferred_contact_method: "email"
                });
                setUploadedFiles([]);
              }}
              variant="outline"
              className="border-2 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white rounded-xl"
            >
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Get a Free Quote</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tell us about your construction project and we'll provide a detailed, professional estimate tailored to your needs
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1f35] mb-2">Project Details</h2>
                <p className="text-gray-600">Please fill out the form below with as much detail as possible</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1a1f35] border-b pb-2">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-[#1a1f35] font-medium">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleChange("full_name", e.target.value)}
                        required
                        className="h-12 rounded-xl border-gray-300 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#1a1f35] font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        className="h-12 rounded-xl border-gray-300 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#1a1f35] font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                        className="h-12 rounded-xl border-gray-300 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                        placeholder="(123) 456-7890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferred_contact_method" className="text-[#1a1f35] font-medium">Preferred Contact Method</Label>
                      <Select value={formData.preferred_contact_method} onValueChange={(value) => handleChange("preferred_contact_method", value)}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="text">Text Message</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1a1f35] border-b pb-2">Project Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project_type" className="text-[#1a1f35] font-medium">Project Type *</Label>
                      <Select value={formData.project_type} onValueChange={(value) => handleChange("project_type", value)} required>
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential Construction</SelectItem>
                          <SelectItem value="commercial">Commercial Building</SelectItem>
                          <SelectItem value="industrial">Industrial Construction</SelectItem>
                          <SelectItem value="renovation">Renovation & Remodeling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget_range" className="text-[#1a1f35] font-medium">Budget Range</Label>
                      <Select value={formData.budget_range} onValueChange={(value) => handleChange("budget_range", value)}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under_50k">Under $50,000</SelectItem>
                          <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k_250k">$100,000 - $250,000</SelectItem>
                          <SelectItem value="250k_500k">$250,000 - $500,000</SelectItem>
                          <SelectItem value="over_500k">Over $500,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property_address" className="text-[#1a1f35] font-medium">Property Address</Label>
                      <Input
                        id="property_address"
                        value={formData.property_address}
                        onChange={(e) => handleChange("property_address", e.target.value)}
                        className="h-12 rounded-xl border-gray-300 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                        placeholder="123 Main St, City, State"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property_size" className="text-[#1a1f35] font-medium">Property Size (sq ft)</Label>
                      <Input
                        id="property_size"
                        value={formData.property_size}
                        onChange={(e) => handleChange("property_size", e.target.value)}
                        className="h-12 rounded-xl border-gray-300 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                        placeholder="e.g., 2500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-[#1a1f35] font-medium">Expected Timeline</Label>
                      <Input
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) => handleChange("timeline", e.target.value)}
                        className="h-12 rounded-xl border-gray-300 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                        placeholder="e.g., 3-6 months"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferred_start_date" className="text-[#1a1f35] font-medium">Preferred Start Date</Label>
                      <Input
                        id="preferred_start_date"
                        type="date"
                        value={formData.preferred_start_date}
                        onChange={(e) => handleChange("preferred_start_date", e.target.value)}
                        className="h-12 rounded-xl border-gray-300 focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_description" className="text-[#1a1f35] font-medium">Project Description *</Label>
                    <Textarea
                      id="project_description"
                      value={formData.project_description}
                      onChange={(e) => handleChange("project_description", e.target.value)}
                      required
                      rows={6}
                      className="rounded-xl border-gray-300 focus:border-[#ff6b35] focus:ring-[#ff6b35] resize-none"
                      placeholder="Please describe your project in detail... Include information about what you're looking to build, any specific requirements, materials preferences, etc."
                    />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1a1f35] border-b pb-2">Additional Requirements</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="permits_required"
                        checked={formData.permits_required}
                        onCheckedChange={(checked) => handleChange("permits_required", checked)}
                      />
                      <label
                        htmlFor="permits_required"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I need assistance with permits and approvals
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="financing_needed"
                        checked={formData.financing_needed}
                        onCheckedChange={(checked) => handleChange("financing_needed", checked)}
                      />
                      <label
                        htmlFor="financing_needed"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I'm interested in financing options
                      </label>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1a1f35] border-b pb-2">Attachments (Optional)</h3>
                  <p className="text-sm text-gray-600">Upload plans, sketches, photos, or any relevant documents</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#ff6b35] transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">Click to upload files</p>
                      <p className="text-sm text-gray-400">PDF, Images, Documents (Max 10MB each)</p>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={createQuoteMutation.isPending || uploading}
                  className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {createQuoteMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Request
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to be contacted by Premier Construction regarding your project.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}