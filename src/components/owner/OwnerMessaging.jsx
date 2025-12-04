import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Send, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function OwnerMessaging({ userEmail }) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [messageText, setMessageText] = useState("");

  const queryClient = useQueryClient();

  const { data: inquiries = [] } = useQuery({
    queryKey: ['owner-inquiries', userEmail],
    queryFn: () => base44.entities.PropertyOwnerInquiry.filter({ email: userEmail }, '-created_date'),
    initialData: []
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      await base44.integrations.Core.SendEmail({
        to: "devbreed@hotmail.com",
        subject: `Response from ${data.owner_name} - ${data.property_address}`,
        body: `
          <h2>Property Owner Response</h2>
          <p><strong>From:</strong> ${data.owner_name}</p>
          <p><strong>Email:</strong> ${data.owner_email}</p>
          <p><strong>Property:</strong> ${data.property_address}</p>
          <hr>
          <p>${data.message}</p>
        `
      });
      
      return base44.entities.PropertyOwnerInquiry.update(data.inquiry_id, {
        status: 'contacted'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-inquiries', userEmail] });
      setShowMessageModal(false);
      setMessageText("");
      setSelectedInquiry(null);
      toast.success("Message sent successfully");
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    sendMessageMutation.mutate({
      inquiry_id: selectedInquiry.id,
      owner_name: selectedInquiry.owner_name,
      owner_email: selectedInquiry.email,
      property_address: selectedInquiry.property_address,
      message: messageText
    });
  };

  const statusColors = {
    'new': 'bg-blue-500',
    'contacted': 'bg-yellow-500',
    'in_discussion': 'bg-purple-500',
    'agreement_signed': 'bg-green-500',
    'declined': 'bg-gray-500'
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">View and respond to inquiries about your properties</p>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Messages Yet</h3>
            <p className="text-gray-500">Inquiries about your properties will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inquiry => (
            <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a1f35] mb-1">{inquiry.property_address}</h3>
                    <p className="text-sm text-gray-500">
                      {inquiry.property_type?.replace('_', ' ')} · {inquiry.bedrooms} bed / {inquiry.bathrooms} bath
                    </p>
                  </div>
                  <Badge className={statusColors[inquiry.status]}>
                    {inquiry.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{inquiry.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{inquiry.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {format(new Date(inquiry.created_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{inquiry.inquiry_type?.replace('_', ' ')}</span>
                  </div>
                </div>

                {inquiry.message && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-700 mb-1">Inquiry Message:</p>
                    <p className="text-gray-600">{inquiry.message}</p>
                  </div>
                )}

                {inquiry.expected_rent && (
                  <p className="text-sm text-gray-600 mb-4">
                    Expected Rent: <span className="font-semibold">${inquiry.expected_rent.toLocaleString()}/month</span>
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setShowMessageModal(true);
                    }}
                    className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Respond
                  </Button>
                  <a href={`mailto:${inquiry.email}`}>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Directly
                    </Button>
                  </a>
                  <a href={`tel:${inquiry.phone}`}>
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Response</DialogTitle>
          </DialogHeader>

          {selectedInquiry && (
            <form onSubmit={handleSendMessage} className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">To:</p>
                <p className="font-semibold">{selectedInquiry.owner_name}</p>
                <p className="text-sm text-gray-600">{selectedInquiry.email}</p>
              </div>

              <div className="space-y-2">
                <Label>Your Message *</Label>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={sendMessageMutation.isPending}
                  className="flex-1 bg-[#ff6b35] hover:bg-[#ff8c5a]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageText("");
                    setSelectedInquiry(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}