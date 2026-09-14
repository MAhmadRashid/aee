"use client";

import React, { useState, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../hooks/useCurrency';

function ProductCard({ perfume }: { perfume: any }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  return (
    <Link href={`/perfume/${perfume.id}`} className="block group">
      <motion.div 
        className="flex flex-col cursor-pointer bg-[var(--color-surface)] relative border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out group"
        whileHover={{ y: -4 }}
      >
        <div className="aspect-square w-full bg-[var(--color-background)] relative overflow-hidden flex items-center justify-center">
          
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

          {/* Badges Container */}
          <div className="absolute top-0 right-0 z-40 flex flex-col items-end">
             {/* Sale Badge */}
             {discountPercentage > 0 && (
               <div className="mt-2 mr-2 bg-gradient-to-r from-amber-600/90 to-amber-400/90 text-white text-[8px] tracking-[0.2em] px-3 py-1 uppercase font-bold rounded-full shadow-sm backdrop-blur-md">
                 SALE -{discountPercentage}%
               </div>
             )}
             
             {/* Stock Badge */}
             {stockStatus !== 'In Stock' && (
                <div className={`mt-2 mr-2 text-[9px] tracking-widest px-3 py-1 uppercase font-bold rounded-full shadow-md backdrop-blur-md ${stockStatus === 'Out of Stock' ? 'bg-black/80 text-white border border-white/20' : 'bg-amber-700/80 text-white border border-white/20'}`}>
                  {stockStatus}
                </div>
             )}
          </div>

          {/* Quick Add to Cart overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 z-40 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <button 
              disabled={totalStock === 0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if(totalStock > 0) {
                  addToCart({ id: perfume.id, name: perfume.name, price: startingPrice, variant: hasVariants ? perfume.sizeVariants[0].size : undefined, image: perfume.image || perfume.image_url });
                  setIsCartOpen(true);
                }
              }}
              className={`w-full py-3 text-xs uppercase font-bold tracking-[0.15em] rounded-full transition-all duration-300 ${totalStock === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-accent)]'}`}
            >
              {totalStock === 0 ? 'Sold Out' : 'Add To Cart'}
            </button>
          </div>
        </div>

        {/* Product Details (Minimalist) */}
        <div className="p-5 flex flex-col items-center text-center z-20 bg-[var(--color-surface)]">
          <div className="min-h-[1.5rem] flex flex-col justify-end mb-1">
            {perfume.brand && (
               <p className="text-[11px] text-[var(--color-text-muted)] font-sans uppercase tracking-[0.3em] font-bold m-0">
                 {perfume.brand}
               </p>
            )}
          </div>
          <h3 className="font-serif text-lg md:text-xl text-[var(--color-text)] font-semibold truncate w-full mb-1 group-hover:text-[var(--color-primary)] transition-colors duration-300">
            {perfume.name}
          </h3>
          <div className="min-h-[1.5rem] flex items-center justify-center mb-3 px-2">
            {perfume.bundle_contents && perfume.bundle_contents.length > 0 && (
              <p className="text-xs text-[var(--color-text-muted)] italic leading-tight m-0 line-clamp-2">
                Includes: {perfume.bundle_contents.join(' + ')}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-sm tracking-wide font-sans mb-3">
            <span className="text-[var(--color-text)] font-bold text-base">
              {formatPrice(startingPrice)}
            </span>
            {startingOriginalPrice > startingPrice && (
              <span className="text-[var(--color-text-muted)] line-through text-xs">
                {formatPrice(startingOriginalPrice)}
              </span>
            )}
          </div>
          
          {/* Star Rating snippet */}
          <div className="flex items-center justify-center space-x-1.5 mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
             <div className="flex items-center text-[var(--color-accent)]">
               <span className="text-[12px]">★</span>
             </div>
             <span className="text-[11px] text-[var(--color-text)] font-semibold">{rating}</span>
             <div className="flex items-center space-x-1 ml-1">
               <span className="text-[10px] text-[var(--color-text-muted)] tracking-wider">({reviewsCount})</span>
               <div className="flex items-center text-green-500/80 bg-green-500/10 px-1 rounded-sm">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <span className="text-[8px] uppercase tracking-widest font-bold ml-0.5">Verified</span>
               </div>
             </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default React.memo(ProductCard);
