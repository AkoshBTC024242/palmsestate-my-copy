// src/lib/emailService.js - UPDATED TO USE SUPABASE EDGE FUNCTION
import { supabase } from './supabase';

// Embedded email template (keep this as is)
const generateApplicationEmailHTML = (data) => {
  // Keep your existing template code...
  return `...your HTML template...`;
};

const generateStatusUpdateText = (data) => {
  // Keep your existing text template code...
  return `...your text template...`;
};

// Main function - Application Confirmation
export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  console.log('=== EMAIL SERVICE START ===');
  console.log('📧 Sending application confirmation to:', userEmail);
  
  try {
    // Prepare email data
    const emailData = {
      applicationId: applicationData.applicationId || `APP-${Date.now()}`,
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
    
    // Get user ID from email
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
    
    // Determine subject
    const subject = emailData.status === 'submitted' 
      ? `Application Received - ${emailData.propertyName}` 
      : `Application Status Update - ${emailData.propertyName}`;
    
    // Use Supabase Edge Function to send email
    console.log('📤 Calling Supabase Edge Function...');
    
    const { data: edgeFunctionResult, error: edgeError } = await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        subject: subject,
        html: htmlContent,
        text: textContent,
        type: 'user',
        applicationData: emailData
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
    
    if (edgeFunctionResult.success) {
      console.log('✅ Email sent successfully via Edge Function');
      
      // Log to database
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
      console.error('❌ Edge Function returned error:', edgeFunctionResult.error);
      
      // Log error to database
      await logEmailToDatabase(
        userEmail,
        userId,
        applicationData.applicationId,
        emailData,
        'failed',
        null,
        edgeFunctionResult.error
      );
      
      return {
        success: false,
        error: edgeFunctionResult.error,
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

// Function to send admin notification
export const sendAdminNotification = async (applicationData) => {
  console.log('📧 Sending admin notification...');
  try {
    const adminEmail = 'admin@palmsestate.org';
    
    const emailData = {
      ...applicationData,
      status: 'new_submission_admin',
      statusNote: 'New application submitted - requires review'
    };
    
    // Generate email content
    const htmlContent = generateApplicationEmailHTML(emailData);
    const textContent = generateStatusUpdateText(emailData);
    
    const subject = `New Application - ${emailData.propertyName}`;
    
    // Use Supabase Edge Function to send email
    const { data: edgeFunctionResult, error: edgeError } = await supabase.functions.invoke('send-email', {
      body: {
        to: adminEmail,
        subject: subject,
        html: htmlContent,
        text: textContent,
        type: 'admin',
        applicationData: emailData
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

// Keep logEmailToDatabase function (same as before)
async function logEmailToDatabase(to, userId, applicationId, data, status, resendId = null, errorMessage = null) {
  // ... keep your existing logEmailToDatabase function ...
}

// Keep other functions
export const sendApplicationStatusUpdate = async (userEmail, applicationData) => {
  try {
    console.log('📧 Sending status update to:', userEmail);
    
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
  
  console.log('📧 Test email result:', result);
  return result;
}

// For compatibility
export const sendEmailViaEdgeFunction = async (emailData) => {
  return sendApplicationConfirmation(emailData.to, emailData);
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return { success: false, message: 'Not implemented' };
};
