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

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col z-20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-[var(--color-border)]/50">
          <h2 className="text-xl font-serif italic font-bold tracking-widest text-[var(--color-primary)]">ZERO TO ONE</h2>
          <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mt-2">Admin Portal</p>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-4">
          <Link href="/admin" className="flex items-center px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-sm transition-all duration-300">
            <LayoutDashboard className="w-4 h-4 mr-4" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-sm transition-all duration-300">
            <Package className="w-4 h-4 mr-4" />
            Products
          </Link>
          <Link href="/admin/categories" className="flex items-center px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-sm transition-all duration-300">
            <Tag className="w-4 h-4 mr-4" />
            Categories
          </Link>
          <Link href="/admin/users" className="flex items-center px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-sm transition-all duration-300">
            <Users className="w-4 h-4 mr-4" />
            Users
          </Link>
          <Link href="/admin/settings" className="flex items-center px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-sm transition-all duration-300">
            <Settings className="w-4 h-4 mr-4" />
            Settings
          </Link>
        </nav>
        <div className="p-6 border-t border-[var(--color-border)]/50">
          <Link href="/api/auth/signout" className="flex items-center justify-center px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-[var(--color-background)] bg-[var(--color-primary)] hover:bg-[var(--color-accent)] rounded-sm transition-all duration-300 w-full shadow-[0_4px_15px_rgba(194,155,87,0.2)]">
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
