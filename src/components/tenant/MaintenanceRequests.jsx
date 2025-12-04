import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MaintenanceRequests({ userEmail, userName }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    apartment_id: "",
    apartment_title: ""
  });

  const queryClient = useQueryClient();

  const { data: apartments = [] } = useQuery({
    queryKey: ['tenant-apartments', userEmail],
    queryFn: async () => {
      const leases = await base44.entities.LeaseAgreement.filter({ 
        tenant_email: userEmail,
        status: { $in: ['signed', 'active'] }
      });
      return leases.map(l => ({ id: l.apartment_id, title: l.apartment_title }));
    },
    initialData: []
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['tenant-maintenance', userEmail],
    queryFn: () => base44.entities.MaintenanceRequest.filter({ tenant_email: userEmail }, '-created_date'),
    initialData: []
  });

  const createRequestMutation = useMutation({
    mutationFn: (data) => base44.entities.MaintenanceRequest.create({
      ...data,
      tenant_email: userEmail,
      tenant_name: userName
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tenant-maintenance']);
      toast.success("Maintenance request submitted!");
      setShowForm(false);
      setFormData({ title: "", description: "", category: "", priority: "medium", apartment_id: "", apartment_title: "" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedApt = apartments.find(a => a.id === formData.apartment_id);
    createRequestMutation.mutate({
      ...formData,
      apartment_title: selectedApt?.title || ""
    });
  };

  const statusColors = {
    submitted: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    scheduled: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800"
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    emergency: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Maintenance Requests</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Maintenance Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Property *</Label>
                <Select
                  value={formData.apartment_id}
                  onValueChange={(value) => setFormData({ ...formData, apartment_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map(apt => (
                      <SelectItem key={apt.id} value={apt.id}>{apt.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="pest_control">Pest Control</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about the maintenance issue"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createRequestMutation.isPending} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                  {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No maintenance requests yet</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{request.apartment_title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={statusColors[request.status]}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={priorityColors[request.priority]}>
                      {request.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Wrench className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-gray-600">{request.category.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-gray-600">{request.description}</p>
                  </div>

                  {request.scheduled_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[#ff6b35]" />
                      <span className="font-medium">Scheduled:</span>
                      <span>{format(new Date(request.scheduled_date), 'MMM d, yyyy')}</span>
                    </div>
                  )}

                  {request.admin_notes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Management Notes:</p>
                      <p className="text-sm text-blue-800">{request.admin_notes}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Submitted {format(new Date(request.created_date), 'MMM d, yyyy')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}