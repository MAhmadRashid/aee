'use client';
import { useState, useEffect, useMemo } from 'react';
import { Package, Eye, CheckCircle, Clock, Truck, XCircle, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatOrderDate = (createdAt: any) => {
    if (!createdAt) return 'Just now';
    if (typeof createdAt === 'string') {
      const d = new Date(createdAt);
      return isNaN(d.getTime()) ? 'Recent' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    const seconds = createdAt._seconds ?? createdAt.seconds;
    if (seconds) {
      return new Date(seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    const d = new Date(createdAt);
    return isNaN(d.getTime()) ? 'Recent' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) => {
      const q = searchQuery.toLowerCase();
      const orderNum = (o.orderNumber || o.id || '').toLowerCase();
      const customerName = (o.customer?.name || '').toLowerCase();
      const customerEmail = (o.customer?.email || '').toLowerCase();
      const matchesSearch = orderNum.includes(q) || customerName.includes(q) || customerEmail.includes(q);

      const matchesStatus = statusFilter === 'All' || (o.status && o.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum: number, o: any) => sum + (Number(o.totalPrice) || Number(o.total) || 0), 0);
  }, [orders]);

  return (
    <div className="space-y-8 pt-4 pb-12 w-full max-w-[100vw] overflow-x-hidden">
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-2 drop-shadow-md">
            Consignments & Orders
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            Real-time fulfillment, customer purchases, and dispatch records
          </p>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#121212] border border-white/5 rounded-xl">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">Total Purchases</span>
          <span className="text-2xl font-serif text-white">{orders.length}</span>
        </div>
        <div className="p-5 bg-[#121212] border border-white/5 rounded-xl">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">Gross Invoiced</span>
          <span className="text-2xl font-mono text-[#D4AF37] font-bold">Rs. {totalRevenue.toLocaleString()}</span>
        </div>
        <div className="p-5 bg-[#121212] border border-white/5 rounded-xl">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">Active Deliveries</span>
          <span className="text-2xl font-serif text-blue-400">
            {orders.filter((o: any) => o.status === 'processing' || o.status === 'shipped').length}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-500" />
          </div>
          <input
            type="text"
            placeholder="Search by order #, client name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <option value="All" className="bg-[#181818]">All Consignments</option>
            <option value="processing" className="bg-[#181818]">Processing</option>
            <option value="shipped" className="bg-[#181818]">Shipped / In Transit</option>
            <option value="completed" className="bg-[#181818]">Delivered & Completed</option>
            <option value="cancelled" className="bg-[#181818]">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_8px_40px_rgb(0,0,0,0.4)] overflow-hidden w-full relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto custom-scrollbar relative z-10 w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400">
                <th className="p-5 pl-6 font-sans">Consignment #</th>
                <th className="p-5 font-sans">Client</th>
                <th className="p-5 font-sans">Registration Date</th>
                <th className="p-5 font-sans">Net Total</th>
                <th className="p-5 font-sans">Consignment Status</th>
                <th className="p-5 pr-6 text-right font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-5 pl-6"><div className="w-24 h-5 bg-white/10 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-32 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-20 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-16 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-20 h-6 bg-white/5 rounded-full"></div></td>
                    <td className="p-5 pr-6 flex justify-end">
                      <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-4 shadow-inner">
                        <Package className="w-7 h-7 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-serif text-white mb-2">No orders match criteria.</h3>
                      <p className="text-xs text-neutral-400 max-w-sm">
                        Try modifying your search query or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => {
                  const status = (order.status || 'processing').toLowerCase();
                  return (
                    <tr key={order._id || order.id} className="hover:bg-white/5 transition-colors duration-200 group">
                      <td className="p-5 pl-6">
                        <span className="font-mono font-bold text-xs text-[#D4AF37] group-hover:text-white transition-colors">
                          {order.orderNumber || order.id}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white">{order.customer?.name || 'Private Patron'}</span>
                          <span className="text-[11px] text-neutral-400">{order.customer?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-xs text-neutral-400">
                          {formatOrderDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="p-5 font-mono text-xs font-bold text-white">
                        Rs. {(order.totalPrice || order.total || 0).toLocaleString()}
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          status === 'processing' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                            : status === 'shipped'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                          {status === 'shipped' && <Truck className="w-3 h-3 mr-1" />}
                          {status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <Link 
                          href={`/admin/orders/${order._id || order.id}`} 
                          className="text-[#D4AF37] hover:text-white transition-colors p-2 hover:bg-[#D4AF37]/20 bg-[#D4AF37]/10 rounded-md inline-flex items-center gap-1.5 border border-[#D4AF37]/20 text-[10px] uppercase font-bold tracking-wider"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
