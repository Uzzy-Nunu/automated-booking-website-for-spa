export interface Appointment {
  appointment_id: string;
  slot: string; // ISO datetime string representing the booked slot
  service: string;
  client_name: string;
  notes?: string;
  status?: string;
}

export interface AvailabilitySlot {
  start: string; // ISO datetime string
  end: string;   // ISO datetime string
  service: string;
}

export interface BookingPayload {
  slot: string;
  service: string;
  client_name: string;
  notes?: string;
}

export interface BookingResponse {
  booking_id: string;
  success: boolean;
}

export interface Service {
  service_name: string;
  name: string;
  category: string;
  price: number;
  duration_minutes?: number;
  image?: string;
}

export interface ChatPayload {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  session_id: string;
  answer: string;
}
