import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationDetailsModal from "../components/admin/ApplicationDetailsModal";
import PaymentRequestManager from "../components/admin/PaymentRequestManager";
import ApplicationFeeManager from "../components/admin/ApplicationFeeManager";

export default function AdminRentals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['rental-applications'],
    queryFn: () => base44.entities.RentalApplication.list('-created_date'),
    initialData: []
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.apartment_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    submitted: "bg-blue-100 text-blue-800 border-blue-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    under_review: "bg-blue-100 text-blue-800 border-blue-200",
    documents_requested: "bg-purple-100 text-purple-800 border-purple-200",
    background_check: "bg-indigo-100 text-indigo-800 border-indigo-200",
    partially_approved: "bg-orange-100 text-orange-800 border-orange-200",
    reviewing: "bg-blue-100 text-blue-800 border-blue-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  // Priority scoring for application queue
  const getPriorityScore = (app) => {
    let score = 0;
    const daysOld = Math.floor((new Date() - new Date(app.created_date)) / (1000 * 60 * 60 * 24));
    
    // Older applications get higher priority
    score += daysOld * 10;
    
    // Higher income gets boost
    if (app.monthly_income >= 5000) score += 20;
    if (app.monthly_income >= 3000) score += 10;
    
    // Employment status
    if (app.employment_status === 'employed') score += 15;
    
    return score;
  };

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    // Pending applications always come first
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // Within pending, sort by priority score
    if (a.status === 'pending' && b.status === 'pending') {
      return getPriorityScore(b) - getPriorityScore(a);
    }
    
    // Otherwise sort by date
    return new Date(b.created_date) - new Date(a.created_date);
  });

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a1f35] mb-2">Rental Applications</h1>
          <p className="text-gray-600">Manage and review apartment rental applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "All Applications", count: statusCounts.all, color: "bg-gray-500" },
            { label: "Pending", count: statusCounts.pending, color: "bg-yellow-500" },
            { label: "Reviewing", count: statusCounts.reviewing, color: "bg-blue-500" },
            { label: "Approved", count: statusCounts.approved, color: "bg-green-500" },
            { label: "Rejected", count: statusCounts.rejected, color: "bg-red-500" }
          ].map((stat, idx) => (
            <Card key={idx} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <span className="text-white text-2xl font-bold">{stat.count}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="fees">Application Fees</TabsTrigger>
            <TabsTrigger value="inspection">Inspection Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, email, or apartment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Applications ({sortedApplications.length})</CardTitle>
              <Badge className="bg-blue-100 text-blue-800 text-base px-4 py-1">
                {sortedApplications.filter(a => a.status === 'pending').length} Pending Review
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-2">Sorted by priority - pending applications first</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading applications...</p>
              </div>
            ) : sortedApplications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Apartment</TableHead>
                      <TableHead>Employment</TableHead>
                      <TableHead>Move-in Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedApplications.map((application, index) => {
                      const isPending = application.status === 'pending';
                      const isHighPriority = isPending && index < 3;
                      
                      return (
                        <TableRow key={application.id} className={`hover:bg-gray-50 ${isHighPriority ? 'bg-red-50/50' : ''}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {isPending && (
                                <Badge className={isHighPriority ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {isHighPriority ? 'High' : 'Med'}
                                </Badge>
                              )}
                              <span className="text-sm text-gray-500">#{index + 1}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-[#1a1f35]">{application.full_name}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="w-3 h-3" />
                              {application.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              {application.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{application.apartment_title}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{application.employment_status}</p>
                            {application.employer_name && (
                              <p className="text-xs text-gray-500">{application.employer_name}</p>
                            )}
                            {application.monthly_income && (
                              <p className="text-xs text-green-600">${application.monthly_income?.toLocaleString()}/mo</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {application.move_in_date ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {format(new Date(application.move_in_date), 'MMM d, yyyy')}
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[application.status] || 'bg-gray-100 text-gray-800 border-gray-200'} border`}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {format(new Date(application.created_date), 'MMM d, yyyy')}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(application)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="fees">
            <ApplicationFeeManager />
          </TabsContent>

          <TabsContent value="inspection">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Inspection Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Inspection fee management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
      </div>

      {/* Modal */}
      {showModal && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
}