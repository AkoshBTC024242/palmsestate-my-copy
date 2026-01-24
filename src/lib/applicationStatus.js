// src/lib/applicationStatus.js - UPDATED WITH PAYMENT INTEGRATION
import { supabase } from './supabase';
import { sendApplicationConfirmation } from './emailService';

// Update application status and send email
export async function updateApplicationStatus(applicationId, newStatus, note = '') {
  try {
    console.log('Updating application status:', { applicationId, newStatus, note });
    
    // Get application details first
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*, property:properties(*)')
      .eq('id', applicationId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Update status in database - using only fields that exist in the table
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      last_status_change: new Date().toISOString()
    };

    // Set specific timestamps based on status (using fields that exist)
    if (newStatus === 'approved_pending_info') {
      updateData.initial_approved_at = new Date().toISOString();
    } else if (newStatus === 'approved') {
      updateData.final_approved_at = new Date().toISOString();
    } else if (newStatus === 'rejected') {
      updateData.rejection_reason = note;
      // Note: There is no rejected_at field in the table
    } else if (newStatus === 'paid_under_review') {
      updateData.paid_at = new Date().toISOString();
      updateData.payment_status = 'paid';
    } else if (newStatus === 'additional_info_submitted') {
      updateData.additional_info_submitted_at = new Date().toISOString();
    } else if (newStatus === 'payment_pending') {
      updateData.payment_status = 'pending';
    }

    console.log('Updating application with data:', updateData);
    
    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    // Send status update email to applicant
    let emailResult = { success: false };
    try {
      const emailData = {
        fullName: application.full_name,
        referenceNumber: application.reference_number,
        applicationId: application.id,
        propertyName: application.property?.title || 'Property',
        propertyLocation: application.property?.location || 'Location',
        status: newStatus,
        statusNote: note
      };

      // Add payment link for pre-approved and payment pending statuses
      if (newStatus === 'pre_approved' || newStatus === 'payment_pending') {
        emailData.paymentLink = `https://palmsestate.org/payment/${application.id}`;
        
        if (newStatus === 'payment_pending') {
          emailData.statusNote = note || 'Application fee payment is pending. Please pay the $50 fee to continue with your application.';
        }
      }

      // Add payment details for paid status
      if (newStatus === 'paid_under_review') {
        emailData.paymentAmount = '$50.00';
        emailData.paymentDate = new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }

      emailResult = await sendApplicationConfirmation(application.email, emailData);
      
      console.log('Status update email sent:', emailResult);
    } catch (emailError) {
      console.warn('Failed to send status update email:', emailError);
      // Continue anyway - status was updated
    }
    
    // Log the status change
    try {
      await supabase.from('application_status_logs').insert({
        application_id: applicationId,
        from_status: application.status,
        to_status: newStatus,
        note: note,
        changed_by: 'admin',
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('Could not log status change:', logError);
    }
    
    // Add a note about status change
    try {
      await supabase
        .from('application_notes')
        .insert({
          application_id: applicationId,
          content: `Status changed to: ${getStatusLabel(newStatus)}${note ? ` - Reason: ${note}` : ''}`,
          created_by: 'system',
          created_at: new Date().toISOString()
        });
    } catch (noteError) {
      console.warn('Could not add note:', noteError);
    }

    // Send admin notification for important status changes
    if (newStatus === 'pre_approved' || newStatus === 'paid_under_review' || newStatus === 'approved') {
      try {
        await sendApplicationConfirmation('admin@palmsestate.org', {
          fullName: application.full_name,
          referenceNumber: application.reference_number,
          applicationId: application.id,
          propertyName: application.property?.title || 'Property',
          status: newStatus,
          statusNote: `Application ${newStatus === 'pre_approved' ? 'pre-approved and payment requested' : newStatus === 'paid_under_review' ? 'fee paid, ready for final review' : 'fully approved'} by admin. ${note ? `Note: ${note}` : ''}`,
          paymentAmount: newStatus === 'paid_under_review' ? '$50.00' : undefined
        });
      } catch (adminEmailError) {
        console.warn('Failed to send admin notification:', adminEmailError);
      }
    }
    
    return {
      success: true,
      data: data,
      emailSent: emailResult.success,
      message: 'Status updated successfully'
    };
    
  } catch (error) {
    console.error('Error updating application status:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to update status'
    };
  }
}

// Send status update email function
export async function sendApplicationStatusUpdate(userEmail, applicationData) {
  try {
    console.log('Sending status update to:', userEmail);
    
    // Use the main sendApplicationConfirmation function
    return await sendApplicationConfirmation(userEmail, applicationData);
    
  } catch (error) {
    console.error('❌ Status update email error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send status update email'
    };
  }
}

// Send payment request email
export async function sendPaymentRequest(applicationId, note = '') {
  try {
    console.log('Sending payment request for application:', applicationId);
    
    // Get application details
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*, property:properties(*)')
      .eq('id', applicationId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Update status to payment_pending if not already
    if (application.status !== 'payment_pending') {
      await updateApplicationStatus(applicationId, 'payment_pending', note || 'Payment request sent');
    }
    
    // Send payment request email
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
    
    // Add a note about payment request
    try {
      await supabase
        .from('application_notes')
        .insert({
          application_id: applicationId,
          content: `Payment request email sent to applicant. ${note ? `Note: ${note}` : ''}`,
          created_by: 'system',
          created_at: new Date().toISOString()
        });
    } catch (noteError) {
      console.warn('Could not add note:', noteError);
    }
    
    return {
      success: true,
      emailSent: emailResult.success,
      message: 'Payment request sent successfully'
    };
    
  } catch (error) {
    console.error('Error sending payment request:', error);
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

export async function getApplicationWithDetails(applicationId) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        property:properties(*),
        status_logs:application_status_logs(*)
      `)
      .eq('id', applicationId)
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get payment status
export async function getPaymentStatus(applicationId) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('payment_status, stripe_payment_id, paid_at, application_fee')
      .eq('id', applicationId)
      .single();
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: {
        paymentStatus: data.payment_status || 'unpaid',
        paymentId: data.stripe_payment_id,
        paidAt: data.paid_at,
        fee: data.application_fee || 50
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
