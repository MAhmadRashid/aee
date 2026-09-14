"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { perfumes } from '@/data/perfumes';

export function SocialProofPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSale, setCurrentSale] = useState<any>(null);

  const locations = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Multan'];
  const times = ['2 mins ago', '5 mins ago', '12 mins ago', 'just now', '1 hour ago'];

  useEffect(() => {
    // Show a popup randomly every 45-120 seconds
    const interval = setInterval(() => {
      const randomProduct = perfumes[Math.floor(Math.random() * perfumes.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];

      setCurrentSale({
        productName: randomProduct.name,
        location: randomLocation,
        time: randomTime,
        image: `/images/bottles/${randomProduct.id}.png`,
      });

      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);

    }, Math.floor(Math.random() * (120000 - 45000 + 1) + 45000));

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && currentSale && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-6 z-50 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] shadow-2xl p-4 max-w-sm rounded-sm flex items-center gap-4 cursor-pointer hover:bg-[var(--color-surface)] transition-colors group"
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            className="absolute top-2 right-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="w-12 h-16 bg-[var(--color-background)] shrink-0 flex items-center justify-center p-1 border border-[var(--color-border)]/50">
            <img 
              src={currentSale.image} 
              alt={currentSale.productName}
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero_bottle.png'; }}
            />
          </div>
          
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              Verified Purchase
            </p>
            <p className="text-xs text-[var(--color-text)] font-sans leading-tight">
              Someone from <span className="font-bold">{currentSale.location}</span> just bought
            </p>
            <p className="text-sm font-serif font-bold text-[var(--color-primary)] truncate mt-0.5">
              {currentSale.productName}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
              {currentSale.time}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
