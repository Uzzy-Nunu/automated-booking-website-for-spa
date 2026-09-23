'use client';

import React, { useState } from 'react';

export default function ManageBookingPage() {
  const [bookingRef, setBookingRef] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingRef, new_slot: newSlot }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg('Your appointment has been successfully rescheduled.');
      } else {
        setErrorMsg(data.error || 'Failed to reschedule appointment.');
      }
    } catch {
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-6 text-center text-stone-900">
        Manage Booking
      </h1>
      <p className="text-sm text-stone-600 mb-8 text-center">
        Reschedule your session free of charge up to 24 hours prior to your scheduled time.
      </p>

      {statusMsg && (
        <div className="p-4 mb-4 bg-emerald-100 text-emerald-800 rounded-lg text-sm">
          {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 mb-4 bg-rose-100 text-rose-800 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleReschedule} className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1 text-stone-700">Booking Reference / ID</label>
          <input
            type="text"
            value={bookingRef}
            onChange={e => setBookingRef(e.target.value)}
            placeholder="e.g. bk_12345"
            className="w-full border border-stone-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-stone-700">New Date & Time Slot</label>
          <input
            type="datetime-local"
            value={newSlot}
            onChange={e => setNewSlot(e.target.value)}
            className="w-full border border-stone-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-700"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-amber-900 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Request Reschedule'}
        </button>
      </form>
    </div>
  );
}
