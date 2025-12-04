import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Calendar, User, Star } from "lucide-react";
import { format } from "date-fns";
import TaskManager from "./TaskManager";
import MilestoneTracker from "./MilestoneTracker";
import DocumentManager from "./DocumentManager";

export default function ProjectDetailsPanel({ project, onUpdate }) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', project.id],
    queryFn: () => base44.entities.Task.filter({ project_id: project.id }),
    initialData: []
  });

  const { data: milestones = [] } = useQuery({
    queryKey: ['milestones', project.id],
    queryFn: () => base44.entities.Milestone.filter({ project_id: project.id }),
    initialData: []
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents', project.id],
    queryFn: () => base44.entities.ProjectDocument.filter({ project_id: project.id }),
    initialData: []
  });

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              {project.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {project.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
              )}
              {project.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${project.budget?.toLocaleString()}
                </div>
              )}
              {project.completion_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(project.completion_date), 'MMM d, yyyy')}
                </div>
              )}
              {project.client_name && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {project.client_name}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="milestones">Milestones ({milestones.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {project.image_url && (
              <div className="rounded-xl overflow-hidden">
                <img src={project.image_url} alt={project.title} className="w-full h-64 object-cover" />
              </div>
            )}

            <div>
              <h3 className="font-semibold text-[#1a1f35] mb-2">Description</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <Badge variant="outline">{project.category}</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Tasks</p>
                  <p className="text-2xl font-bold text-[#1a1f35]">{completedTasks}/{tasks.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Progress</p>
                  <p className="text-2xl font-bold text-[#ff6b35]">{completionPercentage}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 mb-1">Documents</p>
                  <p className="text-2xl font-bold text-[#1a1f35]">{documents.length}</p>
                </CardContent>
              </Card>
            </div>

            {project.created_date && (
              <p className="text-sm text-gray-500">
                Created: {format(new Date(project.created_date), 'MMM d, yyyy')}
              </p>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <TaskManager project={project} />
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <MilestoneTracker project={project} />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <DocumentManager project={project} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}