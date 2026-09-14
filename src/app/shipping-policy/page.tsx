import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="font-serif text-4xl mb-12 tracking-widest uppercase text-center">Shipping Policy</h1>
        
        <h3>Domestic Shipping (Pakistan)</h3>
        <p>We offer premium tracked shipping nationwide. Standard delivery takes 3-5 business days. Orders placed before 2 PM PKT are dispatched the same day.</p>
        
        <h3>International Shipping</h3>
        <p>Zero To One ships worldwide via DHL Express. International delivery typically takes 7-14 business days depending on the destination. Please note that international orders may be subject to import duties and taxes upon arrival.</p>
        
        <h3>Packaging</h3>
        <p>Every order is carefully packaged in our signature luxury rigid boxes, ensuring your delicate glass bottles arrive safely and in pristine condition.</p>
      </div>
    </main>
  );
}