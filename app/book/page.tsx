import { useState, useEffect } from 'react';

interface AvailabilitySlot { start: string; end: string; service: string; }

export default function BookingPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [bookingId, setBookingId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/api/availability')
      .then(res => res.json())
      .then(data => setSlots(data.slots || []))
      .catch(() => setSlots([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedSlot || !service || !clientName) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot: selectedSlot, service, client_name: clientName, notes }),
      });
      const result = await res.json();
      if (res.ok) {
        setBookingId(result.booking_id);
      } else {
        setError(result.error || 'Failed to book');
      }
    } catch {
      setError('Network error');
    }
  };

  if (bookingId) {
    return (
      <div className="p-4 max-w-prose mx-auto">
        <h2 className="text-2xl font-bold mb-4">Booking Confirmed</h2>
        <p>Your booking ID is <strong>{bookingId}</strong>. We look forward to seeing you!</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book a Treatment</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Slot</label>
          <select
            value={selectedSlot}
            onChange={e => setSelectedSlot(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Choose a time --</option>
 {slots.map((s, i) => (
 <option key={i} value={s.start}>
 {new Date(s.start).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
 </option>
 ))}
 </select>
 </div>
        <div>
          <label className="block mb-1 font-medium">Service</label>
          <input
            type="text"
            value={service}
            onChange={e => setService(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g. Deep Tissue Massage"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            type="text"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <button type="submit" className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark">
          Confirm Booking
        </button>
      </form>
 </div>
 );
}
