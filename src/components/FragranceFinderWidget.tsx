"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Droplets, Leaf, Flame, Wind } from 'lucide-react';

export function FragranceFinderWidget() {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  
  const options = [
    { id: 'fresh', name: 'Fresh & Clean', icon: <Wind className="w-5 h-5" />, color: 'bg-blue-900/40 border-blue-500/50 hover:bg-blue-900/60' },
    { id: 'floral', name: 'Floral & Sweet', icon: <Droplets className="w-5 h-5" />, color: 'bg-pink-900/40 border-pink-500/50 hover:bg-pink-900/60' },
    { id: 'woody', name: 'Woody & Earthy', icon: <Leaf className="w-5 h-5" />, color: 'bg-green-900/40 border-green-500/50 hover:bg-green-900/60' },
    { id: 'oriental', name: 'Warm & Spicy', icon: <Flame className="w-5 h-5" />, color: 'bg-amber-900/40 border-amber-500/50 hover:bg-amber-900/60' }
  ];

  const handleSelect = (id: string) => {
    setSelectedVibe(id);
    // Simulate a brief interaction delay before redirecting
    setTimeout(() => {
      router.push(`/fragrance-finder?vibe=${id}`);
    }, 600);
  };

  return (
    <div className="w-full relative overflow-hidden bg-[var(--color-surface)] py-20 px-6 border-y border-[var(--color-border)]">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center space-x-2 text-[var(--color-accent)] mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Signature Scent Quiz</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-serif mb-6 text-[var(--color-text)]"
        >
          What is your vibe today?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-[var(--color-text-muted)] font-serif italic mb-12 max-w-lg"
        >
          Select the mood that speaks to you, and we'll reveal the perfect fragrance to match your energy.
        </motion.p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {options.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              onClick={() => handleSelect(opt.id)}
              disabled={selectedVibe !== null}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${opt.color} ${selectedVibe === opt.id ? 'ring-2 ring-[var(--color-accent)] scale-105' : selectedVibe !== null ? 'opacity-50 grayscale' : 'hover:-translate-y-2'}`}
            >
              <div className="mb-4 text-white">
                {opt.icon}
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-white">{opt.name}</span>
            </motion.button>
          ))}
        </div>
        
        <AnimatePresence>
          {selectedVibe && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              className="flex items-center space-x-3 text-[var(--color-accent)]"
            >
              <div className="w-5 h-5 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
              <span className="text-xs uppercase tracking-widest font-bold">Discovering your match...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
