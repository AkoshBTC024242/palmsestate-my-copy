import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import AIDescriptionGenerator from "../components/admin/AIDescriptionGenerator";

export default function AdminApartments() {
  const [showModal, setShowModal] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    size_sqft: 500,
    monthly_rent: 1000,
    security_deposit: 0,
    application_fee: 85,
    location: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    county: "",
    images: [],
    virtual_tour_url: "",
    amenities: [],
    available: true,
    available_from: "",
    parking: false,
    pets_allowed: false,
    furnishing: "unfurnished"
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");

  const queryClient = useQueryClient();

  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ['admin-apartments'],
    queryFn: () => base44.entities.Apartment.list('-created_date'),
    initialData: []
  });

  const createApartmentMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Creating apartment with data:', data);
      let image_urls = [];
      if (imageFiles.length > 0) {
        console.log('Uploading images...');
        setUploading(true);
        const uploadPromises = imageFiles.map(file => 
          base44.integrations.Core.UploadFile({ file })
        );
        const results = await Promise.all(uploadPromises);
        image_urls = results.map(r => r.file_url);
        setUploading(false);
        console.log('Images uploaded:', image_urls);
      }
      const result = await base44.entities.Apartment.create({ ...data, images: image_urls });
      console.log('Apartment created:', result);
      return result;
    },
    onSuccess: () => {
      console.log('Create success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['admin-apartments'] });
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
      resetForm();
      toast.success("Apartment created successfully!");
    },
    onError: (error) => {
      console.error('Create error:', error);
      setUploading(false);
      toast.error("Failed to create apartment");
    }
  });

  const updateApartmentMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      let image_urls = [...(editingApartment?.images || [])];
      if (imageFiles.length > 0) {
        setUploading(true);
        const uploadPromises = imageFiles.map(file => 
          base44.integrations.Core.UploadFile({ file })
        );
        const results = await Promise.all(uploadPromises);
        image_urls = [...image_urls, ...results.map(r => r.file_url)];
        setUploading(false);
      }
      return base44.entities.Apartment.update(id, { ...data, images: image_urls });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-apartments'] });
      resetForm();
      toast.success("Apartment updated");
    },
    onError: () => {
      setUploading(false);
      toast.error("Failed to update apartment");
    }
  });

  const deleteApartmentMutation = useMutation({
    mutationFn: (id) => base44.entities.Apartment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-apartments'] });
      toast.success("Apartment deleted");
    }
  });

  const resetForm = () => {
    console.log('Resetting form');
    setFormData({
      title: "",
      description: "",
      bedrooms: 1,
      bathrooms: 1,
      size_sqft: 500,
      monthly_rent: 1000,
      security_deposit: 0,
      application_fee: 85,
      location: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      county: "",
      images: [],
      virtual_tour_url: "",
      amenities: [],
      available: true,
      available_from: "",
      parking: false,
      pets_allowed: false,
      furnishing: "unfurnished"
    });
    setImageFiles([]);
    setAmenityInput("");
    setShowModal(false);
    setEditingApartment(null);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted, formData:', formData);
    
    if (!formData.title || !formData.description || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const dataToSubmit = {
      title: formData.title,
      description: formData.description,
      bedrooms: parseInt(formData.bedrooms) || 1,
      bathrooms: parseFloat(formData.bathrooms) || 1,
      size_sqft: parseInt(formData.size_sqft) || 500,
      monthly_rent: parseFloat(formData.monthly_rent) || 1000,
      security_deposit: parseFloat(formData.security_deposit) || 0,
      application_fee: parseFloat(formData.application_fee) || 85,
      location: formData.location,
      address: formData.address || "",
      city: formData.city || "",
      state: formData.state || "",
      zip_code: formData.zip_code || "",
      county: formData.county || "",
      virtual_tour_url: formData.virtual_tour_url || "",
      amenities: formData.amenities || [],
      available: formData.available,
      available_from: formData.available_from || "",
      parking: formData.parking || false,
      pets_allowed: formData.pets_allowed || false,
      furnishing: formData.furnishing || "unfurnished"
    };

    console.log('Submitting data:', dataToSubmit);

    if (editingApartment) {
      console.log('Updating apartment:', editingApartment.id);
      updateApartmentMutation.mutate({ id: editingApartment.id, data: dataToSubmit });
    } else {
      console.log('Creating new apartment');
      createApartmentMutation.mutate(dataToSubmit);
    }
  };

  const handleEdit = (apartment) => {
    setEditingApartment(apartment);
    setFormData({
      title: apartment.title,
      description: apartment.description || "",
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      size_sqft: apartment.size_sqft,
      monthly_rent: apartment.monthly_rent,
      security_deposit: apartment.security_deposit || 0,
      application_fee: apartment.application_fee || 85,
      location: apartment.location,
      address: apartment.address || "",
      city: apartment.city || "",
      state: apartment.state || "",
      zip_code: apartment.zip_code || "",
      county: apartment.county || "",
      images: apartment.images || [],
      virtual_tour_url: apartment.virtual_tour_url || "",
      amenities: apartment.amenities || [],
      available: apartment.available,
      available_from: apartment.available_from || "",
      parking: apartment.parking || false,
      pets_allowed: apartment.pets_allowed || false,
      furnishing: apartment.furnishing || "unfurnished"
    });
    setShowModal(true);
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenityInput.trim()] });
      setAmenityInput("");
    }
  };

  const removeAmenity = (index) => {
    setFormData({ ...formData, amenities: formData.amenities.filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1f35] mb-2">Manage Apartments</h1>
            <p className="text-gray-600">Add and manage your rental properties</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Apartment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="col-span-3 text-center py-12 text-gray-500">Loading...</p>
          ) : apartments.length === 0 ? (
            <p className="col-span-3 text-center py-12 text-gray-500">No apartments yet. Add one to get started.</p>
          ) : (
            apartments.map((apt) => (
              <Card key={apt.id} className="border-0 shadow-lg">
                <div className="relative h-48">
                  <img
                    src={apt.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"}
                    alt={apt.title}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                  <Badge className={`absolute top-3 right-3 ${apt.available ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {apt.available ? 'Available' : 'Rented'}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#1a1f35] mb-2">{apt.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{apt.description}</p>
                  <p className="text-2xl font-bold text-[#ff6b35] mb-3">
                    ${apt.monthly_rent?.toLocaleString()}/mo
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant={apt.available ? "outline" : "default"}
                      onClick={() => {
                        updateApartmentMutation.mutate({
                          id: apt.id,
                          data: { ...apt, available: !apt.available }
                        });
                      }}
                      className={apt.available ? "text-gray-600" : "bg-green-600 hover:bg-green-700 text-white"}
                    >
                      {apt.available ? 'Mark as Rented' : 'Back to Listing'}
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(apt)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteApartmentMutation.mutate(apt.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={() => !uploading && resetForm()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingApartment ? 'Edit' : 'Add'} Apartment</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Modern 2BR Apartment"
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <AIDescriptionGenerator
                apartmentData={formData}
                onDescriptionGenerated={(desc) => setFormData({ ...formData, description: desc })}
              />
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
                placeholder="Spacious apartment with... (or use AI to generate)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bedrooms *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Bathrooms *</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size (sqft) *</Label>
                <Input
                  type="number"
                  value={formData.size_sqft}
                  onChange={(e) => setFormData({...formData, size_sqft: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent ($) *</Label>
                <Input
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({...formData, monthly_rent: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Security Deposit ($)</Label>
                <Input
                  type="number"
                  value={formData.security_deposit}
                  onChange={(e) => setFormData({...formData, security_deposit: e.target.value})}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">Leave 0 if no deposit required</p>
              </div>
              <div className="space-y-2">
                <Label>Application Fee ($)</Label>
                <Input
                  type="number"
                  value={formData.application_fee}
                  onChange={(e) => setFormData({...formData, application_fee: e.target.value})}
                  placeholder="85"
                />
                <p className="text-xs text-gray-500">Default is $85</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                placeholder="Downtown"
              />
            </div>

            <div className="space-y-2">
              <Label>Full Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 Main St"
              />
            </div>

            <div className="space-y-2">
              <Label>Virtual Tour URL (YouTube/Matterport)</Label>
              <Input
                value={formData.virtual_tour_url}
                onChange={(e) => setFormData({...formData, virtual_tour_url: e.target.value})}
                placeholder="https://youtube.com/... or https://matterport.com/..."
              />
              <p className="text-xs text-gray-500">Add a YouTube video or Matterport 3D tour link</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Charlotte"
                />
              </div>
              <div className="space-y-2">
                <Label>County</Label>
                <Input
                  value={formData.county}
                  onChange={(e) => setFormData({...formData, county: e.target.value})}
                  placeholder="Mecklenburg"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  placeholder="NC"
                />
              </div>
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input
                  value={formData.zip_code}
                  onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                  placeholder="28202"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Available *</Label>
                <Select value={formData.available.toString()} onValueChange={(v) => setFormData({...formData, available: v === 'true'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Parking</Label>
                <Select value={formData.parking.toString()} onValueChange={(v) => setFormData({...formData, parking: v === 'true'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pets Allowed</Label>
                <Select value={formData.pets_allowed.toString()} onValueChange={(v) => setFormData({...formData, pets_allowed: v === 'true'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="flex gap-2">
                <Input
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="e.g., Pool, Gym"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity}>Add</Button>
              </div>
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((amenity, idx) => (
                    <Badge key={idx} variant="outline" className="flex items-center gap-1">
                      {amenity}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeAmenity(idx)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer border-2 border-dashed p-4 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 mr-2" />
                {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to upload images'}
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={uploading || createApartmentMutation.isPending || updateApartmentMutation.isPending}
                className="flex-1 bg-[#ff6b35] hover:bg-[#ff8c5a]"
              >
                {uploading ? 'Uploading...' : editingApartment ? 'Update' : 'Create'} Apartment
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}