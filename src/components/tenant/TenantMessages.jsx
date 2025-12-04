import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function TenantMessages({ userEmail, userName }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['tenant-messages', userEmail],
    queryFn: () => base44.entities.TenantMessage.filter({ tenant_email: userEmail }, '-created_date'),
    initialData: []
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data) => base44.entities.TenantMessage.create({
      ...data,
      tenant_email: userEmail,
      tenant_name: userName
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tenant-messages']);
      toast.success("Message sent!");
      setShowForm(false);
      setFormData({ subject: "", message: "" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessageMutation.mutate(formData);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    replied: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Send Message to Property Management</CardTitle>
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
                  rows={6}
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
            <Card key={msg.id} className={msg.status === 'replied' ? 'border-l-4 border-l-green-500' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{msg.subject}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent {format(new Date(msg.created_date), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <Badge className={statusColors[msg.status]}>
                    {msg.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Your Message:</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                      {msg.message}
                    </p>
                  </div>

                  {msg.reply && (
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="w-4 h-4 text-[#ff6b35]" />
                        <p className="text-sm font-medium text-[#ff6b35]">Management Reply:</p>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap bg-green-50 p-3 rounded-lg border-l-4 border-l-green-500">
                        {msg.reply}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}