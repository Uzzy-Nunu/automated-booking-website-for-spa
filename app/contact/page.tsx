import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 text-center">
        Contact & Location
      </h1>
      <p className="text-center text-stone-600 mb-12">
        We look forward to welcoming you. Get in touch with our concierge team.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="font-serif text-2xl mb-4 text-stone-900">Reach Us Directly</h2>
          <div className="space-y-4 text-stone-700 text-sm">
            <p><strong>Address:</strong> 123 Wellness Way, Victoria Island, Lagos</p>
            <p><strong>Phone:</strong> +234 800 REAUS-SPA</p>
            <p><strong>WhatsApp:</strong> +234 800 732 8777</p>
            <p><strong>Hours:</strong> Daily 9:00 AM – 7:00 PM</p>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
          <h2 className="font-serif text-2xl mb-4 text-stone-900">Need Assistance?</h2>
          <p className="text-sm text-stone-700 mb-4">
            Our AI Concierge is available 24/7 at the bottom right of your screen to answer treatment queries and calculate service totals instantly.
          </p>
          <a
            href="https://wa.me/2348007328777"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-800 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-amber-900 transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
