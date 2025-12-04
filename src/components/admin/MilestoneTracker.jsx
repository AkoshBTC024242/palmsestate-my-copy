import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Flag, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MilestoneTracker({ project }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_date: "",
    status: "upcoming",
    progress_percentage: 0
  });

  const queryClient = useQueryClient();

  const { data: milestones = [] } = useQuery({
    queryKey: ['milestones', project.id],
    queryFn: () => base44.entities.Milestone.filter({ project_id: project.id }, 'target_date'),
    initialData: []
  });

  const createMilestoneMutation = useMutation({
    mutationFn: (data) => base44.entities.Milestone.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', project.id] });
      resetForm();
      toast.success("Milestone created");
    }
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Milestone.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', project.id] });
      toast.success("Milestone updated");
    }
  });

  const deleteMilestoneMutation = useMutation({
    mutationFn: (id) => base44.entities.Milestone.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', project.id] });
      toast.success("Milestone deleted");
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      target_date: "",
      status: "upcoming",
      progress_percentage: 0
    });
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMilestoneMutation.mutate({
      ...formData,
      project_id: project.id,
      project_title: project.title,
      progress_percentage: parseInt(formData.progress_percentage)
    });
  };

  const statusColors = {
    upcoming: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    delayed: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Milestones</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add Milestone"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label>Milestone Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Foundation Complete"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Milestone details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Target Date *</Label>
                  <Input
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Progress ({formData.progress_percentage}%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress_percentage}
                  onChange={(e) => setFormData({...formData, progress_percentage: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a]">
                Create Milestone
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No milestones set. Add one to track progress.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative pl-12 pb-8">
                <div className="absolute left-0 top-1.5 w-8 h-8 bg-white border-2 border-[#ff6b35] rounded-full flex items-center justify-center">
                  {milestone.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Flag className="w-4 h-4 text-[#ff6b35]" />
                  )}
                </div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#1a1f35] mb-1">{milestone.title}</h4>
                        {milestone.description && (
                          <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className={statusColors[milestone.status]}>{milestone.status}</Badge>
                          <span className="text-gray-500">
                            Target: {format(new Date(milestone.target_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMilestoneMutation.mutate(milestone.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{milestone.progress_percentage || 0}%</span>
                      </div>
                      <Progress value={milestone.progress_percentage || 0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}