
// src/pages/dashboard/Documents.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Download, Upload, Trash2, Eye,
  File, FileImage, FileArchive, FileSpreadsheet,
  MoreVertical, Loader2, Plus, Search, Filter,
  FolderOpen, CheckCircle, XCircle, Clock
} from 'lucide-react';

function DashboardDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'applications',
    'contracts',
    'identification',
    'financial',
    'property'
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('user-documents')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-documents')
        .getPublicUrl(fileName);

      // Save document record
      const { error: dbError } = await supabase
        .from('user_documents')
        .insert([{
          user_id: user?.id,
          name: file.name,
          type: file.type,
          size: file.size,
          url: urlData.publicUrl,
          category: 'other',
          status: 'pending'
        }]);

      if (dbError) throw dbError;

      fetchDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id, url) => {
    try {
      // Extract file path from URL
      const filePath = url.split('/').pop();
      
      // Delete from storage
      await supabase.storage
        .from('user-documents')
        .remove([`${user?.id}/${filePath}`]);

      // Delete from database
      await supabase
        .from('user_documents')
        .delete()
        .eq('id', id);

      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('image')) return <FileImage className="w-5 h-5 text-blue-400" />;
    if (type?.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (type?.includes('zip') || type?.includes('rar')) return <FileArchive className="w-5 h-5 text-yellow-400" />;
    if (type?.includes('sheet') || type?.includes('excel')) return <FileSpreadsheet className="w-5 h-5 text-green-400" />;
    return <File className="w-5 h-5 text-[#A1A1AA]" />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Documents</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">Manage your application documents</p>
        </div>
        
        <div className="relative">
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => document.getElementById('fileUpload').click()}
            disabled={uploading}
            className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Upload Document
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-white text-sm focus:outline-none focus:border-[#F97316]/50"
        >
          {categories.map(cat => (
            <option key={cat} value={cat} className="bg-[#0A0A0A]">
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-16 bg-[#18181B] border border-[#27272A] rounded-xl">
          <FolderOpen className="w-12 h-12 text-[#F97316]/30 mx-auto mb-4" />
          <h3 className="text-white font-light mb-2">No documents yet</h3>
          <p className="text-[#A1A1AA] text-sm mb-4">Upload your first document to get started</p>
          <button
            onClick={() => document.getElementById('fileUpload').click()}
            className="px-4 py-2 bg-[#F97316] text-white text-sm rounded-lg hover:bg-[#EA580C] transition-colors inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      ) : (
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#27272A]">
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Size</th>
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-4 text-left text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs text-[#A1A1AA] font-light uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#0A0A0A] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <div>
                          <p className="text-white text-sm font-medium">{doc.name}</p>
                          <p className="text-[#A1A1AA] text-xs mt-1">Uploaded {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#A1A1AA]">
                      {(doc.size / 1024).toFixed(1)} KB
                    </td>
                    <td className="px-6 py-4 text-sm text-[#A1A1AA]">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <span className={`text-sm ${
                          doc.status === 'approved' ? 'text-green-500' :
                          doc.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                        }`}>
                          {doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-[#A1A1AA] hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={doc.url}
                          download
                          className="p-1 text-[#A1A1AA] hover:text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => deleteDocument(doc.id, doc.url)}
                          className="p-1 text-[#A1A1AA] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardDocuments;
