"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { 
    title: 'Premium Perfumes', 
    slug: 'premium-perfumes',
    img: '/images/categories/premium_perfumes.jpg', 
    tags: 'Exclusive • High-End • Signature'
  },
  { 
    title: 'Classic Perfumes', 
    slug: 'classic-perfumes',
    img: '/images/categories/classic_perfumes.jpg',
    tags: 'Everyday elegance • Simple • Refined' 
  },
  { 
    title: 'The Oud Collection', 
    slug: 'oud',
    img: '/images/categories/oud_collection.jpg', 
    tags: 'Rich • Smoky • Luxurious'
  },
  { 
    title: 'Perfume Wax and Attar', 
    slug: 'perfume-wax-attar',
    img: '/images/categories/perfume_wax.jpg', 
    tags: 'Alcohol-free • Concentrated • Historic'
  },
  { 
    title: 'Home & Space Fragrances', 
    slug: 'home-space-fragrances',
    img: '/images/categories/home_space_fragrances.jpg', 
    tags: 'Elevate your space'
  },
  {
    title: 'Sample Sets',
    slug: 'sample-sets',
    img: '/images/categories/sample_sets.jpg',
    tags: 'Discover your signature scent'
  },
  { 
    title: 'Luxury Gift Boxes', 
    slug: 'gift-boxes',
    img: '/images/gift_blue_box_1788335469264.jpg', 
    tags: 'The perfect present • Premium unboxing'
  }
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4"
          >
            Our Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--color-text-muted)] italic font-serif"
          >
            Explore the universe of Zero To One fragrances
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-80 w-full"
            >
              <Link href={`/category/${cat.slug}`} className="block w-full h-full relative group overflow-hidden rounded-xl bg-[var(--color-primary)]">
                <Image 
                  src={cat.img} 
                  alt={cat.title} 
                  fill 
                  className="object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
                   <h3 className="text-white text-3xl font-serif italic drop-shadow-lg mb-1">{cat.title}</h3>
                   <p className="text-gray-300 text-[10px] font-sans uppercase tracking-[0.2em] mb-4 opacity-90">{cat.tags}</p>
                   
                   <div className="flex items-center text-white text-[11px] uppercase font-bold tracking-widest relative overflow-hidden group/link pointer-events-auto">
                     <span className="relative z-10">Shop Now</span>
                     <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover/link:translate-x-1 transition-transform" />
                     <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />
                   </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
