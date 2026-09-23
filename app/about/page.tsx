import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 text-center">
        About Reaus Spa
      </h1>
      <p className="text-lg text-stone-700 leading-relaxed mb-8 text-center font-light">
        A sanctuary of stillness and rejuvenation, crafted to help you unwind and glow from the inside out.
      </p>

      <div className="grid md:grid-cols-2 gap-8 my-12 items-center">
        <div className="bg-amber-100/50 p-8 rounded-2xl border border-amber-200">
          <h2 className="font-serif text-2xl mb-4 text-stone-900">Our Wellness Philosophy</h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            At Reaus Spa, we believe wellness is never a compromise. Our treatments combine holistic therapeutic traditions with modern aesthetic techniques, tailored specifically to your body's rhythm.
          </p>
        </div>

        <div className="bg-stone-900 text-amber-50 p-8 rounded-2xl">
          <h2 className="font-serif text-2xl mb-4">Concept Redesign Note</h2>
          <p className="text-amber-200/80 text-sm leading-relaxed">
            This site is an independent portfolio redesign project demonstrating automated spa bookings, AI concierge assistance, and real-time scheduling integration.
          </p>
        </div>
      </div>
    </div>
  );
}
