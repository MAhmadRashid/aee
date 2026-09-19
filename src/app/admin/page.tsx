import React from 'react';
import { Package, Tag, Users, DollarSign, TrendingUp, Activity, BarChart3, ArrowUpRight } from 'lucide-react';
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
    { title: 'Total Products', value: productCount, icon: Package, trend: '+12%', color: 'from-blue-900/50 to-blue-950/20', iconColor: 'text-blue-400' },
    { title: 'Total Collections', value: categoryCount, icon: Tag, trend: '+3%', color: 'from-emerald-900/50 to-emerald-950/20', iconColor: 'text-emerald-400' },
    { title: 'Active Users', value: userCount, icon: Users, trend: '+28%', color: 'from-purple-900/50 to-purple-950/20', iconColor: 'text-purple-400' },
    { title: 'Monthly Revenue', value: '$24,850', icon: DollarSign, trend: '+18.5%', color: 'from-[var(--color-primary)]/20 to-[var(--color-surface)]/20', iconColor: 'text-[var(--color-primary)]' },
  ];

  return (
    <div className="space-y-12 pb-12">
      <header className="mb-14 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[#fcdca0] mb-3 drop-shadow-md">Dashboard Overview</h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] flex items-center">
            <Activity className="w-3 h-3 mr-2 text-[var(--color-primary)]" /> Real-time boutique performance
          </p>
        </div>
        <div className="hidden md:flex space-x-3">
          <div className="px-4 py-2 rounded-full border border-[var(--color-border)]/30 bg-[var(--color-surface)]/30 backdrop-blur-md text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
            Last 30 Days
          </div>
        </div>
      </header>
      
      {dbError && (
        <div className="bg-red-950/30 border border-red-500/50 text-red-400 p-6 rounded-lg mb-8 flex items-center backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-4 animate-ping"></div>
          <div>
            <p className="font-bold text-xs uppercase tracking-widest mb-1">Connection Error</p>
            <p className="text-xs text-red-300/80">Could not connect to Firebase. Using cached placeholder metrics.</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.color} backdrop-blur-2xl border border-[var(--color-border)]/30 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.25)] hover:border-[var(--color-primary)]/40 transition-all duration-500 group cursor-default transform hover:-translate-y-1`}>
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
            
            <div className="flex justify-between items-start mb-6 z-10">
              <div className={`p-3 rounded-xl bg-[var(--color-background)]/80 border border-[var(--color-border)]/20 ${stat.iconColor} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div className="flex items-center text-emerald-400 text-[10px] font-bold tracking-wider bg-emerald-400/10 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
              </div>
            </div>
            <div className="z-10">
              <h3 className="text-3xl font-serif italic text-white drop-shadow-sm mb-1">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-gradient-to-b from-[var(--color-surface)]/60 to-[var(--color-surface)]/20 backdrop-blur-2xl border border-[var(--color-border)]/40 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center border-b border-[var(--color-border)]/30 pb-6 mb-8 relative z-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-text)] flex items-center">
              <BarChart3 className="w-4 h-4 mr-3 text-[var(--color-primary)]" />
              Revenue Analytics
            </h2>
            <button className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] hover:text-white transition-colors flex items-center">
              Detailed Report <ArrowUpRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="h-64 flex items-end justify-between space-x-2 relative z-10">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-[var(--color-border)]"></div>
              <div className="w-full h-[1px] bg-[var(--color-border)]"></div>
              <div className="w-full h-[1px] bg-[var(--color-border)]"></div>
              <div className="w-full h-[1px] bg-[var(--color-border)]"></div>
            </div>
            
            {/* Chart Bars */}
            {[45, 60, 35, 70, 50, 85, 65, 90, 75, 100].map((height, i) => (
              <div key={i} className="relative flex flex-col items-center w-full group/bar">
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-[var(--color-primary)]/20 to-[var(--color-primary)]/80 rounded-t-sm transition-all duration-1000 ease-out hover:brightness-125"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-black/80 text-[var(--color-primary)] text-[10px] py-1 px-2 rounded backdrop-blur-sm border border-[var(--color-primary)]/30 pointer-events-none whitespace-nowrap">
                    ${(height * 120).toLocaleString()}
                  </div>
                </div>
                <div className="mt-3 text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] group-hover/bar:text-[var(--color-text)] transition-colors">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel (Recent Activity) */}
        <div className="bg-gradient-to-b from-[var(--color-surface)]/60 to-[var(--color-surface)]/20 backdrop-blur-2xl border border-[var(--color-border)]/40 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-text)] mb-8 flex items-center border-b border-[var(--color-border)]/30 pb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3 animate-pulse"></span>
            Live Activity
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {/* Mock Activity Items */}
            {[
              { time: '2m ago', action: 'New order placed', target: '#ORD-8924', icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { time: '15m ago', action: 'New user registered', target: 'sarah@example.com', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { time: '1h ago', action: 'Product updated', target: 'Oud Royale', icon: Tag, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { time: '3h ago', action: 'Order fulfilled', target: '#ORD-8920', icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { time: '5h ago', action: 'Category created', target: 'Gift Boxes', icon: Tag, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            ].map((act, i) => (
              <div key={i} className="flex items-start group">
                <div className={`p-2 rounded-full ${act.bg} ${act.color} mr-4 mt-1 group-hover:scale-110 transition-transform`}>
                  <act.icon className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text)] font-serif">{act.action}</p>
                  <p className="text-[10px] tracking-wider text-[var(--color-primary)] mt-1">{act.target}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border border-[var(--color-border)]/50 rounded-lg text-[10px] uppercase tracking-widest text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] hover:border-transparent transition-all duration-300">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
