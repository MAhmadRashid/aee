import React from 'react';

export default function StoreLocator() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col items-center justify-center p-8">
      <h1 className="font-serif text-4xl mb-4 text-[var(--color-primary)]">Store Locator</h1>
      <p className="text-center max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
        Our exclusive boutiques are located in select cities worldwide. 
        We are currently updating our store locator. Please check back soon or contact us for assistance.
      </p>
    </main>
  );
}
