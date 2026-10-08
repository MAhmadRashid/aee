import React from 'react';
import { Activity, BarChart3 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="space-y-10 pb-12 pt-4 w-full animate-pulse">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="h-12 w-64 bg-white/5 rounded-md mb-3"></div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 flex items-center">
            <Activity className="w-3 h-3 mr-2 text-neutral-600" /> Loading metrics...
          </p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5"></div>
              <div className="w-16 h-5 rounded-md bg-white/5"></div>
            </div>
            <div>
              <div className="w-24 h-8 bg-white/10 rounded-md mb-2"></div>
              <div className="w-32 h-3 bg-white/5 rounded-sm"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500 flex items-center">
              <BarChart3 className="w-4 h-4 mr-3" />
              Revenue Analytics
            </h2>
          </div>
          <div className="w-full h-64 bg-white/5 rounded-lg mt-4"></div>
        </div>

        <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 shadow-xl flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500 mb-8 flex items-center border-b border-white/5 pb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mr-3"></span>
            Live Activity Feed
          </h2>
          
          <div className="flex-1 space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white/5 mr-4 mt-1"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-4 bg-white/10 rounded-sm mb-2"></div>
                  <div className="w-1/2 h-3 bg-white/5 rounded-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
