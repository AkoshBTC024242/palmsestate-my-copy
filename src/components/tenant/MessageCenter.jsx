import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MessageCenter({ user, messages }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.TenantMessage.create(data);
      await base44.integrations.Core.SendEmail({
        to: "devbreed@hotmail.com",
        subject: `New Message from Tenant - ${data.subject}`,
        body: `
New message from ${data.tenant_name} (${data.tenant_email})

Subject: ${data.subject}

Message:
${data.message}
        `
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-messages'] });
      toast.success("Message sent successfully!");
      setShowForm(false);
      setFormData({ subject: "", message: "" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessageMutation.mutate({
      ...formData,
      tenant_email: user?.email,
      tenant_name: user?.full_name
    });
  };

  const statusColors = {
    unread: "bg-blue-500",
    read: "bg-gray-500",
    replied: "bg-green-500"
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setShowForm(!showForm)}
        className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Message
      </Button>

      {showForm && (
        <Card className="border-2 border-[#ff6b35]">
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Type your message here..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={sendMessageMutation.isPending} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                  <Send className="w-4 h-4 mr-2" />
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
        <h3 className="text-lg font-semibold">Message History</h3>
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No messages yet</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className={msg.status === 'unread' ? 'border-2 border-blue-200' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-[#1a1f35]">{msg.subject}</h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(msg.created_date), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <Badge className={`${statusColors[msg.status]} text-white`}>
                    {msg.status}
                  </Badge>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                </div>

                {msg.admin_reply && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600 text-white">Admin Reply</Badge>
                      {msg.replied_date && (
                        <span className="text-xs text-gray-600">
                          {format(new Date(msg.replied_date), 'MMM d, yyyy h:mm a')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.admin_reply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}