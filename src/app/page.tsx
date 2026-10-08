"use client";

import React, { useState, useEffect } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

import ProductCard from '../components/ProductCard';
import { FragranceFinderWidget } from '../components/FragranceFinderWidget';
import { EmptyCategoryState } from '../components/EmptyCategoryState';
import { TrustBadges } from '../components/TrustBadges';
import FloatingParticles from '../components/FloatingParticles';
import { Canvas } from '@react-three/fiber';
import { motion, useMotionValue, useTransform, AnimatePresence, useScroll } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Tilt from 'react-parallax-tilt';

export default function Home() {
  const { formatPrice, isLoading, currencyCode, changeCurrency } = useCurrency();
  const { cartItems, cartCount, removeFromCart, updateQuantity } = useCart();
  const { theme, setTheme } = useTheme();
  
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPerfumes(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch live products:", err))
      .finally(() => setIsLoadingProducts(false));
  }, []);

  const premiumPerfumes = perfumes.filter(p => p.category === 'Premium Perfumes').slice(0, 10);
  const classicPerfumes = perfumes.filter(p => p.category === 'Classic Perfumes').slice(0, 9);
  const oudCollection = perfumes.filter(p => p.category === 'Oud').slice(0, 10);
  const traditionalAttars = perfumes.filter(p => p.category === 'Perfume Wax / Attar' || p.category === 'Attar').slice(0, 11);
  const luxuryGiftBoxes = perfumes.filter(p => p.category === 'Gift Box').slice(0, 10);
  const under3000 = perfumes.filter(p => p.price <= 3000).slice(0, 10);
  const homeSpace = perfumes.filter(p => p.category === 'Home & Space Fragrances' || p.category === 'Room Spray').slice(0, 10);
  const sampleSets = perfumes.filter(p => p.category === 'Sample Sets').slice(0, 10);


  // Hover parallax for banner
  const bannerX = useMotionValue(0);
  const bannerY = useMotionValue(0);
  const bannerBgX = useTransform(bannerX, [-0.5, 0.5], ["-10px", "10px"]);
  const bannerBgY = useTransform(bannerY, [-0.5, 0.5], ["-10px", "10px"]);

  const handleBannerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    bannerX.set(xPct);
    bannerY.set(yPct);
  };
  const handleBannerMouseLeave = () => {
    bannerX.set(0);
    bannerY.set(0);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.2]);

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans overflow-x-hidden relative">
      {/* Force recompile to pick up latest perfumes.ts */}
      {/* Hero Banner Section (Luxury Minimalist) */}
      <section 
        className="w-full min-h-[85vh] relative flex flex-col justify-center items-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/images/hero_banner_new.png)',
            y: heroY
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)]/40 via-black/20 to-[var(--color-background)]/80 z-0" />
        
        {/* Floating Particles for Anti-Gravity Effect */}
        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-50">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <FloatingParticles count={40} />
          </Canvas>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ opacity: heroOpacity }}
          className="max-w-[1600px] w-full mx-auto px-6 flex flex-col items-center text-center relative z-20"
        >
          <div className="flex flex-col items-center justify-center max-w-5xl px-4 py-12">
            <h2 className="sr-only">
              Discover Anti-Gravity Elegance
            </h2>
            <p className="sr-only">
              A pure, minimalist expression of nature.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ opacity: heroOpacity }}
          className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 z-30 w-full px-4 flex flex-col md:flex-row justify-center items-center gap-4"
        >
          <Link href="/fragrance-finder">
            <button className="w-[280px] md:w-auto inline-block px-8 md:px-10 py-3.5 md:py-4 border border-amber-200/40 bg-black/40 text-amber-100 text-[10px] md:text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-amber-100 hover:text-black hover:border-amber-100 backdrop-blur-md shadow-xl whitespace-nowrap font-bold">
              Find Your Scent
            </button>
          </Link>
          <Link href="#category-blocks">
            <button className="w-[280px] md:w-auto inline-block px-8 md:px-12 py-3.5 md:py-4 border border-amber-200 text-black bg-amber-100 text-[10px] md:text-[12px] uppercase tracking-[0.25em] transition-all duration-300 hover:bg-transparent hover:text-amber-100 hover:border-amber-100 backdrop-blur-md shadow-xl whitespace-nowrap font-black">
              Shop Collection
            </button>
          </Link>
          <Link href="/custom-box">
            <button className="w-[280px] md:w-auto inline-block px-8 md:px-10 py-3.5 md:py-4 border border-amber-200/40 bg-black/40 text-amber-100 text-[10px] md:text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-amber-100 hover:text-black hover:border-amber-100 backdrop-blur-md shadow-xl whitespace-nowrap font-bold">
              Build a Box
            </button>
          </Link>
        </motion.div>
      </section>

      {/* TRUST BADGES BAR */}
      <TrustBadges />

      {/* FRAGRANCE FINDER PROMINENT */}
      <div className="w-full">
        <FragranceFinderWidget />
      </div>

      
      {/* CATEGORY BLOCK GRID (6 CARDS) */}
      <section id="category-blocks" className="max-w-[1600px] mx-auto py-24 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        {[
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
            title: 'Luxury Gift Boxes', 
            slug: 'gift-boxes',
            img: '/images/categories/luxury_gift_boxes.jpg', 
            tags: 'The perfect present • Premium unboxing'
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
          }
        ].map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 30, rotateX: -5 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full"
          >
            <Tilt 
              tiltMaxAngleX={6} 
              tiltMaxAngleY={6} 
              glareEnable 
              glareMaxOpacity={0.3} 
              glareColor="#ffffff" 
              glarePosition="all" 
              scale={1.01}
              transitionSpeed={1000}
              className="h-72 sm:h-80 rounded-xl w-full"
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10" style={{ transform: "translateZ(30px)" }}>
                   <h3 className="text-white text-3xl font-serif italic drop-shadow-lg mb-1">{cat.title}</h3>
                   <p className="text-gray-300 text-[10px] font-sans uppercase tracking-[0.2em] mb-4 opacity-90">{cat.tags}</p>
                   
                   <div className="flex items-center text-white text-[11px] uppercase font-bold tracking-widest relative overflow-hidden group/link pointer-events-auto">
                     <span className="relative z-10">Explore</span>
                     <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover/link:translate-x-1 transition-transform" />
                     <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />
                   </div>
                </div>
              </Link>
            </Tilt>
          </motion.div>
        ))}
      </section>



      <section id="premium-perfumes" className="w-full bg-[var(--color-surface)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                Premium Perfumes
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                The pinnacle of luxury
              </motion.p>
            </div>
            <Link href="/category/premium-perfumes" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {premiumPerfumes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
              {premiumPerfumes.slice(0, 5).map((perfume: any) => (
                <div key={perfume.id} className="w-full">
                  <ProductCard perfume={perfume} />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 flex items-center justify-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-background)]/50">
              <p className="text-[var(--color-text-muted)] font-serif italic text-lg">Coming soon</p>
            </div>
          )}
        </div>
      </section>

      <section id="classic-perfumes" className="w-full bg-[var(--color-background)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                Classic Perfumes
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                Timeless elegance and charm
              </motion.p>
            </div>
            <Link href="/category/classic-perfumes" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {classicPerfumes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
              {classicPerfumes.slice(0, 5).map((perfume: any) => (
                <div key={perfume.id} className="w-full">
                  <ProductCard perfume={perfume} />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 flex items-center justify-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-background)]/50">
              <p className="text-[var(--color-text-muted)] font-serif italic text-lg">Coming soon</p>
            </div>
          )}
        </div>
      </section>

      <section id="oud-collection" className="w-full bg-[var(--color-surface)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                The Oud Collection
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                Deep, resonant and historic
              </motion.p>
            </div>
            <Link href="/category/oud" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {oudCollection.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
              {oudCollection.slice(0, 5).map((perfume: any) => (
                <div key={perfume.id} className="w-full">
                  <ProductCard perfume={perfume} />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 flex items-center justify-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-background)]/50">
              <p className="text-[var(--color-text-muted)] font-serif italic text-lg">Coming soon</p>
            </div>
          )}
        </div>
      </section>

      <section id="sample-sets" className="w-full bg-[var(--color-background)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                Sample Sets
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                Discover your signature scent
              </motion.p>
            </div>
            <Link href="/category/sample-sets" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {sampleSets.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
              {sampleSets.slice(0, 5).map((perfume: any) => (
                <div key={perfume.id} className="w-full">
                  <ProductCard perfume={perfume} />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 flex items-center justify-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-background)]/50">
              <p className="text-[var(--color-text-muted)] font-serif italic text-lg">Coming soon</p>
            </div>
          )}
        </div>
      </section>

      <section id="traditional-attars" className="w-full bg-[var(--color-surface)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                Perfume Wax and Attar
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                Alcohol-free perfection
              </motion.p>
            </div>
            <Link href="/category/perfume-wax-attar" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {traditionalAttars.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
              {traditionalAttars.slice(0, 5).map((perfume: any) => (
                <div key={perfume.id} className="w-full">
                  <ProductCard perfume={perfume} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyCategoryState title="Perfume Wax & Attar Coming Soon" />
          )}
        </div>
      </section>

      <section id="luxury-gift-boxes" className="w-full bg-[var(--color-surface)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                Luxury Gift Boxes
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                The perfect present for loved ones
              </motion.p>
            </div>
            <Link href="/shop" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {luxuryGiftBoxes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
              {luxuryGiftBoxes.slice(0, 5).map((perfume: any) => (
                <div key={perfume.id} className="w-full">
                  <ProductCard perfume={perfume} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyCategoryState title="Luxury Gift Boxes Coming Soon" />
          )}
        </div>
      </section>

      <section id="under-3000" className="w-full bg-[var(--color-background)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                Under 3,000
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                Premium selections at accessible prices
              </motion.p>
            </div>
            <Link href="/shop" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {under3000.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
              {under3000.slice(0, 5).map((perfume: any) => (
                <div key={perfume.id} className="w-full">
                  <ProductCard perfume={perfume} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyCategoryState title="Budget Collection Coming Soon" />
          )}
        </div>
      </section>

      <section id="home-space" className="w-full relative py-32 overflow-hidden border-y border-[var(--color-border)]">
        {/* Lifestyle Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxurious Sanctuary" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="lg:w-1/3 flex flex-col justify-center relative z-10 text-center lg:text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-300/90 font-medium mb-3 block">
              Anti-Gravity Elegance
            </span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-white font-light uppercase tracking-widest leading-tight mb-4"
            >
              Transform<br />Your<br />Sanctuary
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-neutral-300 italic font-serif text-lg mb-8 max-w-sm mx-auto lg:mx-0"
            >
              Elevate your space with our exclusive range of room sprays and diffusers. Set the perfect mood for relaxation, focus, or welcoming guests.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/category/home-space-fragrances" className="inline-block px-8 py-3.5 border border-amber-200/40 text-amber-100 text-xs uppercase tracking-[0.25em] transition-all duration-300 hover:bg-amber-100 hover:text-black hover:border-amber-100 backdrop-blur-sm">
                Explore The Experience
              </Link>
            </motion.div>
          </div>

          {/* Horizontal Carousel */}
          <div className="lg:w-2/3 w-full">
            {homeSpace.length > 0 ? (
              <div className="flex overflow-x-auto space-x-6 pb-8 pt-4 px-4 -mx-4 scrollbar-hide snap-x">
                {homeSpace.map((perfume: any, idx: number) => (
                  <motion.div 
                    key={perfume.id} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="min-w-[280px] max-w-[280px] md:min-w-[320px] md:max-w-[320px] snap-center bg-[var(--color-surface)] rounded-sm shadow-2xl shrink-0"
                  >
                    <ProductCard perfume={perfume} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full">
                <EmptyCategoryState title="Home & Space Coming Soon" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BLOG / HIGHLIGHT CARDS (ARCHES) */}
      <section id="attar" className="max-w-[1600px] mx-auto py-12 px-8">
         <p className="text-center text-[10px] text-[var(--color-text-muted)] max-w-4xl mx-auto mb-12 leading-relaxed">
           ZERO TO ONE is one of the leading online perfume stores, offering a carefully curated collection of fragrances for men and women... <a href="#" className="font-bold underline text-[var(--color-text)]">Read More.</a>
         </p>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-[90%] max-w-[1400px] mx-auto">
           
           {[
             {
               title: 'Body Mist',
               desc: 'A light, refreshing spray for everyday freshness without the heaviness of perfume.',
               btn: 'SHOP NOW',
               img: '/images/body_mist_arch.jpg',
               price: 'Starting from Rs. 1,490',
               tag: 'Most Popular',
               highlights: ['Lightweight', 'Daily Wear', 'Refreshing'],
               hoverScents: ['Aeternum Rose', 'Citrus Splash Mist', 'Floral Fresh Mist']
             },
             {
               title: 'Poetic Perfumes',
               desc: 'Discover the Poetic Range - Where Iconic DNA Meets Artistic Expression',
               btn: 'EXPLORE RANGE',
               img: '/images/poetic_perfumes.jpg',
               price: 'Starting from Rs. 2,990',
               tag: 'Luxury Blend',
               highlights: ['Long-Lasting', 'Luxury Blend', 'Artisanal'],
               hoverScents: ['Aeternum Glow', 'Amber Rose', 'Dark Aura', 'Eternal Essence', 'Eternal Woods', 'Hidden Breeze', 'Midnight Tears']
             },
             {
               title: 'Best Attar',
               desc: "You are an absolute Attar fan? Then you'll love these attar fragrances for sure!",
               btn: 'SHOP NOW',
               img: '/images/attar_arch.jpg',
               price: 'Starting from Rs. 990',
               tag: 'Alcohol-Free',
               highlights: ['100% Alcohol-Free', 'Pure Concentrated', 'Traditional'],
               hoverScents: ['Perfume Wax Edition 1', 'Perfume Wax Edition 2', 'Perfume Wax Edition 3', 'Perfume Wax Edition 4', 'Perfume Wax Edition 5']
             }
           ].map((block, i) => (
             <motion.div
               key={block.title}
               initial={{ rotateY: -15, opacity: 0, y: 40 }}
               whileInView={{ rotateY: 0, opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
               style={{ perspective: 1200 }}
               className="flex flex-col items-center text-center w-full group cursor-pointer"
             >
               <Link 
                 href={
                   block.title === 'Body Mist' ? '/category/body-mist' : 
                   block.title === 'Poetic Perfumes' ? '/category/poetic-perfumes' : 
                   '/category/attar'
                 } 
                 className="w-full h-full flex flex-col items-center"
               >
                 <Tilt 
                   tiltMaxAngleX={10} 
                   tiltMaxAngleY={10} 
                   glareEnable 
                   glareMaxOpacity={0.4} 
                   glareColor="#ffffff" 
                   glarePosition="all"
                   transitionSpeed={1000}
                   className="w-full aspect-[4/5] rounded-t-full mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-500 relative"
                 >
                   <div className="w-full h-full rounded-t-full overflow-hidden relative bg-[var(--color-primary)] transform-gpu preserve-3d">
                     <Image 
                       src={block.img} 
                       alt={block.title} 
                       fill 
                       className="object-cover scale-[1.01] group-hover:scale-[1.05] transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" 
                       loading="lazy" 
                     />
                     
                     {/* Overlay on hover for quick preview */}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 z-20">
                       <span className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-white/30 pb-1">Popular Scents</span>
                       <ul className="text-sm font-medium space-y-1">
                         {block.hoverScents.map(scent => (
                           <li key={scent}>• {scent}</li>
                         ))}
                       </ul>
                     </div>

                     <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-primary)] to-transparent pointer-events-none z-10" />

                     {/* Tag Badge moved inside to respect rounded-t-full */}
                     <div className="absolute top-6 right-0 bg-gradient-to-r from-amber-600/90 to-amber-400/90 text-white text-[9px] tracking-widest px-3 py-1.5 uppercase font-bold rounded-l-md shadow-md z-30">
                       {block.tag}
                     </div>
                   </div>
                 </Tilt>
                 
                 <div className="transform-gpu group-hover:-translate-y-1 transition-transform duration-300 w-full">
                   <h3 className="font-black text-[var(--color-text)] tracking-widest uppercase text-lg mb-1 drop-shadow-md">{block.title}</h3>
                   <p className="text-[11px] font-bold text-[var(--color-text-muted)] mb-3">{block.price}</p>
                   <p className="text-sm text-[var(--color-text)] mb-4 px-4 leading-relaxed max-w-[320px] font-medium mx-auto">{block.desc}</p>
                   
                   {/* Highlights / Mini Badges */}
                   <div className="flex flex-wrap justify-center gap-2 mb-6 px-2">
                     {block.highlights.map(h => (
                       <span key={h} className="text-[9px] uppercase tracking-wider font-bold bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 rounded-sm text-[var(--color-text-muted)]">
                         {h}
                       </span>
                     ))}
                   </div>

                   <div className={`text-xs uppercase font-bold tracking-widest px-8 py-3 rounded-sm transition-colors duration-300 shadow-sm inline-block ${block.title === 'Poetic Perfumes' ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-primary)]' : 'bg-white text-black hover:bg-[var(--color-accent)] hover:text-white'}`}>
                     {block.btn}
                   </div>
                 </div>
               </Link>
             </motion.div>
           ))}
           
         </div>
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter" className="w-full border-t border-[var(--color-border)] py-12 px-8 flex flex-col sm:flex-row justify-center items-center gap-6">
        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--color-text)]">Let's keep in touch! Get email offers & the latest news from us</h3>
        <div className="flex w-full max-w-sm">
          <input type="email" placeholder="Enter your email" className="flex-1 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] px-4 py-2 text-xs focus:outline-none focus:border-[var(--color-text)] rounded-l-sm" />
          <button className="bg-[var(--color-accent)] text-white font-bold text-xs px-6 py-2 uppercase tracking-widest hover:opacity-80 transition rounded-r-sm">Subscribe</button>
        </div>
      </section>


      {/* Floating WhatsApp Icon */}
      <a 
        href="https://wa.me/923000000000"
        className="fixed bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
        style={{ bottom: 40, right: 40 }}
      >
        <Phone fill="currentColor" className="w-7 h-7" />
      </a>

    </main>
  );
}
