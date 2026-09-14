import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Gift, Star, Award } from 'lucide-react';

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1200px] mx-auto px-6 py-20 min-h-[70vh]">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl mb-6 text-[var(--color-text)]">Zero To One Rewards</h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
            Join our exclusive loyalty program. Earn points with every purchase and unlock luxurious rewards tailored just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 text-center rounded-sm border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-3">Join & Earn</h3>
            <p className="text-gray-600">Create an account and earn 50 points instantly. Plus, earn 1 point for every Rs. 100 spent.</p>
          </div>

          <div className="bg-white p-8 text-center rounded-sm border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-[#f8f5f0] rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-[#C29B57]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Tier Benefits</h3>
            <p className="text-gray-600">Move up our Silver, Gold, and Platinum tiers to unlock free shipping, early access, and VIP gifts.</p>
          </div>

          <div className="bg-white p-8 text-center rounded-sm border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-3">Redeem Rewards</h3>
            <p className="text-gray-600">Use your points for discounts on your favorite perfumes or exclusive member-only merchandise.</p>
          </div>
        </div>

        <div className="bg-black text-white p-12 text-center rounded-sm">
          <h2 className="font-serif text-3xl mb-4">Ready to start earning?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join today and get access to the most exclusive fragrance club.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition">
              Create Account
            </button>
            <button className="bg-transparent border border-white text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
