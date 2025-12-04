import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Eye, FileText, Calendar, User, Home } from "lucide-react";
import { format } from "date-fns";

export default function InspectionManager() {
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: inspections = [], isLoading } = useQuery({
    queryKey: ['property-inspections'],
    queryFn: () => base44.entities.PropertyInspection.list('-created_date'),
    initialData: []
  });

  const typeColors = {
    move_in: "bg-green-100 text-green-800",
    move_out: "bg-orange-100 text-orange-800",
    routine: "bg-blue-100 text-blue-800"
  };

  const conditionColors = {
    excellent: "bg-green-500",
    good: "bg-blue-500",
    fair: "bg-yellow-500",
    poor: "bg-orange-500",
    damaged: "bg-red-500"
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">
              {inspections.filter(i => i.inspection_type === 'move_in').length}
            </div>
            <div className="text-sm text-gray-600">Move-In Inspections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-orange-600">
              {inspections.filter(i => i.inspection_type === 'move_out').length}
            </div>
            <div className="text-sm text-gray-600">Move-Out Inspections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600">{inspections.length}</div>
            <div className="text-sm text-gray-600">Total Inspections</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#ff6b35]" />
            Property Inspections
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : inspections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No inspections yet</div>
          ) : (
            <div className="space-y-4">
              {inspections.map((inspection) => (
                <Card key={inspection.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{inspection.apartment_title}</h4>
                          <Badge className={typeColors[inspection.inspection_type]}>
                            {inspection.inspection_type.replace('_', '-')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {inspection.tenant_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(inspection.inspection_date), 'MMM d, yyyy')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {inspection.areas?.length || 0} areas inspected
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {inspection.areas?.reduce((acc, area) => acc + (area.photos?.length || 0), 0) || 0} photos
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedInspection(inspection);
                          setShowModal(true);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedInspection && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Inspection Report</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Property</p>
                  <p className="font-semibold">{selectedInspection.apartment_title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tenant</p>
                  <p className="font-semibold">{selectedInspection.tenant_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inspection Type</p>
                  <Badge className={typeColors[selectedInspection.inspection_type]}>
                    {selectedInspection.inspection_type.replace('_', '-')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">
                    {format(new Date(selectedInspection.inspection_date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Inspected Areas</h3>
                <div className="space-y-4">
                  {selectedInspection.areas?.map((area, idx) => (
                    <Card key={idx} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-lg">{area.area_name}</h4>
                          <Badge className={`${conditionColors[area.condition]} text-white`}>
                            {area.condition}
                          </Badge>
                        </div>
                        {area.notes && (
                          <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                            {area.notes}
                          </p>
                        )}
                        {area.photos?.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {area.photos.map((photo, photoIdx) => (
                              <a
                                key={photoIdx}
                                href={photo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img
                                  src={photo}
                                  alt={`${area.area_name} photo ${photoIdx + 1}`}
                                  className="w-full h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}