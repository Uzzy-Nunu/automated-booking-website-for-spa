export interface Appointment {
  appointment_id: string;
  slot: string; // ISO datetime string representing the booked slot
  service: string;
  client_name: string;
  notes?: string;
}

export interface AvailabilitySlot {
  start: string; // ISO datetime string
  end: string;   // ISO datetime string
  service: string;
}
// Payload sent from the booking page to the booking API
export interface BookingPayload {
  slot: string;
  service: string;
  client_name: string;
  notes?: string;
}

// Response returned by the booking API
export interface BookingResponse {
  booking_id: string;
  success: boolean;
}
