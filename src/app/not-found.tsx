import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-text)] px-6 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="font-serif text-6xl md:text-8xl tracking-widest text-[#C5A059] mb-4">
          404
        </h1>
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.2em] mb-6 uppercase">
          Page Not Found
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm md:text-base tracking-widest leading-relaxed mb-12 max-w-md">
          The essence you are searching for seems to have evaporated. Let us guide you back to our collection.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/">
            <button className="bg-transparent hover:bg-[var(--color-primary)] text-white hover:text-[var(--color-background)] border border-[#C5A059]/80 hover:border-[var(--color-primary)] text-[10px] md:text-[12px] uppercase font-bold tracking-[0.3em] px-10 md:px-12 py-4 transition-all duration-500 shadow-xl whitespace-nowrap">
              Return Home
            </button>
          </Link>
          <Link href="/shop">
            <button className="bg-[#0a0a0a] hover:bg-[var(--color-primary)] text-white hover:text-[var(--color-background)] border border-[#C5A059]/80 hover:border-[var(--color-primary)] text-[10px] md:text-[12px] uppercase font-bold tracking-[0.3em] px-10 md:px-12 py-4 transition-all duration-500 shadow-xl whitespace-nowrap">
              Shop Collection
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
