import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MaintenanceRequestForm({ user, activeLease, requests }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    priority: "medium",
    title: "",
    description: ""
  });

  const queryClient = useQueryClient();

  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.MaintenanceRequest.create(data);
      await base44.integrations.Core.SendEmail({
        to: "devbreed@hotmail.com",
        subject: `New Maintenance Request - ${data.title}`,
        body: `
New maintenance request from ${data.tenant_name}

Property: ${data.apartment_title}
Category: ${data.category}
Priority: ${data.priority}
Title: ${data.title}

Description:
${data.description}

Please review and respond promptly.
        `
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-maintenance'] });
      toast.success("Maintenance request submitted!");
      setShowForm(false);
      setFormData({ category: "", priority: "medium", title: "", description: "" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeLease) {
      toast.error("No active lease found");
      return;
    }
    createRequestMutation.mutate({
      ...formData,
      tenant_email: user?.email,
      tenant_name: user?.full_name,
      apartment_id: activeLease.apartment_id,
      apartment_title: activeLease.apartment_title
    });
  };

  const statusConfig = {
    submitted: { color: "bg-blue-500", icon: Clock, label: "Submitted" },
    in_progress: { color: "bg-yellow-500", icon: Wrench, label: "In Progress" },
    scheduled: { color: "bg-purple-500", icon: Clock, label: "Scheduled" },
    completed: { color: "bg-green-500", icon: CheckCircle2, label: "Completed" },
    cancelled: { color: "bg-gray-500", icon: AlertCircle, label: "Cancelled" }
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    emergency: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      {!activeLease && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">You need an active lease to submit maintenance requests.</p>
        </div>
      )}

      {activeLease && (
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Maintenance Request
        </Button>
      )}

      {showForm && (
        <Card className="border-2 border-[#ff6b35]">
          <CardHeader>
            <CardTitle>Submit Maintenance Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="appliance">Appliance</SelectItem>
                      <SelectItem value="structural">Structural</SelectItem>
                      <SelectItem value="pest_control">Pest Control</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(val) => setFormData({...formData, priority: val})}>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide detailed information about the maintenance issue"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
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
        <h3 className="text-lg font-semibold">Your Requests</h3>
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No maintenance requests yet</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;

            return (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-[#1a1f35]">{request.title}</h4>
                      <p className="text-sm text-gray-600">{request.apartment_title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${status.color} text-white flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                      <Badge className={priorityColors[request.priority]}>
                        {request.priority}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{request.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Category:</span> {request.category}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {format(new Date(request.created_date), 'MMM d, yyyy')}
                    </div>
                    {request.scheduled_date && (
                      <div>
                        <span className="font-medium">Scheduled:</span> {format(new Date(request.scheduled_date), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>

                  {request.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes:</p>
                      <p className="text-sm text-gray-600">{request.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}