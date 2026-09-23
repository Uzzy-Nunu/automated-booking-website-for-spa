import { readFileSync } from 'fs';
import path from 'path';
import type { BookingPayload } from '@/lib/types';
import { addAppointment, getAppointments } from '@/lib/googleSheets';
import { postToWebhook } from '@/lib/makeWebhook';

/**
 * Calculate the total price for an array of service names.
 * Reads `service-prices.json` (generated from the source-of-truth markdown).
 */
export async function calculateTotal(services: string[]): Promise<{ total: number; services_found: string[] }> {
  const filePath = path.resolve('lib/service-prices.json');
  const raw = readFileSync(filePath, 'utf-8');
  const priceList: { service_name: string; price: number }[] = JSON.parse(raw);

  let total = 0;
  const servicesFound: string[] = [];

  for (const name of services) {
    const entry = priceList.find(p => p.service_name.toLowerCase().includes(name.toLowerCase()));
    if (entry) {
      total += entry.price;
      servicesFound.push(`${entry.service_name} (₦${entry.price})`);
    }
  }

  return { total, services_found: servicesFound };
}

/**
 * Check availability for a service or list appointments.
 */
export async function checkAvailability(service: string, datetime?: string): Promise<{ available: boolean; message: string }> {
  try {
    const appointments = await getAppointments();
    if (datetime) {
      const booked = appointments.some(app => app.requested_time === datetime && app.status !== 'cancelled');
      if (booked) {
        return { available: false, message: `The time slot ${datetime} is already booked for ${service}.` };
      }
      return { available: true, message: `The slot ${datetime} is currently available for ${service}.` };
    }
    return { available: true, message: `Slots are available. Existing appointments count: ${appointments.length}.` };
  } catch (err) {
    console.error('Error checking availability:', err);
    return { available: true, message: 'Could not fetch live schedule, standard operating hours apply (9 AM - 7 PM daily).' };
  }
}

/**
 * Create a booking using the existing booking flow.
 * Re-uses Google Sheets helper and triggers Make.com webhook.
 */
export async function createBooking(payload: BookingPayload): Promise<{ booking_id: string; status: string }> {
  const bookingId = await addAppointment(payload);
  const webhookUrl = process.env.MAKE_NEW_BOOKING_WEBHOOK_URL ?? '';

  if (webhookUrl) {
    await postToWebhook(webhookUrl, { booking_id: bookingId, ...payload });
  }

  return { booking_id: bookingId, status: 'confirmed' };
}
