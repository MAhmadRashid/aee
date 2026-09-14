"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import Link from 'next/link';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeen = sessionStorage.getItem('hasSeenExitIntent');
    if (hasSeen) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if mouse leaves from the top (usually towards address bar/back button)
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        sessionStorage.setItem('hasSeenExitIntent', 'true');
      }
    };

    // Mobile specific: track rapid scroll up
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;

    const handleScroll = () => {
      if (hasTriggered) return;
      const currentScrollY = window.scrollY;
      scrollSpeed = lastScrollY - currentScrollY;
      lastScrollY = currentScrollY;

      // If scrolling up very fast on mobile, or reaching near top after being far down
      if (window.innerWidth < 768 && scrollSpeed > 50 && currentScrollY < 200) {
        setIsVisible(true);
        setHasTriggered(true);
        sessionStorage.setItem('hasSeenExitIntent', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-8 text-center z-10 overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-background)] border border-[var(--color-accent)]/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                <Gift className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              
              <h2 className="font-serif text-3xl mb-2 text-[var(--color-text)]">Wait, Before You Go!</h2>
              <p className="text-sm font-sans text-[var(--color-text-muted)] mb-6 max-w-sm mx-auto">
                Not sure which scent is for you? Don't leave empty-handed.
              </p>

              <div className="bg-[var(--color-background)] border border-[var(--color-border)] w-full p-6 mb-8 text-center shadow-inner">
                <p className="font-serif text-xl text-[var(--color-primary)] mb-1">Try 3 Sample Vouchers</p>
                <p className="text-xs tracking-widest uppercase font-bold text-[var(--color-text)]">For Only Rs. 500</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-4">Includes a Rs. 500 discount code for your next full-size purchase.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link href="/shop" onClick={() => setIsVisible(false)} className="w-full">
                  <button className="btn-luxury w-full py-3 px-6 text-xs bg-[var(--color-primary)] text-[var(--color-background)] border-transparent hover:bg-transparent hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]">
                    GET SAMPLES NOW
                  </button>
                </Link>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="w-full py-3 px-6 text-xs uppercase tracking-widest font-bold border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition-colors"
                >
                  No Thanks
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
