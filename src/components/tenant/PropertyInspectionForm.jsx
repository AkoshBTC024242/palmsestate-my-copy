import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, CheckCircle2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PropertyInspectionForm({ lease, type = "move_in" }) {
  const [areas, setAreas] = useState([
    { area_name: "Living Room", condition: "", notes: "", photos: [] },
    { area_name: "Kitchen", condition: "", notes: "", photos: [] },
    { area_name: "Bedroom 1", condition: "", notes: "", photos: [] },
    { area_name: "Bathroom", condition: "", notes: "", photos: [] }
  ]);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const createInspectionMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.PropertyInspection.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      toast.success("Inspection report submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit inspection");
    }
  });

  const handlePhotoUpload = async (areaIndex, files) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file =>
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const photoUrls = results.map(r => r.file_url);
      
      setAreas(prev => {
        const newAreas = [...prev];
        newAreas[areaIndex].photos = [...newAreas[areaIndex].photos, ...photoUrls];
        return newAreas;
      });
      toast.success("Photos uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (areaIndex, photoIndex) => {
    setAreas(prev => {
      const newAreas = [...prev];
      newAreas[areaIndex].photos.splice(photoIndex, 1);
      return newAreas;
    });
  };

  const updateArea = (index, field, value) => {
    setAreas(prev => {
      const newAreas = [...prev];
      newAreas[index][field] = value;
      return newAreas;
    });
  };

  const addArea = () => {
    setAreas(prev => [...prev, { area_name: "", condition: "", notes: "", photos: [] }]);
  };

  const removeArea = (index) => {
    if (areas.length > 1) {
      setAreas(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const incompleteAreas = areas.filter(a => !a.condition);
    if (incompleteAreas.length > 0) {
      toast.error("Please set condition for all areas");
      return;
    }

    createInspectionMutation.mutate({
      lease_id: lease.id,
      apartment_id: lease.apartment_id,
      apartment_title: lease.apartment_title,
      tenant_email: lease.tenant_email,
      tenant_name: lease.tenant_name,
      inspection_type: type,
      inspection_date: new Date().toISOString().split('T')[0],
      inspector_name: lease.tenant_name,
      areas: areas,
      status: "completed"
    });
  };

  const conditionColors = {
    excellent: "bg-green-100 text-green-800 border-green-300",
    good: "bg-blue-100 text-blue-800 border-blue-300",
    fair: "bg-yellow-100 text-yellow-800 border-yellow-300",
    poor: "bg-orange-100 text-orange-800 border-orange-300",
    damaged: "bg-red-100 text-red-800 border-red-300"
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#ff6b35]/20">
        <CardHeader className="bg-gradient-to-r from-[#ff6b35]/10 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#ff6b35]" />
            {type === "move_in" ? "Move-In" : "Move-Out"} Inspection Report
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Document the current condition of the property with photos and notes
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {areas.map((area, areaIndex) => (
            <Card key={areaIndex} className="mb-4 border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Input
                    value={area.area_name}
                    onChange={(e) => updateArea(areaIndex, 'area_name', e.target.value)}
                    placeholder="Area name (e.g., Living Room)"
                    className="flex-1 mr-2 font-semibold"
                  />
                  {areas.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArea(areaIndex)}
                      className="text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Condition *</Label>
                    <Select
                      value={area.condition}
                      onValueChange={(value) => updateArea(areaIndex, 'condition', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                    {area.condition && (
                      <Badge className={`mt-2 ${conditionColors[area.condition]}`}>
                        {area.condition.charAt(0).toUpperCase() + area.condition.slice(1)}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={area.notes}
                      onChange={(e) => updateArea(areaIndex, 'notes', e.target.value)}
                      placeholder="Describe any issues or observations..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Photos</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(areaIndex, e.target.files)}
                        className="hidden"
                        id={`photo-upload-${areaIndex}`}
                        disabled={uploading}
                      />
                      <label
                        htmlFor={`photo-upload-${areaIndex}`}
                        className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {uploading ? "Uploading..." : "Upload photos"}
                        </span>
                      </label>
                    </div>
                    
                    {area.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {area.photos.map((photo, photoIndex) => (
                          <div key={photoIndex} className="relative group">
                            <img
                              src={photo}
                              alt={`${area.area_name} photo ${photoIndex + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(areaIndex, photoIndex)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addArea}
            className="w-full mb-6"
          >
            + Add Another Area
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={createInspectionMutation.isPending || uploading}
            className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 text-lg"
          >
            {createInspectionMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Submit Inspection Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}