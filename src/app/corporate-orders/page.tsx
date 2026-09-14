'use client';
import React from 'react';
import { Briefcase } from 'lucide-react';

export default function CorporateOrdersPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          <Briefcase className="w-12 h-12 text-[#C5A059] mb-6" />
          <h1 className="font-serif text-4xl mb-6 tracking-widest uppercase">Corporate & Bulk Gifting</h1>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
            Elevate your corporate gifting with Zero To One's bespoke luxury fragrance packages. We offer customized engraving, bespoke packaging, and volume discounts for events, weddings, and corporate clients.
          </p>
          <p className="text-sm font-bold uppercase tracking-widest text-[#C5A059]">Minimum Order Quantity: 20 Units</p>
        </div>
        
        <form className="space-y-4 bg-white/5 p-8 border border-[var(--color-border)]" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Company Name</label>
            <input type="text" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Contact Email</label>
            <input type="email" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Estimated Quantity</label>
            <input type="number" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <button type="submit" className="w-full bg-black text-white border border-[#C5A059] p-4 uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] transition-colors mt-4">
            Request Catalog
          </button>
        </form>
      </div>
    </main>
  );
}