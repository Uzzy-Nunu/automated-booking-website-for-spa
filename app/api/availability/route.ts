import { NextResponse } from 'next/server';
import type { AvailabilitySlot } from '@/lib/types';
import { getAppointments } from '@/lib/googleSheets';

// Placeholder logic: generate next two half‑hour slots for demonstration
function generateSlots(): AvailabilitySlot[] {
  const now = new Date();
  const slots: AvailabilitySlot[] = [];
  for (let i = 0; i < 4; i++) {
    const start = new Date(now.getTime() + i * 30 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    slots.push({ start: start.toISOString(), end: end.toISOString(), service: '' });
  }
  return slots;
}

export async function GET() {
  const existing = await getAppointments();
  const bookedTimes = new Set(existing.map(app => app.slot));
  const rawSlots = generateSlots();
  const slots = rawSlots.filter(s => !bookedTimes.has(s.start));
  return NextResponse.json({ slots });
}
