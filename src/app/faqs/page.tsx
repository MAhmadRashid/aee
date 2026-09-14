'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping within Pakistan takes 3-5 business days. International shipping takes 7-14 business days.' },
  { q: 'What is your return policy?', a: 'We accept returns on unopened and unused perfumes within 14 days of delivery. Sample sets are non-refundable.' },
  { q: 'Are your fragrances cruelty-free?', a: 'Yes, all Zero To One fragrances are 100% cruelty-free and vegan, crafted with ethically sourced ingredients.' },
  { q: 'How should I store my perfume?', a: 'For best results, store your perfume in a cool, dark place away from direct sunlight and extreme temperature changes.' },
];

export default function FaqsPage() {
  const [open, setOpen] = useState<number | null>(null);
  
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4 tracking-widest uppercase">Frequently Asked Questions</h1>
        <p className="text-center text-[var(--color-text-muted)] mb-16 text-sm tracking-widest uppercase">Everything you need to know about our products and services</p>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-[var(--color-border)] p-6 bg-white/5 cursor-pointer hover:bg-white/10 transition" onClick={() => setOpen(open === idx ? null : idx)}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{faq.q}</h3>
                {open === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              {open === idx && <p className="mt-4 text-[var(--color-text-muted)] leading-relaxed">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}