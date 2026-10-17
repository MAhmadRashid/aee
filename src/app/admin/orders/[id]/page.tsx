'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  User, 
  MapPin, 
  CreditCard, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Copy
} from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // 1. Direct single order endpoint
        const singleRes = await fetch(`/api/admin/orders/${resolvedParams.id}`);
        if (singleRes.ok) {
          const data = await singleRes.json();
          if (data && (data.id || data._id)) {
            setOrder(data);
            return;
          }
        }

        // 2. Fallback to list
        const res = await fetch('/api/admin/orders');
        if (res.ok) {
          const orders = await res.json();
          const found = orders.find((o: any) => o.id === resolvedParams.id || o._id === resolvedParams.id);
          if (found) {
            setOrder(found);
          }
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [resolvedParams.id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const result = await res.json();
        setOrder((prev: any) => ({ 
          ...prev, 
          status: newStatus,
          statusHistory: result.statusHistory || prev.statusHistory
        }));
        showToast(`Consignment status updated to ${newStatus.toUpperCase()}`);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || 'Failed to update consignment status.');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Error modifying consignment status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const formatOrderDate = (createdAt: any) => {
    if (!createdAt) return 'Recent';
    if (typeof createdAt === 'string') {
      const d = new Date(createdAt);
      return isNaN(d.getTime()) ? 'Recent' : d.toLocaleString();
    }
    const seconds = createdAt._seconds ?? createdAt.seconds;
    if (seconds) {
      return new Date(seconds * 1000).toLocaleString();
    }
    const d = new Date(createdAt);
    return isNaN(d.getTime()) ? 'Recent' : d.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-widest text-neutral-400">Retrieving Consignment Archive</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif text-white">Consignment Record Not Found</h2>
        <p className="text-neutral-400 text-sm">We could not locate this consignment in the current archives.</p>
        <Link href="/admin/orders" className="inline-flex items-center text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Orders
        </Link>
      </div>
    );
  }

  const items = order.items || order.cartItems || [];
  const customer = order.customer || order.shippingDetails || {};
  const status = (order.status || 'processing').toLowerCase();

  return (
    <div className="space-y-8 pt-4 pb-16 max-w-5xl w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] border border-[#D4AF37]/40 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs font-sans tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <Link href="/admin/orders" className="text-neutral-400 hover:text-[#D4AF37] transition-colors flex items-center text-[10px] uppercase tracking-widest mb-3">
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Consignments
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-serif italic text-white tracking-wide">
              {order.orderNumber || order.id}
            </h1>
            <span className={`inline-flex items-center text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold border ${
              status === 'pending'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                : status === 'confirmed'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : status === 'processing' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : status === 'shipped'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : (status === 'completed' || status === 'delivered')
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
              {status === 'pending' && <Clock className="w-3 h-3 mr-1.5" />}
              {status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1.5" />}
              {status === 'processing' && <Clock className="w-3 h-3 mr-1.5" />}
              {status === 'shipped' && <Truck className="w-3 h-3 mr-1.5" />}
              {(status === 'completed' || status === 'delivered') && <CheckCircle className="w-3 h-3 mr-1.5" />}
              {status === 'cancelled' && <XCircle className="w-3 h-3 mr-1.5" />}
              {order.status || 'Processing'}
            </span>

            {/* Live Status Switcher */}
            <select
              value={status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
            >
              <option value="pending" className="bg-[#121212]">Pending Approval</option>
              <option value="confirmed" className="bg-[#121212]">Confirmed</option>
              <option value="processing" className="bg-[#121212]">Processing (Preparing)</option>
              <option value="shipped" className="bg-[#121212]">Shipped (In Transit)</option>
              <option value="delivered" className="bg-[#121212]">Delivered</option>
              <option value="completed" className="bg-[#121212]">Completed</option>
              <option value="cancelled" className="bg-[#121212]">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs uppercase tracking-widest font-bold text-neutral-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Print Invoice</span>
          </button>
          <div className="text-xs text-neutral-400 font-mono text-right">
            {formatOrderDate(order.createdAt)}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 p-6 md:p-8 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-6 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Purchased Fragrance Formulations ({items.length})
            </h2>

            {items.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No specific items listed for this order.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {items.map((item: any, i: number) => {
                  const imageSrc = item.image || item.image_url || '/perfumes/1.webp';
                  return (
                    <div key={i} className="py-4 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-16 bg-black border border-white/10 rounded-md relative overflow-hidden shrink-0">
                          <Image src={imageSrc} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif text-white text-sm font-semibold group-hover:text-[#D4AF37] transition-colors">{item.name}</p>
                          {item.variant && (
                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Bottle Size: {item.variant}</p>
                          )}
                          <p className="text-xs text-neutral-400">Qty: {item.quantity || 1} × Rs. {(item.price || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="font-mono text-white text-sm font-bold">
                        Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-white/5 pt-6 mt-6 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">Rs. {(order.subtotal || order.totalPrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Express Courier Dispatch</span>
                <span className="font-mono text-white">
                  {order.shippingCost ? `Rs. ${order.shippingCost}` : <span className="text-emerald-400 font-bold">Complimentary</span>}
                </span>
              </div>
              {order.giftWrapCost ? (
                <div className="flex justify-between text-[#D4AF37]">
                  <span>Artisanal Gift Foil Packaging</span>
                  <span className="font-mono">Rs. {order.giftWrapCost}</span>
                </div>
              ) : null}
              <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold text-white">
                <span className="text-[#D4AF37]">Total Consignment Value</span>
                <span className="font-mono text-[#D4AF37]">Rs. {(order.totalPrice || order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details */}
        <div className="space-y-6">
          <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 p-6 md:p-8 shadow-xl space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] flex items-center">
              <User className="w-4 h-4 mr-2" /> Client Details
            </h2>
            
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Recipient Name</p>
              <p className="text-sm text-white font-semibold">{customer.name || customer.fullName || 'Private Client'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Email Address</p>
              <p className="text-xs font-mono text-neutral-300">{customer.email || 'N/A'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Delivery Destination</p>
              <p className="text-xs text-neutral-300 flex items-start leading-relaxed">
                <MapPin className="w-3.5 h-3.5 mr-2 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>
                  {customer.address || 'Address on file'}<br />
                  {customer.city ? `${customer.city}` : ''}
                  {customer.zip ? ` - ${customer.zip}` : ''}
                </span>
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Settlement Mode</p>
              <p className="text-xs text-white uppercase tracking-wider flex items-center font-semibold">
                <CreditCard className="w-4 h-4 mr-2 text-[#D4AF37]" />
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid Online Payment'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
