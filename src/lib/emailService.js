import { supabase } from './supabase';

// Function to send application confirmation email
export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  try {
    console.log('📧 Sending application confirmation to:', userEmail);
    
    const isTestMode = applicationData.isTestMode || false;
    const emailType = isTestMode ? 'TEST MODE' : 'PRODUCTION';
    
    const emailDetails = {
      to: userEmail,
      subject: isTestMode 
        ? `✅ [TEST] Application Auto-Approved - ${applicationData.propertyName}`
        : `Application Received - ${applicationData.propertyName}`,
      applicationId: applicationData.applicationId,
      propertyName: applicationData.propertyName,
      propertyLocation: applicationData.propertyLocation,
      propertyPrice: applicationData.propertyPrice,
      applicationDate: applicationData.applicationDate,
      paymentId: applicationData.paymentId || 'N/A',
      paymentAmount: applicationData.paymentAmount || '$0.00',
      customerName: applicationData.customerName,
      isTestMode: isTestMode,
      status: applicationData.status || (isTestMode ? 'auto-approved' : 'submitted'),
      applicationType: applicationData.applicationType || 'rental',
      timestamp: new Date().toISOString(),
      emailType: emailType
    };
    
    console.log('📋 Email details:', {
      ...emailDetails,
      propertyPrice: applicationData.propertyPrice,
      paymentAmount: applicationData.paymentAmount
    });
    
    // If in test mode, log but don't send actual email
    if (isTestMode) {
      console.log('🧪 TEST MODE EMAIL - Skipping actual send');
      console.log('📨 Test email would have been sent with details:', {
        to: emailDetails.to,
        subject: emailDetails.subject,
        customerName: emailDetails.customerName,
        applicationId: emailDetails.applicationId,
        status: emailDetails.status
      });
      
      // Log to database for testing purposes
      try {
        await supabase
          .from('email_logs')
          .insert([{
            recipient: emailDetails.to,
            subject: emailDetails.subject,
            email_type: 'application_confirmation_test',
            status: 'test_logged',
            details: emailDetails,
            sent_at: new Date().toISOString(),
            is_test: true
          }]);
      } catch (logError) {
        console.warn('Failed to log test email:', logError);
      }
      
      return {
        success: true,
        message: 'Test mode email logged (not sent)',
        isTestMode: true,
        emailDetails: emailDetails
      };
    }
    
    // Production email sending logic
    console.log('🚀 PRODUCTION MODE - Attempting to send email');
    
    // Try Supabase Edge Function first
    try {
      console.log('🔗 Calling Supabase Edge Function for email...');
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailDetails.to,
          subject: emailDetails.subject,
          template: 'application-confirmation',
          data: {
            applicationId: emailDetails.applicationId,
            propertyName: emailDetails.propertyName,
            propertyLocation: emailDetails.propertyLocation,
            propertyPrice: emailDetails.propertyPrice,
            applicationDate: emailDetails.applicationDate,
            paymentId: emailDetails.paymentId,
            paymentAmount: emailDetails.paymentAmount,
            customerName: emailDetails.customerName,
            status: emailDetails.status
          }
        }
      });
      
      if (error) {
        console.warn('Supabase Edge Function failed, trying fallback...', error);
        throw new Error('Edge function failed');
      }
      
      console.log('✅ Email sent via Supabase Edge Function:', data);
      
      // Log successful email
      await supabase
        .from('email_logs')
        .insert([{
          recipient: emailDetails.to,
          subject: emailDetails.subject,
          email_type: 'application_confirmation',
          status: 'sent',
          details: emailDetails,
          sent_at: new Date().toISOString(),
          is_test: false
        }]);
      
      return {
        success: true,
        message: 'Email sent successfully via Supabase Edge Function',
        data: data,
        emailDetails: emailDetails
      };
      
    } catch (edgeFunctionError) {
      console.warn('Edge function failed, using console fallback');
      
      // Fallback: Log to console and database
      console.log('📨 CONSOLE FALLBACK - Email details:', emailDetails);
      
      await supabase
        .from('email_logs')
        .insert([{
          recipient: emailDetails.to,
          subject: emailDetails.subject,
          email_type: 'application_confirmation_fallback',
          status: 'console_logged',
          details: emailDetails,
          sent_at: new Date().toISOString(),
          is_test: false,
          error: 'Edge function unavailable, logged to console'
        }]);
      
      return {
        success: true,
        message: 'Email queued (logged to console - configure email service for actual delivery)',
        emailDetails: emailDetails,
        note: 'Configure Resend, SendGrid, or SMTP for actual email delivery'
      };
    }
    
  } catch (error) {
    console.error('❌ Error in sendApplicationConfirmation:', error);
    
    // Log error to database
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
          is_test: applicationData.isTestMode || false
        }]);
    } catch (logError) {
      console.error('Failed to log email error:', logError);
    }
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send confirmation email'
    };
  }
};

