import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    client_name: "",
    budget: "",
    completion_date: "",
    featured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const createProjectMutation = useMutation({
    mutationFn: async (data) => {
      let image_url = "";
      if (imageFile) {
        setUploading(true);
        const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
        image_url = file_url;
        setUploading(false);
      }
      return base44.entities.Project.create({ ...data, image_url });
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to create project");
      setUploading(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : undefined
    };
    createProjectMutation.mutate(dataToSubmit);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a1f35]">Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              placeholder="Downtown Office Building"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              rows={4}
              placeholder="Detailed project description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleChange("client_name", e.target.value)}
                placeholder="Client or Company Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                placeholder="500000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="completion_date">Target Completion Date</Label>
            <Input
              id="completion_date"
              type="date"
              value={formData.completion_date}
              onChange={(e) => handleChange("completion_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Project Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
                id="image-upload"
              />
              {imageFile ? (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm">{imageFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImageFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload project image</p>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createProjectMutation.isPending || uploading}
              className="flex-1 bg-[#ff6b35] hover:bg-[#ff8c5a] h-12"
            >
              {createProjectMutation.isPending || uploading ? "Creating..." : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}