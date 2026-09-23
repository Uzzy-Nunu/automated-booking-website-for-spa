import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-30" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-5xl font-serif md:text-6xl">Reaus Spa — Concept Redesign</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Experience calm, elegant wellness treatments curated just for you.
        </p>
        <Link
          href="/book"
          className="mt-6 inline-block rounded border border-white px-6 py-3 text-base font-medium hover:bg-white hover:text-black transition"
        >
          Book a Session
        </Link>
      </div>
    </section>
  );
}
