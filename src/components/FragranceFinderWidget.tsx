"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Droplets, Leaf, Flame, Wind, X } from 'lucide-react';
import ProductCard from './ProductCard';

export function FragranceFinderWidget() {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProducts(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch live products:", err));
  }, []);

  const options = [
    { id: 'fresh', name: 'Fresh & Clean', icon: <Wind className="w-5 h-5" />, color: 'bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/40 shadow-[0_0_15px_rgba(59,130,246,0)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]' },
    { id: 'floral', name: 'Floral & Sweet', icon: <Droplets className="w-5 h-5" />, color: 'bg-pink-900/20 border-pink-500/30 hover:bg-pink-900/40 shadow-[0_0_15px_rgba(236,72,153,0)] hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]' },
    { id: 'woody', name: 'Woody & Earthy', icon: <Leaf className="w-5 h-5" />, color: 'bg-green-900/20 border-green-500/30 hover:bg-green-900/40 shadow-[0_0_15px_rgba(34,197,94,0)] hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]' },
    { id: 'oriental', name: 'Warm & Spicy', icon: <Flame className="w-5 h-5" />, color: 'bg-amber-900/20 border-amber-500/30 hover:bg-amber-900/40 shadow-[0_0_15px_rgba(245,158,11,0)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]' }
  ];

  const handleSelect = (id: string) => {
    setSelectedVibe(id);
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = [...products];
      if (id === 'fresh') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes('breeze') || p.category === 'Classic Perfumes');
      } else if (id === 'floral') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes('rose') || p.name.toLowerCase().includes('jasmine') || p.category === 'Premium Perfumes');
      } else if (id === 'woody') {
        filtered = filtered.filter(p => p.category === 'Oud' || p.name.toLowerCase().includes('woods'));
      } else if (id === 'oriental') {
        filtered = filtered.filter(p => p.category === 'Oud' || p.category === 'Perfume Wax / Attar');
      }
      
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      
      if (selected.length < 3) {
         const fallback = products.sort(() => 0.5 - Math.random()).slice(0, 3 - selected.length);
         setMatchedProducts([...selected, ...fallback]);
      } else {
         setMatchedProducts(selected);
      }
      
      setIsLoading(false);
    }, 1500); 
  };

  const resetSelection = () => {
    setSelectedVibe(null);
    setMatchedProducts([]);
  }

  return (
    <div className="w-full relative overflow-hidden bg-[var(--color-surface)] py-24 px-6 border-y border-[var(--color-border)]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center space-x-2 text-[#D4AF37] mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Signature Scent Quiz</span>
          <Sparkles className="w-4 h-4" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif mb-6 text-[var(--color-text)] tracking-wide"
        >
          What is your vibe today?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-[var(--color-text-muted)] font-serif italic mb-14 max-w-lg"
        >
          Select the mood that speaks to you, and we'll reveal the perfect fragrance to match your energy.
        </motion.p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl mx-auto">
          {options.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              onClick={() => handleSelect(opt.id)}
              disabled={selectedVibe !== null}
              className={`relative overflow-hidden flex flex-col items-center justify-center aspect-[4/5] p-6 rounded-lg border transition-all duration-500 bg-neutral-950/60 backdrop-blur-md ${opt.color} 
                ${selectedVibe === opt.id ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-105 z-20' : selectedVibe !== null ? 'opacity-20 grayscale scale-95 pointer-events-none' : 'border-white/10 hover:border-white/40 hover:-translate-y-2 z-10'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
              
              {selectedVibe === null && (
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent" />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={`mb-6 p-5 rounded-full border transition-all duration-500 ${selectedVibe === opt.id ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]' : 'border-white/10 bg-white/5 text-white/90'}`}>
                  {opt.icon}
                </div>
                <span className={`text-xs md:text-sm uppercase font-bold tracking-[0.2em] transition-colors duration-500 ${selectedVibe === opt.id ? 'text-[#D4AF37]' : 'text-white'}`}>{opt.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {selectedVibe && (
            <motion.div
              key="results-container"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full mt-16 flex flex-col items-center overflow-hidden"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                    <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37] animate-pulse" />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">Curating your signature scents...</span>
                </div>
              ) : (
                <div className="w-full max-w-5xl mx-auto flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 pb-4 border-b border-white/10">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                      <h3 className="text-2xl font-serif text-white mb-2">Your Perfect Matches</h3>
                      <p className="text-sm text-neutral-400 font-serif italic">Based on your {options.find(o => o.id === selectedVibe)?.name} vibe</p>
                    </div>
                    <button 
                      onClick={resetSelection}
                      className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-sm hover:border-white/30 hover:bg-white/5"
                    >
                      <X className="w-4 h-4" />
                      <span>Retake Quiz</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
                    {matchedProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 + 0.2, duration: 0.5 }}
                      >
                        <ProductCard perfume={product} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

