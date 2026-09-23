import React from 'react';
import Link from 'next/link';
import Hero from '@/app/components/Hero';
import TreatmentCard from '@/app/components/TreatmentCard';
import servicePrices from '@/lib/service-prices.json';

export default function Home() {
  const featuredTreatments = servicePrices.slice(0, 4).map((s, idx) => ({
    ...s,
    name: s.service_name,
    image: `/images/treatment-${idx + 1}.jpg`,
  }));

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <Hero />

      <div className="max-w-6xl mx-auto px-4 space-y-20">
        {/* 2. Content Duo / About Summary Block */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="w-full h-80 bg-stone-300 rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
              <span className="text-white/80 font-serif text-lg bg-black/40 px-4 py-2 rounded">Sanctuary of Serenity</span>
            </div>
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 bg-amber-800/20 rounded-2xl border border-amber-800/30 backdrop-blur -z-10" />
          </div>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">Welcome to Reaus</span>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight">
              A Sanctuary Crafted to Restore Mind, Body, and Spirit
            </h2>
            <p className="text-stone-600 leading-relaxed font-light text-sm md:text-base">
              At Reaus Spa, wellness is never a compromise. We blend ancestral holistic rituals with state-of-the-art restorative therapies to create tailored treatments that revitalize your energy.
            </p>
            <div>
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-medium text-amber-900 hover:text-amber-700 tracking-wide uppercase group"
              >
                Explore Our Story <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Featured Treatments Grid */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">Curated Experiences</span>
              <h2 className="font-serif text-3xl text-stone-900">Featured Treatments</h2>
            </div>
            <Link
              href="/treatments"
              className="text-sm font-medium text-amber-900 hover:underline uppercase tracking-wider"
            >
              View All Services →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTreatments.map((service, index) => (
              <TreatmentCard key={index} service={service} />
            ))}
          </div>
        </section>

        {/* 4. Why Choose Us Section (Asymmetric 2-column layout per §5) */}
        <section className="bg-amber-100/40 p-8 md:p-12 rounded-3xl border border-amber-900/10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">The Reaus Standard</span>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight">
              Why Discerning Guests Choose Our Haven
            </h2>
            <p className="text-stone-600 text-sm font-light leading-relaxed">
              Every detail is meticulously designed for your peace. From custom-blended botanical oils to private treatment suites.
            </p>
          </div>

          <div className="md:col-span-7 grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-800/10 flex items-center justify-center text-amber-800 text-lg font-serif">
                🌿
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Holistic Botanicals</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Organic, cold-pressed botanical formulations tailored to nourish skin and ease tension.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-800/10 flex items-center justify-center text-amber-800 text-lg font-serif">
                ✨
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Master Practitioners</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Certified wellness specialists dedicated to personalizing every massage and facial.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-800/10 flex items-center justify-center text-amber-800 text-lg font-serif">
                🏛️
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Private Suites</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sound-insulated, temperature-controlled private suites with ambient hydrotherapy accents.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-800/10 flex items-center justify-center text-amber-800 text-lg font-serif">
                🤖
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Instant AI Concierge</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                24/7 intelligent scheduling assistant to answer queries and reserve slots seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Call to Action Banner */}
        <section className="bg-stone-900 text-amber-50 p-10 md:p-16 rounded-3xl text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-5xl">Begin Your Journey to Stillness</h2>
          <p className="text-amber-200/80 max-w-xl mx-auto text-sm md:text-base font-light">
            Reserve your treatment online in moments or speak with our AI concierge for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="/book"
              className="inline-block rounded border border-amber-200 px-8 py-3.5 text-sm font-medium text-amber-200 hover:bg-amber-200 hover:text-stone-900 transition tracking-wider uppercase"
            >
              Book an Appointment
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded border border-stone-700 px-8 py-3.5 text-sm font-medium text-stone-300 hover:bg-stone-800 transition tracking-wider uppercase"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
