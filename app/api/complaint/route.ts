import { NextResponse } from 'next/server';
import { sendComplaintAlert, type ComplaintAlertPayload } from '@/lib/complaintAlert';

export async function POST(request: Request) {
  try {
    const payload: ComplaintAlertPayload = await request.json();
    if (!payload.session_id || !payload.complaint_details) {
      return NextResponse.json({ error: 'Missing session_id or complaint_details' }, { status: 400 });
    }

    const result = await sendComplaintAlert(payload);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Complaint route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
