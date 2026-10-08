'use client';
import { useState, useEffect } from 'react';
import { Package, Eye, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // In a real app, you would have an /api/admin/orders route
      // Here we simulate fetching from Firebase for demonstration purposes
      const res = await fetch('/api/admin/orders').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setOrders([]); // Fallback
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pt-4 pb-12 w-full max-w-[100vw] overflow-x-hidden">
      <header className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-2 drop-shadow-md">Orders</h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">Manage customer purchases and shipments</p>
        </div>
      </header>

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_8px_40px_rgb(0,0,0,0.4)] overflow-hidden w-full relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto custom-scrollbar relative z-10 w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400">
                <th className="p-6 pl-8 font-sans">Order ID</th>
                <th className="p-6 font-sans">Customer</th>
                <th className="p-6 font-sans">Date</th>
                <th className="p-6 font-sans">Total</th>
                <th className="p-6 font-sans">Status</th>
                <th className="p-6 pr-8 text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                // Skeleton Rows
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-6 pl-8"><div className="w-24 h-5 bg-white/10 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-32 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-20 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-16 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-20 h-6 bg-white/5 rounded-full"></div></td>
                    <td className="p-6 pr-8 flex justify-end">
                      <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                // Empty State Design
                <tr>
                  <td colSpan={6} className="p-0">
                    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                      <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-6 shadow-inner">
                        <Package className="w-8 h-8 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-3">No orders placed yet.</h3>
                      <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mb-8">
                        Once a customer completes checkout on your store, their order will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id || order.id} className="hover:bg-white/5 transition-colors duration-300 group">
                    <td className="p-6 pl-8">
                      <span className="font-sans font-bold text-sm text-neutral-200 group-hover:text-white transition-colors">{order.orderNumber || order.id}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-white">{order.customer?.name || 'Guest User'}</span>
                        <span className="text-xs text-neutral-500">{order.customer?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs text-neutral-400">
                        {order.createdAt ? new Date(order.createdAt.seconds * 1000 || order.createdAt).toLocaleDateString() : 'Just now'}
                      </span>
                    </td>
                    <td className="p-6 font-sans text-sm tracking-wider text-neutral-300">
                      Rs. {order.totalPrice?.toLocaleString() || 0}
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full ${
                        order.status === 'processing' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : order.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {order.status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                        {order.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-6 pr-8">
                      <div className="flex items-center justify-end space-x-3 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/orders/${order._id || order.id}`} className="text-[#D4AF37] hover:text-white transition-colors p-2 hover:bg-[#D4AF37]/20 bg-[#D4AF37]/10 rounded-lg flex items-center border border-[#D4AF37]/20">
                          <Eye className="w-4 h-4 mr-2" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">View</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
