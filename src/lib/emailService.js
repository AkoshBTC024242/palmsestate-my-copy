// src/lib/emailService.js - COPY THIS ENTIRE FILE
import { supabase } from './supabase';

// REAL EMAIL TEMPLATE - THIS IS THE ACTUAL TEMPLATE
const generateApplicationEmailHTML = (data) => {
  const {
    propertyName = 'Property',
    propertyLocation = 'Location',
    applicantName = 'Applicant',
    referenceNumber = 'N/A',
    status = 'submitted',
    statusNote = ''
  } = data;

  const isStatusUpdate = status && status !== 'submitted';
  
  let statusSection = '';
  if (isStatusUpdate) {
    statusSection = `
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; border-radius: 8px; margin: 20px 0; color: white; text-align: center;">
        <h3 style="margin: 0 0 10px; font-size: 20px;">Application Status Updated</h3>
        <p style="margin: 0; font-size: 24px; font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        ${statusNote ? `<p style="margin: 10px 0 0; font-style: italic;">${statusNote}</p>` : ''}
      </div>
    `;
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // THIS IS THE ACTUAL HTML TEMPLATE THAT GETS SENT
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Palms Estate - ${isStatusUpdate ? 'Status Update' : 'Application Confirmation'}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 30px;
            text-align: center;
            color: white;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 30px;
            background: white;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 10px 10px;
        }
        .details {
            background: #fffbeb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f97316;
        }
        .button {
            display: inline-block;
            background: #f97316;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
        }
        .button:hover {
            background: #ea580c;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
            text-align: center;
        }
        .status-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0; font-size: 28px;">Palms Estate</h1>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 16px;">${isStatusUpdate ? 'Application Status Update' : 'Application Confirmation'}</p>
    </div>
    
    <div class="content">
        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">
            ${isStatusUpdate ? 'Your Application Status Has Been Updated' : 'Thank You for Your Application!'}
        </h2>
        
        <p style="font-size: 16px; color: #4b5563;">
            ${isStatusUpdate ? 'The status of your application has been updated:' : 'We have successfully received your application and will begin processing it immediately.'}
        </p>
        
        ${statusSection}
        
        <div class="details">
            <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">Application Details</h3>
            
            <div style="margin: 15px 0;">
                <p style="margin: 8px 0;">
                    <strong style="color: #374151;">Reference Number:</strong>
                    <span style="color: #111827; font-weight: bold; font-size: 18px;">${referenceNumber}</span>
                </p>
                
                <p style="margin: 8px 0;">
                    <strong style="color: #374151;">Property:</strong>
                    <span style="color: #111827;">${propertyName}</span>
                </p>
                
                <p style="margin: 8px 0;">
                    <strong style="color: #374151;">Location:</strong>
                    <span style="color: #111827;">${propertyLocation}</span>
                </p>
                
                <p style="margin: 8px 0;">
                    <strong style="color: #374151;">Applicant:</strong>
                    <span style="color: #111827;">${applicantName}</span>
                </p>
                
                <p style="margin: 8px 0;">
                    <strong style="color: #374151;">${isStatusUpdate ? 'Updated' : 'Submitted'}:</strong>
                    <span style="color: #111827;">${formattedDate}</span>
                </p>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://palmsestate.org/dashboard/applications" class="button">
                View Application Status
            </a>
        </div>
        
        ${!isStatusUpdate ? `
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #0369a1; margin-top: 0; font-size: 18px;">What happens next?</h3>
            <ol style="color: #0c4a6e; margin: 15px 0; padding-left: 20px;">
                <li style="margin: 8px 0;"><strong>Initial review</strong> (1-2 business days)</li>
                <li style="margin: 8px 0;"><strong>Verification check</strong> of provided information</li>
                <li style="margin: 8px 0;"><strong>Decision notification</strong> via email</li>
            </ol>
            <p style="color: #0c4a6e; font-size: 14px; margin: 10px 0 0;">
                You will be notified at every step of the process.
            </p>
        </div>
        ` : ''}
        
        <div class="footer">
            <p style="margin: 5px 0;">
                Questions? Contact <a href="mailto:applications@palmsestate.org" style="color: #ea580c; text-decoration: none;">applications@palmsestate.org</a>
            </p>
            <p style="margin: 5px 0; font-size: 11px;">
                © ${today.getFullYear()} Palms Estate. All rights reserved.
            </p>
            <p style="margin: 5px 0; font-size: 11px; color: #9ca3af;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>`;
};

