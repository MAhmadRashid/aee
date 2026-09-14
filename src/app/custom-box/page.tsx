"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { perfumes } from '@/data/perfumes';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import Image from 'next/image';

type SelectionStep = 'perfume' | 'attar' | 'mist' | 'summary';

export default function CustomBoxPage() {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState<SelectionStep>('perfume');
  
  const [selections, setSelections] = useState({
    perfume: null as any,
    attar: null as any,
    mist: null as any
  });

  const availablePerfumes = perfumes.filter(p => ['Classic Perfumes', 'Premium Perfumes', 'Oud'].includes(p.category));
  const availableAttars = perfumes.filter(p => p.category === 'Perfume Wax / Attar');
  const availableMists = perfumes.filter(p => p.category === 'Body Mist');

  const handleSelect = (item: any) => {
    if (step === 'perfume') {
      setSelections(prev => ({ ...prev, perfume: item }));
      setStep('attar');
    } else if (step === 'attar') {
      setSelections(prev => ({ ...prev, attar: item }));
      setStep('mist');
    } else if (step === 'mist') {
      setSelections(prev => ({ ...prev, mist: item }));
      setStep('summary');
    }
  };

  const getStepData = () => {
    switch(step) {
      case 'perfume': return { title: 'Step 1: Choose Your Perfume', items: availablePerfumes };
      case 'attar': return { title: 'Step 2: Choose Your Attar', items: availableAttars };
      case 'mist': return { title: 'Step 3: Choose Your Body Mist', items: availableMists };
      default: return { title: '', items: [] };
    }
  };

  const { title, items } = getStepData();

  const handleAddToCart = () => {
    if (!selections.perfume || !selections.attar || !selections.mist) return;

    // Calculate bundle price (e.g. 15% discount on total)
    const totalPrice = selections.perfume.price + selections.attar.price + selections.mist.price;
    const discountedPrice = Math.round(totalPrice * 0.85);

    addToCart({
      id: `custom-box-${Date.now()}`,
      name: 'Custom Gift Box',
      price: discountedPrice,
      variant: `${selections.perfume.name} + ${selections.attar.name} + ${selections.mist.name}`,
      image: selections.perfume.image || selections.perfume.image_url
    });

    // Reset or redirect
    alert("Custom Box Added to Cart!");
    window.location.href = '/shop';
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-primary)]">Build Your Own Box</h1>
          <p className="text-lg text-[var(--color-text-muted)] mt-4">Select your favorite Perfume, Attar, and Body Mist to create the perfect custom gift.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center items-center mb-12 space-x-2 md:space-x-4">
          {['perfume', 'attar', 'mist', 'summary'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${step === s || (step === 'summary' && s !== 'summary') || (step === 'mist' && (s === 'perfume' || s === 'attar')) || (step === 'attar' && s === 'perfume') ? 'bg-[var(--color-primary)] text-[var(--color-background)]' : 'border border-[var(--color-border)] text-[var(--color-text-muted)]'}`}>
                {idx + 1}
              </div>
              {idx < 3 && <div className={`w-6 md:w-12 h-px mx-1 md:mx-2 ${idx === 0 && step !== 'perfume' ? 'bg-[var(--color-primary)]' : idx === 1 && (step === 'mist' || step === 'summary') ? 'bg-[var(--color-primary)]' : idx === 2 && step === 'summary' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step !== 'summary' ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-3xl font-serif text-center mb-8 text-[var(--color-text)]">{title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => handleSelect(item)}
                    className="cursor-pointer border border-[var(--color-border)] rounded-xl p-3 md:p-4 hover:border-[var(--color-primary)] hover:shadow-xl transition-all group bg-[var(--color-surface)] flex flex-col"
                  >
                    <div className="aspect-[4/5] relative w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      <Image 
                        src={item.image || item.image_url || 'https://image.pollinations.ai/prompt/minimal%20perfume'} 
                        alt={item.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <h3 className="font-serif font-bold text-sm md:text-lg text-center text-[var(--color-text)] leading-tight mb-2">{item.name}</h3>
                      <p className="text-center text-[var(--color-text-muted)] text-xs md:text-sm">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 shadow-2xl"
            >
              <h2 className="text-3xl font-serif text-center mb-8 text-[var(--color-primary)]">Your Custom Box</h2>
              
              <div className="space-y-4 md:space-y-6 mb-8">
                {[
                  { label: 'Perfume', item: selections.perfume },
                  { label: 'Attar', item: selections.attar },
                  { label: 'Mist', item: selections.mist }
                ].map(({label, item}) => (
                  <div key={label} className="flex items-center space-x-4 p-3 md:p-4 border border-[var(--color-border)] rounded-xl">
                    <div className="w-16 h-16 relative bg-gray-100 rounded-md overflow-hidden">
                      {item && (
                        <Image src={item.image || item.image_url} alt={item.name} fill className="object-cover" unoptimized />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] uppercase tracking-widest">{label}</p>
                      <h4 className="font-serif text-sm md:text-lg font-bold">{item?.name}</h4>
                    </div>
                    <div className="text-right font-bold text-sm md:text-base">
                      {item && formatPrice(item.price)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--color-border)] pt-6 flex justify-between items-center mb-8">
                <span className="text-sm md:text-lg font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Bundle Price (15% Off)</span>
                <span className="text-xl md:text-2xl font-serif text-[var(--color-primary)]">
                  {selections.perfume && formatPrice(Math.round((selections.perfume.price + selections.attar.price + selections.mist.price) * 0.85))}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => { setStep('perfume'); setSelections({perfume: null, attar: null, mist: null}); }}
                  className="flex-1 border border-[var(--color-primary)] text-[var(--color-text)] py-3 md:py-4 rounded-xl uppercase tracking-widest font-bold hover:bg-[var(--color-background)] transition text-xs md:text-sm"
                >
                  Start Over
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--color-primary)] text-[var(--color-background)] py-3 md:py-4 rounded-xl uppercase tracking-widest font-bold shadow-lg hover:opacity-90 transition transform hover:scale-105 text-xs md:text-sm"
                >
                  Add To Cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
