import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Star } from "lucide-react";
import { format } from "date-fns";
import CreateProjectModal from "../components/admin/CreateProjectModal";
import ProjectDetailsPanel from "../components/admin/ProjectDetailsPanel";

export default function AdminProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
    initialData: []
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }) => base44.entities.Project.update(id, { featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    }
  });

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFeatured = (project) => {
    toggleFeaturedMutation.mutate({ id: project.id, featured: !project.featured });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1f35] mb-2">Project Management</h1>
            <p className="text-gray-600">Manage construction projects, tasks, and milestones</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>All Projects ({projects.length})</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-6 text-center text-gray-500">Loading...</div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No projects found</div>
                  ) : (
                    <div className="divide-y">
                      {filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedProject?.id === project.id ? 'bg-blue-50 border-l-4 border-[#ff6b35]' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-[#1a1f35] mb-1 truncate">{project.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {project.category}
                                </Badge>
                                {project.featured && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              {project.location && (
                                <p className="text-xs text-gray-500 mt-1">{project.location}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFeatured(project);
                              }}
                              className="flex-shrink-0"
                            >
                              <Star className={`w-4 h-4 ${project.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <ProjectDetailsPanel 
                project={selectedProject}
                onUpdate={() => {
                  queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
                }}
              />
            ) : (
              <Card className="border-0 shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a project to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
          }}
        />
      )}
    </div>
  );
}