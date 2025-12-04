import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Mail } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function DirectMessaging({ userEmail, userName }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['property-messages', userEmail],
    queryFn: () => base44.entities.PropertyMessage.filter({ 
      $or: [
        { sender_email: userEmail },
        { recipient_email: userEmail }
      ]
    }, '-created_date'),
    initialData: []
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      const message = await base44.entities.PropertyMessage.create({
        ...data,
        sender_email: userEmail,
        sender_name: userName,
        sender_type: "tenant",
        recipient_email: "devbreed@hotmail.com"
      });

      // Send email notification to property manager
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Real Estate - Tenant Portal",
        to: "devbreed@hotmail.com",
        subject: `New Message from ${userName}: ${data.subject}`,
        body: `New message from tenant:

From: ${userName}
Email: ${userEmail}
Subject: ${data.subject}

Message:
${data.message}

Reply to this tenant through the property management dashboard.`
      });

      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['property-messages']);
      toast.success("Message sent to property manager!");
      setShowForm(false);
      setFormData({ subject: "", message: "" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessageMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
        >
          <Send className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Message Property Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Subject *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div>
                <Label>Message *</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message here..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={sendMessageMutation.isPending} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                  {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No messages yet</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{msg.subject}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {msg.sender_type === 'tenant' ? 'To: Property Manager' : `From: ${msg.sender_name}`}
                    </p>
                  </div>
                  <Badge variant={msg.sender_type === 'tenant' ? 'outline' : 'default'}>
                    {msg.sender_type === 'tenant' ? 'Sent' : 'Received'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap mb-3">{msg.message}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail className="w-3 h-3" />
                  {format(new Date(msg.created_date), 'MMM d, yyyy h:mm a')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}