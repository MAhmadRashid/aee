"use client";
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle, 
  PackageSearch, 
  Truck, 
  CreditCard, 
  Sparkles,
  Lock
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartCount, clearCart } = useCart();
  const { data: session } = useSession();
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  
  const [gifting, setGifting] = useState({
    giftWrap: false,
    giftCard: false,
    cardMessage: ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 5000 ? 0 : 250;
  const giftWrapCost = gifting.giftWrap ? 500 : 0;
  const total = subtotal + shippingCost + giftWrapCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    
    try {
      const generatedOrderNumber = `#ZTO-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: generatedOrderNumber,
          shippingDetails,
          cartItems,
          subtotal,
          shippingCost,
          giftWrapCost,
          total,
          paymentMethod,
          gifting
        })
      });

      if (res.ok) {
        setPlacedOrderNumber(generatedOrderNumber);
        setOrderPlaced(true);
        clearCart();

        // Non-blocking email dispatch
        fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: generatedOrderNumber,
            email: shippingDetails.email,
            name: shippingDetails.fullName,
            total,
            paymentMethod
          })
        }).catch((emailErr) => {
          console.warn('Order confirmation email notice:', emailErr);
        });
      } else {
        alert("There was an issue processing your order. Please try again.");
      }
    } catch (err) {
      console.error("Order save failed", err);
      alert("Failed to connect to the checkout server. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex items-center justify-center p-6 py-20">
        <div className="max-w-lg w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-8 md:p-10 text-center rounded-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-[#C5A059]/15 rounded-full flex items-center justify-center mx-auto mb-6 text-[#C5A059]">
            <CheckCircle className="w-8 h-8" />
          </div>
          
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#C5A059] block mb-1">
            Consignment Confirmed
          </span>
          <h1 className="text-3xl font-serif text-white mb-3">Thank You for Your Order</h1>
          <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
            Your artisanal fragrance selection is currently being prepared with exceptional care.
          </p>

          <div className="bg-[var(--color-background)] p-4 border border-[var(--color-border)] rounded-sm mb-6 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
              <span className="text-neutral-400 uppercase tracking-wider">Order Reference:</span>
              <span className="font-mono font-bold text-[#C5A059]">{placedOrderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--color-border)] py-2">
              <span className="text-neutral-400 uppercase tracking-wider">Total Amount:</span>
              <span className="font-mono text-white font-bold">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-neutral-400 uppercase tracking-wider">Payment Method:</span>
              <span className="text-white">{paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid Online'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/track-order"
              className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] py-3.5 text-xs rounded-sm hover:bg-white transition flex items-center justify-center gap-2"
            >
              <PackageSearch className="w-4 h-4" />
              <span>Track Consignment Real-Time</span>
            </Link>

            <Link 
              href="/shop"
              className="w-full bg-transparent text-white border border-[var(--color-border)] hover:border-white font-semibold uppercase tracking-widest py-3 text-xs rounded-sm transition block text-center"
            >
              Return to Fragrance Boutique
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cartCount === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 border border-[var(--color-border)] rounded-full flex items-center justify-center mx-auto text-[#C5A059]">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-serif text-white">Your Cart is Empty</h1>
          <p className="text-neutral-400 text-sm">
            Discover our haute collection of fragrances, oud extraits, and discovery sets.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <button className="bg-[#C5A059] text-black font-bold uppercase tracking-widest px-8 py-3.5 text-xs rounded-sm hover:bg-white transition">
                Explore The Boutique
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans relative">
      <header className="w-full bg-[var(--color-surface)] text-[var(--color-primary)] py-4 px-6 md:px-12 flex justify-between items-center border-b border-[var(--color-border)] sticky top-0 z-40">
        <Link href="/shop" className="flex items-center text-xs font-bold uppercase tracking-widest hover:opacity-70 transition text-white">
          <ChevronLeft className="w-4 h-4 mr-1 text-[#C5A059]" /> Back to Boutique
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-serif uppercase tracking-[0.25em] text-[#C5A059]">ZERO TO ONE</h1>
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">Secure Checkout</span>
        </div>
        <div className="flex items-center text-xs uppercase tracking-widest text-emerald-400 font-semibold gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">256-Bit SSL</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-12 px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side - Shipping Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 md:p-8 rounded-sm">
            <h2 className="text-xl font-serif text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#C5A059]" />
              <span>Shipping Destination</span>
            </h2>
            
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-widest text-neutral-300 mb-1.5">
                  Full Name <span className="text-[#C5A059]">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={shippingDetails.fullName} 
                  onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})} 
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm p-3.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-neutral-300 mb-1.5">
                    Email Address <span className="text-[#C5A059]">*</span>
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={shippingDetails.email} 
                    onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})} 
                    placeholder="elena@domain.com"
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm p-3.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-neutral-300 mb-1.5">
                    Phone Number <span className="text-[#C5A059]">*</span>
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={shippingDetails.phone} 
                    onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} 
                    placeholder="0300 1234567"
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm p-3.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-widest text-neutral-300 mb-1.5">
                  Street Address & Apartment <span className="text-[#C5A059]">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={shippingDetails.address} 
                  onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} 
                  placeholder="House #, Street name, Sector / Area"
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm p-3.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-neutral-300 mb-1.5">
                    City <span className="text-[#C5A059]">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={shippingDetails.city} 
                    onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})} 
                    placeholder="Karachi, Lahore, Islamabad..."
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm p-3.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-neutral-300 mb-1.5">
                    Postal Code
                  </label>
                  <input 
                    type="text" 
                    value={shippingDetails.zip} 
                    onChange={(e) => setShippingDetails({...shippingDetails, zip: e.target.value})} 
                    placeholder="75600"
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm p-3.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition" 
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Gifting Options */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Bespoke Gifting Presentation</span>
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={gifting.giftWrap} 
                  onChange={(e) => setGifting({...gifting, giftWrap: e.target.checked})} 
                  className="form-checkbox text-[#C5A059] bg-black border-[var(--color-border)] rounded-sm w-4 h-4 focus:ring-0" 
                />
                <span className="text-xs text-white/90">Signature Black & Gold Foil Gift Wrapping (+Rs. 500)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={gifting.giftCard} 
                  onChange={(e) => setGifting({...gifting, giftCard: e.target.checked})} 
                  className="form-checkbox text-[#C5A059] bg-black border-[var(--color-border)] rounded-sm w-4 h-4 focus:ring-0" 
                />
                <span className="text-xs text-white/90">Complimentary Hand-Embossed Gift Note (Free)</span>
              </label>
              {gifting.giftCard && (
                <textarea 
                  placeholder="Enter your personal sentiment to be inscribed by our calligrapher..."
                  value={gifting.cardMessage}
                  onChange={(e) => setGifting({...gifting, cardMessage: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#C5A059] mt-2 h-20 resize-none transition-colors"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary & Payment */}
        <div className="lg:col-span-5">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 md:p-8 sticky top-24 space-y-6">
            <h2 className="text-lg font-serif text-white uppercase tracking-wider pb-3 border-b border-[var(--color-border)]">
              Consignment Summary
            </h2>
            
            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex justify-between items-center bg-[var(--color-background)]/60 p-3 rounded-sm border border-[var(--color-border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-black border border-[var(--color-border)] rounded-sm overflow-hidden relative shrink-0">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-serif font-semibold line-clamp-1">{item.name}</h4>
                      <p className="text-[#C5A059] text-[10px] uppercase tracking-wider">{item.variant} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-white font-mono text-xs font-bold">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-[var(--color-border)] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Courier Express Shipping</span>
                <span className="font-mono text-white">
                  {shippingCost === 0 ? <span className="text-emerald-400 uppercase font-bold">Complimentary</span> : `Rs. ${shippingCost}`}
                </span>
              </div>
              {gifting.giftWrap && (
                <div className="flex justify-between text-[#C5A059]">
                  <span>Artisanal Foil Packaging</span>
                  <span className="font-mono">Rs. {giftWrapCost}</span>
                </div>
              )}
              <div className="flex justify-between text-base text-white font-serif border-t border-[var(--color-border)] pt-3">
                <span className="font-bold">Total Payable</span>
                <span className="font-mono text-[#C5A059] font-bold">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border-t border-[var(--color-border)] pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#C5A059]" />
                <span>Payment Method</span>
              </h3>
              <div className="space-y-2.5">
                <label className={`flex items-center p-3.5 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-[var(--color-border)] bg-[var(--color-background)]'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')} 
                    className="mr-3 text-[#C5A059] focus:ring-0" 
                  />
                  <div>
                    <span className="text-xs text-white font-semibold block">Cash on Delivery (COD)</span>
                    <span className="text-[10px] text-neutral-400">Pay cash upon parcel arrival at your doorstep</span>
                  </div>
                </label>

                <label className={`flex items-center p-3.5 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-[var(--color-border)] bg-[var(--color-background)]'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="online" 
                    checked={paymentMethod === 'online'} 
                    onChange={() => setPaymentMethod('online')} 
                    className="mr-3 text-[#C5A059] focus:ring-0" 
                  />
                  <div>
                    <span className="text-xs text-white font-semibold block">Online / Card Payment</span>
                    <span className="text-[10px] text-neutral-400">Direct instant debit/credit card or bank transfer</span>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] py-4 text-xs rounded-sm hover:bg-white transition-all shadow-xl cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? "Processing Consignment..." : `Confirm Order (Rs. ${total.toLocaleString()})`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
