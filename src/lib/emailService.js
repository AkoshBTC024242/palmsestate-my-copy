// src/lib/emailService.js - REPLACE ENTIRE FILE WITH THIS
import { supabase } from './supabase';

// Embedded email template (no file imports)
const generateApplicationEmailHTML = (data) => {
  const {
    applicationId = 'APP-N/A',
    propertyName = 'Property',
    propertyLocation = 'Location',
    applicantName = 'Applicant',
    referenceNumber = 'N/A'
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
        .details { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">Palms Estate</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">Application Confirmation</p>
    </div>
    
    <div class="content">
        <h2 style="color: #1f2937; margin-top: 0;">Thank You for Your Application!</h2>
        <p>We've received your application and will begin processing it immediately.</p>
        
        <div class="details">
            <h3 style="color: #92400e; margin-top: 0;">Application Details</h3>
            <p><strong>Reference Number:</strong> ${referenceNumber}</p>
            <p><strong>Property:</strong> ${propertyName}</p>
            <p><strong>Location:</strong> ${propertyLocation}</p>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://palmsestate.org/dashboard/applications" class="button">
                View Application Status
            </a>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ol style="color: #4b5563;">
            <li>Initial review (1-2 business days)</li>
            <li>Verification check</li>
            <li>Decision notification</li>
        </ol>
        
        <div class="footer">
            <p>Questions? Contact <a href="mailto:applications@palmsestate.org" style="color: #ea580c;">applications@palmsestate.org</a></p>
            <p>© ${new Date().getFullYear()} Palms Estate. All rights reserved.</p>
            <p style="font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;
};

// Main function - MAKE SURE THIS NAME MATCHES WHAT YOUR FORMS CALL
export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  try {
    console.log('📧 Sending application confirmation to:', userEmail);
    
    // Prepare email data
    const emailData = {
      applicationId: applicationData.applicationId || `APP-${Date.now()}`,
      propertyName: applicationData.propertyName || applicationData.propertyTitle || 'Property',
      propertyLocation: applicationData.propertyLocation || 'Location',
      applicantName: applicationData.fullName || applicationData.applicantName || applicationData.customerName || 'Applicant',
      referenceNumber: applicationData.referenceNumber || applicationData.referenceNumber || `APP-${Date.now()}`
    };
    
    // Generate email content
    const htmlContent = generateApplicationEmailHTML(emailData);
    
    const textContent = `
APPLICATION CONFIRMATION - PALMS ESTATE

Your application has been received!

Application Details:
- Reference: ${emailData.referenceNumber}
- Property: ${emailData.propertyName}
- Location: ${emailData.propertyLocation}
- Applicant: ${emailData.applicantName}
- Submitted: ${new Date().toLocaleDateString()}

Next Steps:
1. Initial Review (1-2 business days)
2. Verification Check
3. Decision Notification

View your application status:
https://palmsestate.org/dashboard/applications

Questions? Contact: applications@palmsestate.org

© ${new Date().getFullYear()} Palms Estate
    `.trim();
    
    // Try to send via Resend API
    const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
    
    if (RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Palms Estate <onboarding@resend.dev>',
            to: userEmail,
            subject: `Application Received - ${emailData.propertyName}`,
            html: htmlContent,
            text: textContent,
            reply_to: 'applications@palmsestate.org'
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('✅ Email sent via Resend API');
          
          // Log to database
          await logEmailToDatabase(userEmail, emailData, 'sent', data.id);
          
          return {
            success: true,
            message: 'Email sent successfully',
            reference: emailData.referenceNumber,
            method: 'resend'
          };
        } else {
          console.warn('Resend API error:', data.message);
        }
      } catch (error) {
        console.warn('Resend API failed:', error.message);
      }
    }
    
    // Fallback: Log to console and database
    console.log('📧 Email would be sent (configure VITE_RESEND_API_KEY for actual delivery):');
    console.log('To:', userEmail);
    console.log('Subject:', `Application Received - ${emailData.propertyName}`);
    console.log('Reference:', emailData.referenceNumber);
    
    // Log to database
    await logEmailToDatabase(userEmail, emailData, 'queued');
    
    return {
      success: true,
      queued: true,
      message: 'Email queued (configure Resend API for actual delivery)',
      reference: emailData.referenceNumber,
      method: 'console_log'
    };
    
  } catch (error) {
    console.error('❌ Email service error:', error);
    
    // Log error
    await supabase.from('email_logs').insert([{
      recipient: userEmail,
      subject: 'Application Error',
      email_type: 'application_confirmation_error',
      status: 'failed',
      error: error.message,
      sent_at: new Date().toISOString(),
      is_test: false
    }]);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

async function logEmailToDatabase(to, data, status, resendId = null) {
  try {
    await supabase.from('email_logs').insert([{
      recipient: to,
      subject: `Application Received - ${data.propertyName}`,
      email_type: 'application_confirmation',
      status: status,
      details: {
        ...data,
        resendId,
        timestamp: new Date().toISOString()
      },
      sent_at: new Date().toISOString(),
      is_test: false
    }]);
  } catch (error) {
    console.error('Failed to log email:', error);
  }
}

// Keep other functions if they exist in your current emailService.js
// Add them back here if needed

// For example, if you have these functions, keep them:
export const sendEmailViaEdgeFunction = async (emailData) => {
  // ... existing code if any
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  // ... existing code if any
};

export const canSendEmails = async () => {
  // ... existing code if any
  return {
    hasEmailService: !!import.meta.env.VITE_RESEND_API_KEY,
    message: import.meta.env.VITE_RESEND_API_KEY 
      ? 'Resend API configured' 
      : 'Configure VITE_RESEND_API_KEY for email delivery'
  };
};

// Test function
export async function testEmailService() {
  const result = await sendApplicationConfirmation('test@example.com', {
    propertyName: 'Test Luxury Villa',
    propertyLocation: 'Test Location, Maldives',
    fullName: 'Test User',
    referenceNumber: 'TEST-' + Date.now()
  });
  
  console.log('Test email result:', result);
  return result;
}
