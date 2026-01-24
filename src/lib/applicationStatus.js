// src/lib/applicationStatus.js - DEBUG VERSION
import { supabase } from './supabase';
import { sendApplicationConfirmation } from './emailService';

// Update application status and send email
export async function updateApplicationStatus(applicationId, newStatus, note = '') {
  console.log('=== DEBUG: updateApplicationStatus START ===');
  console.log('Inputs:', { applicationId, newStatus, note });
  
  try {
    console.log('1. Fetching application details...');
    
    // Get application details first
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*, property:properties(*)')
      .eq('id', applicationId)
      .single();
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      throw fetchError;
    }
    
    console.log('2. Application fetched:', { 
      id: application.id,
      currentStatus: application.status,
      email: application.email 
    });
    
    // Update status in database
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      last_status_change: new Date().toISOString()
    };

    console.log('3. Setting timestamps for status:', newStatus);
    
    // Set specific timestamps based on status
    if (newStatus === 'approved_pending_info') {
      updateData.initial_approved_at = new Date().toISOString();
    } else if (newStatus === 'approved') {
      updateData.final_approved_at = new Date().toISOString();
    } else if (newStatus === 'rejected') {
      updateData.rejection_reason = note;
    } else if (newStatus === 'paid_under_review') {
      updateData.paid_at = new Date().toISOString();
      updateData.payment_status = 'paid';
    } else if (newStatus === 'additional_info_submitted') {
      updateData.additional_info_submitted_at = new Date().toISOString();
    } else if (newStatus === 'payment_pending') {
      updateData.payment_status = 'pending';
    }

    console.log('4. Update data:', updateData);
    
    console.log('5. Updating database...');
    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }
    
    console.log('6. Database updated successfully');
    
    // Send status update email to applicant
    let emailResult = { success: false };
    try {
      console.log('7. Preparing email data...');
      const emailData = {
        fullName: application.full_name,
        referenceNumber: application.reference_number,
        applicationId: application.id,
        propertyName: application.property?.title || 'Property',
        propertyLocation: application.property?.location || 'Location',
        status: newStatus,
        statusNote: note || `Your application status has been updated to ${newStatus}.`
      };

      // Add payment link for pre-approved and payment pending statuses
      if (newStatus === 'pre_approved' || newStatus === 'payment_pending') {
        emailData.paymentLink = `https://palmsestate.org/payment/${application.id}`;
        emailData.statusNote = note || 'Please pay the $50 application fee to continue with your application.';
        console.log('8. Added payment link to email data');
      }

      console.log('8. Sending email with data:', emailData);
      
      emailResult = await sendApplicationConfirmation(application.email, emailData);
      
      console.log('9. Email result:', emailResult);
    } catch (emailError) {
      console.warn('⚠️ Email sending failed (continuing anyway):', emailError);
      // Continue anyway - status was updated
    }
    
    // Log the status change
    try {
      console.log('10. Logging status change...');
      await supabase.from('application_status_logs').insert({
        application_id: applicationId,
        from_status: application.status,
        to_status: newStatus,
        note: note,
        changed_by: 'admin',
        created_at: new Date().toISOString()
      });
      console.log('11. Status change logged');
    } catch (logError) {
      console.warn('⚠️ Could not log status change:', logError);
    }
    
    // Add a note about status change
    try {
      console.log('12. Adding admin note...');
      await supabase
        .from('application_notes')
        .insert({
          application_id: applicationId,
          content: `Status changed to: ${getStatusLabel(newStatus)}${note ? ` - Reason: ${note}` : ''}`,
          created_by: 'system',
          created_at: new Date().toISOString()
        });
      console.log('13. Admin note added');
    } catch (noteError) {
      console.warn('⚠️ Could not add note:', noteError);
    }
    
    console.log('=== DEBUG: updateApplicationStatus SUCCESS ===');
    
    return {
      success: true,
      data: data,
      emailSent: emailResult.success,
      message: 'Status updated successfully'
    };
    
  } catch (error) {
    console.error('=== DEBUG: updateApplicationStatus ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to update status'
    };
  }
}

