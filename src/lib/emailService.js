// src/lib/emailService.js - UPDATED VERSION
import { supabase } from './supabase';
import { processTemplate, hasTemplate } from './emailTemplates';

// Function to send application confirmation email
export const sendApplicationConfirmation = async (userEmail, applicationData) => {
  try {
    console.log('📧 Sending application confirmation to:', userEmail);
    
    // Extract and normalize data
    const propertyTitle = applicationData.propertyName || applicationData.propertyTitle || 'Property';
    const applicationReference = applicationData.referenceNumber || applicationData.applicationId || `APP-${Date.now()}`;
    const applicantName = applicationData.fullName || applicationData.customerName || applicationData.applicantName || 'Applicant';
    const applicationId = applicationData.applicationId || applicationReference;
    
    // Prepare template data
    const templateData = {
      ApplicationID: applicationReference,
      PropertyName: propertyTitle,
      PropertyLocation: applicationData.propertyLocation || propertyTitle,
      PropertyPrice: applicationData.propertyPrice || '$N/A',
      ApplicationDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      ApplicantName: applicantName,
      ApplicantEmail: userEmail
    };
    
    // Generate HTML from template
    let htmlContent;
    if (hasTemplate('ApplicationConfirmation')) {
      htmlContent = processTemplate('ApplicationConfirmation', templateData);
    } else {
      // Fallback template if file not found
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <body>
          <h2>Application Received</h2>
          <p>Your application ${applicationReference} for ${propertyTitle} has been received.</p>
          <p>We'll review it and get back to you within 24-48 hours.</p>
          <p>View your application: https://palmsestate.org/dashboard/applications</p>
        </body>
        </html>
      `;
    }
    
    // Generate plain text version
    const textContent = `
Application Confirmation - Palms Estate

Your application has been received!

Application ID: ${applicationReference}
Property: ${propertyTitle}
Applicant: ${applicantName}
Date Submitted: ${templateData.ApplicationDate}

Next Steps:
1. Application Review - Our team will review your application
2. Background Check - Standard verification process
3. Final Decision - You'll receive our decision within 48 hours

View your application status: https://palmsestate.org/dashboard/applications

Questions? Contact concierge@palmsestate.org

© 2024 Palms Estate
    `.trim();
    
    const emailDetails = {
      to: userEmail,
      subject: `Application Received - ${propertyTitle}`,
      html: htmlContent,
      text: textContent,
      template: 'ApplicationConfirmation',
      data: templateData,
      timestamp: new Date().toISOString()
    };
    
    console.log('📋 Prepared email with template data:', {
      to: emailDetails.to,
      subject: emailDetails.subject,
      reference: templateData.ApplicationID
    });
    
    // Check if we can send emails
    const emailConfig = await canSendEmails();
    
    if (!emailConfig.hasEmailService) {
      console.warn('⚠️ Email service not configured. Logging to database...');
      
      // Log to database
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
            template: emailDetails.template,
            applicationId: templateData.ApplicationID,
            timestamp: emailDetails.timestamp
          },
          sent_at: new Date().toISOString(),
          is_test: false,
          note: 'Email queued - service not configured'
        }]);
      
      if (logError) {
        console.error('❌ Failed to log email:', logError);
      }
      
      return {
        success: true,
        queued: true,
        sent: false,
        message: 'Email queued (service not configured)',
        templateUsed: emailDetails.template,
        data: templateData
      };
    }
    
    // Try to send via Edge Function
    try {
      console.log('🔗 Attempting to send via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailDetails.to,
          subject: emailDetails.subject,
          html: htmlContent,
          text: textContent,
          template: 'ApplicationConfirmation',
          data: templateData
        }
      });
      
      if (error) {
        console.warn('⚠️ Edge Function error:', error);
        throw error;
      }
      
      console.log('✅ Email sent successfully:', data);
      
      // Log success
      await supabase
        .from('email_logs')
        .insert([{
          recipient: emailDetails.to,
          subject: emailDetails.subject,
          email_type: 'application_confirmation',
          status: 'sent',
          details: {
            to: emailDetails.to,
            subject: emailDetails.subject,
            template: emailDetails.template,
            applicationId: templateData.ApplicationID,
            timestamp: emailDetails.timestamp,
            edgeFunctionResponse: data
          },
          sent_at: new Date().toISOString(),
          is_test: false
        }]);
      
      return {
        success: true,
        sent: true,
        message: 'Email sent successfully',
        templateUsed: emailDetails.template,
        data: templateData,
        edgeFunctionResponse: data
      };
      
    } catch (sendError) {
      console.error('❌ Email sending failed:', sendError);
      
      // Fallback: log to database as failed
      await supabase
        .from('email_logs')
        .insert([{
          recipient: emailDetails.to,
          subject: emailDetails.subject,
          email_type: 'application_confirmation_error',
          status: 'failed',
          error: sendError.message,
          details: {
            to: emailDetails.to,
            subject: emailDetails.subject,
            template: emailDetails.template,
            data: templateData,
            timestamp: emailDetails.timestamp
          },
          sent_at: new Date().toISOString(),
          is_test: false
        }]);
      
      return {
        success: false,
        sent: false,
        error: sendError.message,
        message: 'Failed to send email',
        templateUsed: emailDetails.template,
        data: templateData
      };
    }
    
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

// Check email service status (updated)
export const canSendEmails = async () => {
  try {
    let edgeFunctionAvailable = false;
    let edgeFunctionTest = null;
    
    // Test Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { test: true }
      }).catch(err => ({ error: err.message }));
      
      if (error) {
        console.log('Edge Function test error (may be normal):', error);
      } else {
        edgeFunctionAvailable = true;
        edgeFunctionTest = data;
      }
    } catch (err) {
      console.log('Edge Function not reachable:', err.message);
    }
    
    // Check database logging
    const { data: logs, error: logsError } = await supabase
      .from('email_logs')
      .select('id')
      .limit(1)
      .catch(() => ({ error: 'Table not found' }));
    
    const hasEmailLogs = !logsError;
    
    return {
      hasEmailService: edgeFunctionAvailable,
      hasEmailLogs,
      service: edgeFunctionAvailable ? 'Supabase Edge Function' : 'Not configured',
      status: edgeFunctionAvailable ? 'Available' : 'Not configured - emails will be logged',
      edgeFunctionTest,
      databaseStatus: hasEmailLogs ? 'Available' : 'Not configured',
      message: edgeFunctionAvailable 
        ? 'Email service is configured and ready'
        : 'Edge Function not configured. Configure Resend API and deploy send-email function.',
      recommendations: edgeFunctionAvailable ? [] : [
        '1. Deploy the send-email Edge Function in Supabase',
        '2. Add RESEND_API_KEY and FROM_EMAIL as secrets',
        '3. Verify your email domain in Resend.com',
        '4. Test the Edge Function with the test endpoint'
      ]
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

// Generic email sending function
export const sendEmail = async (emailData) => {
  try {
    const { to, subject, template, data, html, text } = emailData;
    
    let finalHtml = html;
    let finalText = text;
    
    // Process template if specified
    if (template && hasTemplate(template)) {
      finalHtml = processTemplate(template, data || {});
      
      if (!text) {
        // Generate basic text from template data
        finalText = Object.entries(data || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      }
    }
    
    const { data: result, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html: finalHtml,
        text: finalText,
        template,
        data
      }
    });
    
    if (error) throw error;
    
    // Log to database
    await supabase
      .from('email_logs')
      .insert([{
        recipient: to,
        subject: subject,
        email_type: template || 'generic',
        status: 'sent',
        details: { to, subject, template },
        sent_at: new Date().toISOString(),
        is_test: false
      }]);
    
    return { success: true, data: result };
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

// Email stats function (unchanged)
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
      queued: data.filter(e => e.status === 'queued').length,
      test: data.filter(e => e.is_test).length,
      byType: {},
      recent: data.slice(0, 10)
    };
    
    data.forEach(email => {
      const type = email.email_type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });
    
    return { success: true, stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
