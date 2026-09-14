import React from 'react';

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="font-serif text-4xl mb-12 tracking-widest uppercase text-center">Return Policy</h1>
        <p>At Zero To One, we take immense pride in the craftsmanship of our fragrances. If you are not entirely satisfied with your purchase, we are here to help.</p>
        
        <h3>Returns</h3>
        <p>You have 14 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused, sealed, and in the same condition that you received it. It must also be in the original packaging.</p>
        
        <h3>Refunds</h3>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment.</p>
        
        <h3>Non-Returnable Items</h3>
        <p>Please note that for hygiene and authenticity reasons, opened perfumes, attars, and sample sets cannot be returned or exchanged.</p>
      </div>
    </main>
  );
}