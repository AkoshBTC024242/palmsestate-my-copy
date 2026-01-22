// src/lib/applicationStatus.js
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
    const { data, error } = await supabase
      .from('applications')
      .update({
        status: newStatus,
        status_note: note,
        updated_at: new Date().toISOString(),
        reviewed_at: new Date().toISOString()
      })
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
    await supabase.from('application_status_logs').insert({
      application_id: applicationId,
      from_status: application.status,
      to_status: newStatus,
      note: note,
      changed_by: 'admin', // You might want to pass admin user ID here
      created_at: new Date().toISOString()
    });
    
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
