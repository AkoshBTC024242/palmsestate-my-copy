import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Send, User, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ApplicationTracker() {
  const [trackingCode, setTrackingCode] = useState("");
  const [searchedCode, setSearchedCode] = useState("");

  // Auto-load if tracking code is in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setTrackingCode(code);
      setSearchedCode(code);
    }
  }, []);
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: application, isLoading } = useQuery({
    queryKey: ['tracked-application', searchedCode],
    queryFn: async () => {
      const apps = await base44.entities.RentalApplication.filter({ tracking_number: searchedCode });
      return apps[0] || null;
    },
    enabled: !!searchedCode,
    initialData: null
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['application-messages', application?.id],
    queryFn: () => base44.entities.ApplicationMessage.filter({ application_id: application.id }, '-created_date'),
    enabled: !!application?.id,
    initialData: []
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ appId, trackingNum, fullName, messageText }) => {
      return await base44.entities.ApplicationMessage.create({
        application_id: appId,
        tracking_number: trackingNum,
        sender_type: 'applicant',
        sender_name: fullName,
        message: messageText
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-messages'] });
      setNewMessage("");
      toast.success("Message sent!");
    },
    onError: (error) => {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedCode(trackingCode.toUpperCase());
  };

  const statusConfig = {
    submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800", desc: "Your application has been received" },
    under_review: { label: "Under Review", color: "bg-yellow-100 text-yellow-800", desc: "Our team is reviewing your application" },
    documents_requested: { label: "Documents Requested", color: "bg-orange-100 text-orange-800", desc: "Additional documents needed" },
    background_check: { label: "Background Check", color: "bg-purple-100 text-purple-800", desc: "Running background verification" },
    partially_approved: { label: "Partially Approved", color: "bg-teal-100 text-teal-800", desc: "Application approved, pending final steps" },
    approved: { label: "Approved", color: "bg-green-100 text-green-800", desc: "Congratulations! Your application is approved" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800", desc: "Application was not approved" }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1a1f35] mb-2">Track Your Application</h1>
          <p className="text-gray-600">Enter your tracking code to check your application status</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter tracking code (e.g., APP-12345)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  className="h-12"
                />
              </div>
              <Button type="submit" className="bg-[#ff6b35] hover:bg-[#ff8c5a] px-8">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading && (
          <Card><CardContent className="p-12 text-center text-gray-500">Loading...</CardContent></Card>
        )}

        {!isLoading && searchedCode && !application && (
          <Card><CardContent className="p-12 text-center text-gray-500">
            No application found with code: {searchedCode}
          </CardContent></Card>
        )}

        {application && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Application Status</CardTitle>
                  <Badge className={`${statusConfig[application.status].color} text-lg px-4 py-1`}>
                    {statusConfig[application.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-4">{statusConfig[application.status].desc}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Applicant</p>
                      <p className="font-semibold">{application.full_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Property</p>
                      <p className="font-semibold">{application.apartment_title}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-semibold">{format(new Date(application.created_date), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tracking Code</p>
                      <p className="font-semibold">{application.tracking_number}</p>
                    </div>
                  </div>
                </div>

                {application.admin_notes && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-semibold text-blue-900 mb-2">Latest Update from Admin:</p>
                    <p className="text-blue-800">{application.admin_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No messages yet</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-lg ${
                          msg.sender_type === 'admin' 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : 'bg-gray-50 border-l-4 border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4" />
                          <span className="font-semibold">
                            {msg.sender_type === 'admin' ? 'Property Manager' : msg.sender_name}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {format(new Date(msg.created_date), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-gray-700">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Send Message */}
                <div className="border-t pt-4">
                  <Label className="mb-2">Send a Message</Label>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                      className="flex-1"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newMessage.trim()) {
                        sendMessageMutation.mutate({
                          appId: application.id,
                          trackingNum: application.tracking_number,
                          fullName: application.full_name,
                          messageText: newMessage.trim()
                        });
                      }
                    }}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    className="mt-2 bg-[#ff6b35] hover:bg-[#ff8c5a]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}