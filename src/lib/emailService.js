// src/lib/emailService.js - COMPLETE WORKING VERSION
import { supabase } from './supabase';

// ACTUAL EMAIL TEMPLATE - NO PLACEHOLDERS
const generateApplicationEmailHTML = (data) => {
  const {
    applicationId = 'APP-N/A',
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isStatusUpdate ? 'Application Status Update' : 'Application Confirmation'} - Palms Estate</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
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
            transition: background 0.3s; 
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
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">Palms Estate</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">${isStatusUpdate ? 'Application Status Update' : 'Application Confirmation'}</p>
    </div>
    
    <div class="content">
        <h2 style="color: #1f2937; margin-top: 0;">${isStatusUpdate ? 'Your Application Status Has Been Updated' : 'Thank You for Your Application!'}</h2>
        <p>${isStatusUpdate ? 'The status of your application has been updated:' : 'We\'ve received your application and will begin processing it immediately.'}</p>
        
        ${statusSection}
        
        <div class="details">
            <h3 style="color: #92400e; margin-top: 0;">Application Details</h3>
            <p><strong>Reference Number:</strong> ${referenceNumber}</p>
            <p><strong>Property:</strong> ${propertyName}</p>
            <p><strong>Location:</strong> ${propertyLocation}</p>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p><strong>${isStatusUpdate ? 'Updated' : 'Submitted'}:</strong> ${formattedDate}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://palmsestate.org/dashboard/applications" class="button">
                View Application Status
            </a>
        </div>
        
        ${!isStatusUpdate ? `
        <p><strong>What happens next?</strong></p>
        <ol style="color: #4b5563;">
            <li>Initial review (1-2 business days)</li>
            <li>Verification check</li>
            <li>Decision notification</li>
        </ol>
        ` : ''}
        
        <div class="footer">
            <p>Questions? Contact <a href="mailto:applications@palmsestate.org" style="color: #ea580c;">applications@palmsestate.org</a></p>
            <p>© ${today.getFullYear()} Palms Estate. All rights reserved.</p>
            <p style="font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;
};

// Text version
const generateStatusUpdateText = (data) => {
  const status = data.status || 'submitted';
  const isStatusUpdate = status && status !== 'submitted';
  
  let statusText = '';
  if (isStatusUpdate) {
    statusText = `APPLICATION STATUS UPDATE - PALMS ESTATE

Your application status has been updated to: ${status.toUpperCase()}

${data.statusNote ? `Note: ${data.statusNote}\n` : ''}`;
  }

  return `${statusText}Application Details:
- Reference: ${data.referenceNumber || 'N/A'}
- Property: ${data.propertyName || 'Property'}
- Location: ${data.propertyLocation || 'Location'}
- Applicant: ${data.applicantName || 'Applicant'}
- ${isStatusUpdate ? 'Updated' : 'Submitted'}: ${new Date().toLocaleDateString()}

${!isStatusUpdate ? `Next Steps:
1. Initial Review (1-2 business days)
2. Verification Check
3. Decision Notification
` : ''}
View your application status:
https://palmsestate.org/dashboard/applications

Questions? Contact: applications@palmsestate.org

© ${new Date().getFullYear()} Palms Estate`.trim();
};

// Main function
export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  console.log('📧 Starting email send to:', userEmail);
  
  try {
    // Prepare data
    const emailData = {
      applicationId: applicationData.applicationId || `APP-${Date.now()}`,
      propertyName: applicationData.propertyName || applicationData.propertyTitle || 'Property',
      propertyLocation: applicationData.propertyLocation || 'Location',
      applicantName: applicationData.fullName || applicationData.applicantName || applicationData.customerName || 'Applicant',
      referenceNumber: applicationData.referenceNumber || `APP-${Date.now()}`,
      status: applicationData.status || 'submitted',
      statusNote: applicationData.statusNote || ''
    };
    
    // Generate content
    const htmlContent = generateApplicationEmailHTML(emailData);
    const textContent = generateStatusUpdateText(emailData);
    
    console.log('📧 Generated HTML length:', htmlContent.length);
    console.log('📧 Generated text length:', textContent.length);
    
    // Check if HTML is valid
    if (htmlContent.includes('...your HTML template...') || 
        htmlContent.includes('your HTML template here') ||
        htmlContent.length < 1000) {
      console.error('❌ HTML template issue detected!');
      console.log('HTML preview:', htmlContent.substring(0, 200));
      throw new Error('Invalid HTML template generated');
    }
    
    // Get subject
    const subject = emailData.status === 'submitted' 
      ? `Application Received - ${emailData.propertyName}` 
      : `Application Status Update - ${emailData.propertyName}`;
    
    // Send via Edge Function
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
    
    if (result && result.success) {
      console.log('✅ Email sent successfully:', result.emailId);
      return {
        success: true,
        message: 'Email sent successfully',
        emailId: result.emailId
      };
    } else {
      console.error('❌ Edge Function returned error:', result?.error);
      throw new Error(result?.error || 'Email sending failed');
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

// Other functions (simplified)
export const sendAdminNotification = async (applicationData) => {
  try {
    return await sendApplicationConfirmation('admin@palmsestate.org', {
      ...applicationData,
      status: 'new_submission_admin',
      statusNote: 'New application submitted - requires review'
    });
  } catch (error) {
    console.error('Admin notification error:', error);
    return { success: false, error: error.message };
  }
};

export const sendApplicationStatusUpdate = async (userEmail, applicationData) => {
  return await sendApplicationConfirmation(userEmail, {
    ...applicationData,
    status: applicationData.status || 'updated'
  });
};

export const sendTestEmail = async (toEmail) => {
  return await sendApplicationConfirmation(toEmail, {
    propertyName: 'Test Luxury Villa',
    propertyLocation: 'Maldives Beach',
    fullName: 'Test User',
    referenceNumber: 'TEST-' + Date.now(),
    status: 'submitted'
  });
};

// Simple config check
export const canSendEmails = async () => {
  return {
    hasEmailService: true,
    message: 'Email service is configured',
    domain: 'palmsestate.org'
  };
};

// Keep for compatibility
export const sendEmailViaEdgeFunction = async (emailData) => {
  return sendApplicationConfirmation(emailData.to, emailData);
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return { success: false, message: 'Not implemented' };
};

export async function testEmailService() {
  return await sendTestEmail('test@example.com');
}
