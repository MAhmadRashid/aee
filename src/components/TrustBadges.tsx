import React from 'react';
import { ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

export function TrustBadges() {
  return (
    <div className="w-full py-12 bg-[var(--color-background)] border-y border-[var(--color-border)]">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
          
          <div className="flex flex-col items-center justify-center p-4">
            <ShieldCheck className="w-8 h-8 text-[var(--color-accent)] mb-4 stroke-1" />
            <h4 className="font-serif text-lg text-[var(--color-text)] mb-2">100% Original</h4>
            <p className="text-xs text-[var(--color-text-muted)] font-sans tracking-wide max-w-xs">
              Authentic fragrances crafted with the finest ingredients from around the world.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 pt-8 md:pt-4">
            <Truck className="w-8 h-8 text-[var(--color-accent)] mb-4 stroke-1" />
            <h4 className="font-serif text-lg text-[var(--color-text)] mb-2">Fast Delivery</h4>
            <p className="text-xs text-[var(--color-text-muted)] font-sans tracking-wide max-w-xs">
              Express shipping across Pakistan. Delivered securely to your doorstep.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 pt-8 md:pt-4">
            <RefreshCcw className="w-8 h-8 text-[var(--color-accent)] mb-4 stroke-1" />
            <h4 className="font-serif text-lg text-[var(--color-text)] mb-2">Easy Returns</h4>
            <p className="text-xs text-[var(--color-text-muted)] font-sans tracking-wide max-w-xs">
              Not satisfied? Enjoy a hassle-free 7-day return policy on all sealed items.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
