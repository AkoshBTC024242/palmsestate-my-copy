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
import { Plus, Trash2, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function TaskManager({ project }) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    status: "pending",
    priority: "medium",
    due_date: ""
  });

  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', project.id],
    queryFn: () => base44.entities.Task.filter({ project_id: project.id }, '-created_date'),
    initialData: []
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
      resetForm();
      toast.success("Task created");
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
      resetForm();
      toast.success("Task updated");
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
      toast.success("Task deleted");
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assigned_to: "",
      status: "pending",
      priority: "medium",
      due_date: ""
    });
    setShowForm(false);
    setEditingTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      project_id: project.id,
      project_title: project.title
    };

    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data: dataToSubmit });
    } else {
      createTaskMutation.mutate(dataToSubmit);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      assigned_to: task.assigned_to || "",
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || ""
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const statusIcons = {
    pending: Circle,
    in_progress: Clock,
    completed: CheckCircle2,
    blocked: AlertCircle
  };

  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    blocked: "bg-red-100 text-red-800"
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add Task"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label>Task Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Task name"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Task details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <Input
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                    placeholder="Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a]">
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tasks yet. Create one to get started.</p>
        ) : (
          tasks.map((task) => {
            const StatusIcon = statusIcons[task.status];
            return (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className="w-5 h-5 flex-shrink-0" />
                        <h4 className="font-medium text-[#1a1f35]">{task.title}</h4>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={statusColors[task.status]}>{task.status}</Badge>
                        <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                        {task.assigned_to && (
                          <Badge variant="outline">{task.assigned_to}</Badge>
                        )}
                        {task.due_date && (
                          <Badge variant="outline">{format(new Date(task.due_date), 'MMM d')}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTaskMutation.mutate(task.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}