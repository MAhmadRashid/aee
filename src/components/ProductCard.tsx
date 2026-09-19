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
  const [isAdded, setIsAdded] = useState(false);
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
        className="flex flex-col cursor-pointer bg-neutral-950/40 backdrop-blur-sm relative border border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out group"
        whileHover={{ y: -4 }}
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

          {/* Badges Container */}
          <div className="absolute top-3 left-3 z-40 flex flex-col items-start space-y-2">
             {/* Sale Badge */}
             {discountPercentage > 0 && (
               <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(212, 175, 55, 0.4)', color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '0.1em' }} className="px-3 py-1 uppercase font-bold rounded-sm backdrop-blur-md">
                 SALE -{discountPercentage}%
               </div>
             )}
             
             {/* Stock Badge */}
             {stockStatus !== 'In Stock' && (
                <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a3a3a3', fontSize: '0.7rem', letterSpacing: '0.1em' }} className="px-3 py-1 uppercase font-bold rounded-sm backdrop-blur-md">
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
                 <p className="text-[11px] text-[var(--color-text-muted)] font-sans uppercase tracking-[0.3em] font-bold m-0">
                   {perfume.brand}
                 </p>
              )}
            </div>
            <h3 className="font-serif text-lg md:text-xl text-[var(--color-text)] font-semibold line-clamp-2 min-h-[3.5rem] w-full mb-1 group-hover:text-[var(--color-primary)] transition-colors duration-300">
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if(totalStock > 0) {
                  addToCart({ id: perfume.id, name: perfume.name, price: startingPrice, variant: hasVariants ? perfume.sizeVariants[0].size : undefined, image: perfume.image || perfume.image_url });
                  setIsAdded(true);
                  setTimeout(() => setIsAdded(false), 2000);
                  setIsCartOpen(true);
                }
              }}
              className={`w-full py-3 text-[11px] uppercase font-bold tracking-[0.15em] rounded-sm transition-all duration-300 ${
                totalStock === 0 
                  ? 'border border-white/5 text-neutral-600 bg-neutral-900/30 cursor-not-allowed' 
                  : isAdded
                    ? 'border border-[#D4AF37] bg-[#D4AF37] text-white'
                    : 'border border-white/20 text-white bg-transparent hover:bg-white hover:text-black hover:border-white'
              }`}
            >
              {totalStock === 0 ? 'Sold Out' : isAdded ? '✓ Added' : 'Add To Cart'}
            </button>
          </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default React.memo(ProductCard);
