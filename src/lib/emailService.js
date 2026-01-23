// src/lib/emailService.js - MAKE SURE THIS IS THE ACTUAL FILE
import { supabase } from './supabase';

// Embedded email template - ACTUAL TEMPLATE
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
      <div class="status-update" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; border-radius: 8px; margin: 20px 0; color: white; text-align: center;">
        <h3 style="margin: 0 0 10px; font-size: 20px;">Application Status Updated</h3>
        <p style="margin: 0; font-size: 24px; font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        ${statusNote ? `<p style="margin: 10px 0 0; font-style: italic;">${statusNote}</p>` : ''}
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isStatusUpdate ? 'Application Status Update' : 'Application Confirmation'} - Palms Estate</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
        .details { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; transition: background 0.3s; }
        .button:hover { background: #ea580c; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
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
            <p><strong>${isStatusUpdate ? 'Updated' : 'Submitted'}:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
            <p>© ${new Date().getFullYear()} Palms Estate. All rights reserved.</p>
            <p style="font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;
};

const generateStatusUpdateText = (data) => {
  const status = data.status || 'submitted';
  const isStatusUpdate = status && status !== 'submitted';
  
  let statusText = '';
  if (isStatusUpdate) {
    statusText = `
APPLICATION STATUS UPDATE - PALMS ESTATE

Your application status has been updated to: ${status.toUpperCase()}

${data.statusNote ? `Note: ${data.statusNote}\n` : ''}
`;
  }

  return `
${statusText}
Application Details:
- Reference: ${data.referenceNumber || 'N/A'}
- Property: ${data.propertyName || 'Property'}
- Location: ${data.propertyLocation || 'Location'}
- Applicant: ${data.applicantName || 'Applicant'}
- ${isStatusUpdate ? 'Updated' : 'Submitted'}: ${new Date().toLocaleDateString()}

${!isStatusUpdate ? `
Next Steps:
1. Initial Review (1-2 business days)
2. Verification Check
3. Decision Notification
` : ''}

View your application status:
https://palmsestate.org/dashboard/applications

Questions? Contact: applications@palmsestate.org

© ${new Date().getFullYear()} Palms Estate
`.trim();
};

const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuid && uuidRegex.test(uuid);
};

async function logEmailToDatabase(to, userId, applicationId, data, status, resendId = null, errorMessage = null) {
  try {
    const emailType = data.status === 'submitted' ? 'application_confirmation' : 'status_update';
    const subject = data.status === 'submitted' 
      ? `Application Received - ${data.propertyName}` 
      : `Application Status Update - ${data.propertyName}`;
    
    let validatedResendId = null;
    if (resendId && isValidUUID(resendId)) {
      validatedResendId = resendId;
    }
    
    const logData = {
      recipient_email: to,
      user_id: userId,
      application_id: applicationId,
      subject: subject,
      email_type: emailType,
      status: status,
      error_message: errorMessage,
      details: {
        ...data,
        timestamp: new Date().toISOString()
      },
      sent_at: new Date().toISOString()
    };
    
    if (validatedResendId) {
      logData.resend_id = validatedResendId;
    }
    
    const { error } = await supabase.from('email_logs').insert([logData]);
    
    if (error) {
      console.error('❌ Failed to insert email log:', error);
      return false;
    }
    
    console.log('📝 Email logged to database');
    return true;
  } catch (error) {
    console.error('❌ Failed to log email:', error);
    return false;
  }
}

