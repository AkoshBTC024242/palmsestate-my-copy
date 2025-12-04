import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, CheckCircle2, Bell } from "lucide-react";

export default function AutomatedEmailSystem() {
  const { data: applications = [] } = useQuery({
    queryKey: ['automated-applications'],
    queryFn: () => base44.entities.RentalApplication.list('-created_date'),
    refetchInterval: 300000, // Check every 5 minutes
    initialData: []
  });

  const { data: fees = [] } = useQuery({
    queryKey: ['automated-fees'],
    queryFn: () => base44.entities.ApplicationFee.list('-created_date'),
    refetchInterval: 300000,
    initialData: []
  });

  const { data: emailLogs = [] } = useQuery({
    queryKey: ['email-logs'],
    queryFn: () => base44.entities.EmailLog.list('-created_date', 50),
    initialData: []
  });

  const sendEmailMutation = useMutation({
    mutationFn: async ({ email, type, relatedId, subject, body }) => {
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Estate",
        to: email,
        subject,
        body
      });
      
      await base44.entities.EmailLog.create({
        recipient_email: email,
        email_type: type,
        related_entity_id: relatedId,
        subject,
        sent_successfully: true
      });
    }
  });

  useEffect(() => {
    const checkAndSendReminders = () => {
      const now = new Date();
      const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      // Check pending applications
      applications.forEach(app => {
        if (app.status === 'submitted' || app.status === 'under_review') {
          const appDate = new Date(app.created_date);
          const lastUpdate = new Date(app.updated_date || app.created_date);
          
          if (lastUpdate < fortyEightHoursAgo) {
            const alreadySent = emailLogs.find(
              log => log.related_entity_id === app.id && 
                     log.email_type === 'reminder' &&
                     new Date(log.created_date) > fortyEightHoursAgo
            );

            if (!alreadySent) {
              sendEmailMutation.mutate({
                email: app.email,
                type: 'reminder',
                relatedId: app.id,
                subject: `⏰ Application Update - ${app.apartment_title}`,
                body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1f35; margin: 0; padding: 0; background: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .footer { background: #1a1f35; color: white; padding: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Application Status Update</h1>
    </div>
    <div class="content">
      <p><strong>Dear ${app.full_name},</strong></p>
      <p>This is a friendly reminder that your application for <strong>${app.apartment_title}</strong> is currently being reviewed.</p>
      <p><strong>Tracking Number:</strong> ${app.tracking_number}</p>
      <p>We're working diligently to process your application. If you have any questions, please don't hesitate to contact us.</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>Palms Estate Team</strong></p>
    </div>
    <div class="footer">
      <p>📞 (828) 623-9765 | ✉️ devbreed@hotmail.com</p>
    </div>
  </div>
</body>
</html>
                `
              });
            }
          }
        }
      });

      // Check pending fees
      fees.forEach(fee => {
        if (fee.status === 'instructions_sent' || fee.status === 'payment_pending_verification') {
          const lastUpdate = new Date(fee.updated_date || fee.created_date);
          
          if (lastUpdate < fortyEightHoursAgo) {
            const alreadySent = emailLogs.find(
              log => log.related_entity_id === fee.id && 
                     log.email_type === 'reminder' &&
                     new Date(log.created_date) > fortyEightHoursAgo
            );

            if (!alreadySent) {
              sendEmailMutation.mutate({
                email: fee.applicant_email,
                type: 'reminder',
                relatedId: fee.id,
                subject: `⏰ Payment Reminder - ${fee.apartment_title}`,
                body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1f35; margin: 0; padding: 0; background: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .footer { background: #1a1f35; color: white; padding: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Payment Pending</h1>
    </div>
    <div class="content">
      <p><strong>Dear ${fee.applicant_name},</strong></p>
      <p>This is a friendly reminder about your application fee for <strong>${fee.apartment_title}</strong>.</p>
      <p><strong>Tracking Code:</strong> ${fee.transaction_id}</p>
      <p>Please log in to your dashboard to complete the payment process or check the status of your payment verification.</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>Palms Estate Team</strong></p>
    </div>
    <div class="footer">
      <p>📞 (828) 623-9765 | ✉️ devbreed@hotmail.com</p>
    </div>
  </div>
</body>
</html>
                `
              });
            }
          }
        }
      });
    };

    checkAndSendReminders();
  }, [applications, fees, emailLogs]);

  const recentEmails = emailLogs.slice(0, 10);
  const remindersSent = emailLogs.filter(log => log.email_type === 'reminder').length;

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Bell className="w-6 h-6 text-[#ff6b35]" />
          Automated Email System
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{emailLogs.length}</p>
            <p className="text-sm text-blue-700">Total Emails Sent</p>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{remindersSent}</p>
            <p className="text-sm text-orange-700">Reminders Sent</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">
              {emailLogs.filter(log => log.sent_successfully).length}
            </p>
            <p className="text-sm text-green-700">Successful</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Recent Email Activity</h3>
          <div className="space-y-2">
            {recentEmails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No emails sent yet</p>
            ) : (
              recentEmails.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{log.recipient_email}</p>
                    <p className="text-xs text-gray-600">{log.subject}</p>
                  </div>
                  <Badge className={`${
                    log.email_type === 'reminder' ? 'bg-orange-100 text-orange-800' :
                    log.email_type === 'congratulations' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {log.email_type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}