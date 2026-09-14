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
      colors: ['#040914', '#0A1121', '#D4AF37'] 
    },
    { 
      id: 'rose-quartz', 
      name: 'Rose Noir', 
      colors: ['#0A0708', '#120D0F', '#C89B9B'] 
    },
    { 
      id: 'emerald-onyx', 
      name: 'Emerald Onyx', 
      colors: ['#040D09', '#081711', '#C5A869'] 
    }
  ];

  return (
    <>
      <div className="w-full sticky top-0 z-[100] bg-[var(--color-surface)]/95 backdrop-blur-lg border-b border-[var(--color-border)] transition-all duration-300">
        {/* Top Announcement Bar */}
        <div className="w-full bg-[var(--color-background)]/50 text-[var(--color-text)]/90 text-[9px] py-1.5 px-6 flex justify-between items-center font-bold tracking-[0.2em] uppercase border-b border-[var(--color-border)]">
          <div className="flex-1 hidden md:block"></div>
          <div className="text-center flex-1">Welcome to Anti-Gravity Elegance</div>
          <div className="flex-1 flex justify-end">
            <select 
              value={currencyCode} 
              onChange={(e) => changeCurrency(e.target.value)}
              className="bg-transparent text-[var(--color-text)]/90 border-none outline-none cursor-pointer font-bold tracking-[0.1em] py-0 m-0 leading-none"
            >
              <option value="PKR" className="text-black">PKR</option>
              <option value="USD" className="text-black">USD</option>
              <option value="EUR" className="text-black">EUR</option>
              <option value="GBP" className="text-black">GBP</option>
              <option value="AED" className="text-black">AED</option>
            </select>
          </div>
        </div>

        {/* Main Header */}
        <header className="w-full bg-transparent transition-all duration-300">
          <div className="max-w-[1600px] mx-auto px-6 py-5 flex items-center justify-between">
            {/* Search (Left) */}
            <div className="flex-1 flex items-center">
              <div className="relative w-48 sm:w-64 flex items-center border-b border-[var(--color-border)] pb-1 focus-within:border-[var(--color-text)] transition-colors">
                <button 
                  onClick={() => {
                    if (searchQuery.trim()) {
                      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="p-1 group"
                >
                  <Search className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors" />
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
                  className="w-full bg-transparent text-[var(--color-text)] text-[10px] font-bold uppercase tracking-[0.2em] pl-2 focus:outline-none placeholder:text-[var(--color-text-muted)]"
                />
              </div>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <Link href="/">
                <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-[0.4em] text-center hover:opacity-80 transition cursor-pointer text-[var(--color-text)] leading-none pt-1">
                  ZERO TO ONE
                </h1>
              </Link>
            </div>

            {/* Icons (Right) */}
            <div className="flex-1 flex justify-end items-center space-x-6 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-text)]">
              
              {/* Theme Toggle */}
              <div className="relative">
                <button 
                  onClick={() => setShowThemeMenu(!showThemeMenu)} 
                  className="flex items-center space-x-2 hover:text-[var(--color-accent)] transition"
                >
                  {theme === 'midnight-gold' ? <Moon className="w-[18px] h-[18px]" /> : theme === 'emerald-onyx' ? <Tag className="w-[18px] h-[18px]" /> : theme === 'rose-quartz' ? <Sparkles className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
                  <span className="hidden sm:inline">Theme</span>
                </button>
                
                <AnimatePresence>
                  {showThemeMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-6 w-56 bg-[var(--color-surface)]/95 backdrop-blur-xl border border-[var(--color-border)] shadow-2xl z-50 p-2 rounded-sm"
                    >
                      {themes.map(t => (
                        <button 
                          key={t.id}
                          onClick={() => { setTheme(t.id as any); setShowThemeMenu(false); }}
                          className={`w-full flex items-center px-4 py-3 text-left hover:bg-[var(--color-background)] transition ${theme === t.id ? 'font-black text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}
                        >
                          <div className="flex space-x-1 mr-3 border border-[var(--color-border)] rounded-full overflow-hidden w-6 h-4">
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

              <Link href="/account" className="flex items-center space-x-2 hover:text-[var(--color-accent)] transition">
                <User className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline">Account</span>
              </Link>

              <button onClick={() => setIsCartOpen(true)} className="flex items-center space-x-2 hover:text-[var(--color-accent)] transition relative">
                <ShoppingBag className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-1 w-5 h-5 bg-[#C5A059] text-[9px] font-bold rounded-full flex items-center justify-center text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Sub-Navigation Bar */}
        <nav className="w-full bg-[var(--color-background)] backdrop-blur-md transition-colors duration-500 border-t border-[var(--color-border)] shadow-sm hidden md:block py-3">
          <div className="max-w-[1600px] mx-auto flex justify-center items-center space-x-8 text-[12px] font-bold tracking-[0.05em] uppercase text-center whitespace-nowrap">
            <Link href="/" className={`flex items-center transition ${pathname === '/' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              <Home className="w-3 h-3 mr-1" /> HOME
            </Link>
            <Link href="/shop" className={`flex items-center transition ${pathname.startsWith('/shop') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              SHOP <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link href="/fragrance-finder" className={`transition ${pathname.startsWith('/fragrance-finder') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              FRAGRANCE FINDER
            </Link>
            <Link href="/custom-box" className={`transition ${pathname.startsWith('/custom-box') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              BUILD A BOX
            </Link>
            <Link href="/category/gifting-packages" className={`transition ${pathname === '/category/gifting-packages' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              GIFTING PACKAGES
            </Link>
            <Link href="/category/oud" className={`transition ${pathname === '/category/oud' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              OUD
            </Link>
            <Link href="/category/attar" className={`transition ${pathname === '/category/attar' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              ATTAR
            </Link>
            <Link href="/loyalty" className={`flex items-center transition ${pathname.startsWith('/loyalty') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              LOYALTY <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link href="/contact" className={`flex items-center transition ${pathname.startsWith('/contact') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              CONTACT <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link href="/store-locator" className={`flex items-center transition ${pathname.startsWith('/store-locator') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]/90 hover:text-[var(--color-accent)]'}`}>
              STORE LOCATOR
            </Link>
          </div>
        </nav>
      </div>

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
