'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X, 
  ExternalLink,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [storefrontUrl, setStorefrontUrl] = useState('/');
  const [isPort3001, setIsPort3001] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.port === '3001') {
      setStorefrontUrl('http://localhost:3000');
      setIsPort3001(true);
    }
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Blends', href: '/admin/products', icon: Package },
    { name: 'Collections', href: '/admin/categories', icon: Tag },
    { name: 'Customer Patrons', href: '/admin/users', icon: Users },
    { name: 'Consignments', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Configuration', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex h-screen bg-[#070707] text-[var(--color-text)] font-sans overflow-hidden selection:bg-[#D4AF37]/30">
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-lg text-white shadow-xl cursor-pointer"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0d0d0d] border-r border-white/5 flex flex-col shadow-[10px_0_40px_rgba(0,0,0,0.8)] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="p-7 border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-60 pointer-events-none" />
          <h2 className="text-xl font-serif italic tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D4AF37] to-[#D4AF37] relative z-10 font-bold">
            ZERO TO ONE
          </h2>
          <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37] mt-1.5 font-bold relative z-10 flex items-center gap-1.5">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Atelier Admin Suite</span>
          </span>
          {isPort3001 && (
            <div className="mt-2 relative z-10 px-2.5 py-0.5 rounded-full text-[9px] tracking-widest uppercase font-mono bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Port :3001 Dedicated</span>
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`relative flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)] text-white' 
                    : 'bg-transparent border border-transparent hover:border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute left-0 top-0 w-1 h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"
                  />
                )}
                <item.icon className={`w-4 h-4 mr-3.5 transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-neutral-500 group-hover:text-white'}`} />
                <span className="text-xs uppercase tracking-[0.15em] font-semibold">
                  {item.name}
                </span>
                
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#D4AF37]" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom Actions: Storefront Link & Signout */}
        <div className="p-4 border-t border-white/5 bg-black/40 space-y-2 relative z-10">
          <Link 
            href={storefrontUrl} 
            target="_blank"
            className="flex items-center justify-center px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-300 hover:text-white border border-white/10 hover:border-[#D4AF37]/50 rounded-xl transition-all duration-200 w-full bg-white/5 hover:bg-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2 text-[#D4AF37]" />
            <span>{isPort3001 ? 'Live Boutique (:3000)' : 'View Live Boutique'}</span>
          </Link>

          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] hover:brightness-110 rounded-xl transition-all duration-200 w-full shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            <span>Secure Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative bg-[#090909]">
        {/* Ambient Subtle Luxury Glow */}
        <div className="absolute top-0 left-1/4 w-[700px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/2 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto p-6 md:p-10 lg:p-12 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
