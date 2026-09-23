import { NextResponse } from 'next/server';
import type { BookingPayload, BookingResponse, Appointment } from '@/lib/types';
import { addAppointment } from '@/lib/googleSheets';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const payload: BookingPayload = await request.json();
    const { service, client_name, notes, slot } = payload;
    if (!service || !client_name || !slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const booking_id = uuidv4();
    const appointment: Appointment = {
      appointment_id: booking_id,
      slot,
      service,
      client_name,
      notes: notes ?? '',
    };
    // Append to Google Sheet
    await addAppointment(appointment);
    // Log in Supabase (optional – for chatbot knowledge base)
    const { error: supabaseError } = await supabase.from('bookings').insert({
      booking_id,
      service,
      client_name,
      notes: notes ?? '',
      slot,
    });
    if (supabaseError) {
      console.warn('Supabase insert error:', supabaseError);
    }
    const response: BookingResponse = { booking_id, success: true };
    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
