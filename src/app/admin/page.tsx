import React from 'react';
import { Package, Tag, Users, DollarSign } from 'lucide-react';
import { db } from '../../lib/firebase-admin';

export default async function AdminDashboard() {
  let productCount = 0;
  let categoryCount = 0;
  let userCount = 0;
  let dbError = false;

  try {
    const productsCountSnapshot = await db.collection('products').count().get();
    const categoriesCountSnapshot = await db.collection('categories').count().get();
    const usersCountSnapshot = await db.collection('users').count().get();

    productCount = productsCountSnapshot.data().count;
    categoryCount = categoriesCountSnapshot.data().count;
    userCount = usersCountSnapshot.data().count;
  } catch (error) {
    console.error("Admin dashboard failed to connect to DB:", error);
    dbError = true;
  }

  const stats = [
    { title: 'Total Products', value: productCount, icon: Package, color: 'text-[var(--color-primary)]' },
    { title: 'Total Categories', value: categoryCount, icon: Tag, color: 'text-[var(--color-primary)]' },
    { title: 'Total Users', value: userCount, icon: Users, color: 'text-[var(--color-primary)]' },
    { title: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-[var(--color-primary)]' },
  ];

  return (
    <div className="space-y-10">
      <header className="mb-12">
        <h1 className="text-4xl font-serif italic tracking-wide text-[var(--color-primary)] mb-2">Overview</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Monitor your boutique's performance</p>
      </header>
      
      {dbError && (
        <div className="bg-red-950/30 border border-red-500/50 text-red-400 p-6 rounded-sm mb-8 flex items-center backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-4 animate-pulse"></div>
          <div>
            <p className="font-bold text-xs uppercase tracking-widest mb-1">Connection Error</p>
            <p className="text-xs text-red-300/80">Could not connect to Firebase. Please check your credentials.</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[var(--color-surface)]/40 backdrop-blur-xl border border-[var(--color-border)]/50 rounded-sm p-8 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-[var(--color-primary)]/30 transition-all duration-500 group">
            <div className={`p-4 rounded-full bg-[var(--color-background)]/80 border border-[var(--color-border)]/30 ${stat.color} mr-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(194,155,87,0.3)] transition-all duration-500`}>
              <stat.icon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] mb-2">{stat.title}</p>
              <h3 className="text-3xl font-serif italic text-[var(--color-primary)] drop-shadow-sm">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface)]/40 backdrop-blur-xl border border-[var(--color-border)]/50 rounded-sm p-10 mt-10 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text)] mb-8 flex items-center border-b border-[var(--color-border)]/30 pb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mr-3"></span>
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)]/50 rounded-sm bg-[var(--color-background)]/30">
          <Package className="w-8 h-8 mb-4 opacity-50" strokeWidth={1} />
          <p className="text-xs uppercase tracking-widest font-serif italic">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
