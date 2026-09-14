"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function EmptyCategoryState({ title = "Coming Soon" }: { title?: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="w-full py-16 md:py-24 px-6 flex flex-col items-center justify-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]/50 backdrop-blur-sm text-center"
    >
      <div className="mb-6">
        <svg className="w-12 h-12 text-[var(--color-text-muted)] mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <h3 className="text-[var(--color-text)] font-serif text-2xl md:text-3xl mb-3">{title}</h3>
      <p className="text-[var(--color-text-muted)] text-sm mb-8 max-w-md mx-auto">
        We're currently brewing something extraordinary for this collection. Be the first to know when it drops!
      </p>

      {!subscribed ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full max-w-md gap-3 mb-8">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] rounded-sm text-[var(--color-text)]"
          />
          <button 
            type="submit" 
            className="bg-[var(--color-primary)] text-[var(--color-background)] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-white hover:text-black transition-colors whitespace-nowrap shadow-md"
          >
            Notify Me
          </button>
        </form>
      ) : (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-6 py-4 rounded-sm mb-8 text-sm font-medium">
          Thank you! We'll notify you as soon as this collection is available.
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
          In the meantime
        </p>
        <Link 
          href="/category/sample-sets" 
          className="inline-block bg-[var(--color-primary)] text-[var(--color-background)] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-white hover:text-black transition-all shadow-md transform hover:-translate-y-1"
        >
          Explore Our Sample Sets
        </Link>
      </div>
    </motion.div>
  );
}
