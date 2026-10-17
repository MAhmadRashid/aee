'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PackageSearch, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  AlertCircle, 
  ArrowRight, 
  MapPin, 
  CreditCard,
  Sparkles
} from 'lucide-react';

interface OrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  createdAt?: string;
  customer?: {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    zip?: string;
  };
  items?: OrderItem[];
  subtotal?: number;
  shippingCost?: number;
  totalPrice?: number;
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter your order number.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No order found matching the provided details.');
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Unable to track order. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'cancelled':
        return 0;
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'completed':
        return 4;
      default:
        return 2;
    }
  };

  const currentStep = order ? getStepProgress(order.status) : 0;

  const steps = [
    { label: 'Order Confirmed', desc: 'Verified & Registered', icon: Clock },
    { label: 'Formulation', desc: 'Crafting & Quality Check', icon: Sparkles },
    { label: 'Dispatched', desc: 'With Courier Partner', icon: Truck },
    { label: 'Delivered', desc: 'Arrived at your doorstep', icon: PackageCheck },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-full bg-[#C5A059]/10 text-[#C5A059] mb-4">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl tracking-widest uppercase mb-3">Track Your Order</h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Experience real-time artisanal delivery updates for your luxury zero-to-one fragrance shipments.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="p-6 md:p-8 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl rounded-sm mb-10">
          <form className="space-y-5" onSubmit={handleTrack}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 font-semibold text-neutral-300">
                  Order Number <span className="text-[#C5A059]">*</span>
                </label>
                <input 
                  type="text" 
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. ZTO-10482 or #ZTO-10482" 
                  required
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] p-3.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors rounded-sm" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 font-semibold text-neutral-300">
                  Email Address <span className="text-neutral-500 font-normal">(Optional)</span>
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com" 
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] p-3.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors rounded-sm" 
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-3 rounded-sm">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-[#C5A059] border border-[#C5A059] py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching Boutique Archives...</span>
                </>
              ) : (
                <>
                  <span>Track Shipment Status</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[var(--color-border)]/50 text-center">
            <p className="text-xs text-neutral-500">
              Demo order lookup: try order number{' '}
              <button 
                type="button" 
                onClick={() => setOrderNumber('ZTO-10482')}
                className="text-[#C5A059] hover:underline font-mono"
              >
                ZTO-10482
              </button>
            </p>
          </div>
        </div>

        {/* Tracking Details View */}
        {order && (
          <div className="border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl rounded-sm p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
            {/* Order status banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">Active Consignment</span>
                <h2 className="text-2xl font-serif tracking-wide">{order.orderNumber}</h2>
                {order.trackingNumber && (
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    Courier Consignment: <span className="text-white">{order.trackingNumber}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${
                  order.status === 'completed' 
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                    : order.status === 'shipped'
                    ? 'border-[#C5A059]/40 text-[#C5A059] bg-[#C5A059]/10'
                    : 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                }`}>
                  Status: {order.status}
                </span>
                {order.estimatedDelivery && (
                  <p className="text-xs text-neutral-400 mt-1">Est. Arrival: {order.estimatedDelivery}</p>
                )}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-6">Delivery Milestones</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                {steps.map((st, i) => {
                  const isDone = i + 1 <= currentStep;
                  const isCurrent = i + 1 === currentStep;
                  const Icon = st.icon;

                  return (
                    <div key={st.label} className="flex flex-col items-center text-center p-3 rounded-sm bg-[var(--color-background)]/50 border border-[var(--color-border)]">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                        isDone 
                          ? 'bg-[#C5A059] text-black font-bold' 
                          : 'bg-white/5 text-neutral-500 border border-[var(--color-border)]'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isCurrent ? 'text-[#C5A059]' : isDone ? 'text-white' : 'text-neutral-500'}`}>
                        {st.label}
                      </span>
                      <span className="text-[11px] text-neutral-400 mt-1">{st.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items Breakdown */}
            {order.items && order.items.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-4">Artisanal Selection</h3>
                <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-sm overflow-hidden bg-[var(--color-background)]/40">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-neutral-900 border border-[var(--color-border)] rounded-sm relative overflow-hidden shrink-0">
                          {it.image ? (
                            <Image src={it.image} alt={it.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">ZTO</div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold">{it.name}</h4>
                          <p className="text-xs text-neutral-400">Qty: {it.quantity} {it.size ? `• ${it.size}` : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono text-[#C5A059] font-semibold">
                          Rs. {(it.price * (it.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
              {order.customer && (
                <div className="p-4 bg-[var(--color-background)]/60 border border-[var(--color-border)] rounded-sm">
                  <div className="flex items-center gap-2 mb-2 text-[#C5A059]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Destination</span>
                  </div>
                  <p className="text-sm font-semibold">{order.customer.name}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {order.customer.address}<br />
                    {order.customer.city}{order.customer.zip ? ` - ${order.customer.zip}` : ''}
                  </p>
                </div>
              )}

              <div className="p-4 bg-[var(--color-background)]/60 border border-[var(--color-border)] rounded-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#C5A059]">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Payment</span>
                  </div>
                  <p className="text-sm font-semibold">{order.paymentMethod || 'Cash on Delivery'}</p>
                </div>
                <div className="pt-3 border-t border-[var(--color-border)] flex justify-between items-center text-sm">
                  <span className="text-xs uppercase text-neutral-400">Total Charged</span>
                  <span className="font-mono text-base font-bold text-[#C5A059]">
                    Rs. {(order.totalPrice || order.subtotal || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Help CTA */}
            <div className="text-center pt-2">
              <p className="text-xs text-neutral-400">
                Have questions regarding your delivery?{' '}
                <Link href="/contact" className="text-[#C5A059] hover:underline">
                  Speak with our Concierge Desk
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}