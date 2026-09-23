import React from 'react';
import Link from 'next/link';
import TreatmentCard from '@/app/components/TreatmentCard';
import servicePrices from '@/lib/service-prices.json';

const CATEGORY_NAMES: Record<string, string> = {
  facials: 'Facials',
  massage: 'Massage',
  body: 'Body Treatments',
  hammam: 'Hammam',
  wax: 'Waxing',
  'hand-and-foot': 'Hand & Foot Care',
  'non-invasive': 'Non-Invasive Aesthetics',
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryTitle = CATEGORY_NAMES[category] || category.replace('-', ' ');

  const filtered = servicePrices
    .filter(s => s.category.toLowerCase().includes(category.toLowerCase()) || category === 'massage')
    .map((s, idx) => ({
      ...s,
      name: s.service_name,
      image: `/images/treatment-${(idx % 4) + 1}.jpg`,
    }));

  const displayList = filtered.length > 0 ? filtered : servicePrices.slice(0, 3).map((s, idx) => ({
    ...s,
    name: s.service_name,
    image: `/images/treatment-${(idx % 4) + 1}.jpg`,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500">
        <Link href="/treatments" className="hover:text-amber-800">Treatments</Link>
        <span>/</span>
        <span className="text-amber-800 font-semibold">{categoryTitle}</span>
      </div>

      <div className="space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 capitalize">{categoryTitle}</h1>
        <p className="text-stone-600 font-light text-sm md:text-base max-w-2xl">
          Discover our curated {categoryTitle.toLowerCase()} services designed for holistic restoration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayList.map((service, index) => (
          <TreatmentCard key={index} service={service} />
        ))}
      </div>
    </div>
  );
}
