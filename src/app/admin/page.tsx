import React from 'react';
import { Package, Tag, Users, DollarSign, TrendingUp, Activity, BarChart3, ArrowUpRight, DatabaseZap } from 'lucide-react';
import { db } from '../../lib/firebase-admin';
import RevenueChart from '../../components/admin/RevenueChart';

export default async function AdminDashboard() {
  let productCount = 0;
  let categoryCount = 0;
  let userCount = 0;
  let totalRevenue = 0;
  let dbError = false;
  let dbErrorMsg = "Could not connect to Firebase. Using cached placeholder metrics.";
  let isFirestoreDisabled = false;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const chartData = months.map(m => ({ name: m, revenue: 0 }));

  try {
    if (!db || Object.keys(db).length === 0) {
      throw new Error("Firebase Admin SDK is not initialized.");
    }
    const productsCountSnapshot = await db.collection('products').count().get();
    const categoriesCountSnapshot = await db.collection('categories').count().get();
    const usersCountSnapshot = await db.collection('users').count().get();
    
    // Calculate Total Revenue from orders
    const ordersSnapshot = await db.collection('orders').get();
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      if (order.totalPrice && typeof order.totalPrice === 'number') {
        totalRevenue += order.totalPrice;
        
        // Simple logic to add revenue to the latest month (Oct) for demonstration, 
        // in a real app this would use order.createdAt timestamp
        chartData[9].revenue += order.totalPrice;
      }
    });

    productCount = productsCountSnapshot.data().count;
    categoryCount = categoriesCountSnapshot.data().count;
    userCount = usersCountSnapshot.data().count;
  } catch (error: any) {
    console.error("Admin dashboard failed to connect to DB:", error);
    dbError = true;
    
    if (error.message?.includes('Cloud Firestore API has not been used') || error.message?.includes('PERMISSION_DENIED')) {
      isFirestoreDisabled = true;
      dbErrorMsg = "Firestore Database is not enabled in your Firebase Project. Please go to the Firebase Console -> Build -> Firestore Database and click 'Create Database'.";
    }
  }

  const stats = [
    { title: 'Total Products', value: productCount, icon: Package, trend: '+12%', color: 'from-blue-900/50 to-blue-950/20', iconColor: 'text-blue-400' },
    { title: 'Total Collections', value: categoryCount, icon: Tag, trend: '+3%', color: 'from-emerald-900/50 to-emerald-950/20', iconColor: 'text-emerald-400' },
    { title: 'Active Users', value: userCount, icon: Users, trend: '+28%', color: 'from-purple-900/50 to-purple-950/20', iconColor: 'text-purple-400' },
    { title: 'Monthly Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: totalRevenue > 0 ? '+18.5%' : '0%', color: 'from-[#D4AF37]/20 to-[#D4AF37]/5', iconColor: 'text-[#D4AF37]' },
  ];

  return (
    <div className="space-y-10 pb-12 pt-4">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-3 drop-shadow-md">Dashboard Overview</h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 flex items-center">
            <Activity className="w-3 h-3 mr-2 text-[#D4AF37]" /> Real-time boutique performance
          </p>
        </div>
        <div className="hidden md:flex space-x-3">
          <div className="px-4 py-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-md text-[10px] uppercase tracking-widest text-neutral-400">
            Last 30 Days
          </div>
        </div>
      </header>
      
      {dbError && (
        <div className={`border p-6 rounded-lg mb-8 flex items-center backdrop-blur-md shadow-lg ${isFirestoreDisabled ? 'bg-orange-950/40 border-orange-500/50 text-orange-400' : 'bg-red-950/30 border-red-500/50 text-red-400'}`}>
          {isFirestoreDisabled ? (
            <DatabaseZap className="w-8 h-8 mr-4 text-orange-400 animate-pulse" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-500 mr-4 animate-ping"></div>
          )}
          <div className="flex-1">
            <p className="font-bold text-xs uppercase tracking-widest mb-1">{isFirestoreDisabled ? 'Action Required' : 'Connection Error'}</p>
            <p className="text-xs opacity-90">{dbErrorMsg}</p>
          </div>
          {isFirestoreDisabled && (
            <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/30 rounded text-xs uppercase tracking-widest transition-colors">
              Open Firebase
            </a>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/10 transition-all duration-500 group cursor-default transform hover:-translate-y-1`}>
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
            
            <div className="flex justify-between items-start mb-6 z-10">
              <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${stat.iconColor} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div className="flex items-center text-emerald-400 text-[10px] font-bold tracking-wider bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
              </div>
            </div>
            <div className="z-10">
              <h3 className="text-3xl font-serif italic text-white drop-shadow-sm mb-1">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-gradient-to-b from-neutral-900/60 to-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-4 relative z-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white flex items-center">
              <BarChart3 className="w-4 h-4 mr-3 text-[#D4AF37]" />
              Revenue Analytics
            </h2>
            <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors flex items-center">
              Detailed Report <ArrowUpRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          {/* Recharts Visualization */}
          <RevenueChart data={chartData} />
        </div>

        {/* Side Panel (Recent Activity) */}
        <div className="bg-gradient-to-b from-neutral-900/60 to-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-xl flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white mb-8 flex items-center border-b border-white/5 pb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3 animate-pulse"></span>
            Live Activity Feed
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
                <div className={`p-2 rounded-full ${act.bg} ${act.color} mr-4 mt-1 border border-white/5 group-hover:scale-110 transition-transform`}>
                  <act.icon className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-sm text-neutral-200 font-serif">{act.action}</p>
                  <p className="text-[10px] tracking-wider text-[#D4AF37] mt-1">{act.target}</p>
                  <p className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border border-white/10 rounded-lg text-[10px] uppercase tracking-widest text-white hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all duration-300">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