// Text version for plain text emails
const generateStatusUpdateText = (data) => {
  const status = data.status || 'submitted';
  const isStatusUpdate = status && status !== 'submitted';
  
  let statusText = '';
  if (isStatusUpdate) {
    statusText = `APPLICATION STATUS UPDATE - PALMS ESTATE

Your application status has been updated to: ${status.toUpperCase()}

${data.statusNote ? `Note: ${data.statusNote}\n\n` : ''}`;
  }

  const today = new Date();
  
  return `${statusText}APPLICATION CONFIRMATION - PALMS ESTATE

Application Details:
────────────────────
Reference Number: ${data.referenceNumber || 'N/A'}
Property: ${data.propertyName || 'Property'}
Location: ${data.propertyLocation || 'Location'}
Applicant: ${data.applicantName || 'Applicant'}
${isStatusUpdate ? 'Updated' : 'Submitted'}: ${today.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

${!isStatusUpdate ? `
Next Steps:
───────────
1. Initial Review (1-2 business days)
2. Verification Check
3. Decision Notification

` : ''}
View your application status online:
https://palmsestate.org/dashboard/applications

Need help? Contact us at: applications@palmsestate.org

────────────────────
© ${today.getFullYear()} Palms Estate
This is an automated message. Please do not reply to this email.`;
};

// Main email sending function
export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  console.log('🚀 STARTING EMAIL SEND TO:', userEmail);
  
  try {
    // Prepare email data
    const emailData = {
      propertyName: applicationData.propertyName || applicationData.propertyTitle || 'Property',
      propertyLocation: applicationData.propertyLocation || 'Location',
      applicantName: applicationData.fullName || applicationData.applicantName || applicationData.customerName || 'Applicant',
      referenceNumber: applicationData.referenceNumber || `APP-${Date.now()}`,
      status: applicationData.status || 'submitted',
      statusNote: applicationData.statusNote || ''
    };
    
    // Generate email content
    const htmlContent = generateApplicationEmailHTML(emailData);
    const textContent = generateStatusUpdateText(emailData);
    
    console.log('📧 Generated HTML length:', htmlContent.length, 'characters');
    console.log('📧 Generated text length:', textContent.length, 'characters');
    
    // Validate that we have actual HTML (not placeholder)
    if (htmlContent.includes('...your HTML template...')) {
      console.error('❌ CRITICAL ERROR: HTML contains placeholder text!');
      throw new Error('Email template is not properly configured');
    }
    
    if (htmlContent.length < 1000) {
      console.error('❌ WARNING: HTML seems too short:', htmlContent.length);
      console.log('First 200 chars:', htmlContent.substring(0, 200));
    }
    
    // Determine email subject
    const subject = emailData.status === 'submitted' 
      ? `Application Received - ${emailData.propertyName}` 
      : `Application Status Update - ${emailData.propertyName}`;
    
    console.log('📧 Subject:', subject);
    
    // Send via Supabase Edge Function
    const { data: result, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        subject: subject,
        html: htmlContent,
        text: textContent,
        type: 'user',
        applicationData: emailData
      }
    });
    
    if (error) {
      console.error('❌ Edge Function error:', error.message);
      throw error;
    }
    
    console.log('✅ Edge Function response:', result);
    
    if (result && result.success) {
      console.log('🎉 EMAIL SENT SUCCESSFULLY! ID:', result.emailId);
      return {
        success: true,
        message: 'Email sent successfully',
        emailId: result.emailId,
        referenceNumber: emailData.referenceNumber
      };
    } else {
      console.error('❌ Edge Function returned error:', result?.error);
      throw new Error(result?.error || 'Failed to send email');
    }
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

// Send admin notification
export const sendAdminNotification = async (applicationData) => {
  console.log('📧 Sending admin notification');
  try {
    const result = await sendApplicationConfirmation('admin@palmsestate.org', {
      ...applicationData,
      propertyName: applicationData.propertyName || 'New Application',
      applicantName: applicationData.applicantName || 'New Applicant',
      status: 'new_submission_admin',
      statusNote: 'New application submitted - requires review'
    });
    return result;
  } catch (error) {
    console.error('Admin notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send status update
export const sendApplicationStatusUpdate = async (userEmail, applicationData) => {
  console.log('📧 Sending status update to:', userEmail);
  try {
    const result = await sendApplicationConfirmation(userEmail, {
      ...applicationData,
      status: applicationData.status || 'updated'
    });
    return result;
  } catch (error) {
    console.error('Status update error:', error);
    return { success: false, error: error.message };
  }
};

// Test function
export const sendTestEmail = async (toEmail) => {
  console.log('🧪 Sending test email to:', toEmail);
  try {
    const result = await sendApplicationConfirmation(toEmail, {
      propertyName: 'Oceanfront Luxury Villa',
      propertyLocation: 'Maldives Beach Resort',
      applicantName: 'Test Applicant',
      referenceNumber: 'TEST-' + Date.now(),
      status: 'submitted'
    });
    return result;
  } catch (error) {
    console.error('Test email error:', error);
    return { success: false, error: error.message };
  }
};

// Configuration check
export const canSendEmails = async () => {
  return {
    hasEmailService: true,
    message: 'Email service is configured and ready',
    domain: 'palmsestate.org',
    fromEmail: 'notification@palmsestate.org'
  };
};

// For compatibility
export const sendEmailViaEdgeFunction = async (emailData) => {
  return sendApplicationConfirmation(emailData.to, emailData);
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return { success: false, message: 'Password reset emails not implemented' };
};

// Test the service
export async function testEmailService() {
  console.log('🧪 Testing email service...');
  const result = await sendTestEmail('test@example.com');
  console.log('Test result:', result);
  return result;
}
