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
import { Plus, Trash2, FileText, Download, Upload as UploadIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function DocumentManager({ project }) {
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other"
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const queryClient = useQueryClient();

  const { data: documents = [] } = useQuery({
    queryKey: ['documents', project.id],
    queryFn: () => base44.entities.ProjectDocument.filter({ project_id: project.id }, '-created_date'),
    initialData: []
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (data) => {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
      const docData = {
        ...data,
        file_url,
        file_type: selectedFile.name.split('.').pop(),
        project_id: project.id,
        project_title: project.title
      };
      setUploading(false);
      return base44.entities.ProjectDocument.create(docData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', project.id] });
      resetForm();
      toast.success("Document uploaded");
    },
    onError: () => {
      setUploading(false);
      toast.error("Upload failed");
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (id) => base44.entities.ProjectDocument.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', project.id] });
      toast.success("Document deleted");
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "other"
    });
    setSelectedFile(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    createDocumentMutation.mutate(formData);
  };

  const categoryColors = {
    contract: "bg-purple-100 text-purple-800",
    blueprint: "bg-blue-100 text-blue-800",
    permit: "bg-green-100 text-green-800",
    invoice: "bg-yellow-100 text-yellow-800",
    photo: "bg-pink-100 text-pink-800",
    report: "bg-indigo-100 text-indigo-800",
    other: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Upload Document"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label>Document Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Contract Agreement"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  placeholder="Document details..."
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="blueprint">Blueprint</SelectItem>
                    <SelectItem value="permit">Permit</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>File *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="doc-upload"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{selectedFile.name}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                      <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to select file</p>
                    </label>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a]"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {documents.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No documents uploaded yet.</p>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#1a1f35] mb-1">{doc.title}</h4>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={categoryColors[doc.category]}>{doc.category}</Badge>
                        <Badge variant="outline">{doc.file_type}</Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(doc.created_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(doc.file_url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteDocumentMutation.mutate(doc.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
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