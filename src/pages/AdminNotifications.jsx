import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, AlertTriangle, Calendar, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminNotifications() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    category: "announcement",
    priority: "medium",
    target_audience: "all_tenants",
    property_id: "",
    tenant_email: ""
  });

  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => base44.entities.Notification.list('-created_date'),
    initialData: []
  });

  const { data: apartments = [] } = useQuery({
    queryKey: ['apartments'],
    queryFn: () => base44.entities.Apartment.list(),
    initialData: []
  });

  const { data: leases = [] } = useQuery({
    queryKey: ['active-leases'],
    queryFn: () => base44.entities.LeaseAgreement.filter({ status: 'active' }),
    initialData: []
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (data) => {
      const notification = await base44.entities.Notification.create({
        ...data,
        sent: true,
        sent_date: new Date().toISOString()
      });

      // Get recipient list
      let recipients = [];
      if (data.target_audience === 'all_tenants') {
        recipients = leases.map(l => ({ email: l.tenant_email, name: l.tenant_name }));
      } else if (data.target_audience === 'specific_property') {
        recipients = leases
          .filter(l => l.apartment_id === data.property_id)
          .map(l => ({ email: l.tenant_email, name: l.tenant_name }));
      } else if (data.target_audience === 'specific_tenant') {
        const lease = leases.find(l => l.tenant_email === data.tenant_email);
        if (lease) {
          recipients = [{ email: lease.tenant_email, name: lease.tenant_name }];
        }
      }

      // Send emails
      const priorityText = data.priority === 'urgent' ? ' [URGENT]' : '';
      for (const recipient of recipients) {
        await base44.integrations.Core.SendEmail({
          from_name: "Palms Real Estate",
          to: recipient.email,
          subject: `${priorityText} ${data.title}`,
          body: `Dear ${recipient.name},

${data.message}

Category: ${data.category}
Priority: ${data.priority}

If you have any questions, please contact us:
Phone: (828) 623-9765
Email: devbreed@hotmail.com

Best regards,
Palms Real Estate Team`
        });
      }

      return { notification, recipientCount: recipients.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(`Notification sent to ${data.recipientCount} tenant(s)`);
      setShowForm(false);
      setFormData({
        title: "",
        message: "",
        category: "announcement",
        priority: "medium",
        target_audience: "all_tenants",
        property_id: "",
        tenant_email: ""
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendNotificationMutation.mutate(formData);
  };

  const categoryColors = {
    maintenance: 'bg-blue-100 text-blue-800',
    event: 'bg-purple-100 text-purple-800',
    announcement: 'bg-green-100 text-green-800',
    emergency: 'bg-red-100 text-red-800',
    policy: 'bg-yellow-100 text-yellow-800'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1f35]">Push Notifications</h1>
            <p className="text-gray-600 mt-2">Send important updates to tenants</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white"
          >
            <Bell className="w-4 h-4 mr-2" />
            Create Notification
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Send className="w-8 h-8 text-[#ff6b35]" />
                <div>
                  <p className="text-sm text-gray-600">Total Sent</p>
                  <p className="text-3xl font-bold">{notifications.filter(n => n.sent).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-3xl font-bold">{notifications.filter(n => n.priority === 'urgent').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-3xl font-bold">
                    {notifications.filter(n => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(n.created_date) > weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Tenants</p>
                  <p className="text-3xl font-bold">{leases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Building Maintenance Scheduled"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    placeholder="Enter your message here..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="policy">Policy Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select value={formData.target_audience} onValueChange={(value) => setFormData({...formData, target_audience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_tenants">All Tenants</SelectItem>
                      <SelectItem value="specific_property">Specific Property</SelectItem>
                      <SelectItem value="specific_tenant">Specific Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.target_audience === 'specific_property' && (
                  <div className="space-y-2">
                    <Label>Select Property</Label>
                    <Select value={formData.property_id} onValueChange={(value) => setFormData({...formData, property_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a property" />
                      </SelectTrigger>
                      <SelectContent>
                        {apartments.map(apt => (
                          <SelectItem key={apt.id} value={apt.id}>{apt.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.target_audience === 'specific_tenant' && (
                  <div className="space-y-2">
                    <Label>Tenant Email</Label>
                    <Select value={formData.tenant_email} onValueChange={(value) => setFormData({...formData, tenant_email: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {leases.map(lease => (
                          <SelectItem key={lease.id} value={lease.tenant_email}>
                            {lease.tenant_name} ({lease.apartment_title})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={sendNotificationMutation.isPending}
                    className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendNotificationMutation.isPending ? "Sending..." : "Send Notification"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-gray-500 py-8">Loading...</p>
              ) : notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No notifications sent yet</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-[#1a1f35]">{notif.title}</h4>
                        <p className="text-gray-600 mt-1">{notif.message}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Badge className={categoryColors[notif.category]}>{notif.category}</Badge>
                        <Badge className={priorityColors[notif.priority]}>{notif.priority}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Target: {notif.target_audience.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Sent: {format(new Date(notif.sent_date || notif.created_date), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}