"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Droplets, Leaf, Flame, Wind, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function InteractiveQuizModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const options = [
    { id: 'fresh', name: 'Fresh & Clean', icon: <Wind className="w-6 h-6" />, color: 'bg-blue-900/20 border-blue-500/30 text-blue-300 hover:bg-blue-900/40 hover:border-blue-500/60' },
    { id: 'floral', name: 'Floral & Sweet', icon: <Droplets className="w-6 h-6" />, color: 'bg-pink-900/20 border-pink-500/30 text-pink-300 hover:bg-pink-900/40 hover:border-pink-500/60' },
    { id: 'woody', name: 'Woody & Earthy', icon: <Leaf className="w-6 h-6" />, color: 'bg-green-900/20 border-green-500/30 text-green-300 hover:bg-green-900/40 hover:border-green-500/60' },
    { id: 'oriental', name: 'Warm & Spicy', icon: <Flame className="w-6 h-6" />, color: 'bg-amber-900/20 border-amber-500/30 text-amber-300 hover:bg-amber-900/40 hover:border-amber-500/60' }
  ];

  const handleSelect = (id: string) => {
    setSelectedVibe(id);
    setIsProcessing(true);
    // Simulate finding the perfect scent
    setTimeout(() => {
      onClose();
      router.push(`/fragrance-finder?vibe=${id}`);
      // Reset state after transition
      setTimeout(() => {
        setSelectedVibe(null);
        setIsProcessing(false);
      }, 500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden rounded-sm p-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {!isProcessing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent)]/10 mb-6">
                  <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] mb-3">
                  What is your vibe today?
                </h2>
                <p className="text-[var(--color-text-muted)] font-sans text-sm tracking-wide mb-10 max-w-md mx-auto">
                  Select a mood and we'll curate a personalized fragrance recommendation just for you.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      className={`
                        relative flex flex-col items-center justify-center p-6 border transition-all duration-300 group rounded-sm
                        ${option.color}
                      `}
                    >
                      <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                        {option.icon}
                      </div>
                      <span className="font-bold tracking-widest uppercase text-xs">
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 border-4 border-[var(--color-accent)]/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-[var(--color-accent)] rounded-full border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[var(--color-accent)] animate-pulse" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-[var(--color-text)] mb-2">Analyzing your vibe...</h3>
                <p className="text-[var(--color-text-muted)] text-sm tracking-widest uppercase">Finding the perfect match</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
