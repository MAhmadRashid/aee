'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Trash2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, fetch from your database
    // For now we will just simulate a fetch or show an empty state
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // If you have a real endpoint, it would be here:
      // const res = await fetch('/api/admin/orders');
      // const data = await res.json();
      // setOrders(data);
      setOrders([]);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    // Simulate delete
    setOrders(orders.filter((o: any) => o._id !== id));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Loading Orders</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif italic tracking-wide text-[var(--color-primary)] mb-2">Orders</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Manage customer orders and shipments</p>
        </div>
      </header>

      <div className="bg-[var(--color-surface)]/40 backdrop-blur-xl rounded-sm border border-[var(--color-border)]/50 shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface)]/80 border-b border-[var(--color-border)]/50 text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">
              <th className="p-6">Order ID</th>
              <th className="p-6">Customer</th>
              <th className="p-6">Date</th>
              <th className="p-6">Total</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/30">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-serif italic">No orders found.</td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-[var(--color-surface)]/60 transition-colors duration-300">
                  <td className="p-6 font-mono text-sm text-[var(--color-text)]">#{order._id.substring(0, 8)}</td>
                  <td className="p-6 font-serif text-md text-[var(--color-text)]">{order.customerName}</td>
                  <td className="p-6 text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-6 font-sans tracking-wider text-[var(--color-text)]">Rs. {order.totalAmount.toLocaleString()}</td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[9px] uppercase tracking-widest rounded-sm">
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-6 text-right flex justify-end space-x-4">
                    <button className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteOrder(order._id)} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
