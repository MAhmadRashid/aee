'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Users, Settings, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-[var(--color-text)] font-sans overflow-hidden selection:bg-[#D4AF37]/30">
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-lg text-white"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-neutral-950/80 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-[10px_0_40px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-8 border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-50" />
          <h2 className="text-2xl font-serif italic font-light tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D4AF37] to-[#D4AF37] relative z-10">ZERO TO ONE</h2>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37]/80 mt-3 font-bold relative z-10">Admin Portal</p>
        </div>
        
        <nav className="flex-1 px-5 py-8 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`relative flex items-center px-4 py-4 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                    : 'bg-transparent border border-transparent hover:border-white/10 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute left-0 top-0 w-1 h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"
                  />
                )}
                <item.icon className={`w-4 h-4 mr-4 transition-colors duration-300 ${isActive ? 'text-[#D4AF37]' : 'text-neutral-500 group-hover:text-white'}`} />
                <span className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-200'}`}>
                  {item.name}
                </span>
                
                {isActive && (
                  <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37] opacity-80" />
                )}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-6 border-t border-white/5 bg-black/40 relative z-10">
          <Link href="/api/auth/signout" className="flex items-center justify-center px-4 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] hover:brightness-110 rounded-xl transition-all duration-300 w-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:-translate-y-0.5">
            <LogOut className="w-4 h-4 mr-3" />
            Secure Logout
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative bg-[#0a0a0a]">
        {/* Subtle Luxury Background Effects */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white/2 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto p-6 md:p-12 lg:p-16 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
