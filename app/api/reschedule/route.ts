import { NextResponse } from 'next/server';
import { getAppointments } from '@/lib/googleSheets';
import { postToWebhook } from '@/lib/makeWebhook';

export async function POST(request: Request) {
  try {
    const { booking_id, new_slot } = await request.json();

    if (!booking_id || !new_slot) {
      return NextResponse.json({ error: 'Missing booking_id or new_slot' }, { status: 400 });
    }

    const appointments = await getAppointments();
    const existing = appointments.find(a => a.appointment_id === booking_id);

    if (existing) {
      const apptTime = new Date(existing.slot).getTime();
      const now = Date.now();
      const hoursRemaining = (apptTime - now) / (1000 * 60 * 60);

      if (hoursRemaining < 24) {
        return NextResponse.json(
          {
            error:
              'Rescheduling is only allowed up to 24 hours before your scheduled appointment. Please contact concierge on WhatsApp for urgent changes.',
          },
          { status: 400 }
        );
      }
    }

    // Call Make.com Reschedule Webhook
    const webhookUrl = process.env.MAKE_RESCHEDULE_WEBHOOK_URL ?? '';
    if (webhookUrl) {
      await postToWebhook(webhookUrl, { booking_id, new_slot });
    }

    return NextResponse.json({ success: true, message: 'Reschedule request submitted successfully.' });
  } catch (err) {
    console.error('Reschedule API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
