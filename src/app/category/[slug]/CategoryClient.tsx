"use client";

import React, { useState } from 'react';
import ProductCard from '../../../components/ProductCard';
import Link from 'next/link';
import { ChevronLeft, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyCategoryState } from '../../../components/EmptyCategoryState';

export default function CategoryClient({ 
  categoryName, 
  initialProducts 
}: { 
  categoryName: string;
  initialProducts: any[];
}) {
  const [sortOption, setSortOption] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Sorting logic
  const sortedProducts = [...initialProducts].sort((a, b) => {
    // Get actual starting prices (simulating what ProductCard does)
    const getPrice = (p: any) => {
      if (p.sizeVariants && p.sizeVariants.length > 0) {
        return Math.min(...p.sizeVariants.map((v: any) => v.price));
      }
      return p.price;
    };

    if (sortOption === 'price-low') {
      return getPrice(a) - getPrice(b);
    } else if (sortOption === 'price-high') {
      return getPrice(b) - getPrice(a);
    } else if (sortOption === 'az') {
      return a.name.localeCompare(b.name);
    }
    // 'featured' keeps original order
    return 0;
  });

  const sortLabels: Record<string, string> = {
    'featured': 'Featured',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
    'az': 'Alphabetical (A-Z)'
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans pb-24">
      {/* Category Hero */}
      {categoryName === 'Home & Space Fragrances' ? (
        <section className="w-full relative py-32 overflow-hidden flex flex-col items-center justify-center text-center border-b border-[var(--color-border)]">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop" 
              alt="Home Ambiance" 
              className="w-full h-full object-cover opacity-50 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/80 via-[var(--color-background)]/80 to-[var(--color-background)] backdrop-blur-sm" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 max-w-3xl px-6"
          >
            <h2 className="text-5xl md:text-7xl font-serif text-[var(--color-text)] mb-6 drop-shadow-md">The Sanctuary<br/>Collection</h2>
            <p className="text-[var(--color-text-muted)] italic font-serif text-xl md:text-2xl mb-8 leading-relaxed">
              Curate the unseen architecture of your home. Our room sprays and diffusers are designed to welcome, relax, and inspire.
            </p>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2 inline-block">
              {sortedProducts.length} Exquisite Scents
            </p>
          </motion.div>
        </section>
      ) : (
        <section className="w-full bg-[var(--color-surface)] py-20 px-8 border-b border-[var(--color-border)] relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1595425970377-c9703bc48639?q=80&w=2000&auto=format&fit=crop" 
              alt="Category Ambiance" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/90 via-[var(--color-background)]/80 to-[var(--color-background)] backdrop-blur-[2px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-[var(--color-text)] mb-4 drop-shadow-sm">{categoryName}</h2>
            <p className="text-[var(--color-text-muted)] italic font-serif text-lg md:text-xl">
              Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </section>
      )}

      {/* Toolbar / Filters (Placeholder) & Sorting */}
      {sortedProducts.length > 0 && (
        <section className="w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-[1600px] mx-auto px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide">
              <button className="flex items-center text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition border-r border-[var(--color-border)] pr-4 mr-2">
                <SlidersHorizontal className="w-3 h-3 mr-1" />
                Filters
              </button>
              {['All Perfumes', 'For Him', 'For Her', 'Unisex'].map(tag => (
                <button key={tag} className="flex-shrink-0 text-[10px] uppercase font-bold tracking-widest px-4 py-2 border border-[var(--color-border)] rounded-full hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-colors">
                  {tag}
                </button>
              ))}
            </div>

            <div className="relative self-end md:self-auto">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center text-xs font-bold uppercase tracking-widest hover:opacity-70 transition border border-[var(--color-border)] px-4 py-2 rounded-sm bg-[var(--color-surface)] shadow-sm"
              >
                Sort By: {sortLabels[sortOption]} <ChevronDown className="w-3 h-3 ml-2" />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl z-50 rounded-sm overflow-hidden"
                  >
                    {Object.keys(sortLabels).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortOption(key); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-background)] transition ${sortOption === key ? 'text-[var(--color-accent)] bg-[var(--color-background)]' : 'text-[var(--color-text)]'}`}
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Storytelling Block for Home & Space */}
      {categoryName === 'Home & Space Fragrances' && (
        <section className="w-full max-w-[1200px] mx-auto py-16 px-8 text-center">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-serif text-xl mb-3">The Welcoming Foyer</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">Create an unforgettable first impression for your guests with vibrant citrus or subtle woody notes that instantly set a hospitable tone.</p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-3">The Calming Bedroom</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">Unwind after a long day. Soothing lavender, vanilla, and gentle musk create a cocoon of tranquility for better sleep.</p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-3">The Focused Office</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">Enhance concentration and clarity in your workspace with crisp, clean scents like mint, eucalyptus, and fresh linen.</p>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="max-w-[1600px] mx-auto py-16 px-8 relative z-10">
        {sortedProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            layout
          >
            <AnimatePresence>
              {sortedProducts.map((perfume, index) => (
                <motion.div
                  key={perfume.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard perfume={perfume} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <EmptyCategoryState title={`New ${categoryName} Coming Soon`} />
          </div>
        )}
      </section>
    </main>
  );
}
