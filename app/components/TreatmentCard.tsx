import React from 'react';
import Image from 'next/image';
import type { Service } from '@/lib/types';

export default function TreatmentCard({ service }: { service: Service }) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <Image
        src={service.image ?? '/images/default-treatment.jpg'}
        alt={service.name}
        width={400}
        height={300}
        className="object-cover w-full h-48"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
        <h3 className="text-lg font-serif">{service.name}</h3>
        <p className="text-sm">{service.category}</p>
        <p className="mt-1 font-medium">${service.price}</p>
      </div>
    </div>
  );
}
