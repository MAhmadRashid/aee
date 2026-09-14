import React from 'react';
import { PlayCircle } from 'lucide-react';

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-5xl text-center mb-16 tracking-widest uppercase">Media & Press</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="group cursor-pointer relative aspect-[4/3] bg-white/5 border border-[var(--color-border)] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-bold uppercase tracking-wider">Campaign Vol. {i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}