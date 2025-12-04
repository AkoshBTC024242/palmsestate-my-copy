import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Users, Clock, CheckCircle, XCircle, 
  DollarSign, Mail, Phone, Calendar, FileText, Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ApplicationDetailsModal from "../components/admin/ApplicationDetailsModal";

export default function AdminApplicants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const queryClient = useQueryClient();

  const { data: applications = [] } = useQuery({
    queryKey: ['rental-applications'],
    queryFn: () => base44.entities.RentalApplication.list('-created_date'),
    initialData: []
  });

  const { data: applicationFees = [] } = useQuery({
    queryKey: ['application-fees'],
    queryFn: () => base44.entities.ApplicationFee.list('-created_date'),
    initialData: []
  });

  const { data: viewingRequests = [] } = useQuery({
    queryKey: ['viewing-requests'],
    queryFn: () => base44.entities.ViewingRequest.list('-created_date'),
    initialData: []
  });

  const updateFeeMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ApplicationFee.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['application-fees']);
    }
  });

  const sendEmailMutation = useMutation({
    mutationFn: async ({ to, subject, body }) => {
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Estate",
        to: "devbreed@hotmail.com",
        subject: subject,
        body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1f35; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
    .header { background: #1a1f35; color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Message from Palms Estate</h2>
    </div>
    <div class="content">
      ${body}
    </div>
  </div>
</body>
</html>
        `
      });
    },
    onSuccess: () => {
      setShowEmailModal(false);
      setEmailSubject("");
      setEmailBody("");
      toast.success("Email sent successfully!");
    },
    onError: () => {
      toast.error("Failed to send email");
    }
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.apartment_title?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && ["submitted", "under_review"].includes(app.status);
    if (activeTab === "approved") return matchesSearch && app.status === "approved";
    if (activeTab === "rejected") return matchesSearch && app.status === "rejected";
    return matchesSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => ["submitted", "under_review"].includes(a.status)).length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    pendingFees: applicationFees.filter(f => f.status === "pending").length,
    pendingViewings: viewingRequests.filter(v => v.status === "pending").length
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: "bg-blue-100 text-blue-800",
      under_review: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-orange-100 text-orange-800",
      verified: "bg-green-100 text-green-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1f35] mb-2">Applicant Management</h1>
          <p className="text-gray-600">Manage rental applications, fees, and viewing requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-[#1a1f35]">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Fees</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingFees}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Tours</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.pendingViewings}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Tabs */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, email, or apartment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No applications found</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => {
              const fee = applicationFees.find(f => 
                f.apartment_id === application.apartment_id && 
                f.applicant_email === application.email
              );

              return (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#1a1f35]">
                            {application.full_name}
                          </h3>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status?.replace('_', ' ')}
                          </Badge>
                          {fee && (
                            <Badge className={getStatusColor(fee.status)}>
                              Fee: {fee.status}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{application.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">{application.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              Move-in: {new Date(application.move_in_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm">
                              Income: ${application.monthly_income?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Property:</strong> {application.apartment_title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Applied: {new Date(application.created_date).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEmailRecipient(application);
                            setEmailSubject(`Update on Your Application - ${application.apartment_title}`);
                            setEmailBody(`Hi ${application.full_name},\n\n`);
                            setShowEmailModal(true);
                          }}
                          variant="outline"
                          className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowModal(true);
                          }}
                          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
                        >
                          View Details
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

      {/* Application Details Modal */}
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

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to {emailRecipient?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Recipient</Label>
              <Input value={emailRecipient?.email} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
                placeholder="Type your message here..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => sendEmailMutation.mutate({
                  to: emailRecipient.email,
                  subject: emailSubject,
                  body: emailBody
                })}
                disabled={!emailSubject || !emailBody || sendEmailMutation.isPending}
                className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}