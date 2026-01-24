// src/lib/emailService.js - UPDATED FOR EDGE FUNCTION WITH BUILT-IN TEMPLATE
import { supabase } from './supabase';

// Validate UUID format for logging
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuid && uuidRegex.test(uuid);
};

// Log email to database
async function logEmailToDatabase(to, userId, applicationId, data, status, resendId = null, errorMessage = null) {
  try {
    const emailType = data.status === 'submitted' ? 'application_confirmation' : 'status_update';
    const subject = data.status === 'submitted' 
      ? `Application Received - ${data.propertyName}` 
      : `Application Status Update - ${data.propertyName}`;
    
    // Validate resendId if provided
    let validatedResendId = null;
    if (resendId && isValidUUID(resendId)) {
      validatedResendId = resendId;
    } else if (resendId) {
      console.warn('⚠️ Invalid Resend ID format, not logging:', resendId);
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
    
    // Only add resend_id if it's a valid UUID
    if (validatedResendId) {
      logData.resend_id = validatedResendId;
    }
    
    const { error } = await supabase.from('email_logs').insert([logData]);
    
    if (error) {
      console.error('❌ Failed to insert email log:', error);
      return false;
    } else {
      console.log('📝 Email logged to database successfully');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to log email:', error);
    return false;
  }
}

// Main function - Application Confirmation
// NOW SENDS DATA ONLY - Edge Function generates the HTML
export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  console.log('=== EMAIL SERVICE START ===');
  console.log('📧 Sending application confirmation to:', userEmail);
  console.log('📧 Application data:', applicationData);
  
  try {
    // Prepare email data - Edge Function will use this to generate HTML
    const emailData = {
      propertyName: applicationData.propertyName || applicationData.propertyTitle || 'Property',
      propertyLocation: applicationData.propertyLocation || 'Location',
      applicantName: applicationData.fullName || applicationData.applicantName || applicationData.customerName || 'Applicant',
      referenceNumber: applicationData.referenceNumber || `APP-${Date.now()}`,
      status: applicationData.status || 'submitted',
      statusNote: applicationData.statusNote || ''
    };
    
    // Get user ID from email for logging
    let userId = null;
    try {
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle();
      
      if (!error && userData) {
        userId = userData.id;
      }
    } catch (error) {
      console.log('Could not find user ID for email:', userEmail);
    }
    
    // Determine email type
    const emailType = emailData.status === 'new_submission_admin' ? 'admin' : 'user';
    
    console.log('📤 Calling Supabase Edge Function with data only...');
    console.log('📧 Email data being sent:', emailData);
    
    // Send to Edge Function - NO HTML/TEXT, just the data
    const { data: edgeFunctionResult, error: edgeError } = await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        type: emailType,
        applicationData: emailData
        // No html/text fields here - Edge Function generates them
      }
    });
    
    if (edgeError) {
      console.error('❌ Edge Function error:', edgeError);
      
      // Log error to database
      await logEmailToDatabase(
        userEmail,
        userId,
        applicationData.applicationId,
        emailData,
        'failed',
        null,
        edgeError.message
      );
      
      return {
        success: false,
        error: edgeError.message,
        message: 'Failed to send email'
      };
    }
    
    console.log('✅ Edge Function response:', edgeFunctionResult);
    
    if (edgeFunctionResult && edgeFunctionResult.success) {
      console.log('✅ Email sent successfully via Edge Function');
      console.log('📧 Email ID:', edgeFunctionResult.emailId);
      
      // Log success to database
      await logEmailToDatabase(
        userEmail,
        userId,
        applicationData.applicationId,
        emailData,
        'sent',
        edgeFunctionResult.emailId || null
      );
      
      return {
        success: true,
        message: 'Email sent successfully',
        reference: emailData.referenceNumber,
        method: 'edge-function',
        emailId: edgeFunctionResult.emailId || null
      };
    } else {
      console.error('❌ Edge Function returned error:', edgeFunctionResult?.error);
      
      // Log error to database
      await logEmailToDatabase(
        userEmail,
        userId,
        applicationData.applicationId,
        emailData,
        'failed',
        null,
        edgeFunctionResult?.error || 'Unknown error'
      );
      
      return {
        success: false,
        error: edgeFunctionResult?.error || 'Email sending failed',
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

// Function to send admin notification about new application
export const sendAdminNotification = async (applicationData) => {
  console.log('📧 Sending admin notification...');
  try {
    const adminEmail = 'admin@palmsestate.org';
    
    // Prepare admin notification data
    const adminData = {
      ...applicationData,
      propertyName: applicationData.propertyName || applicationData.propertyTitle || 'Property',
      propertyLocation: applicationData.propertyLocation || 'Location',
      applicantName: applicationData.fullName || applicationData.applicantName || applicationData.customerName || 'Applicant',
      referenceNumber: applicationData.referenceNumber || `APP-${Date.now()}`,
      status: 'new_submission_admin',
      statusNote: 'New application submitted - requires review'
    };
    
    // Send to Edge Function
    const { data: edgeFunctionResult, error: edgeError } = await supabase.functions.invoke('send-email', {
      body: {
        to: adminEmail,
        type: 'admin',
        applicationData: adminData
      }
    });
    
    if (edgeError) {
      console.error('❌ Admin email error:', edgeError);
      return { success: false, error: edgeError.message };
    }
    
    return edgeFunctionResult;
    
  } catch (error) {
    console.error('❌ Admin notification error:', error);
    return { success: false, error: error.message };
  }
};

// Function for sending status updates
export const sendApplicationStatusUpdate = async (userEmail, applicationData) => {
  console.log('📧 Sending status update to:', userEmail);
  try {
    // Prepare status update data
    const statusData = {
      ...applicationData,
      status: applicationData.status || 'updated',
      statusNote: applicationData.statusNote || 'Your application status has been updated'
    };
    
    // Use the main send function
    return await sendApplicationConfirmation(userEmail, statusData);
    
  } catch (error) {
    console.error('❌ Status update email error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send status update email'
    };
  }
};

// Simple test email function
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

// Check if email service is configured
export const canSendEmails = async () => {
  try {
    // Test if Edge Function is accessible
    const { error } = await supabase.functions.invoke('send-email', {
      body: { test: true }
    });
    
    return {
      hasEmailService: true,
      message: 'Email service is configured and ready',
      method: 'supabase-edge-function',
      domain: 'palmsestate.org',
      fromEmail: 'notification@palmsestate.org'
    };
  } catch (error) {
    return {
      hasEmailService: false,
      message: 'Email service not configured: ' + error.message,
      method: 'none'
    };
  }
};

// Direct test function
export async function testEmailService() {
  console.log('🧪 Testing email service...');
  
  const config = await canSendEmails();
  console.log('Configuration check:', config);
  
  if (!config.hasEmailService) {
    return {
      success: false,
      error: 'Email service not configured',
      message: config.message
    };
  }
  
  // Send a test email
  const result = await sendTestEmail('test@example.com');
  console.log('📧 Test email result:', result);
  
  return result;
}

// Fallback function for direct email sending (if needed)
export const sendEmailDirect = async (toEmail, subject, html, text, type = 'user') => {
  console.log('📧 Sending email directly via Edge Function...');
  
  try {
    const { data: result, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: toEmail,
        subject: subject,
        html: html,
        text: text,
        type: type
      }
    });
    
    if (error) throw error;
    return result;
    
  } catch (error) {
    console.error('Direct email error:', error);
    return { success: false, error: error.message };
  }
};

// For compatibility with existing code
export const sendEmailViaEdgeFunction = async (emailData) => {
  return sendApplicationConfirmation(emailData.to, emailData);
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return { 
    success: false, 
    message: 'Password reset emails not implemented',
    error: 'Use Supabase Auth for password reset instead'
  };
};

// Helper to check if template is being generated
export const checkTemplateGeneration = async (testData = {}) => {
  const data = {
    propertyName: 'Test Property',
    propertyLocation: 'Test Location',
    applicantName: 'Test Applicant',
    referenceNumber: 'TEST-123',
    status: 'submitted',
    ...testData
  };
  
  console.log('🔍 Checking template generation...');
  console.log('Test data:', data);
  
  // Try to send a test email
  const result = await sendTestEmail('test@example.com');
  
  return {
    testData: data,
    emailResult: result,
    timestamp: new Date().toISOString()
  };
};
