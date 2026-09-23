import { supabase } from '@/lib/supabaseClient';

export interface ComplaintAlertPayload {
  session_id: string;
  client_name?: string;
  client_contact?: string;
  complaint_details: string;
}

/**
 * Log complaint to chat_logs and dispatch human-handoff alert
 */
export async function sendComplaintAlert(payload: ComplaintAlertPayload): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Log to chat_logs with flagged_complaint = true
    await supabase.from('chat_logs').insert({
      session_id: payload.session_id,
      role: 'user',
      message: `[HANDOFF REQUEST] ${payload.complaint_details} | Contact: ${payload.client_contact ?? 'N/A'}`,
      flagged_complaint: true,
      created_at: new Date().toISOString(),
    });

    // 2. Alert notification (e.g., logging or sending via external email API if configured)
    console.log(`[HUMAN HANDOFF ALERT] Session: ${payload.session_id} | Details: ${payload.complaint_details} | Contact: ${payload.client_contact}`);

    return {
      success: true,
      message: 'Your request has been routed to our team. A concierge staff member will follow up with you shortly.',
    };
  } catch (err) {
    console.error('Failed to send complaint alert:', err);
    return {
      success: false,
      message: 'Failed to dispatch alert. Please reach us directly on WhatsApp at +234 800 REAUS-SPA.',
    };
  }
}
