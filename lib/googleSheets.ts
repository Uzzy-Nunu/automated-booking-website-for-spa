import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import type { Appointment } from '@/lib/types';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '';

function getAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? '';
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? '';
  return new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function getAppointments(): Promise<Appointment[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Appointments!A2:E',
  });
  const rows = res.data.values || [];
  return rows.map((row: string[]) => ({
    appointment_id: row[0],
    slot: row[1],
    service: row[2],
    client_name: row[3],
    notes: row[4] ?? '',
  }));
}

export async function addAppointment(appointment: Appointment): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Appointments!A2:E',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        [
          appointment.appointment_id,
          appointment.slot,
          appointment.service,
          appointment.client_name,
          appointment.notes ?? '',
        ],
      ],
    },
  });
}
