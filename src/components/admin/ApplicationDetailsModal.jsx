import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Users, Home,
  CheckCircle2, XCircle, Clock, FileText, Send
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import LeaseGenerator from "./LeaseGenerator";
import ApplicantMessaging from "./ApplicantMessaging";
import TenantScreening from "./TenantScreening";

export default function ApplicationDetailsModal({ application, isOpen, onClose }) {
  const [newStatus, setNewStatus] = useState(application.status);
  const [adminNotes, setAdminNotes] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [showLeaseGenerator, setShowLeaseGenerator] = useState(false);
  const queryClient = useQueryClient();

  // Fetch messages for this application
  const { data: messages = [] } = useQuery({
    queryKey: ['application-messages', application.tracking_number],
    queryFn: () => base44.entities.ApplicationMessage.filter(
      { tracking_number: application.tracking_number },
      '-created_date'
    ),
    initialData: []
  });

  const { data: apartment } = useQuery({
    queryKey: ['apartment', application.apartment_id],
    queryFn: async () => {
      const apts = await base44.entities.Apartment.filter({ id: application.apartment_id });
      return apts[0];
    },
    enabled: !!application.apartment_id
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes, message }) => {
      await base44.entities.RentalApplication.update(application.id, {
        status,
        admin_notes: notes
      });

      // If approved, trigger automated onboarding workflow
      if (status === 'approved') {
        // Hide apartment from public listings
        await base44.entities.Apartment.update(application.apartment_id, {
          available: false
        });

        // Create lease agreement automatically
        const existingLeases = await base44.entities.LeaseAgreement.filter({ 
          application_id: application.id 
        });

        if (existingLeases.length === 0) {
          const leaseStartDate = application.move_in_date || new Date().toISOString().split('T')[0];
          const leaseEndDate = new Date(leaseStartDate);
          leaseEndDate.setFullYear(leaseEndDate.getFullYear() + 1);

          await base44.entities.LeaseAgreement.create({
            application_id: application.id,
            apartment_id: application.apartment_id,
            tenant_name: application.full_name,
            tenant_email: application.email,
            apartment_title: application.apartment_title,
            apartment_address: apartment?.address || '',
            monthly_rent: apartment?.monthly_rent || 0,
            security_deposit: apartment?.security_deposit || 0,
            lease_start_date: leaseStartDate,
            lease_end_date: leaseEndDate.toISOString().split('T')[0],
            status: 'draft',
            approval_date: new Date().toISOString()
          });
        }

        // Send onboarding email with next steps
        await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate",
          to: application.email,
          subject: "🏡 Next Steps: Lease Signing & Move-In Process",
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1f35; margin: 0; padding: 0; background: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .step-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .step-number { display: inline-block; width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; text-align: center; line-height: 32px; font-weight: bold; margin-right: 10px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Your New Home!</h1>
      <p style="font-size: 18px; margin: 10px 0 0 0;">Let's complete your move-in process</p>
    </div>
    <div class="content">
      <p style="font-size: 18px;"><strong>Dear ${application.full_name},</strong></p>
      
      <p>Congratulations on your approved application for <strong>${application.apartment_title}</strong>!</p>
      
      <h2 style="color: #1e40af; margin-top: 30px;">📋 Next Steps:</h2>
      
      <div class="step-box">
        <p><span class="step-number">1</span> <strong>Lease Agreement Review</strong></p>
        <p>Your lease agreement has been generated and will be sent to you within 24 hours for electronic signature.</p>
      </div>
      
      <div class="step-box">
        <p><span class="step-number">2</span> <strong>Security Deposit Payment</strong></p>
        <p>Amount: <strong>$${apartment?.security_deposit || 0}</strong><br>
        Payment instructions will be provided after lease signing.</p>
      </div>
      
      <div class="step-box">
        <p><span class="step-number">3</span> <strong>Move-In Inspection</strong></p>
        <p>We'll schedule a property walkthrough before your move-in date: <strong>${application.move_in_date ? new Date(application.move_in_date).toLocaleDateString() : 'TBD'}</strong></p>
      </div>
      
      <div class="step-box">
        <p><span class="step-number">4</span> <strong>Key Pickup & Move-In</strong></p>
        <p>Final step! Collect your keys and move into your new home.</p>
      </div>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 8px;">
        <p style="margin: 0;"><strong>⏰ Action Required:</strong> Please respond to this email within 48 hours to confirm your acceptance and proceed with the lease signing process.</p>
      </div>
      
      <p style="margin-top: 30px;">If you have any questions, please don't hesitate to reach out.</p>
      
      <p><strong>Property Manager Team</strong><br>
      📞 (828) 623-9765<br>
      ✉️ devbreed@hotmail.com</p>
    </div>
  </div>
</body>
</html>
          `
        });

        // Create notification for tenant
        await base44.entities.Notification.create({
          user_email: application.email,
          title: "Application Approved - Next Steps",
          message: "Your application has been approved! Check your email for lease signing and move-in instructions.",
          type: "success",
          read: false
        });
      }

      // Send message if provided
      if (message) {
        await base44.entities.ApplicationMessage.create({
          application_id: application.id,
          tracking_number: application.tracking_number,
          sender_type: 'admin',
          sender_name: 'Property Manager',
          message
        });
      }

      // Send congratulatory email if approved
      if (status === 'approved') {
        await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate",
          to: application.email,
          subject: `🎉 Congratulations! Your Application Has Been Approved`,
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1f35; margin: 0; padding: 0; background: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 50px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .info-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .next-steps { background: #eff6ff; border: 2px solid #3b82f6; padding: 25px; border-radius: 12px; margin: 25px 0; }
    .footer { background: #1a1f35; color: white; padding: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Congratulations!</h1>
      <p style="font-size: 18px; margin: 10px 0 0 0; opacity: 0.95;">Your Application Has Been Approved</p>
    </div>
    <div class="content">
      <p style="font-size: 18px;"><strong>Dear ${application.full_name},</strong></p>
      <p style="font-size: 16px; color: #047857; font-weight: 600; margin: 20px 0;">
        Your rental application for <strong>${application.apartment_title}</strong> has been approved! 🏡
      </p>
      <div class="info-box">
        <p style="margin: 5px 0;"><strong>Property:</strong> ${application.apartment_title}</p>
        <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${application.tracking_number}</p>
        <p style="margin: 5px 0;"><strong>Move-in Date:</strong> ${application.move_in_date ? new Date(application.move_in_date).toLocaleDateString() : 'TBD'}</p>
      </div>
      <div class="next-steps">
        <h3 style="color: #1e40af; margin: 0 0 15px 0;">📋 Next Steps:</h3>
        <ol style="color: #1e3a8a; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Lease Agreement - Sent within 24 hours</li>
          <li>Security Deposit Payment</li>
          <li>Move-in Inspection Scheduling</li>
          <li>Keys & Property Access</li>
          <li>Utilities Setup</li>
        </ol>
      </div>
      <p>Please respond within <strong>48 hours</strong> to confirm your acceptance.</p>
    </div>
    <div class="footer">
      <p style="font-size: 20px; font-weight: bold;">Palms Estate</p>
      <p>📞 (828) 623-9765 | ✉️ devbreed@hotmail.com</p>
    </div>
  </div>
</body>
</html>
          `
        });

        await base44.entities.EmailLog.create({
          recipient_email: application.email,
          email_type: 'congratulations',
          related_entity_id: application.id,
          subject: 'Application Approved',
          sent_successfully: true
        });
      }

      // Send email notification
      const statusLabels = {
        submitted: 'Submitted',
        under_review: 'Under Review',
        documents_requested: 'Documents Requested',
        background_check: 'Background Check in Progress',
        partially_approved: 'Partially Approved',
        approved: 'Approved',
        rejected: 'Declined'
      };

      await base44.integrations.Core.SendEmail({
        from_name: "Palms Estate",
        to: application.email,
        subject: `Application Status Update - ${application.apartment_title}`,
        body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; }
    .header p { color: #ffffff; margin: 10px 0 0 0; opacity: 0.95; font-size: 14px; }
    .content { padding: 40px 30px; }
    .status-badge { display: inline-block; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .status-approved { background-color: #d1fae5; color: #065f46; }
    .status-partially { background-color: #ccfbf1; color: #115e59; }
    .status-documents { background-color: #fed7aa; color: #92400e; }
    .status-review { background-color: #fef3c7; color: #92400e; }
    .status-rejected { background-color: #fee2e2; color: #991b1b; }
    .status-default { background-color: #e0e7ff; color: #3730a3; }
    .info-box { background-color: #f9fafb; border-left: 4px solid #ff6b35; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .info-box h3 { margin: 0 0 10px 0; color: #1a1f35; font-size: 16px; }
    .info-box p { margin: 5px 0; color: #6b7280; font-size: 14px; }
    .info-box strong { color: #1a1f35; }
    .message-box { background-color: #eff6ff; border: 2px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 12px; }
    .message-box h3 { margin: 0 0 12px 0; color: #1e40af; font-size: 16px; display: flex; align-items: center; }
    .message-box p { margin: 0; color: #1e3a8a; font-size: 15px; line-height: 1.6; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 25px 0; font-size: 16px; box-shadow: 0 4px 6px rgba(255, 107, 53, 0.3); }
    .cta-button:hover { box-shadow: 0 6px 8px rgba(255, 107, 53, 0.4); }
    .divider { border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0; }
    .footer { background-color: #1a1f35; color: #ffffff; padding: 30px; text-align: center; }
    .footer p { margin: 8px 0; font-size: 14px; opacity: 0.9; }
    .footer a { color: #ff8c5a; text-decoration: none; }
    .contact-info { margin: 20px 0; }
    .contact-info a { color: #ff8c5a; text-decoration: none; font-weight: 500; }
    .emoji { font-size: 24px; margin-right: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 Palms Estate</h1>
      <p>Your Dream Home Awaits</p>
    </div>
    
    <div class="content">
      <h2 style="color: #1a1f35; margin-top: 0;">Dear ${application.full_name},</h2>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        Your rental application for <strong style="color: #1a1f35;">${application.apartment_title}</strong> has been updated.
      </p>

      <div class="info-box">
        <h3>📋 Application Details</h3>
        <p><strong>Tracking Number:</strong> ${application.tracking_number}</p>
        <p><strong>Property:</strong> ${application.apartment_title}</p>
        <p><strong>New Status:</strong> <span class="status-badge status-${status === 'approved' ? 'approved' : status === 'partially_approved' ? 'partially' : status === 'documents_requested' ? 'documents' : status === 'under_review' ? 'review' : status === 'rejected' ? 'rejected' : 'default'}">${statusLabels[status]}</span></p>
      </div>

      ${status === 'approved' ? `
        <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 25px 0;">
          <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
          <h2 style="color: #065f46; margin: 0 0 10px 0;">Congratulations!</h2>
          <p style="color: #047857; font-size: 18px; margin: 0;">Your application has been approved!</p>
          <p style="color: #059669; font-size: 14px; margin: 15px 0 0 0;">Our team will contact you shortly to proceed with the lease signing process.</p>
        </div>
      ` : status === 'partially_approved' ? `
        <div style="background-color: #ecfeff; padding: 25px; border-radius: 12px; border-left: 4px solid #06b6d4; margin: 25px 0;">
          <h3 style="color: #0e7490; margin: 0 0 10px 0;">✨ Almost There!</h3>
          <p style="color: #155e75; margin: 0; line-height: 1.6;">${notes || 'Your application has been partially approved. We may need a few more details before final approval.'}</p>
        </div>
      ` : status === 'documents_requested' ? `
        <div style="background-color: #fff7ed; padding: 25px; border-radius: 12px; border-left: 4px solid #f97316; margin: 25px 0;">
          <h3 style="color: #c2410c; margin: 0 0 10px 0;">📄 Documents Required</h3>
          <p style="color: #9a3412; margin: 0; line-height: 1.6;">${notes || 'We need additional documents to process your application. Please check your application tracker for details.'}</p>
        </div>
      ` : status === 'rejected' ? `
        <div style="background-color: #fef2f2; padding: 25px; border-radius: 12px; border-left: 4px solid #ef4444; margin: 25px 0;">
          <h3 style="color: #991b1b; margin: 0 0 10px 0;">Application Update</h3>
          <p style="color: #7f1d1d; margin: 0; line-height: 1.6;">Unfortunately, we are unable to proceed with your application at this time. ${notes || ''}</p>
        </div>
      ` : `
        <div style="background-color: #f0f9ff; padding: 25px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 25px 0;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0;">🔄 Application in Progress</h3>
          <p style="color: #1e3a8a; margin: 0; line-height: 1.6;">${notes || 'Your application is progressing through our review process. We\'ll keep you updated.'}</p>
        </div>
      `}

      ${message ? `
        <div class="message-box">
          <h3>💬 Message from Property Manager</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      ` : ''}

      <hr class="divider">

      <div style="text-align: center;">
        <p style="color: #6b7280; font-size: 15px; margin-bottom: 20px;">Track your application status and send messages anytime:</p>
        <a href="https://palmsrealestate.com" class="cta-button">View Application Status</a>
      </div>

      <hr class="divider">

      <div class="contact-info" style="text-align: center;">
        <h3 style="color: #1a1f35; margin: 0 0 15px 0;">Need Help?</h3>
        <p style="color: #6b7280; margin: 5px 0;">
          📞 <a href="tel:8286239765">(828) 623-9765</a>
        </p>
        <p style="color: #6b7280; margin: 5px 0;">
          ✉️ <a href="mailto:devbreed@hotmail.com">devbreed@hotmail.com</a>
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">Palms Estate</p>
      <p style="opacity: 0.8;">Your Dream Home Awaits</p>
      <p style="font-size: 12px; opacity: 0.7; margin-top: 15px;">
        © ${new Date().getFullYear()} Palms Estate. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-applications'] });
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
      queryClient.invalidateQueries({ queryKey: ['application-messages'] });
      toast.success("Application updated and applicant notified");
      setAdminMessage("");
      setAdminNotes("");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update application");
    }
  });

  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({
      status: newStatus,
      notes: adminNotes,
      message: adminMessage
    });
  };

  const statusColors = {
    submitted: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock },
    under_review: { bg: "bg-yellow-100", text: "text-yellow-800", icon: FileText },
    documents_requested: { bg: "bg-orange-100", text: "text-orange-800", icon: Mail },
    background_check: { bg: "bg-purple-100", text: "text-purple-800", icon: FileText },
    partially_approved: { bg: "bg-teal-100", text: "text-teal-800", icon: CheckCircle2 },
    approved: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
    rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle }
  };

  const StatusIcon = statusColors[application.status]?.icon || Clock;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-[#1a1f35] mb-2">
                {application.full_name}
              </DialogTitle>
              <p className="text-gray-600">Application for {application.apartment_title}</p>
              <p className="text-sm text-gray-500 mt-1">Tracking: {application.tracking_number}</p>
            </div>
            <Badge className={`${statusColors[application.status]?.bg} ${statusColors[application.status]?.text} border-0 flex items-center gap-1 px-3 py-1`}>
              <StatusIcon className="w-4 h-4" />
              {application.status?.replace(/_/g, ' ')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#1a1f35] mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{application.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{application.phone}</p>
                  </div>
                </div>
                {application.current_address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Current Address</p>
                      <p className="font-medium">{application.current_address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employment & Financial Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#1a1f35] mb-4">Employment & Financial Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Employment Status</p>
                    <p className="font-medium capitalize">{application.employment_status?.replace(/-/g, ' ')}</p>
                  </div>
                </div>
                {application.employer_name && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Employer</p>
                      <p className="font-medium">{application.employer_name}</p>
                    </div>
                  </div>
                )}
                {application.monthly_income && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Monthly Income</p>
                      <p className="font-medium text-green-600">${application.monthly_income?.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#1a1f35] mb-4">Application Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {application.move_in_date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Desired Move-in</p>
                      <p className="font-medium">{format(new Date(application.move_in_date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Occupants</p>
                    <p className="font-medium">{application.number_of_occupants || 1} person(s)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-[#ff6b35] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Pets</p>
                    <p className="font-medium">{application.has_pets ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {application.has_pets && application.pet_details && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Pet Details</p>
                  <p className="text-gray-700">{application.pet_details}</p>
                </div>
              )}

              {application.additional_info && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Additional Information</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{application.additional_info}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Tabs for Messages and Status Update */}
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat">Live Chat</TabsTrigger>
              <TabsTrigger value="history">Message History ({messages.length})</TabsTrigger>
              <TabsTrigger value="screening">Tenant Screening</TabsTrigger>
              <TabsTrigger value="status">Update Status</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card>
                <CardContent className="p-6">
                  <ApplicantMessaging application={application} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="screening">
              <Card>
                <CardContent className="p-6">
                  <TenantScreening application={application} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-6">
                  {messages.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No messages yet</p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-lg ${
                            msg.sender_type === 'admin'
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-green-50 border border-green-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  msg.sender_type === 'admin'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-green-600 text-white'
                                }
                              >
                                {msg.sender_type === 'admin' ? 'You (Admin)' : 'Applicant'}
                              </Badge>
                              {msg.sender_name && (
                                <span className="text-sm text-gray-600">{msg.sender_name}</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(msg.created_date), 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="status">
              {/* Status Update Section */}
          <Card className="border-2 border-[#ff6b35]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#1a1f35] mb-4">Update Application Status</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Application Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="status" className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          Submitted
                        </div>
                      </SelectItem>
                      <SelectItem value="under_review">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-yellow-600" />
                          Under Review
                        </div>
                      </SelectItem>
                      <SelectItem value="documents_requested">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-orange-600" />
                          Documents Requested
                        </div>
                      </SelectItem>
                      <SelectItem value="background_check">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          Background Check
                        </div>
                      </SelectItem>
                      <SelectItem value="partially_approved">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          Partially Approved
                        </div>
                      </SelectItem>
                      <SelectItem value="approved">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Approved
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Rejected
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message to Applicant</Label>
                  <Textarea
                    id="message"
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    rows={3}
                    placeholder="Send a message to the applicant (they will see this in their tracker)..."
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Admin Notes (Internal Only)</Label>
                  <Textarea
                    id="notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    placeholder="Internal notes (not visible to applicant)..."
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  {newStatus === 'approved' && apartment && (
                    <Button
                      onClick={() => setShowLeaseGenerator(true)}
                      className="flex-1 bg-green-600 hover:bg-green-700 h-12"
                    >
                      Generate Lease
                    </Button>
                  )}
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 bg-[#ff6b35] hover:bg-[#ff8c5a] h-12"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {updateStatusMutation.isPending ? "Updating..." : "Update & Notify"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="h-12"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>
        </div>

        {showLeaseGenerator && apartment && (
          <LeaseGenerator
            application={application}
            apartment={apartment}
            isOpen={showLeaseGenerator}
            onClose={() => setShowLeaseGenerator(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}