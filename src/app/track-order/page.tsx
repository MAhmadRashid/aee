'use client';
import React from 'react';
import { PackageSearch } from 'lucide-react';

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full p-8 border border-[var(--color-border)] bg-white/5">
        <div className="flex justify-center mb-6">
          <PackageSearch className="w-12 h-12 text-[#C5A059]" />
        </div>
        <h1 className="font-serif text-3xl text-center mb-8 tracking-widest uppercase">Track Your Order</h1>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Order Number</label>
            <input type="text" placeholder="e.g. ZTO-10482" className="w-full bg-transparent border border-[var(--color-border)] p-4 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Email Address</label>
            <input type="email" placeholder="Enter your email" className="w-full bg-transparent border border-[var(--color-border)] p-4 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <button type="submit" className="w-full bg-black text-white border border-[#C5A059] p-4 uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] transition-colors">
            Track Shipment
          </button>
        </form>
      </div>
    </main>
  );
}