import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CareersPage() {
  const jobs = [
    { title: 'Master Perfumer', location: 'Karachi, PK', type: 'Full-time' },
    { title: 'Digital Marketing Lead', location: 'Remote', type: 'Full-time' },
    { title: 'Boutique Manager', location: 'Dubai, UAE', type: 'Full-time' },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl text-center mb-6 tracking-widest uppercase">Join Our Team</h1>
        <p className="text-center text-[var(--color-text-muted)] mb-16 max-w-2xl mx-auto">We are always looking for passionate individuals who share our dedication to luxury, minimalism, and the art of perfumery.</p>
        
        <div className="space-y-6">
          {jobs.map((job, i) => (
            <div key={i} className="border border-[var(--color-border)] p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 hover:bg-white/10 transition group cursor-pointer">
              <div>
                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] tracking-widest uppercase">{job.location} • {job.type}</p>
              </div>
              <ArrowRight className="w-6 h-6 mt-4 md:mt-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}