export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  console.log('=== EMAIL SERVICE START ===');
  console.log('📧 Sending to:', userEmail);
  
  try {
    const emailData = {
      applicationId: applicationData.applicationId || `APP-${Date.now()}`,
      propertyName: applicationData.propertyName || applicationData.propertyTitle || 'Property',
      propertyLocation: applicationData.propertyLocation || 'Location',
      applicantName: applicationData.fullName || applicationData.applicantName || applicationData.customerName || 'Applicant',
      referenceNumber: applicationData.referenceNumber || `APP-${Date.now()}`,
      status: applicationData.status || 'submitted',
      statusNote: applicationData.statusNote || ''
    };
    
    const htmlContent = generateApplicationEmailHTML(emailData);
    const textContent = generateStatusUpdateText(emailData);
    
    console.log('📧 HTML Length:', htmlContent.length, 'chars');
    
    if (htmlContent.length < 1000) {
      console.error('❌ HTML is too short! Might be placeholder.');
    }
    
    let userId = null;
    try {
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle();
      
      if (userData) userId = userData.id;
    } catch (error) {
      console.log('No user ID found for:', userEmail);
    }
    
    const subject = emailData.status === 'submitted' 
      ? `Application Received - ${emailData.propertyName}` 
      : `Application Status Update - ${emailData.propertyName}`;
    
    console.log('📤 Calling Edge Function...');
    
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
      console.error('❌ Edge Function error:', error);
      
      await logEmailToDatabase(
        userEmail,
        userId,
        applicationData.applicationId,
        emailData,
        'failed',
        null,
        error.message
      );
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to send email'
      };
    }
    
    console.log('✅ Edge Function result:', result);
    
    if (result.success) {
      console.log('✅ Email sent successfully');
      
      await logEmailToDatabase(
        userEmail,
        userId,
        applicationData.applicationId,
        emailData,
        'sent',
        result.emailId || null
      );
      
      return {
        success: true,
        message: 'Email sent successfully',
        reference: emailData.referenceNumber,
        method: 'edge-function',
        emailId: result.emailId || null
      };
    } else {
      console.error('❌ Edge Function error:', result.error);
      
      await logEmailToDatabase(
        userEmail,
        userId,
        applicationData.applicationId,
        emailData,
        'failed',
        null,
        result.error
      );
      
      return {
        success: false,
        error: result.error,
        message: 'Failed to send email'
      };
    }
    
  } catch (error) {
    console.error('❌ Email service error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

export const sendAdminNotification = async (applicationData) => {
  console.log('📧 Sending admin notification...');
  try {
    const adminEmail = 'admin@palmsestate.org';
    
    const emailData = {
      ...applicationData,
      status: 'new_submission_admin',
      statusNote: 'New application submitted - requires review'
    };
    
    const htmlContent = generateApplicationEmailHTML(emailData);
    const textContent = generateStatusUpdateText(emailData);
    
    const subject = `New Application - ${emailData.propertyName}`;
    
    const { data: result, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: adminEmail,
        subject: subject,
        html: htmlContent,
        text: textContent,
        type: 'admin',
        applicationData: emailData
      }
    });
    
    if (error) {
      console.error('❌ Admin email error:', error);
      return { success: false, error: error.message };
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Admin notification error:', error);
    return { success: false, error: error.message };
  }
};

export const sendApplicationStatusUpdate = async (userEmail, applicationData) => {
  console.log('📧 Sending status update to:', userEmail);
  try {
    const emailData = {
      ...applicationData,
      status: applicationData.status || 'updated'
    };
    
    return await sendApplicationConfirmation(userEmail, emailData);
    
  } catch (error) {
    console.error('❌ Status update email error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send status update email'
    };
  }
};

export const sendTestEmail = async (toEmail) => {
  console.log('🧪 Sending test email to:', toEmail);
  
  return await sendApplicationConfirmation(toEmail, {
    propertyName: 'Test Luxury Villa',
    propertyLocation: 'Maldives Beach',
    fullName: 'Test User',
    referenceNumber: 'TEST-' + Date.now(),
    status: 'submitted'
  });
};

export const canSendEmails = async () => {
  return {
    hasEmailService: true,
    message: 'Using Supabase Edge Functions for email delivery',
    domain: 'palmsestate.org',
    fromEmail: 'notification@palmsestate.org'
  };
};

export async function testEmailService() {
  console.log('🧪 Testing email service...');
  
  const result = await sendApplicationConfirmation('test@example.com', {
    propertyName: 'Test Luxury Villa',
    propertyLocation: 'Test Location, Maldives',
    fullName: 'Test User',
    referenceNumber: 'TEST-' + Date.now()
  });
  
  console.log('📧 Test result:', result);
  return result;
}

export const sendEmailViaEdgeFunction = async (emailData) => {
  return sendApplicationConfirmation(emailData.to, emailData);
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return { success: false, message: 'Not implemented' };
};
