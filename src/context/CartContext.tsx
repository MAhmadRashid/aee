"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('zerotoone_cart');
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('zerotoone_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      // Check for exact same product and variant
      const existing = prev.find(p => p.id === item.id && p.variant === item.variant);
      if (existing) {
        return prev.map(p => (p.id === item.id && p.variant === item.variant) ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number | string) => {
    setCartItems(prev => prev.filter(p => p.id !== id));
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(p => p.id === id ? { ...p, quantity } : p));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
