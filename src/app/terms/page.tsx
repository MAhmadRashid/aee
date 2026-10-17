import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-[#C5A059] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Boutique</span>
        </Link>

        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12 rounded-sm shadow-xl space-y-8">
          <div className="text-center pb-8 border-b border-[var(--color-border)]">
            <div className="inline-flex p-3 rounded-full bg-[#C5A059]/10 text-[#C5A059] mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase mb-2">Terms of Service</h1>
            <p className="text-xs uppercase tracking-widest text-[#C5A059]">Haute Parfumerie & Client Privilege</p>
          </div>

          <div className="space-y-6 text-sm text-neutral-300 leading-relaxed font-sans">
            <div>
              <h2 className="text-lg font-serif text-white mb-2 uppercase tracking-wide">1. Acceptance of Terms</h2>
              <p>
                By accessing and purchasing from Zero to One ("ZTO", "we", "our"), you agree to be bound by these Terms of Service. Each fragrance, attar, discovery set, and luxury formulation is crafted under exacting artisanal standards.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-serif text-white mb-2 uppercase tracking-wide">2. Artisanal Formulations & Scent Authenticity</h2>
              <p>
                All our olfactory offerings are authentic, high-concentration extraits and eau de parfums. Batch maturation times and natural ingredient variations may yield subtle nuances between seasons, reflecting genuine perfumery craftsmanship.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-serif text-white mb-2 uppercase tracking-wide">3. Pricing & Consignment Dispatch</h2>
              <p>
                All prices are stated in Pakistani Rupees (PKR) and include standard luxury presentation boxes. Consignments are dispatched via express insured couriers across Pakistan. Cash on Delivery (COD) orders require telephone or digital verification prior to blending dispatch.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-serif text-white mb-2 uppercase tracking-wide">4. Returns & Olfactory Guarantees</h2>
              <p>
                Due to personal hygiene and the volatile nature of fine perfumery, bottles opened or sprayed are non-returnable. Unbroken tamper-evident sealed packages may be exchanged within 7 business days as detailed in our Return Policy.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-serif text-white mb-2 uppercase tracking-wide">5. Atelier Concierge & Legal Jurisdiction</h2>
              <p>
                Any matters of inquiry, bespoke blending, or consultation may be directed to our Concierge Desk at <a href="mailto:support@zerotoone.com" className="text-[#C5A059] underline">support@zerotoone.com</a>. These Terms are governed under the laws of the Islamic Republic of Pakistan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
