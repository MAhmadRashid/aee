import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Tag, Users, Settings, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Temporarily bypassing admin check so you can access the dashboard immediately
  // if (!session || (session.user as any)?.role !== 'admin') {
  //   redirect('/');
  // }

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[var(--color-surface)]/80 backdrop-blur-xl border-r border-[var(--color-border)]/50 flex flex-col z-20 shadow-[10px_0_30px_rgba(0,0,0,0.3)]">
        <div className="p-10 border-b border-[var(--color-border)]/30 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-serif italic font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[#fcdca0]">ZERO TO ONE</h2>
          <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--color-primary)]/80 mt-3 font-bold">Admin Portal</p>
        </div>
        <nav className="flex-1 px-6 py-10 space-y-3 overflow-y-auto custom-scrollbar">
          <Link href="/admin" className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-primary)]/10 rounded-xl border border-transparent hover:border-[var(--color-primary)]/20 transition-all duration-300 shadow-sm">
            <LayoutDashboard className="w-4 h-4 mr-4 opacity-70" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-xl border border-transparent hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <Package className="w-4 h-4 mr-4 opacity-70" />
            Products
          </Link>
          <Link href="/admin/categories" className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-xl border border-transparent hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <Tag className="w-4 h-4 mr-4 opacity-70" />
            Categories
          </Link>
          <Link href="/admin/users" className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-xl border border-transparent hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <Users className="w-4 h-4 mr-4 opacity-70" />
            Users
          </Link>
          <Link href="/admin/orders" className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-xl border border-transparent hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <Package className="w-4 h-4 mr-4 opacity-70" />
            Orders
          </Link>
          <Link href="/admin/settings" className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-xl border border-transparent hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <Settings className="w-4 h-4 mr-4 opacity-70" />
            Settings
          </Link>
        </nav>
        <div className="p-8 border-t border-[var(--color-border)]/30 bg-[var(--color-surface)]/20">
          <Link href="/api/auth/signout" className="flex items-center justify-center px-4 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-background)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:from-[#e3b867] hover:to-[#c29b57] rounded-xl transition-all duration-300 w-full shadow-[0_4px_20px_rgba(194,155,87,0.3)] hover:shadow-[0_8px_25px_rgba(194,155,87,0.4)] hover:-translate-y-0.5">
            <LogOut className="w-4 h-4 mr-3" />
            Secure Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[var(--color-background)] opacity-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--color-surface)] via-[var(--color-background)] to-[var(--color-background)] pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
