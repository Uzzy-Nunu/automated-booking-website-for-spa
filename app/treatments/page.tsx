import React from 'react';
import Link from 'next/link';
import TreatmentCard from '@/app/components/TreatmentCard';
import servicePrices from '@/lib/service-prices.json';

const CATEGORIES = [
  { slug: 'facials', name: 'Facials' },
  { slug: 'massage', name: 'Massage' },
  { slug: 'body', name: 'Body Treatments' },
  { slug: 'hammam', name: 'Hammam' },
  { slug: 'wax', name: 'Waxing' },
  { slug: 'hand-and-foot', name: 'Hand & Foot' },
  { slug: 'non-invasive', name: 'Non-Invasive' },
];

export default function TreatmentsPage() {
  const treatments = servicePrices.map((s, idx) => ({
    ...s,
    name: s.service_name,
    image: `/images/treatment-${(idx % 4) + 1}.jpg`,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">Treatment Menu</span>
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900">Spa & Wellness Treatments</h1>
        <p className="text-stone-600 font-light text-sm md:text-base">
          Explore our holistic therapies designed to rejuvenate skin, ease physical tension, and foster deep stillness.
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-stone-200 pb-6">
        <Link
          href="/treatments"
          className="px-4 py-2 rounded-full bg-amber-800 text-white text-xs font-medium uppercase tracking-wider shadow-sm"
        >
          All Services
        </Link>
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            href={`/treatments/${cat.slug}`}
            className="px-4 py-2 rounded-full bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-900 text-xs font-medium uppercase tracking-wider transition"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Treatment Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {treatments.map((service, index) => (
          <TreatmentCard key={index} service={service} />
        ))}
      </div>
    </div>
  );
}
