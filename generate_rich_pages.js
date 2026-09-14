const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src', 'app');

const filesToCreate = [
  {
    path: 'faqs/page.tsx',
    content: `'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping within Pakistan takes 3-5 business days. International shipping takes 7-14 business days.' },
  { q: 'What is your return policy?', a: 'We accept returns on unopened and unused perfumes within 14 days of delivery. Sample sets are non-refundable.' },
  { q: 'Are your fragrances cruelty-free?', a: 'Yes, all Zero To One fragrances are 100% cruelty-free and vegan, crafted with ethically sourced ingredients.' },
  { q: 'How should I store my perfume?', a: 'For best results, store your perfume in a cool, dark place away from direct sunlight and extreme temperature changes.' },
];

export default function FaqsPage() {
  const [open, setOpen] = useState<number | null>(null);
  
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4 tracking-widest uppercase">Frequently Asked Questions</h1>
        <p className="text-center text-[var(--color-text-muted)] mb-16 text-sm tracking-widest uppercase">Everything you need to know about our products and services</p>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-[var(--color-border)] p-6 bg-white/5 cursor-pointer hover:bg-white/10 transition" onClick={() => setOpen(open === idx ? null : idx)}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{faq.q}</h3>
                {open === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              {open === idx && <p className="mt-4 text-[var(--color-text-muted)] leading-relaxed">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}`
  },
  {
    path: 'our-story/page.tsx',
    content: `import React from 'react';

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-5xl md:text-6xl mb-8 tracking-widest uppercase text-[#C5A059]">The Art of Zero</h1>
        <p className="text-lg md:text-xl text-[var(--color-text-muted)] leading-relaxed mb-12">
          Zero To One was born from a singular vision: to distill the chaotic beauty of nature into perfect, minimalist drops of luxury. 
          We believe that fragrance is not just an accessory, but an invisible aura that defines your presence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="aspect-square bg-white/5 flex items-center justify-center p-8 border border-[var(--color-border)]">
            <p className="font-serif text-2xl">Ethically Sourced Ingredients</p>
          </div>
          <div className="aspect-square bg-white/5 flex items-center justify-center p-8 border border-[var(--color-border)]">
            <p className="font-serif text-2xl">Master Perfumery Techniques</p>
          </div>
        </div>
      </div>
    </main>
  );
}`
  },
  {
    path: 'media/page.tsx',
    content: `import React from 'react';
import { PlayCircle } from 'lucide-react';

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-5xl text-center mb-16 tracking-widest uppercase">Media & Press</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="group cursor-pointer relative aspect-[4/3] bg-white/5 border border-[var(--color-border)] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-bold uppercase tracking-wider">Campaign Vol. {i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}`
  },
  {
    path: 'quiz/page.tsx',
    content: `'use client';
import React, { useState } from 'react';

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const questions = [
    "What is your ideal evening?",
    "Which element speaks to you?",
    "Select a texture:"
  ];
  const options = [
    ["A quiet dinner", "A vibrant party", "A midnight walk"],
    ["Fire", "Water", "Earth"],
    ["Silk", "Leather", "Cashmere"]
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full border border-[var(--color-border)] p-12 bg-white/5 text-center">
        {step < questions.length ? (
          <>
            <p className="text-sm tracking-[0.3em] uppercase text-[#C5A059] mb-4">Question {step + 1} of {questions.length}</p>
            <h2 className="font-serif text-3xl mb-12">{questions[step]}</h2>
            <div className="space-y-4">
              {options[step].map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => setStep(step + 1)}
                  className="w-full border border-[var(--color-border)] p-4 hover:bg-white hover:text-black transition uppercase tracking-widest text-sm font-bold"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="font-serif text-4xl mb-4 text-[#C5A059]">Your Signature Scent is Ready</h2>
            <p className="text-[var(--color-text-muted)] mb-8">Based on your answers, we have found your perfect match.</p>
            <button className="bg-black text-white px-8 py-4 uppercase tracking-[0.2em] font-bold border border-white hover:bg-white hover:text-black transition">
              Reveal Perfume
            </button>
          </>
        )}
      </div>
    </main>
  );
}`
  },
  {
    path: 'careers/page.tsx',
    content: `import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CareersPage() {
  const jobs = [
    { title: 'Master Perfumer', location: 'Karachi, PK', type: 'Full-time' },
    { title: 'Digital Marketing Lead', location: 'Remote', type: 'Full-time' },
    { title: 'Boutique Manager', location: 'Dubai, UAE', type: 'Full-time' },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl text-center mb-6 tracking-widest uppercase">Join Our Team</h1>
        <p className="text-center text-[var(--color-text-muted)] mb-16 max-w-2xl mx-auto">We are always looking for passionate individuals who share our dedication to luxury, minimalism, and the art of perfumery.</p>
        
        <div className="space-y-6">
          {jobs.map((job, i) => (
            <div key={i} className="border border-[var(--color-border)] p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 hover:bg-white/10 transition group cursor-pointer">
              <div>
                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] tracking-widest uppercase">{job.location} • {job.type}</p>
              </div>
              <ArrowRight className="w-6 h-6 mt-4 md:mt-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}`
  },
  {
    path: 'return-policy/page.tsx',
    content: `import React from 'react';

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="font-serif text-4xl mb-12 tracking-widest uppercase text-center">Return Policy</h1>
        <p>At Zero To One, we take immense pride in the craftsmanship of our fragrances. If you are not entirely satisfied with your purchase, we are here to help.</p>
        
        <h3>Returns</h3>
        <p>You have 14 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused, sealed, and in the same condition that you received it. It must also be in the original packaging.</p>
        
        <h3>Refunds</h3>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment.</p>
        
        <h3>Non-Returnable Items</h3>
        <p>Please note that for hygiene and authenticity reasons, opened perfumes, attars, and sample sets cannot be returned or exchanged.</p>
      </div>
    </main>
  );
}`
  },
  {
    path: 'privacy-policy/page.tsx',
    content: `import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="font-serif text-4xl mb-12 tracking-widest uppercase text-center">Privacy Policy</h1>
        <p>Last updated: January 2026</p>
        <p>Zero To One respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
        
        <h3>Information We Collect</h3>
        <p>We may collect, use, store and transfer different kinds of personal data about you, including Identity Data, Contact Data, Financial Data, and Transaction Data when you make a purchase or create an account.</p>
        
        <h3>How We Use Your Data</h3>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to process your orders, manage our relationship with you, and send you luxury fragrance recommendations.</p>
      </div>
    </main>
  );
}`
  },
  {
    path: 'shipping-policy/page.tsx',
    content: `import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="font-serif text-4xl mb-12 tracking-widest uppercase text-center">Shipping Policy</h1>
        
        <h3>Domestic Shipping (Pakistan)</h3>
        <p>We offer premium tracked shipping nationwide. Standard delivery takes 3-5 business days. Orders placed before 2 PM PKT are dispatched the same day.</p>
        
        <h3>International Shipping</h3>
        <p>Zero To One ships worldwide via DHL Express. International delivery typically takes 7-14 business days depending on the destination. Please note that international orders may be subject to import duties and taxes upon arrival.</p>
        
        <h3>Packaging</h3>
        <p>Every order is carefully packaged in our signature luxury rigid boxes, ensuring your delicate glass bottles arrive safely and in pristine condition.</p>
      </div>
    </main>
  );
}`
  },
  {
    path: 'track-order/page.tsx',
    content: `'use client';
import React from 'react';
import { PackageSearch } from 'lucide-react';

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full p-8 border border-[var(--color-border)] bg-white/5">
        <div className="flex justify-center mb-6">
          <PackageSearch className="w-12 h-12 text-[#C5A059]" />
        </div>
        <h1 className="font-serif text-3xl text-center mb-8 tracking-widest uppercase">Track Your Order</h1>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Order Number</label>
            <input type="text" placeholder="e.g. ZTO-10482" className="w-full bg-transparent border border-[var(--color-border)] p-4 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Email Address</label>
            <input type="email" placeholder="Enter your email" className="w-full bg-transparent border border-[var(--color-border)] p-4 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <button type="submit" className="w-full bg-black text-white border border-[#C5A059] p-4 uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] transition-colors">
            Track Shipment
          </button>
        </form>
      </div>
    </main>
  );
}`
  },
  {
    path: 'ask-perfume/page.tsx',
    content: `'use client';
import React from 'react';

export default function AskPerfumePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl text-center mb-4 tracking-widest uppercase">Ask For A Perfume</h1>
        <p className="text-center text-[var(--color-text-muted)] mb-12 text-sm tracking-widest uppercase">Looking for a specific scent profile? Let our master perfumers help.</p>
        
        <form className="space-y-6 bg-white/5 p-8 border border-[var(--color-border)]" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Full Name</label>
              <input type="text" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Email Address</label>
              <input type="email" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Preferred Fragrance Family</label>
            <select className="w-full bg-black border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]">
              <option>Woody & Earthy</option>
              <option>Floral</option>
              <option>Fresh & Citrus</option>
              <option>Oriental & Spicy</option>
              <option>Oud</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Describe Your Ideal Scent</label>
            <textarea rows={4} className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]"></textarea>
          </div>
          <button type="submit" className="w-full bg-[#0a0a0a] text-white border border-[#C5A059] p-4 uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] hover:text-black transition-colors">
            Submit Request
          </button>
        </form>
      </div>
    </main>
  );
}`
  },
  {
    path: 'corporate-orders/page.tsx',
    content: `'use client';
import React from 'react';
import { Briefcase } from 'lucide-react';

export default function CorporateOrdersPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          <Briefcase className="w-12 h-12 text-[#C5A059] mb-6" />
          <h1 className="font-serif text-4xl mb-6 tracking-widest uppercase">Corporate & Bulk Gifting</h1>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
            Elevate your corporate gifting with Zero To One's bespoke luxury fragrance packages. We offer customized engraving, bespoke packaging, and volume discounts for events, weddings, and corporate clients.
          </p>
          <p className="text-sm font-bold uppercase tracking-widest text-[#C5A059]">Minimum Order Quantity: 20 Units</p>
        </div>
        
        <form className="space-y-4 bg-white/5 p-8 border border-[var(--color-border)]" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Company Name</label>
            <input type="text" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Contact Email</label>
            <input type="email" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold">Estimated Quantity</label>
            <input type="number" className="w-full bg-transparent border border-[var(--color-border)] p-3 text-white focus:outline-none focus:border-[#C5A059]" />
          </div>
          <button type="submit" className="w-full bg-black text-white border border-[#C5A059] p-4 uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] transition-colors mt-4">
            Request Catalog
          </button>
        </form>
      </div>
    </main>
  );
}`
  },
  {
    path: 'blogs/page.tsx',
    content: `import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BlogsPage() {
  const blogs = [
    { title: "The Art of Layering Oud", category: "Guide", date: "Oct 12, 2026" },
    { title: "Choosing the Perfect Summer Attar", category: "Editorial", date: "Sep 28, 2026" },
    { title: "Behind the Scenes: Emerald Onyx", category: "Brand", date: "Aug 15, 2026" },
    { title: "The History of Rose Noir Extraction", category: "Ingredients", date: "Jul 04, 2026" },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-5xl text-center mb-16 tracking-widest uppercase">The Journal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog, i) => (
            <div key={i} className="group border border-[var(--color-border)] bg-white/5 overflow-hidden cursor-pointer">
              <div className="aspect-[2/1] bg-black/50 p-6 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                <div className="relative z-20">
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-2 block">{blog.category}</span>
                  <h2 className="font-serif text-2xl md:text-3xl mb-4 group-hover:text-[#C5A059] transition-colors">{blog.title}</h2>
                  <div className="flex justify-between items-center text-sm text-[var(--color-text-muted)]">
                    <span>{blog.date}</span>
                    <span className="flex items-center font-bold uppercase tracking-widest group-hover:text-white transition-colors">Read <ArrowRight className="w-4 h-4 ml-2" /></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}`
  }
];

filesToCreate.forEach(file => {
  const fullPath = path.join(basePath, file.path);
  // Ensure directory exists just in case
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, file.content, 'utf8');
});

console.log('All 12 rich pages generated successfully.');
