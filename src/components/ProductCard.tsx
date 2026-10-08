"use client";

import React, { useState, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../hooks/useCurrency';

function ProductCard({ perfume }: { perfume: any }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();

  // Compute pricing and stock from size variants if available
  const hasVariants = perfume.sizeVariants && perfume.sizeVariants.length > 0;
  
  const startingPrice = hasVariants 
    ? Math.min(...perfume.sizeVariants.map((v: any) => v.price))
    : perfume.price;
    
  const startingOriginalPrice = hasVariants 
    ? Math.min(...perfume.sizeVariants.map((v: any) => v.originalPrice || v.price))
    : (perfume.originalPrice || perfume.price);
    
  const totalStock = hasVariants 
    ? perfume.sizeVariants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
    : 15; // default fallback if no stock field

  const discountPercentage = startingOriginalPrice > startingPrice
    ? Math.round(((startingOriginalPrice - startingPrice) / startingOriginalPrice) * 100)
    : 0;

  // Use local image if available, fallback to image_url, then placeholder
  const rawImageUrl = imageError || !perfume || !(perfume.image || perfume.image_url)
    ? 'https://image.pollinations.ai/prompt/minimal%20grey%20perfume%20placeholder?nologo=true&seed=0' 
    : (perfume.image || perfume.image_url);
    
  // Next.js local image optimization crashes if local images have query strings.
  const imageUrl = rawImageUrl.startsWith('/') ? rawImageUrl.split('?')[0] : rawImageUrl;

  let stockStatus = 'In Stock';
  if (totalStock === 0) stockStatus = 'Out of Stock';
  else if (totalStock <= 10) stockStatus = 'Low Stock';

  // Generate deterministic random rating between 3.8 and 5.0 based on ID
  const generateRating = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const ratingBase = (Math.abs(hash) % 13) / 10; // 0.0 to 1.2
    const rating = (3.8 + ratingBase).toFixed(1);
    const reviewsCount = (Math.abs(hash) % 450) + 12; // 12 to 461
    return { rating, reviewsCount };
  };
  
  const { rating, reviewsCount } = perfume.rating ? { rating: perfume.rating, reviewsCount: perfume.reviews } : generateRating(perfume.id);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(totalStock > 0) {
      addToCart({ id: perfume.id, name: perfume.name, price: startingPrice, variant: hasVariants ? perfume.sizeVariants[0].size : undefined, image: perfume.image || perfume.image_url });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      setIsCartOpen(true);
      setIsQuickViewOpen(false);
    }
  };

  return (
    <>
    <Link href={`/perfume/${perfume.id}`} className="block group">
      <motion.div 
        className="flex flex-col cursor-pointer bg-neutral-950/60 backdrop-blur-md relative border border-white/5 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_40px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/30 transition-all duration-500 ease-out group"
        whileHover={{ y: -6, scale: 1.02 }}
      >
        <div className="aspect-[4/5] w-full bg-transparent relative overflow-hidden flex items-center justify-center">
          
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[var(--color-border)]/20 animate-pulse z-0" />
          )}

          {/* Product Image */}
          <div className="absolute inset-0 z-10 p-4">
            <Image 
              src={imageUrl} 
              alt={perfume.name}
              fill
              loading="lazy"
              className={`object-contain p-4 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] scale-100 group-hover:scale-105 group-hover:opacity-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageError(true); setImageLoaded(true); }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
            />
            {/* Secondary Image for Hover Effect */}
            <Image 
              src={perfume.image_secondary || imageUrl} // Fallback to primary image if secondary doesn't exist, but we apply a filter or slight zoom to simulate it
              alt={`${perfume.name} alternative`}
              fill
              loading="lazy"
              className={`object-contain p-4 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] scale-110 opacity-0 group-hover:scale-105 group-hover:opacity-100 absolute inset-0 ${!perfume.image_secondary ? 'brightness-75 contrast-125' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
            />
          </div>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={handleQuickView}
              className="pointer-events-auto flex items-center justify-center space-x-2 bg-black/80 backdrop-blur-md text-white border border-[#D4AF37]/50 px-6 py-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#D4AF37] hover:text-black hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Quick View</span>
            </button>
          </div>

          {/* Badges Container */}
          <div className="absolute top-3 left-3 z-40 flex flex-col items-start space-y-2">
             {/* Sale Badge */}
             {discountPercentage > 0 && (
               <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(212, 175, 55, 0.4)', color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '0.1em' }} className="px-3 py-1 uppercase font-bold rounded-sm backdrop-blur-md shadow-lg">
                 SALE -{discountPercentage}%
               </div>
             )}
             
             {/* Stock Badge */}
             {stockStatus !== 'In Stock' && (
                <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a3a3a3', fontSize: '0.7rem', letterSpacing: '0.1em' }} className="px-3 py-1 uppercase font-bold rounded-sm backdrop-blur-md shadow-lg">
                  {stockStatus}
                </div>
             )}
          </div>

        </div>

        {/* Product Details (Minimalist) */}
        <div className="p-5 flex-1 flex flex-col items-center text-center z-20 bg-transparent justify-between">
          <div className="w-full flex flex-col items-center justify-start flex-1">
            <div className="min-h-[1.5rem] flex flex-col justify-end mb-1">
              {perfume.brand && (
                 <p className="text-[11px] text-[#D4AF37] font-sans uppercase tracking-[0.3em] font-bold m-0">
                   {perfume.brand}
                 </p>
              )}
            </div>
            <h3 className="font-serif text-lg md:text-xl text-[var(--color-text)] font-semibold line-clamp-2 min-h-[3.5rem] w-full mb-1 group-hover:text-[#D4AF37] transition-colors duration-300">
              {perfume.name}
            </h3>
            <div className="flex items-center justify-center mb-3 px-2">
              {perfume.bundle_contents && perfume.bundle_contents.length > 0 && (
                <p className="text-xs text-[var(--color-text-muted)] italic leading-tight m-0 line-clamp-2">
                  Includes: {perfume.bundle_contents.join(' + ')}
                </p>
              )}
            </div>
          </div>
          
          <div className="w-full flex flex-col items-center justify-end">
          
          <div className="flex items-center justify-center space-x-3 text-sm tracking-wide font-sans mb-3">
            <span className="text-white font-bold text-base">
              {formatPrice(startingPrice)}
            </span>
            {startingOriginalPrice > startingPrice && (
              <span className="text-neutral-500 opacity-80 line-through text-[13px]">
                {formatPrice(startingOriginalPrice)}
              </span>
            )}
          </div>
          
          {/* Star Rating snippet */}
          <div className="flex items-center justify-center space-x-1 mb-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
             <div className="flex items-center text-[#D4AF37] font-black">
               <span className="text-[10px]">★</span>
             </div>
             <span className="text-[10px] text-neutral-400 font-medium">{rating}</span>
              <div className="flex items-center space-x-1 ml-0.5">
               <span className="text-[9px] text-neutral-500 tracking-wider">({reviewsCount})</span>
              </div>
          </div>
          
          {/* Fixed Add To Cart CTA */}
          <div className="w-full mt-auto pt-2">
            <button 
              disabled={totalStock === 0 || isAdded}
              onClick={handleAddToCart}
              className={`w-full py-3 text-[11px] uppercase font-bold tracking-[0.15em] rounded-sm transition-all duration-300 ${
                totalStock === 0 
                  ? 'border border-white/5 text-neutral-600 bg-neutral-900/30 cursor-not-allowed' 
                  : isAdded
                    ? 'border border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                    : 'border border-white/20 text-white bg-black/40 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]'
              }`}
            >
              {totalStock === 0 ? 'Sold Out' : isAdded ? '✓ Added' : 'Add To Cart'}
            </button>
          </div>
          </div>
        </div>
      </motion.div>
    </Link>

    {/* Quick View Modal */}
    <AnimatePresence>
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(false); }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="relative w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row z-10"
          >
            {/* Close Button */}
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(false); }}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-[#D4AF37] text-white hover:text-black rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image Area */}
            <div className="w-full md:w-1/2 relative bg-gradient-to-br from-neutral-900 to-black aspect-square md:aspect-auto border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center p-8">
               <div className="absolute inset-0 bg-[#D4AF37]/5 mix-blend-overlay pointer-events-none" />
               <div className="relative w-full h-full max-h-[400px]">
                 <Image 
                   src={imageUrl} 
                   alt={perfume.name}
                   fill
                   className="object-contain drop-shadow-2xl"
                 />
               </div>
            </div>

            {/* Right Details Area */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-black/40">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3 block">
                {perfume.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">
                {perfume.name}
              </h2>
              
              <div className="flex items-center space-x-3 text-lg tracking-wide font-sans mb-6">
                <span className="text-white font-bold">
                  {formatPrice(startingPrice)}
                </span>
                {startingOriginalPrice > startingPrice && (
                  <span className="text-neutral-500 line-through text-sm">
                    {formatPrice(startingOriginalPrice)}
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-400 font-sans leading-relaxed mb-8 line-clamp-3">
                {perfume.description || "A masterfully crafted fragrance capturing the essence of luxury. Experience deep, evolving notes that linger throughout the day."}
              </p>

              {/* Fragrance Notes */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <span className="w-16 text-[9px] uppercase tracking-widest text-neutral-500 font-bold mt-1">Top</span>
                  <p className="flex-1 text-sm text-neutral-200">
                    {perfume.notes?.top?.join(', ') || 'Citrus, Bergamot, Pink Pepper'}
                  </p>
                </div>
                <div className="flex items-start border-t border-white/5 pt-4">
                  <span className="w-16 text-[9px] uppercase tracking-widest text-neutral-500 font-bold mt-1">Heart</span>
                  <p className="flex-1 text-sm text-neutral-200">
                    {perfume.notes?.middle?.join(', ') || 'Rose, Jasmine, Spices'}
                  </p>
                </div>
                <div className="flex items-start border-t border-white/5 pt-4">
                  <span className="w-16 text-[9px] uppercase tracking-widest text-neutral-500 font-bold mt-1">Base</span>
                  <p className="flex-1 text-sm text-neutral-200">
                    {perfume.notes?.base?.join(', ') || 'Oud, Amber, Musk, Vanilla'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  disabled={totalStock === 0 || isAdded}
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 text-[11px] uppercase font-bold tracking-[0.2em] rounded-sm transition-all duration-300 ${
                    totalStock === 0 
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                      : isAdded
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-black hover:bg-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  }`}
                >
                  {totalStock === 0 ? 'Out of Stock' : isAdded ? 'Added to Cart ✓' : 'Add To Cart'}
                </button>
                <Link 
                  href={`/perfume/${perfume.id}`}
                  className="px-6 py-4 flex items-center justify-center border border-white/20 text-white hover:border-white text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors"
                >
                  Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

export default React.memo(ProductCard);
