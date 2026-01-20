import { supabase } from './supabase';

// Function to generate HTML email from template
function generateApplicationConfirmationEmail(data) {
  const {
    applicationReference = 'APP-XXXX-XXXX',
    propertyTitle = 'Property',
    propertyLocation = 'Location not specified',
    applicantName = 'Applicant',
    applicantEmail = 'email@example.com',
    submissionDate = new Date().toLocaleDateString('en-US'),
    applicationId = 'N/A'
  } = data;
  
  // Return the complete HTML email template with placeholders replaced
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Submitted - Palms Estate</title>
    <style>
        body, table, td, div, p, a {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        body {
            background-color: #fffbeb;
            margin: 0;
            padding: 0;
        }
        
        .application-button {
            display: inline-block;
            background-color: #f97316;
            color: white !important;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            padding: 16px 40px;
            border-radius: 12px;
            text-align: center;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        
        @media only screen and (max-width: 640px) {
            .container {
                width: 100% !important;
            }
            .mobile-padding {
                padding: 24px !important;
            }
        }
    </style>
</head>
<body style="background-color: #fffbeb;">
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbeb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <!-- Main container -->
                <table width="600" border="0" cellspacing="0" cellpadding="0" class="container" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td bgcolor="#f97316" style="background-color: #f97316; padding: 48px 0; border-radius: 24px 24px 0 0;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <!-- Logo -->
                                        <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                            <tr>
                                                <td align="center">
                                                    <div style="width: 80px; height: 80px; background-color: white; border-radius: 20px; display: inline-block; text-align: center; line-height: 80px;">
                                                        <span style="font-size: 32px; font-weight: bold; color: #f97316; font-family: 'Georgia', serif;">P</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <h1 style="color: white; font-size: 36px; font-weight: bold; margin: 0 0 8px 0; font-family: 'Georgia', serif;">
                                            Palms<span style="color: white;">Estate</span>
                                        </h1>
                                        <p style="color: white; font-size: 14px; letter-spacing: 3px; margin: 0; font-weight: 500; text-transform: uppercase;">
                                            APPLICATION CONFIRMATION
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 48px 40px;">
                            
                            <!-- Confirmation message -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding-bottom: 32px;">
                                        <h2 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0 0 12px 0; font-family: 'Georgia', serif;">
                                            Application Submitted Successfully
                                        </h2>
                                        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
                                            Thank you for applying with Palms Estate. Your application has been received and is being processed.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Success icon -->
                                <tr>
                                    <td align="center" style="padding-bottom: 40px;">
                                        <div style="width: 100px; height: 100px; background-color: #d1fae5; border-radius: 24px; display: inline-block; margin-bottom: 24px; border: 2px solid #a7f3d0; text-align: center; line-height: 100px;">
                                            <span style="font-size: 40px; color: #10b981;">✓</span>
                                        </div>
                                        <h3 style="color: #1f2937; font-size: 22px; font-weight: bold; margin: 0 0 12px 0;">
                                            Application Received
                                        </h3>
                                        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0; max-width: 480px;">
                                            Your application #${applicationReference} has been submitted for review.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Application Status Badge -->
                                <tr>
                                    <td align="center" style="padding-bottom: 40px;">
                                        <div class="status-badge" style="background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a;">
                                            STATUS: UNDER REVIEW
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Application Details Card -->
                                <tr>
                                    <td style="padding-bottom: 40px;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 16px; border: 1px solid #e5e7eb;">
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <h4 style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 24px 0; font-family: 'Georgia', serif;">
                                                        Application Details
                                                    </h4>
                                                    
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <!-- Property -->
                                                        <tr>
                                                            <td style="padding-bottom: 20px;">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="40" valign="top" style="padding-right: 16px;">
                                                                            <div style="width: 32px; height: 32px; background-color: #fef3c7; border-radius: 8px; text-align: center; line-height: 32px;">
                                                                                <span style="color: #f97316;">🏠</span>
                                                                            </div>
                                                                        </td>
                                                                        <td valign="top">
                                                                            <p style="color: #6b7280; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">
                                                                                Property
                                                                            </p>
                                                                            <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0;">
                                                                                ${propertyTitle}
                                                                            </p>
                                                                            <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">
                                                                                ${propertyLocation}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        
                                                        <!-- Application ID -->
                                                        <tr>
                                                            <td style="padding-bottom: 20px;">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="40" valign="top" style="padding-right: 16px;">
                                                                            <div style="width: 32px; height: 32px; background-color: #e0f2fe; border-radius: 8px; text-align: center; line-height: 32px;">
                                                                                <span style="color: #0ea5e9;">#</span>
                                                                            </div>
                                                                        </td>
                                                                        <td valign="top">
                                                                            <p style="color: #6b7280; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">
                                                                                Application Reference
                                                                            </p>
                                                                            <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0;">
                                                                                ${applicationReference}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        
                                                        <!-- Submitted Date -->
                                                        <tr>
                                                            <td style="padding-bottom: 20px;">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="40" valign="top" style="padding-right: 16px;">
                                                                            <div style="width: 32px; height: 32px; background-color: #f0fdf4; border-radius: 8px; text-align: center; line-height: 32px;">
                                                                                <span style="color: #10b981;">📅</span>
                                                                            </div>
                                                                        </td>
                                                                        <td valign="top">
                                                                            <p style="color: #6b7280; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">
                                                                                Submitted On
                                                                            </p>
                                                                            <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0;">
                                                                                ${submissionDate}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        
                                                        <!-- Applicant -->
                                                        <tr>
                                                            <td>
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td width="40" valign="top" style="padding-right: 16px;">
                                                                            <div style="width: 32px; height: 32px; background-color: #f3e8ff; border-radius: 8px; text-align: center; line-height: 32px;">
                                                                                <span style="color: #a855f7;">👤</span>
                                                                            </div>
                                                                        </td>
                                                                        <td valign="top">
                                                                            <p style="color: #6b7280; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">
                                                                                Applicant
                                                                            </p>
                                                                            <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0;">
                                                                                ${applicantName}
                                                                            </p>
                                                                            <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">
                                                                                ${applicantEmail}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Next Steps -->
                                <tr>
                                    <td style="padding-bottom: 32px;">
                                        <h4 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 24px 0; font-family: 'Georgia', serif;">
                                            What Happens Next?
                                        </h4>
                                        
                                        <!-- Timeline -->
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <!-- Step 1 -->
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td width="24" valign="top" style="padding-right: 16px;">
                                                                <div style="width: 24px; height: 24px; background-color: #f97316; border-radius: 50%;"></div>
                                                            </td>
                                                            <td valign="top">
                                                                <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                                    1. Initial Review (1-2 Business Days)
                                                                </p>
                                                                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                                                                    Our team will review your application for completeness
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <!-- Step 2 -->
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td width="24" valign="top" style="padding-right: 16px;">
                                                                <div style="width: 24px; height: 24px; background-color: #fbbf24; border-radius: 50%;"></div>
                                                            </td>
                                                            <td valign="top">
                                                                <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                                    2. Verification Check (2-3 Business Days)
                                                                </p>
                                                                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                                                                    Document verification and background checks
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <!-- Step 3 -->
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td width="24" valign="top" style="padding-right: 16px;">
                                                                <div style="width: 24px; height: 24px; background-color: #10b981; border-radius: 50%;"></div>
                                                            </td>
                                                            <td valign="top">
                                                                <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                                    3. Decision & Notification (1-2 Business Days)
                                                                </p>
                                                                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                                                                    You'll receive an email with the final decision
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- CTA Buttons -->
                                <tr>
                                    <td align="center" style="padding-bottom: 40px;">
                                        <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                                            <tr>
                                                <td style="padding-bottom: 12px;">
                                                    <a href="https://palmsestate.org/dashboard/applications/${applicationId}" 
                                                       class="application-button"
                                                       style="display: inline-block; background-color: #f97316; color: white; text-decoration: none; font-weight: bold; font-size: 16px; padding: 16px 40px; border-radius: 12px; text-align: center;">
                                                       View Application Status
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="https://palmsestate.org/dashboard" 
                                                       style="display: inline-block; color: #f97316; text-decoration: none; font-weight: 600; font-size: 14px; padding: 8px 16px;">
                                                       Go to Dashboard
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Support Info -->
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fef3c7; border-radius: 12px; border: 1px solid #fde68a;">
                                            <tr>
                                                <td style="padding: 20px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td width="40" valign="top" style="padding-right: 16px;">
                                                                <div style="width: 32px; height: 32px; background-color: #f97316; color: white; border-radius: 8px; text-align: center; line-height: 32px;">
                                                                    💬
                                                                </div>
                                                            </td>
                                                            <td valign="top">
                                                                <p style="color: #92400e; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                                    Questions About Your Application?
                                                                </p>
                                                                <p style="color: #92400e; font-size: 14px; line-height: 1.5; margin: 0;">
                                                                    Contact our application support team at 
                                                                    <a href="mailto:applications@palmsestate.org" style="color: #ea580c; text-decoration: none; font-weight: 600;">
                                                                        applications@palmsestate.org
                                                                    </a>
                                                                    or call (555) 123-4567
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#111827" style="background-color: #111827; padding: 40px 30px; border-radius: 0 0 24px 24px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 32px;">
                                        <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                            <tr>
                                                <td align="center">
                                                    <div style="width: 48px; height: 48px; background-color: #1f2937; border-radius: 12px; display: inline-block; text-align: center; line-height: 48px; margin-right: 16px; border: 1px solid #374151;">
                                                        <span style="font-size: 20px; font-weight: bold; color: #f59e0b; font-family: 'Georgia', serif;">P</span>
                                                    </div>
                                                    <h3 style="color: white; font-size: 24px; font-weight: bold; margin: 0; font-family: 'Georgia', serif; display: inline-block; vertical-align: middle;">
                                                        Palms<span style="color: #f59e0b;">Estate</span>
                                                    </h3>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; max-width: 400px; color: #9ca3af;">
                                            Your trusted partner for premium luxury rentals and exceptional living experiences.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Links -->
                                <tr>
                                    <td align="center" style="padding-bottom: 32px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="padding: 0 12px;">
                                                    <a href="https://palmsestate.org/dashboard" style="color: #d1d5db; text-decoration: none; font-size: 14px; font-weight: 500;">
                                                        Dashboard
                                                    </a>
                                                </td>
                                                <td style="padding: 0 12px;">
                                                    <a href="https://palmsestate.org/properties" style="color: #d1d5db; text-decoration: none; font-size: 14px; font-weight: 500;">
                                                        Properties
                                                    </a>
                                                </td>
                                                <td style="padding: 0 12px;">
                                                    <a href="https://palmsestate.org/contact" style="color: #d1d5db; text-decoration: none; font-size: 14px; font-weight: 500;">
                                                        Contact
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Divider -->
                                <tr>
                                    <td align="center" style="padding-bottom: 32px;">
                                        <div style="width: 100%; height: 1px; background-color: #374151;"></div>
                                    </td>
                                </tr>
                                
                                <!-- Copyright -->
                                <tr>
                                    <td align="center">
                                        <p style="font-size: 13px; color: #9ca3af; margin: 0 0 12px 0;">
                                            © 2024 Palms Estate. All rights reserved.
                                        </p>
                                        <p style="font-size: 12px; color: #6b7280; margin: 0; line-height: 1.5;">
                                            This email confirms your rental application submission.
                                            <br>
                                            <a href="https://palmsestate.org/unsubscribe" style="color: #9ca3af; text-decoration: none; font-size: 12px;">
                                                Unsubscribe
                                            </a>
                                             • 
                                            <a href="https://palmsestate.org/privacy" style="color: #9ca3af; text-decoration: none; font-size: 12px;">
                                                Privacy Policy
                                            </a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Bottom address -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 32px;">
                    <tr>
                        <td align="center">
                            <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; margin: 0;">
                                Palms Estate Applications Department
                                <br>
                                123 Luxury Avenue • Beverly Hills, CA 90210
                                <br>
                                <a href="https://palmsestate.org" style="color: #9ca3af; text-decoration: none; font-size: 12px;">
                                    palmsestate.org
                                </a>
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// Main function to send application confirmation email
export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  try {
    console.log('📧 Preparing application confirmation email for:', userEmail);
    
    // Extract and normalize data from both form types
    const propertyTitle = applicationData.propertyName || applicationData.propertyTitle || 'Property';
    const applicationReference = applicationData.referenceNumber || `APP-${Date.now()}`;
    const applicantName = applicationData.fullName || applicationData.customerName || applicationData.applicantName || 'Applicant';
    const applicationId = applicationData.applicationId || applicationReference;
    const submissionDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const propertyLocation = applicationData.propertyLocation || 'Location not specified';
    
    // Generate email content
    const htmlContent = generateApplicationConfirmationEmail({
      applicationReference,
      propertyTitle,
      propertyLocation,
      applicantName,
      applicantEmail: userEmail,
      submissionDate,
      applicationId
    });
    
    const textContent = `
Application Submitted Successfully

Thank you for applying with Palms Estate. Your application has been received and is being processed.

Application Reference: ${applicationReference}
Property: ${propertyTitle}
Location: ${propertyLocation}
Applicant: ${applicantName}
Email: ${userEmail}
Submitted On: ${submissionDate}

Status: UNDER REVIEW

What Happens Next?
1. Initial Review (1-2 Business Days)
   Our team will review your application for completeness

2. Verification Check (2-3 Business Days)
   Document verification and background checks

3. Decision & Notification (1-2 Business Days)
   You'll receive an email with the final decision

View your application status: https://palmsestate.org/dashboard/applications/${applicationId}

Questions About Your Application?
Contact our application support team at applications@palmsestate.org

© 2024 Palms Estate. All rights reserved.
    `.trim();
    
    const emailDetails = {
      to: userEmail,
      subject: `Application Received - ${propertyTitle}`,
      html: htmlContent,
      text: textContent,
      applicationId,
      referenceNumber: applicationReference,
      propertyName: propertyTitle,
      propertyLocation,
      customerName: applicantName,
      submissionDate,
      timestamp: new Date().toISOString()
    };
    
    console.log('📋 Email details prepared:', {
      to: emailDetails.to,
      subject: emailDetails.subject,
      referenceNumber: emailDetails.referenceNumber
    });
    
    // First, try to log to database
    try {
      console.log('💾 Logging email to database...');
      const { error: logError } = await supabase
        .from('email_logs')
        .insert([{
          recipient: emailDetails.to,
          subject: emailDetails.subject,
          email_type: 'application_confirmation',
          status: 'queued',
          details: {
            to: emailDetails.to,
            subject: emailDetails.subject,
            referenceNumber: emailDetails.referenceNumber,
            propertyName: emailDetails.propertyName,
            customerName: emailDetails.customerName,
            timestamp: emailDetails.timestamp
          },
          sent_at: new Date().toISOString(),
          is_test: false,
          note: 'Email queued for sending. Configure email service for actual delivery.'
        }]);
      
      if (logError) {
        console.warn('⚠️ Could not log to database:', logError.message);
      } else {
        console.log('✅ Email logged to database');
      }
    } catch (logError) {
      console.warn('⚠️ Database logging failed:', logError);
    }
    
    // Check for Edge Function (optional)
    let edgeFunctionAvailable = false;
    try {
      // Quick test to see if edge function exists
      const { error: edgeTestError } = await supabase.functions.invoke('send-email', {
        body: { test: true }
      }).catch(() => ({ error: 'Edge function not available' }));
      
      edgeFunctionAvailable = !edgeTestError;
    } catch {
      edgeFunctionAvailable = false;
    }
    
    if (edgeFunctionAvailable) {
      console.log('🔗 Edge function available, attempting to send...');
      try {
        const { data, error } = await supabase.functions.invoke('send-email', {
          body: {
            to: emailDetails.to,
            subject: emailDetails.subject,
            html: htmlContent,
            text: textContent,
            template: 'application-confirmation',
            data: {
              applicationReference: emailDetails.referenceNumber,
              propertyTitle: emailDetails.propertyName,
              propertyLocation: emailDetails.propertyLocation,
              applicantName: emailDetails.customerName,
              applicantEmail: userEmail,
              submissionDate: emailDetails.submissionDate,
              applicationId: emailDetails.applicationId
            }
          }
        });
        
        if (error) throw error;
        
        console.log('✅ Email sent via Edge Function');
        
        // Update log to sent
        await supabase
          .from('email_logs')
          .update({ status: 'sent' })
          .eq('recipient', emailDetails.to)
          .eq('subject', emailDetails.subject)
          .order('sent_at', { ascending: false })
          .limit(1);
        
        return {
          success: true,
          sent: true,
          message: 'Email sent successfully via Supabase Edge Function',
          emailDetails: {
            to: emailDetails.to,
            subject: emailDetails.subject,
            referenceNumber: emailDetails.referenceNumber
          }
        };
      } catch (edgeError) {
        console.warn('⚠️ Edge function failed:', edgeError.message);
      }
    }
    
    // Fallback: Console log and mark as queued
    console.log('📨 CONSOLE MODE - Email details (configure email service for actual delivery):');
    console.log('To:', emailDetails.to);
    console.log('Subject:', emailDetails.subject);
    console.log('Reference:', emailDetails.referenceNumber);
    console.log('Property:', emailDetails.propertyName);
    console.log('---');
    console.log('HTML email content would be sent here');
    console.log('---');
    console.log('To enable actual email delivery:');
    console.log('1. Set up Resend.com (recommended) or SendGrid');
    console.log('2. Create a Supabase Edge Function for sending emails');
    console.log('3. Update emailService.js to use your email provider');
    
    return {
      success: true,
      queued: true,
      sent: false,
      message: 'Email queued for sending (logged to console and database)',
      note: 'Configure email service (Resend/SendGrid) for actual delivery',
      emailDetails: {
        to: emailDetails.to,
        subject: emailDetails.subject,
        referenceNumber: emailDetails.referenceNumber,
        preview: 'Check console for full email details'
      }
    };
    
  } catch (error) {
    console.error('❌ Error in sendApplicationConfirmation:', error);
    
    // Log error
    try {
      await supabase
        .from('email_logs')
        .insert([{
          recipient: userEmail,
          subject: 'Application Confirmation - ERROR',
          email_type: 'application_confirmation_error',
          status: 'failed',
          error: error.message,
          details: applicationData,
          sent_at: new Date().toISOString(),
          is_test: false
        }]);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to process email request'
    };
  }
};

// Check email service status
export const canSendEmails = async () => {
  try {
    let edgeFunctionAvailable = false;
    
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: { test: true }
      }).catch(() => ({ error: 'Not available' }));
      edgeFunctionAvailable = !error;
    } catch {
      edgeFunctionAvailable = false;
    }
    
    const { data: logs, error: logsError } = await supabase
      .from('email_logs')
      .select('id')
      .limit(1);
    
    const hasEmailLogs = !logsError;
    
    return {
      hasEmailService: edgeFunctionAvailable,
      hasEmailLogs,
      service: edgeFunctionAvailable ? 'Supabase Edge Function' : 'Console/Database Logging Only',
      status: edgeFunctionAvailable ? 'Available' : 'Not configured - emails logged to console',
      message: edgeFunctionAvailable 
        ? 'Email service is configured via Supabase Edge Functions'
        : 'Email service not configured. Configure Resend, SendGrid, or SMTP for actual delivery.',
      recommendations: [
        '1. Create a "send-email" edge function in Supabase Dashboard',
        '2. Integrate with Resend.com (recommended for simplicity)',
        '3. Or use SendGrid, AWS SES, or SMTP',
        '4. Emails are currently logged to database and console'
      ],
      stats: {
        edgeFunction: edgeFunctionAvailable ? '✅ Available' : '❌ Not configured',
        databaseLogging: hasEmailLogs ? '✅ Available' : '❌ Not configured',
        currentMode: edgeFunctionAvailable ? 'Production' : 'Development/Logging'
      }
    };
  } catch (error) {
    return {
      hasEmailService: false,
      service: 'Unknown',
      error: error.message,
      message: 'Unable to check email service configuration'
    };
  }
};

// Simple function for other email types
export const sendEmailViaEdgeFunction = async (emailData) => {
  try {
    console.log('📧 Sending email:', emailData.to);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });
    
    if (error) throw error;
    
    // Log to database
    await supabase
      .from('email_logs')
      .insert([{
        recipient: emailData.to,
        subject: emailData.subject,
        email_type: emailData.template || 'generic',
        status: 'sent',
        details: emailData,
        sent_at: new Date().toISOString(),
        is_test: false
      }]);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    
    await supabase
      .from('email_logs')
      .insert([{
        recipient: emailData.to || 'unknown',
        subject: emailData.subject || 'No subject',
        email_type: emailData.template || 'generic',
        status: 'failed',
        error: error.message,
        details: emailData,
        sent_at: new Date().toISOString(),
        is_test: false
      }]);
    
    return { success: false, error: error.message };
  }
};
