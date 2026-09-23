import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-base-100 py-4 shadow">
      <div className="container mx-auto flex items-center justify-between px-4">
        <h1 className="text-2xl font-serif text-primary">
          Reaus Spa — Concept Redesign
        </h1>
        <nav>
          <Link href="/" className="mr-4 hover:underline">
            Home
          </Link>
          <Link href="/about" className="mr-4 hover:underline">
            About
          </Link>
          <Link href="/treatments" className="mr-4 hover:underline">
            Treatments
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
