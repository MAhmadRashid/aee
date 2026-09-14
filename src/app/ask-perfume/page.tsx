'use client';
import React from 'react';

export default function AskPerfumePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl text-center mb-4 tracking-widest uppercase">Ask For A Perfume</h1>
        <p className="text-center text-[var(--color-text-muted)] mb-12 text-sm tracking-widest uppercase">Looking for a specific scent profile? Let our master perfumers help.</p>
        
        <form className="space-y-6 bg-white/5 p-8 border border-[var(--color-border)]" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Full Name</label>
              <input type="text" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Email Address</label>
              <input type="email" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Preferred Fragrance Family</label>
            <select className="w-full bg-black border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]">
              <option>Woody & Earthy</option>
              <option>Floral</option>
              <option>Fresh & Citrus</option>
              <option>Oriental & Spicy</option>
              <option>Oud</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Describe Your Ideal Scent</label>
            <textarea rows={4} className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]"></textarea>
          </div>
          <button type="submit" className="w-full bg-[#0a0a0a] text-white border border-[#C5A059] p-4 uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] hover:text-black transition-colors">
            Submit Request
          </button>
        </form>
      </div>
    </main>
  );
}