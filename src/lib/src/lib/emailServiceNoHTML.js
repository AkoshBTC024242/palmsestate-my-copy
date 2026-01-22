// src/lib/emailServiceNoHTML.js
import { supabase } from './supabase';

// Simple embedded template
const getApplicationConfirmationHTML = (data) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
  <div style="background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0;">Palms Estate</h1>
    <p style="margin: 5px 0 0; opacity: 0.9;">Application Confirmation</p>
  </div>
  <div style="padding: 30px; background: white; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Application Received!</h2>
    <p>Thank you for applying with Palms Estate. Your application has been received and is being processed.</p>
    
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <h3 style="color: #333; margin-top: 0;">Application Details</h3>
      <p><strong>Reference:</strong> ${data.ApplicationID || 'N/A'}</p>
      <p><strong>Property:</strong> ${data.PropertyName || 'Property'}</p>
      <p><strong>Location:</strong> ${data.PropertyLocation || 'Not specified'}</p>
      <p><strong>Submitted:</strong> ${data.ApplicationDate || new Date().toLocaleDateString()}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://palmsestate.org/dashboard/applications" 
         style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        View Your Application
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      Our team will review your application within 24-48 hours. You'll receive another email with the decision.
    </p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="color: #888; font-size: 12px; text-align: center;">
      Questions? Contact <a href="mailto:applications@palmsestate.org" style="color: #10b981;">applications@palmsestate.org</a><br>
      © ${new Date().getFullYear()} Palms Estate. All rights reserved.
    </p>
  </div>
</body>
</html>`;

export async function sendSimpleEmail(userEmail, applicationData) {
  try {
    console.log('📧 Sending email to:', userEmail);
    
    const templateData = {
      ApplicationID: applicationData.referenceNumber || `APP-${Date.now()}`,
      PropertyName: applicationData.propertyName || 'Property',
      PropertyLocation: applicationData.propertyLocation || 'Location not specified',
      ApplicationDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    const htmlContent = getApplicationConfirmationHTML(templateData);
    
    const textContent = `
Application Confirmation - Palms Estate

Your application has been received!

Application ID: ${templateData.ApplicationID}
Property: ${templateData.PropertyName}
Location: ${templateData.PropertyLocation}
Submitted: ${templateData.ApplicationDate}

Our team will review your application within 24-48 hours.

View your application: https://palmsestate.org/dashboard/applications

Questions? Contact: applications@palmsestate.org

© ${new Date().getFullYear()} Palms Estate
    `.trim();
    
    // Try Resend API
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
            subject: `Application Received - ${templateData.PropertyName}`,
            html: htmlContent,
            text: textContent,
            reply_to: 'applications@palmsestate.org'
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('✅ Email sent via Resend');
          
          await supabase.from('email_logs').insert([{
            recipient: userEmail,
            subject: `Application Received - ${templateData.PropertyName}`,
            email_type: 'application_confirmation',
            status: 'sent',
            details: { ...templateData, resendId: data.id },
            sent_at: new Date().toISOString()
          }]);
          
          return {
            success: true,
            message: 'Email sent successfully',
            reference: templateData.ApplicationID
          };
        }
      } catch (error) {
        console.warn('Resend failed:', error.message);
      }
    }
    
    // Fallback
    console.log('📧 Email would be sent to:', userEmail);
    
    await supabase.from('email_logs').insert([{
      recipient: userEmail,
      subject: `Application Received - ${templateData.PropertyName}`,
      email_type: 'application_confirmation',
      status: 'queued',
      details: templateData,
      sent_at: new Date().toISOString()
    }]);
    
    return {
      success: true,
      queued: true,
      message: 'Email queued (configure Resend API)',
      reference: templateData.ApplicationID
    };
    
  } catch (error) {
    console.error('❌ Email error:', error);
    
    await supabase.from('email_logs').insert([{
      recipient: userEmail,
      subject: 'Application Error',
      status: 'failed',
      error: error.message,
      sent_at: new Date().toISOString()
    }]);
    
    return {
      success: false,
      error: error.message
    };
  }
}
