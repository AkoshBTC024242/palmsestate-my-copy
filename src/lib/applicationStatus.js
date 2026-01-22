// src/lib/applicationStatus.js - UPDATED
import { supabase } from './supabase';
import { sendApplicationStatusUpdate } from './emailService';

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
    
    // Update status in database
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      last_email_sent_at: new Date().toISOString()
    };

    // Set specific timestamps based on status
    if (newStatus === 'approved_pending_info') {
      updateData.initial_approved_at = new Date().toISOString();
    } else if (newStatus === 'approved') {
      updateData.final_approved_at = new Date().toISOString();
    } else if (newStatus === 'rejected') {
      updateData.rejected_at = new Date().toISOString();
      updateData.rejection_reason = note;
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Send status update email to applicant
    let emailResult = { success: false };
    try {
      emailResult = await sendApplicationStatusUpdate(application.email, {
        fullName: application.full_name,
        referenceNumber: application.reference_number,
        applicationId: application.id,
        propertyName: application.property?.title || 'Property',
        propertyLocation: application.property?.location || 'Location',
        status: newStatus,
        statusNote: note
      });
      
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
