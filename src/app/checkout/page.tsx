"use client";
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartCount, removeFromCart } = useCart();
  const { data: session } = useSession();
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    address: '',
    city: '',
    zip: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
  
  const [gifting, setGifting] = useState({
    giftWrap: false,
    giftCard: false,
    cardMessage: ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = 150;
  const giftWrapCost = gifting.giftWrap ? 500 : 0;
  const total = subtotal + shippingCost + giftWrapCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API request to save order
    setTimeout(async () => {
      // Trigger email API in background
      try {
        await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: `#ZTO-${Math.floor(Math.random() * 100000)}`,
            email: shippingDetails.email,
            name: shippingDetails.fullName,
            total,
            paymentMethod
          })
        });
      } catch (err) {
        console.error("Email send failed", err);
      }
      
      setIsProcessing(false);
      setOrderPlaced(true);
      // In a real app we would clear cart and save to backend
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-12 text-center rounded shadow-2xl relative">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif text-white mb-4">Order Confirmed!</h1>
          <p className="text-white/70 mb-8 font-sans leading-relaxed">
            Thank you for your purchase. A luxury experience is on its way to you. Your order number is <span className="text-white font-bold">#ZTO-{Math.floor(Math.random() * 100000)}</span>.
          </p>
          <Link href="/">
            <button className="w-full bg-[var(--color-primary)] text-[var(--color-background)] font-bold uppercase tracking-widest py-4 rounded hover:opacity-90 transition">
              Return to Store
            </button>
          </Link>
        </div>
      </main>
    );
  }

  if (cartCount === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-serif text-white mb-4">Your Cart is Empty</h1>
        <Link href="/">
          <button className="bg-[var(--color-primary)] text-[var(--color-background)] font-bold uppercase tracking-widest px-8 py-4 rounded hover:opacity-90 transition">
            Continue Shopping
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans relative">
      <header className="w-full bg-[var(--color-surface)] text-[var(--color-primary)] py-4 px-8 flex justify-between items-center border-b border-[var(--color-border)] sticky top-0 z-50">
        <Link href="/" className="flex items-center text-xs font-bold uppercase tracking-widest hover:opacity-70 transition">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <h1 className="text-xl font-black tracking-widest text-center">SECURE CHECKOUT</h1>
        <div className="w-20 flex items-center justify-end text-green-500 opacity-80">
          <ShieldCheck className="w-4 h-4 mr-1" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Shipping Form */}
        <div>
          <h2 className="text-2xl font-serif text-white mb-6 uppercase tracking-widest">Shipping Information</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Full Name</label>
              <input type="text" required value={shippingDetails.fullName} onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-4 text-sm focus:outline-none focus:border-[var(--color-text)] transition" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Email Address</label>
              <input type="email" required value={shippingDetails.email} onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-4 text-sm focus:outline-none focus:border-[var(--color-text)] transition" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Address</label>
              <input type="text" required value={shippingDetails.address} onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-4 text-sm focus:outline-none focus:border-[var(--color-text)] transition" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">City</label>
                <input type="text" required value={shippingDetails.city} onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-4 text-sm focus:outline-none focus:border-[var(--color-text)] transition" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Postal Code</label>
                <input type="text" required value={shippingDetails.zip} onChange={(e) => setShippingDetails({...shippingDetails, zip: e.target.value})} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-4 text-sm focus:outline-none focus:border-[var(--color-text)] transition" />
              </div>
            </div>
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-8 sticky top-24">
            <h2 className="text-xl font-serif text-white mb-6 uppercase tracking-widest">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex justify-between items-center bg-black/20 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-white/10 rounded overflow-hidden">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h4 className="text-white text-sm">{item.name}</h4>
                      <p className="text-[var(--color-primary)] text-[10px] uppercase">{item.variant} x {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-white text-sm">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] pt-6 space-y-4">
              <div className="flex justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-white/70">
                <span>Shipping</span>
                <span>Rs. {shippingCost}</span>
              </div>
              {gifting.giftWrap && (
                <div className="flex justify-between text-sm text-amber-500/90">
                  <span>Premium Gift Wrap</span>
                  <span>Rs. {giftWrapCost}</span>
                </div>
              )}
              <div className="flex justify-between text-lg text-white font-serif border-t border-white/10 pt-4">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            {/* Gifting Options */}
            <div className="mt-6 border-t border-[var(--color-border)] pt-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Gifting Options</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={gifting.giftWrap} onChange={(e) => setGifting({...gifting, giftWrap: e.target.checked})} className="form-checkbox text-[var(--color-primary)] bg-black border-[var(--color-border)] rounded w-4 h-4 focus:ring-0" />
                  <span className="text-sm text-white/80">Premium Gift Wrap (+Rs. 500)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={gifting.giftCard} onChange={(e) => setGifting({...gifting, giftCard: e.target.checked})} className="form-checkbox text-[var(--color-primary)] bg-black border-[var(--color-border)] rounded w-4 h-4 focus:ring-0" />
                  <span className="text-sm text-white/80">Add Custom Gift Card (Free)</span>
                </label>
                {gifting.giftCard && (
                  <textarea 
                    placeholder="Enter your personalized message here..."
                    value={gifting.cardMessage}
                    onChange={(e) => setGifting({...gifting, cardMessage: e.target.value})}
                    className="w-full bg-black/40 border border-[var(--color-border)] rounded p-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] mt-2 h-20 resize-none transition-colors"
                  />
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6 border-t border-[var(--color-border)] pt-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)] bg-black/20'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-3 text-[var(--color-primary)] focus:ring-0" />
                  <span className="text-sm text-white font-medium">Cash on Delivery (COD)</span>
                </label>
                <label className={`flex flex-col p-4 border rounded cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)] bg-black/20'}`}>
                  <div className="flex items-center">
                    <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="mr-3 text-[var(--color-primary)] focus:ring-0" />
                    <span className="text-sm text-white font-medium">Online Payment (Card)</span>
                  </div>
                  
                  {/* Simulated Card Form */}
                  {paymentMethod === 'online' && (
                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3 pl-7">
                      <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="w-full bg-black border border-[var(--color-border)] rounded p-3 text-sm text-white" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="w-full bg-black border border-[var(--color-border)] rounded p-3 text-sm text-white" />
                        <input type="text" placeholder="CVC" className="w-full bg-black border border-[var(--color-border)] rounded p-3 text-sm text-white" />
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={isProcessing}
              className="w-full mt-8 bg-[var(--color-primary)] text-[var(--color-background)] font-bold uppercase tracking-widest py-4 rounded hover:opacity-90 transition disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : `Place Order (${paymentMethod === 'cod' ? 'COD' : 'Online'})`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
