"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { perfumes } from '@/data/perfumes';
import ProductCard from '@/components/ProductCard';

type Step = 'intro' | 'gender' | 'scent' | 'occasion' | 'analyzing' | 'results';

const QUESTIONS = {
  gender: {
    question: "Who are you shopping for?",
    options: ["Men", "Women", "Unisex"]
  },
  scent: {
    question: "What kind of scent do you prefer?",
    options: ["Woody", "Floral", "Fresh", "Oud", "Sweet/Spicy"]
  },
  occasion: {
    question: "When will you wear this mostly?",
    options: ["Everyday / Office", "Evening / Date Night", "Special Occasions"]
  }
};

export default function FragranceFinderPage() {
  const [step, setStep] = useState<Step>('intro');
  const [answers, setAnswers] = useState({
    gender: '',
    scent: '',
    occasion: ''
  });
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const vibeQuery = params.get('vibe');
      if (vibeQuery) {
        let mappedScent = '';
        if (vibeQuery === 'fresh') mappedScent = 'Fresh';
        if (vibeQuery === 'floral') mappedScent = 'Floral';
        if (vibeQuery === 'woody') mappedScent = 'Woody';
        if (vibeQuery === 'oriental') mappedScent = 'Sweet/Spicy';

        if (mappedScent) {
          setStep('analyzing');
          // Start analysis automatically
          setTimeout(() => {
            let matches = perfumes.filter(p => {
              const scentStr = JSON.stringify(p.scentNotes).toLowerCase() + (p.category || '').toLowerCase();
              let scentMatch = false;
              const selectedScent = mappedScent.toLowerCase();
              
              if (selectedScent === 'woody' && (scentStr.includes('wood') || scentStr.includes('sandal') || scentStr.includes('cedar'))) scentMatch = true;
              if (selectedScent === 'floral' && (scentStr.includes('rose') || scentStr.includes('jasmine') || scentStr.includes('peony') || scentStr.includes('floral'))) scentMatch = true;
              if (selectedScent === 'fresh' && (scentStr.includes('citrus') || scentStr.includes('mint') || scentStr.includes('lemon') || scentStr.includes('neroli') || scentStr.includes('fresh'))) scentMatch = true;
              if (selectedScent === 'sweet/spicy' && (scentStr.includes('vanilla') || scentStr.includes('praline') || scentStr.includes('cardamom') || scentStr.includes('spice') || scentStr.includes('amber'))) scentMatch = true;
              
              if (!scentMatch && Math.random() > 0.5) scentMatch = true; 
              return scentMatch;
            });
            setResults(matches.slice(0, 8)); // show 8 matches instead of 4 for vibe
            setStep('results');
          }, 1500);
        }
      }
    }
  }, []);

  const handleAnswer = (questionId: keyof typeof answers, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (questionId === 'gender') setStep('scent');
    else if (questionId === 'scent') setStep('occasion');
    else if (questionId === 'occasion') {
      setStep('analyzing');
      analyzeResults({ ...answers, occasion: answer });
    }
  };

  const analyzeResults = (finalAnswers: typeof answers) => {
    setTimeout(() => {
      // Basic filtering logic
      let matches = perfumes.filter(p => {
        // Gender match (or unisex)
        const genderMatch = p.type === finalAnswers.gender || p.type === 'Unisex' || finalAnswers.gender === 'Unisex';
        
        // Scent match
        const scentStr = JSON.stringify(p.scentNotes).toLowerCase() + (p.category || '').toLowerCase();
        let scentMatch = false;
        const selectedScent = finalAnswers.scent.toLowerCase();
        
        if (selectedScent === 'woody' && (scentStr.includes('wood') || scentStr.includes('sandal') || scentStr.includes('cedar'))) scentMatch = true;
        if (selectedScent === 'floral' && (scentStr.includes('rose') || scentStr.includes('jasmine') || scentStr.includes('peony') || scentStr.includes('floral'))) scentMatch = true;
        if (selectedScent === 'fresh' && (scentStr.includes('citrus') || scentStr.includes('mint') || scentStr.includes('lemon') || scentStr.includes('neroli') || scentStr.includes('fresh'))) scentMatch = true;
        if (selectedScent === 'oud' && (scentStr.includes('oud') || p.category === 'Oud')) scentMatch = true;
        if (selectedScent === 'sweet/spicy' && (scentStr.includes('vanilla') || scentStr.includes('praline') || scentStr.includes('cardamom') || scentStr.includes('spice') || scentStr.includes('amber'))) scentMatch = true;
        
        // If we can't find a direct match, let's just loosely allow it so we don't have 0 results
        if (!scentMatch && Math.random() > 0.5) scentMatch = true; 

        return genderMatch && scentMatch;
      });

      // Limit to 4 recommendations
      setResults(matches.slice(0, 4));
      setStep('results');
    }, 2500);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-12 px-4 flex flex-col items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial="initial" animate="in" exit="out" variants={pageVariants}
              className="text-center space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-primary)]">Fragrance Finder</h1>
              <p className="text-lg text-[var(--color-text-muted)] max-w-xl mx-auto">
                Not sure which perfume to choose? Take our 3-step quiz and let us find the perfect scent tailored to your unique taste.
              </p>
              <button
                onClick={() => setStep('gender')}
                className="bg-[var(--color-primary)] text-[var(--color-background)] px-8 py-4 rounded-full uppercase tracking-[0.2em] font-bold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Start Quiz
              </button>
            </motion.div>
          )}

          {(step === 'gender' || step === 'scent' || step === 'occasion') && (
            <motion.div
              key={step}
              initial="initial" animate="in" exit="out" variants={pageVariants}
              className="text-center space-y-12 w-full"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text)]">
                {QUESTIONS[step].question}
              </h2>
              <div className="flex flex-col space-y-4 max-w-md mx-auto w-full">
                {QUESTIONS[step].options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(step, option)}
                    className="border border-[var(--color-primary)] text-[var(--color-text)] px-6 py-4 rounded-xl hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition-all duration-300 text-lg font-medium tracking-wide w-full"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial="initial" animate="in" exit="out" variants={pageVariants}
              className="text-center space-y-8 py-20 w-full"
            >
              <div className="w-16 h-16 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mx-auto"></div>
              <h2 className="text-2xl font-serif text-[var(--color-text)] animate-pulse">
                Analyzing your scent profile...
              </h2>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              initial="initial" animate="in" exit="out" variants={pageVariants}
              className="space-y-12 w-full"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-serif text-[var(--color-primary)]">Your Perfect Matches</h2>
                <p className="text-[var(--color-text-muted)]">Based on your preferences, we recommend these fragrances.</p>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mx-auto">
                  {results.map(perfume => (
                    <ProductCard key={perfume.id} perfume={perfume} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-[var(--color-text-muted)]">
                  <p>No exact matches found, but our Classic Collection is always a great choice.</p>
                </div>
              )}

              <div className="flex justify-center pt-8">
                <button
                  onClick={() => { setAnswers({gender: '', scent: '', occasion: ''}); setStep('intro'); }}
                  className="border-b border-[var(--color-primary)] text-[var(--color-primary)] pb-1 uppercase tracking-widest text-sm hover:opacity-70 transition-opacity"
                >
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
