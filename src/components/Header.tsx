"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, User, ShoppingBag, ChevronDown, Sun, Moon, Tag, Sparkles, X, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../hooks/useCurrency';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { cartItems, cartCount, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();
  const { currencyCode, changeCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();
  
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const themes = [
    { 
      id: 'midnight-gold', 
      name: 'Royal Sapphire', 
      colors: ['#02040A', '#070B14', '#D4AF37'] 
    },
    { 
      id: 'obsidian-silver', 
      name: 'Obsidian Platinum', 
      colors: ['#050505', '#0E0E0E', '#E5E4E2'] 
    },
    { 
      id: 'amber-oud', 
      name: 'Amber Oud', 
      colors: ['#0A0604', '#120A06', '#C87D46'] 
    }
  ];

  return (
    <>
      <header className="w-full sticky top-0 z-[100] bg-neutral-950/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        {/* Top Announcement Bar */}
        <div className="w-full bg-black/50 text-neutral-400 text-[9px] py-1.5 px-6 flex justify-between items-center font-bold tracking-[0.2em] uppercase border-b border-white/5">
          <div className="flex-1 hidden md:block"></div>
          <div className="text-center flex-1">Welcome to Anti-Gravity Elegance</div>
          <div className="flex-1 flex justify-end">
            <select 
              value={currencyCode} 
              onChange={(e) => changeCurrency(e.target.value)}
              className="bg-transparent text-neutral-400 border-none outline-none cursor-pointer font-bold tracking-[0.1em] py-0 m-0 leading-none"
            >
              <option value="PKR" className="text-black">PKR</option>
              <option value="USD" className="text-black">USD</option>
              <option value="EUR" className="text-black">EUR</option>
              <option value="GBP" className="text-black">GBP</option>
              <option value="AED" className="text-black">AED</option>
            </select>
          </div>
        </div>

        {/* Top Utility Bar */}
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Search (Left) */}
          <div className="flex-1">
            <div className="relative w-48 sm:w-64 flex items-center border-b border-white/20 pb-1 focus-within:border-white transition-colors">
              <button 
                onClick={() => {
                  if (searchQuery.trim()) {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="p-1 group flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="w-full bg-transparent text-white text-[10px] font-bold uppercase tracking-[0.2em] pl-2 focus:outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          {/* Main Brand Logo */}
          <div className="text-center flex-1">
            <Link href="/">
              <h1 className="font-serif text-2xl md:text-3xl tracking-[0.3em] uppercase text-white hover:opacity-90 transition-opacity">
                ZERO TO ONE
              </h1>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex-1 flex items-center justify-end gap-6 text-xs uppercase tracking-wider text-neutral-300">
            {/* Theme Toggle */}
            <div className="relative">
                <button 
                  onClick={() => setShowThemeMenu(!showThemeMenu)} 
                  className="hover:text-amber-200 transition-colors hidden sm:flex items-center gap-1.5"
                >
                  {theme === 'midnight-gold' ? <Moon className="w-[14px] h-[14px]" /> : theme === 'amber-oud' ? <Tag className="w-[14px] h-[14px]" /> : theme === 'obsidian-silver' ? <Sparkles className="w-[14px] h-[14px]" /> : <Sun className="w-[14px] h-[14px]" />}
                  <span>Theme</span>
                </button>
              
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-6 w-56 bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 p-2 rounded-sm"
                  >
                    {themes.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => { setTheme(t.id as any); setShowThemeMenu(false); }}
                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-white/5 transition ${theme === t.id ? 'font-black text-[#D4AF37]' : 'text-neutral-300'}`}
                      >
                        <div className="flex space-x-1 mr-3 border border-white/10 rounded-full overflow-hidden w-6 h-4">
                           <div style={{ backgroundColor: t.colors[0] }} className="w-1/3 h-full" />
                           <div style={{ backgroundColor: t.colors[1] }} className="w-1/3 h-full" />
                           <div style={{ backgroundColor: t.colors[2] }} className="w-1/3 h-full" />
                        </div>
                        <span className="text-[10px] tracking-[0.1em] uppercase">{t.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/account" className="hover:text-amber-200 transition-colors hidden sm:block">
              Account
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-1.5 hover:text-amber-200 transition-colors">
              <span>Cart</span>
              <span className="bg-amber-400/20 text-amber-200 text-[10px] px-1.5 py-0.5 rounded-full border border-amber-400/30">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Menu Bar */}
        <nav className="border-t border-white/5 bg-black/40 py-3 hidden md:block">
          <ul className="flex items-center justify-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-300">
            <li><Link href="/" className={pathname === '/' ? 'text-amber-300' : 'hover:text-white transition-colors'}>Home</Link></li>
            <li><Link href="/shop" className={pathname.startsWith('/shop') ? 'text-amber-300' : 'hover:text-white transition-colors'}>Shop</Link></li>
            <li><Link href="/fragrance-finder" className={pathname.startsWith('/fragrance-finder') ? 'text-amber-300' : 'hover:text-white transition-colors'}>Fragrance Finder</Link></li>
            <li><Link href="/custom-box" className={pathname.startsWith('/custom-box') ? 'text-amber-300' : 'hover:text-white transition-colors'}>Build a Box</Link></li>
            
            <li className="relative group">
              <span className={`cursor-pointer ${pathname.startsWith('/category') ? 'text-amber-300' : 'hover:text-white transition-colors'}`}>
                Collections
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-48">
                <div className="bg-neutral-950 border border-white/10 shadow-xl rounded-sm overflow-hidden flex flex-col py-2">
                  <Link href="/category/oud" className="px-4 py-2.5 text-[11px] hover:bg-white/5 hover:text-amber-300 transition-colors text-left text-neutral-300">
                    OUD
                  </Link>
                  <Link href="/category/attar" className="px-4 py-2.5 text-[11px] hover:bg-white/5 hover:text-amber-300 transition-colors text-left text-neutral-300">
                    ATTAR
                  </Link>
                  <Link href="/category/gifting-packages" className="px-4 py-2.5 text-[11px] hover:bg-white/5 hover:text-amber-300 transition-colors text-left text-neutral-300">
                    GIFTING PACKAGES
                  </Link>
                </div>
              </div>
            </li>
            
            <li><Link href="/loyalty" className={pathname.startsWith('/loyalty') ? 'text-amber-300' : 'hover:text-white transition-colors'}>Loyalty</Link></li>
            <li><Link href="/contact" className={pathname.startsWith('/contact') ? 'text-amber-300' : 'hover:text-white transition-colors'}>Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/* Slide-out Cart */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-surface)] text-[var(--color-text)] border-l border-[var(--color-border)] z-[100] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
                <h2 className="font-serif text-2xl">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-50">
                    <ShoppingBag className="w-16 h-16 mb-6 text-[var(--color-text)] stroke-1" />
                    <p className="font-sans uppercase tracking-[0.2em] text-xs text-[var(--color-text)]">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-6">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.variant}`} className="flex gap-5 pb-6 border-b border-[var(--color-border)]/50 last:border-0 group">
                        <div className="w-24 h-32 bg-[var(--color-background)] rounded-sm overflow-hidden relative flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-contain p-1 transition-transform duration-700 group-hover:scale-105" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-surface)] text-[var(--color-text-muted)] p-2 text-center ${item.image ? 'hidden' : ''}`}>
                            <span className="font-serif text-[10px] uppercase tracking-widest opacity-50">Zero To<br/>One</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-serif text-lg leading-tight mb-1 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{item.name}</h3>
                              {item.variant && <p className="text-[var(--color-accent)] text-[10px] tracking-widest uppercase">{item.variant}</p>}
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[var(--color-text-muted)] hover:text-[var(--color-sale)] transition-colors p-1" title="Remove Item">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-[var(--color-text)] text-sm font-medium mt-2">
                            Rs. {item.price.toLocaleString()}
                          </div>
                          
                          <div className="flex items-center mt-4">
                            <div className="flex items-center space-x-4 border border-[var(--color-border)] rounded-full px-4 py-1.5">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">-</button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-background)]/50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[var(--color-text-muted)] uppercase tracking-[0.2em] text-xs font-bold">Subtotal</span>
                    <span className="font-serif text-2xl text-[var(--color-text)]">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                    <button className="btn-luxury w-full flex justify-center items-center">
                      PROCEED TO CHECKOUT
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
