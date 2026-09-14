import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BlogsPage() {
  const blogs = [
    { title: "The Art of Layering Oud", category: "Guide", date: "Oct 12, 2026" },
    { title: "Choosing the Perfect Summer Attar", category: "Editorial", date: "Sep 28, 2026" },
    { title: "Behind the Scenes: Emerald Onyx", category: "Brand", date: "Aug 15, 2026" },
    { title: "The History of Rose Noir Extraction", category: "Ingredients", date: "Jul 04, 2026" },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-5xl text-center mb-16 tracking-widest uppercase">The Journal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog, i) => (
            <div key={i} className="group border border-[var(--color-border)] bg-white/5 overflow-hidden cursor-pointer">
              <div className="aspect-[2/1] bg-black/50 p-6 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                <div className="relative z-20">
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-2 block">{blog.category}</span>
                  <h2 className="font-serif text-2xl md:text-3xl mb-4 group-hover:text-[#C5A059] transition-colors">{blog.title}</h2>
                  <div className="flex justify-between items-center text-sm text-[var(--color-text-muted)]">
                    <span>{blog.date}</span>
                    <span className="flex items-center font-bold uppercase tracking-widest group-hover:text-white transition-colors">Read <ArrowRight className="w-4 h-4 ml-2" /></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}