// Send payment request email
export async function sendPaymentRequest(applicationId, note = '') {
  console.log('=== DEBUG: sendPaymentRequest START ===');
  console.log('Inputs:', { applicationId, note });
  
  try {
    console.log('1. Fetching application for payment request...');
    
    // Get application details
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*, property:properties(*)')
      .eq('id', applicationId)
      .single();
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      throw fetchError;
    }
    
    console.log('2. Application fetched:', {
      id: application.id,
      status: application.status,
      email: application.email
    });
    
    // Update status to payment_pending if not already
    if (application.status !== 'payment_pending') {
      console.log('3. Updating status to payment_pending...');
      await updateApplicationStatus(applicationId, 'payment_pending', note || 'Payment request sent');
    } else {
      console.log('3. Status already payment_pending, skipping update');
    }
    
    // Send payment request email
    console.log('4. Sending payment request email...');
    const emailResult = await sendApplicationConfirmation(application.email, {
      fullName: application.full_name,
      referenceNumber: application.reference_number,
      applicationId: application.id,
      propertyName: application.property?.title || 'Property',
      propertyLocation: application.property?.location || 'Location',
      status: 'payment_pending',
      statusNote: note || 'Please pay the application fee to continue with your application.',
      paymentLink: `https://palmsestate.org/payment/${application.id}`
    });
    
    console.log('5. Payment request email result:', emailResult);
    
    // Add a note about payment request
    try {
      console.log('6. Adding payment request note...');
      await supabase
        .from('application_notes')
        .insert({
          application_id: applicationId,
          content: `Payment request email sent to applicant. ${note ? `Note: ${note}` : ''}`,
          created_by: 'system',
          created_at: new Date().toISOString()
        });
      console.log('7. Note added');
    } catch (noteError) {
      console.warn('⚠️ Could not add note:', noteError);
    }
    
    console.log('=== DEBUG: sendPaymentRequest SUCCESS ===');
    
    return {
      success: true,
      emailSent: emailResult.success,
      message: 'Payment request sent successfully'
    };
    
  } catch (error) {
    console.error('=== DEBUG: sendPaymentRequest ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send payment request'
    };
  }
}

// Helper function for status labels
function getStatusLabel(status) {
  const labels = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    pre_approved: 'Pre-Approved',
    approved_pending_info: 'Approved - Pending Info',
    additional_info_submitted: 'Additional Info Submitted',
    paid_under_review: 'Paid - Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    payment_pending: 'Payment Pending'
  };
  return labels[status] || status;
}

// Test function to debug email sending
export async function testEmailService(toEmail = 'test@example.com') {
  console.log('=== DEBUG: testEmailService START ===');
  
  try {
    console.log('1. Testing sendApplicationConfirmation...');
    
    const result = await sendApplicationConfirmation(toEmail, {
      fullName: 'Test User',
      referenceNumber: 'TEST-' + Date.now().toString().slice(-6),
      applicationId: 'test-123',
      propertyName: 'Test Property',
      propertyLocation: 'Test Location',
      status: 'pre_approved',
      statusNote: 'This is a test email to verify the email system is working.'
    });
    
    console.log('2. Test result:', result);
    console.log('=== DEBUG: testEmailService END ===');
    
    return result;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, error: error.message };
  }
}

// Simple status update without email
export async function updateStatusOnly(applicationId, newStatus, note = '') {
  console.log('=== DEBUG: updateStatusOnly START ===');
  
  try {
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      last_status_change: new Date().toISOString()
    };

    console.log('Update data:', updateData);
    
    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('=== DEBUG: updateStatusOnly SUCCESS ===');
    return { success: true, data };
    
  } catch (error) {
    console.error('=== DEBUG: updateStatusOnly ERROR ===');
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}
