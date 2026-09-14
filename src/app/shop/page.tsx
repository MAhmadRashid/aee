'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Footer } from '../../components/Footer';
import { perfumes as staticPerfumes } from '../../data/perfumes';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

type FilterOption = 'All' | 'Summer Scents' | 'Winter / Oud Special' | 'Date Night' | 'Office Wear';

function ShopContent() {
  const [perfumes, setPerfumes] = useState<any[]>(staticPerfumes);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setPerfumes(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch live products, using static fallback:", err))
      .finally(() => setLoading(false));
  }, []);

  const categoryOrder = [
    'Premium Perfumes', 
    'Classic Perfumes',
    'Oud', 
    'Perfume Wax / Attar', 
    'Sample Sets', 
    'Body Mist', 
    'Home & Space Fragrances', 
    'Gift Box'
  ];

  const filterOptions: FilterOption[] = ['All', 'Summer Scents', 'Winter / Oud Special', 'Date Night', 'Office Wear'];

  const filterProduct = (p: any, filter: FilterOption) => {
    if (filter === 'All') return true;
    
    const scentStr = JSON.stringify(p.scentNotes || {}).toLowerCase();
    const nameStr = (p.name || '').toLowerCase();
    const catStr = (p.category || '').toLowerCase();

    // Logical grouping based on names and missing metadata
    const isOud = catStr.includes('oud') || nameStr.includes('oud');
    const isFresh = scentStr.includes('fresh') || scentStr.includes('citrus') || scentStr.includes('ocean') || nameStr.includes('blue') || nameStr.includes('aqua') || nameStr.includes('summer');
    const isWarm = scentStr.includes('wood') || scentStr.includes('spice') || scentStr.includes('amber') || scentStr.includes('vanilla') || scentStr.includes('musk') || nameStr.includes('dark') || nameStr.includes('noir');
    const isFloral = scentStr.includes('floral') || scentStr.includes('rose') || scentStr.includes('jasmine');
    const isElegant = nameStr.includes('classic') || nameStr.includes('elegant') || nameStr.includes('signature') || nameStr.includes('velvet');

    if (filter === 'Summer Scents') {
      // Non-ouds, fresh scents, or general mild perfumes
      if (isOud || isWarm) return false;
      return isFresh || isFloral || (!isFresh && !isWarm && !isOud && !isFloral); 
    }
    if (filter === 'Winter / Oud Special') {
      // All Ouds, warm scents, and dark intense scents
      return isOud || isWarm || nameStr.includes('intense');
    }
    if (filter === 'Date Night') {
      // Warm, floral, elegant, and ouds make good date night scents
      return isWarm || isFloral || isElegant || isOud || nameStr.includes('night') || nameStr.includes('seduction');
    }
    if (filter === 'Office Wear') {
      // Exclude heavy ouds and very warm/spicy scents from office wear
      if (isOud || isWarm) return false;
      return isFresh || isFloral || isElegant || (!isFresh && !isWarm && !isOud);
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      
      {/* Hero Section */}
      <div className="w-full bg-[var(--color-surface)] py-20 border-b border-[var(--color-border)] relative">
        <div className="max-w-[1600px] mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-[var(--color-primary)] tracking-widest uppercase">The Collection</h1>
          <p className="text-[var(--color-text-muted)] text-lg mb-0 max-w-2xl mx-auto font-serif italic">
            Explore our entire collection of luxurious fragrances, carefully categorized for your convenience.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="w-full bg-[var(--color-background)] border-b border-[var(--color-border)] sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center text-[var(--color-text-muted)] mr-2 flex-shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-xs font-bold uppercase tracking-widest">Filter:</span>
            </div>
            {filterOptions.map(option => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeFilter === option 
                    ? 'bg-[var(--color-primary)] text-[var(--color-background)]' 
                    : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full">
        {categoryOrder.map((category, idx) => {
          let categoryProducts = perfumes.filter(p => p.category === category);
          
          // Apply active filter
          categoryProducts = categoryProducts.filter(p => filterProduct(p, activeFilter));
          
          // Apply search query
          if (searchQuery) {
            categoryProducts = categoryProducts.filter(p => 
              p.name.toLowerCase().includes(searchQuery) || 
              (p.brand && p.brand.toLowerCase().includes(searchQuery)) ||
              (p.category && p.category.toLowerCase().includes(searchQuery))
            );
          }
          
          if (categoryProducts.length === 0) return null;
          
          const slug = category.toLowerCase().replace(/ /g, '-').replace(/\//g, '').replace(/--/g, '-');
          
          return (
            <section key={category} className={`w-full py-24 px-8 ${idx !== 0 ? 'border-t border-[var(--color-border)]' : ''}`}>
              <div className="max-w-[1600px] mx-auto">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="text-2xl md:text-4xl font-serif text-[var(--color-text)] uppercase tracking-widest"
                    >
                      {category}
                    </motion.h2>
                  </div>
                  <Link href={`/category/${slug}`} className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
                    <span className="relative z-10">View All {category}</span>
                    <ArrowRight className="w-3 h-3 ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform" />
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {categoryProducts.map(perfume => (
                    <div key={perfume.id} className="w-full">
                      <ProductCard perfume={perfume} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--color-primary)]"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}
