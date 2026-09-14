'use client';
import React, { useState } from 'react';

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const questions = [
    "What is your ideal evening?",
    "Which element speaks to you?",
    "Select a texture:"
  ];
  const options = [
    ["A quiet dinner", "A vibrant party", "A midnight walk"],
    ["Fire", "Water", "Earth"],
    ["Silk", "Leather", "Cashmere"]
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full border border-[var(--color-border)] p-12 bg-white/5 text-center">
        {step < questions.length ? (
          <>
            <p className="text-sm tracking-[0.3em] uppercase text-[#C5A059] mb-4">Question {step + 1} of {questions.length}</p>
            <h2 className="font-serif text-3xl mb-12">{questions[step]}</h2>
            <div className="space-y-4">
              {options[step].map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => setStep(step + 1)}
                  className="w-full border border-[var(--color-border)] p-4 hover:bg-white hover:text-black transition uppercase tracking-widest text-sm font-bold"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="font-serif text-4xl mb-4 text-[#C5A059]">Your Signature Scent is Ready</h2>
            <p className="text-[var(--color-text-muted)] mb-8">Based on your answers, we have found your perfect match.</p>
            <button className="bg-black text-white px-8 py-4 uppercase tracking-[0.2em] font-bold border border-white hover:bg-white hover:text-black transition">
              Reveal Perfume
            </button>
          </>
        )}
      </div>
    </main>
  );
}