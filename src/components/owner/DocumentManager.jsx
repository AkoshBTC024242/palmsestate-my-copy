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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Upload, Trash2, Download, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function DocumentManager({ userEmail }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    is_private: true
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['owner-documents', userEmail],
    queryFn: () => base44.entities.OwnerDocument.filter({ owner_email: userEmail }, '-created_date'),
    initialData: []
  });

  const uploadMutation = useMutation({
    mutationFn: async (data) => {
      setUploading(true);
      const uploadResult = await base44.integrations.Core.UploadFile({ file: data.file });
      const fileType = data.file.name.split('.').pop();
      
      return base44.entities.OwnerDocument.create({
        owner_email: userEmail,
        title: data.title,
        description: data.description,
        category: data.category,
        is_private: data.is_private,
        file_url: uploadResult.file_url,
        file_type: fileType
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-documents', userEmail] });
      setShowUploadModal(false);
      resetForm();
      toast.success("Document uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload document");
    },
    onSettled: () => {
      setUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.OwnerDocument.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-documents', userEmail] });
      toast.success("Document deleted");
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "other",
      is_private: true
    });
    setSelectedFile(null);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    uploadMutation.mutate({
      ...formData,
      file: selectedFile
    });
  };

  const categoryColors = {
    contract: 'bg-blue-500',
    invoice: 'bg-green-500',
    insurance: 'bg-purple-500',
    maintenance: 'bg-yellow-500',
    legal: 'bg-red-500',
    other: 'bg-gray-500'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage your property documents and files</p>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#ff6b35] mb-4" />
          <p className="text-gray-500">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Documents Yet</h3>
            <p className="text-gray-500 mb-4">Upload your first document to get started</p>
            <Button onClick={() => setShowUploadModal(true)} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map(doc => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#ff6b35]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={categoryColors[doc.category]}>
                    {doc.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {doc.file_type}
                  </Badge>
                  {doc.is_private && (
                    <Badge variant="outline" className="text-xs">Private</Badge>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Uploaded {format(new Date(doc.created_date), 'MMM d, yyyy')}
                </p>

                <div className="flex gap-2">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMutation.mutate(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Document title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>File *</Label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="doc-upload"
                required
              />
              <label htmlFor="doc-upload" className="cursor-pointer border-2 border-dashed p-4 rounded-lg flex items-center justify-center hover:border-[#ff6b35] transition-colors">
                <Upload className="w-5 h-5 mr-2" />
                {selectedFile ? selectedFile.name : 'Click to select file'}
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-[#ff6b35] hover:bg-[#ff8c5a]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}