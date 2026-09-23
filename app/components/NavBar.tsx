import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-primary text-white p-4 flex items-center justify-between">
      <div className="text-lg font-bold">
        <Link href="/">Reaus Spa — Concept Redesign</Link>
      </div>
      <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>
      <ul className={`md:flex space-x-4 ${open ? 'block' : 'hidden'} md:block`}> 
        <li><Link href="/about">About</Link></li>
        <li><Link href="/treatments">Treatments</Link></li>
        <li><Link href="/book">Book</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}
