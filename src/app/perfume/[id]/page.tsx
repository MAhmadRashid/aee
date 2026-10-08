"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '../../../hooks/useCurrency';
import { useCart } from '../../../context/CartContext';
import ProductCard from '../../../components/ProductCard';
import { ChevronLeft, ShoppingBag, MessageCircle, MapPin, Check, Wind, Droplets, Leaf, ChevronDown, ChevronUp, History } from 'lucide-react';

export default function PerfumeDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [perfume, setPerfume] = useState<any>(null);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const livePerfume = data.data.find((p: any) => p.id === resolvedParams.id || p.slug === resolvedParams.id);
          if (livePerfume) {
            setPerfume(livePerfume);
            
            // Save to recently viewed
            try {
              let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
              viewed = viewed.filter((id: string) => id !== livePerfume.id);
              viewed.unshift(livePerfume.id);
              if (viewed.length > 5) viewed = viewed.slice(0, 5);
              localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
              
              // Load recently viewed
              const recent = data.data.filter((p: any) => viewed.includes(p.id) && p.id !== livePerfume.id);
              // Sort by view order
              recent.sort((a: any, b: any) => viewed.indexOf(a.id) - viewed.indexOf(b.id));
              setRecentProducts(recent);
            } catch (e) {
              console.error("Local storage error", e);
            }
          }
        }
      })
      .catch(err => console.error("Failed to fetch live product:", err));
  }, [resolvedParams.id]);

  const { formatPrice, isLoading } = useCurrency();
  const { addToCart, cartCount, cartItems, setIsCartOpen } = useCart();
  
  const hasVariants = perfume?.sizeVariants && perfume.sizeVariants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('notes');

  useEffect(() => {
    if (hasVariants && perfume) {
      setSelectedVariant(perfume.sizeVariants[0]);
    }
  }, [perfume, hasVariants]);

  const [isAdded, setIsAdded] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : perfume?.price || 0;
  const originalPrice = selectedVariant ? selectedVariant.originalPrice : perfume?.originalPrice;
  const stock = selectedVariant ? selectedVariant.stock : (perfume?.stock ?? 15);
  
  const rawImageUrl = perfume?.image || perfume?.image_url || 'https://image.pollinations.ai/prompt/minimal%20grey%20perfume%20placeholder?nologo=true&seed=0';
  const imageUrl = rawImageUrl.startsWith('/') ? rawImageUrl.split('?')[0] : rawImageUrl;
  
  const handleAddToCart = () => {
    if (stock > 0 && perfume) {
      addToCart({ 
        id: perfume.id, 
        name: perfume.name, 
        price: currentPrice, 
        variant: selectedVariant?.size, 
        image: imageUrl 
      });
      setIsAdded(true);
      setIsCartOpen(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (!perfume) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)]">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Loading Collection</p>
    </div>
  );
  
  let stockStatus = 'In Stock';
  if (stock === 0) stockStatus = 'Out of Stock';
  else if (stock <= 10) stockStatus = `Low Stock (${stock} left)`;

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans selection:bg-[var(--color-primary)] selection:text-[var(--color-background)] pb-20 lg:pb-0">
      {/* Premium Navigation Header */}
      <header className="w-full absolute top-0 z-50 py-8 px-6 lg:px-12 flex justify-between items-center">
        <Link href="/shop" className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors group">
          <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Boutique
        </Link>
        <Link href="/cart" className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors relative">
           <ShoppingBag className="w-4 h-4 mr-2" />
           Cart
           {cartCount > 0 && (
             <span className="absolute -top-2 -right-3 bg-[var(--color-accent)] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
               {cartCount}
             </span>
           )}
        </Link>
      </header>

      <div className="flex flex-col lg:flex-row min-h-screen pt-24 lg:pt-24">
        {/* Left Side: Stunning 2D Image Hero (50%) */}
        <div className="w-full lg:w-[50%] relative flex items-center justify-center p-6 lg:p-20 bg-[var(--color-surface)]/30 border-r border-[var(--color-border)]/50 min-h-[50vh] lg:min-h-screen">
           {/* Subtle glow behind image */}
           <div className="absolute inset-0 bg-radial-gradient from-[var(--color-surface)] to-transparent opacity-60 pointer-events-none" />
           
           <div className="relative w-full max-w-lg aspect-square rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] group">
             <Image
                src={imageUrl}
                alt={perfume.name}
                fill
                priority
                quality={100}
                className="object-contain p-4 transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
             />
             <div className="absolute inset-0 border border-white/10 pointer-events-none mix-blend-overlay"></div>
           </div>
        </div>

        {/* Right Side: Product Details (50%) */}
        <div className="w-full lg:w-[50%] bg-[var(--color-background)] p-8 lg:p-24 flex flex-col justify-center min-h-screen">
          
          <div className="mb-10 animate-fade-in-up">
            {perfume.brand && (
              <div className="uppercase text-[10px] font-bold tracking-[0.4em] text-[var(--color-text-muted)] mb-4">
                {perfume.brand}
              </div>
            )}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif italic tracking-wide mb-4 text-[var(--color-primary)] drop-shadow-sm leading-tight break-words">
              {perfume.name}
            </h1>
            <div className="uppercase text-[10px] font-bold tracking-[0.2em] text-[var(--color-accent)]">
              {perfume.category}
            </div>
          </div>
          
          <div className="flex items-end space-x-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-3xl font-sans tracking-widest text-[var(--color-primary)]">
              {isLoading ? '...' : formatPrice(currentPrice)}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-xl text-[var(--color-text-muted)] opacity-80 line-through tracking-widest mb-1">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          
          {/* Star Rating & Reviews */}
          <div className="flex items-center space-x-2 mb-10 animate-fade-in-up opacity-100" style={{ animationDelay: '0.15s' }}>
            <div className="flex text-[var(--color-accent)] font-black">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-[var(--color-text)] font-bold tracking-widest">
              {(perfume.rating || 4.8).toFixed(1)} <span className="text-[var(--color-text-muted)] mx-1">|</span> {perfume.reviews || 128} Reviews
            </span>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-[var(--color-border)] to-transparent mb-10 opacity-50" />

          {/* Size Selector */}
          {hasVariants && (
            <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-5">Select Size</h4>
              <div className="flex flex-wrap gap-4">
                {perfume.sizeVariants.map((variant: any) => (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${selectedVariant?.size === variant.size ? 'bg-[var(--color-primary)] text-[var(--color-background)] shadow-[0_4px_15px_rgba(0,0,0,0.1)]' : 'bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'}`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
              <p className={`text-[9px] font-bold tracking-[0.2em] uppercase mt-5 ${stock === 0 ? 'text-[var(--color-sale)]' : stock <= 10 ? 'text-orange-500' : 'text-[var(--color-accent)]'}`}>
                {stockStatus}
              </p>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="mt-4 mb-12 animate-fade-in-up hidden lg:block" style={{ animationDelay: '0.3s' }}>
            <button 
              disabled={stock === 0}
              onClick={handleAddToCart}
              className={`w-full py-5 text-[11px] uppercase font-bold tracking-[0.25em] transition-all duration-500 flex items-center justify-center rounded-sm ${stock === 0 ? 'bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-border)]' : isAdded ? 'bg-green-700 text-white shadow-lg' : 'bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-accent)] hover:shadow-[0_10px_30px_rgba(194,155,87,0.3)]'}`}
            >
              {stock === 0 ? 'Out of Stock' : isAdded ? <><Check className="w-4 h-4 mr-2" /> Added to Collection</> : 'Add To Collection'}
            </button>

            {/* Direct Inquiry Button */}
            <a 
              href={`https://wa.me/923000000000?text=${encodeURIComponent(`Hi, I would like to inquire about ${perfume.name}...`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 py-4 text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)]/50 bg-transparent rounded-sm text-[var(--color-text)]"
            >
              <MessageCircle className="w-4 h-4 mr-2 text-[var(--color-accent)]" />
              Inquire via WhatsApp
            </a>
          </div>

          {/* Collapsible Accordions */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col gap-4">
              {/* Scent Notes Accordion */}
              {perfume.scentNotes && (
                <div className="border border-[var(--color-border)]/50 bg-[var(--color-surface)]/20 rounded-sm overflow-hidden">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === 'notes' ? null : 'notes')}
                    className="w-full p-4 flex justify-between items-center text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]/40"
                  >
                    Olfactory Profile
                    {activeAccordion === 'notes' ? <ChevronUp className="w-4 h-4 text-[var(--color-accent)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />}
                  </button>
                  {activeAccordion === 'notes' && (
                    <div className="p-8 pt-4 border-t border-[var(--color-border)]/30">
                      <div className="flex flex-col items-center gap-8 relative pb-4">
                        {/* Connecting Line */}
                        <div className="absolute top-8 bottom-8 w-[1px] bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-text-muted)] to-[var(--color-border)] opacity-30 z-0"></div>
                        
                        {/* Top Notes */}
                        <div className="flex flex-col items-center text-center relative z-10 w-full max-w-[200px]">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-accent)] flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                            <Wind className="w-4 h-4 text-[var(--color-accent)]" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] mb-1">Top Notes</span>
                          <span className="text-[9px] uppercase text-[var(--color-text-muted)] mb-2 block">First 15 mins</span>
                          <div className="flex flex-wrap justify-center gap-2">
                            {perfume.scentNotes.top.map((n: string) => (
                              <span key={n} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-serif text-[var(--color-text)]">{n}</span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Heart Notes */}
                        <div className="flex flex-col items-center text-center relative z-10 w-full max-w-[240px]">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-text-muted)] flex items-center justify-center mb-3">
                            <Droplets className="w-4 h-4 text-[var(--color-text-muted)]" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)] mb-1">Heart Notes</span>
                          <span className="text-[9px] uppercase text-[var(--color-text-muted)]/70 mb-2 block">2-4 Hours</span>
                          <div className="flex flex-wrap justify-center gap-2">
                            {perfume.scentNotes.middle.map((n: string) => (
                              <span key={n} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-serif text-[var(--color-text)]">{n}</span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Base Notes */}
                        <div className="flex flex-col items-center text-center relative z-10 w-full max-w-[280px]">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-white/20 flex items-center justify-center mb-3">
                            <Leaf className="w-4 h-4 text-white/50" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 mb-1">Base Notes</span>
                          <span className="text-[9px] uppercase text-white/40 mb-2 block">4+ Hours</span>
                          <div className="flex flex-wrap justify-center gap-2">
                            {perfume.scentNotes.base.map((n: string) => (
                              <span key={n} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-serif text-[var(--color-text)]">{n}</span>
                            ))}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Longevity Accordion */}
              {perfume.qualities && (
                <div className="border border-[var(--color-border)]/50 bg-[var(--color-surface)]/20 rounded-sm overflow-hidden">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === 'longevity' ? null : 'longevity')}
                    className="w-full p-4 flex justify-between items-center text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]/40"
                  >
                    Longevity & Sillage
                    {activeAccordion === 'longevity' ? <ChevronUp className="w-4 h-4 text-[var(--color-accent)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />}
                  </button>
                  {activeAccordion === 'longevity' && (
                    <div className="p-6 pt-4 border-t border-[var(--color-border)]/30 text-sm font-sans text-[var(--color-text)]/80 space-y-3">
                      <p><strong>Longevity:</strong> {perfume.qualities.longevity}</p>
                      <p><strong>Sillage:</strong> {perfume.qualities.sillage}</p>
                      <p><strong>Ideal Season:</strong> {perfume.qualities.season}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients Accordion */}
              <div className="border border-[var(--color-border)]/50 bg-[var(--color-surface)]/20 rounded-sm overflow-hidden">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === 'ingredients' ? null : 'ingredients')}
                  className="w-full p-4 flex justify-between items-center text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]/40"
                >
                  Ingredients
                  {activeAccordion === 'ingredients' ? <ChevronUp className="w-4 h-4 text-[var(--color-accent)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />}
                </button>
                {activeAccordion === 'ingredients' && (
                  <div className="p-6 pt-4 border-t border-[var(--color-border)]/30 text-[11px] leading-relaxed font-sans text-[var(--color-text-muted)] italic">
                    Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Geraniol, Coumarin, Citral, Benzyl Benzoate, Eugenol, Farnesol. <br/>
                    *Please be aware that ingredient lists may change or vary from time to time.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap gap-8 text-[9px] text-[var(--color-text-muted)] font-bold uppercase tracking-[0.2em] pt-8 border-t border-[var(--color-border)]/50 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <span className="flex items-center gap-2 hover:text-[var(--color-text)] transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" /> Complimentary Shipping</span>
            <span className="flex items-center gap-2 hover:text-[var(--color-text)] transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" /> 100% Authentic</span>
            <Link href="/store-locator" className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors">
              <MapPin className="w-3 h-3 text-[var(--color-accent)]" /> 
              Find In Store
            </Link>
          </div>

        </div>
      </div>

      {/* Recently Viewed Products */}
      {recentProducts.length > 0 && (
        <section className="w-full py-20 px-6 lg:px-12 bg-[var(--color-surface)]/20 border-t border-[var(--color-border)]/30">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <History className="w-5 h-5 text-[var(--color-accent)]" />
              <h2 className="text-xl md:text-2xl font-serif text-[var(--color-text)] uppercase tracking-widest">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {recentProducts.map(p => (
                <div key={p.id}>
                  <ProductCard perfume={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Add to Cart Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 p-4 bg-[var(--color-background)] border-t border-[var(--color-border)]/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase truncate max-w-[150px]">{perfume.name}</span>
            <span className="text-sm font-bold text-[var(--color-primary)]">{isLoading ? '...' : formatPrice(currentPrice)}</span>
          </div>
          <button 
            disabled={stock === 0}
            onClick={handleAddToCart}
            className={`px-6 py-3 text-[10px] uppercase font-bold tracking-[0.2em] transition-all rounded-sm ${stock === 0 ? 'bg-[var(--color-surface)] text-[var(--color-text-muted)]' : isAdded ? 'bg-green-700 text-white' : 'bg-[var(--color-primary)] text-[var(--color-background)]'}`}
          >
            {stock === 0 ? 'Out of Stock' : isAdded ? 'Added' : 'Add To Cart'}
          </button>
        </div>
      </div>
    </main>
  );
}
