import React from 'react';

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-5xl md:text-6xl mb-8 tracking-widest uppercase text-[#C5A059]">The Art of Zero</h1>
        <p className="text-lg md:text-xl text-[var(--color-text-muted)] leading-relaxed mb-12">
          Zero To One was born from a singular vision: to distill the chaotic beauty of nature into perfect, minimalist drops of luxury. 
          We believe that fragrance is not just an accessory, but an invisible aura that defines your presence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="aspect-square bg-white/5 flex items-center justify-center p-8 border border-[var(--color-border)]">
            <p className="font-serif text-2xl">Ethically Sourced Ingredients</p>
          </div>
          <div className="aspect-square bg-white/5 flex items-center justify-center p-8 border border-[var(--color-border)]">
            <p className="font-serif text-2xl">Master Perfumery Techniques</p>
          </div>
        </div>
      </div>
    </main>
  );
}