// Function to send generic email via Supabase Edge Function
export const sendEmailViaEdgeFunction = async (emailData) => {
  try {
    console.log('📧 Sending email via edge function:', emailData.to);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });
    
    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }
    
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
        is_test: emailData.isTest || false
      }]);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email via edge function:', error);
    
    // Log error
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
        is_test: emailData.isTest || false
      }]);
    
    return { success: false, error: error.message };
  }
};

// Function to send password reset email
export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    console.log('📧 Sending password reset email to:', email);
    
    const emailData = {
      to: email,
      subject: 'Reset Your Palms Estate Password',
      template: 'password-reset',
      data: {
        resetLink: resetLink,
        supportEmail: 'support@palmsestate.org'
      }
    };
    
    return await sendEmailViaEdgeFunction(emailData);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Function to send property inquiry email
export const sendPropertyInquiry = async (inquiryData) => {
  try {
    console.log('📧 Sending property inquiry:', inquiryData.propertyTitle);
    
    const emailData = {
      to: 'inquiries@palmsestate.org', // Or specific agent email
      subject: `New Inquiry: ${inquiryData.propertyTitle}`,
      template: 'property-inquiry',
      data: {
        propertyTitle: inquiryData.propertyTitle,
        propertyLocation: inquiryData.propertyLocation,
        customerName: inquiryData.customerName,
        customerEmail: inquiryData.customerEmail,
        customerPhone: inquiryData.customerPhone || 'Not provided',
        message: inquiryData.message,
        inquiryDate: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    };
    
    return await sendEmailViaEdgeFunction(emailData);
  } catch (error) {
    console.error('Error sending property inquiry:', error);
    return { success: false, error: error.message };
  }
};

// Check if we can send emails (for debugging)
export const canSendEmails = async () => {
  try {
    // Check if email_logs table exists
    const { data: logs, error: logsError } = await supabase
      .from('email_logs')
      .select('id')
      .limit(1);
    
    // Check if we have edge function configured
    const { data: edgeTest, error: edgeError } = await supabase.functions.invoke('send-email', {
      body: { test: true }
    }).catch(() => ({ data: null, error: 'Edge function not configured' }));
    
    const hasEmailLogs = !logsError;
    const hasEdgeFunction = !edgeError;
    
    return {
      hasEmailService: hasEdgeFunction,
      hasEmailLogs: hasEmailLogs,
      service: hasEdgeFunction ? 'Supabase Edge Function' : 'Not configured',
      edgeFunctionStatus: hasEdgeFunction ? 'Available' : 'Not configured',
      databaseStatus: hasEmailLogs ? 'Available' : 'Not configured',
      message: hasEdgeFunction 
        ? 'Email service configured via Supabase Edge Functions'
        : 'Email service not configured. Configure Resend, SendGrid, or SMTP in Supabase Edge Functions.',
      recommendations: [
        '1. Create a "send-email" edge function in Supabase',
        '2. Integrate with Resend (recommended) or SendGrid',
        '3. Configure email templates in the edge function',
        '4. Test email delivery with test mode'
      ]
    };
  } catch (error) {
    return {
      hasEmailService: false,
      service: 'Not configured',
      error: error.message,
      message: 'Unable to check email service configuration'
    };
  }
};

// Get email statistics
export const getEmailStats = async () => {
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .select('status, email_type, is_test, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    const stats = {
      total: data.length,
      sent: data.filter(e => e.status === 'sent').length,
      failed: data.filter(e => e.status === 'failed').length,
      test: data.filter(e => e.is_test).length,
      byType: {},
      recent: data.slice(0, 10)
    };
    
    // Group by email type
    data.forEach(email => {
      const type = email.email_type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });
    
    return { success: true, stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
