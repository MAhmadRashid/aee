'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Fragrance Consultation',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Fragrance Consultation',
      message: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex p-3 rounded-full bg-[#C5A059]/10 text-[#C5A059] mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl md:text-5xl mb-4 tracking-wide">Fragrance Concierge</h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            Whether seeking bespoke olfactive guidance, inquiring about an active consignment, or reserving a private tasting at our atelier, our team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Form Card */}
          <div className="lg:col-span-7 bg-[var(--color-surface)] p-8 md:p-10 border border-[var(--color-border)] rounded-sm shadow-xl">
            {submitted ? (
              <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
                <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-serif text-2xl">Message Received</h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto">
                  Thank you for reaching out to Zero to One. Your inquiry has been prioritized with reference code:
                </p>
                <div className="inline-block px-4 py-2 bg-neutral-900 border border-[#C5A059]/40 font-mono text-base text-[#C5A059] rounded-sm">
                  {ticketId}
                </div>
                <p className="text-xs text-neutral-500">
                  Our fragrance specialist will reply to <span className="text-white">{formData.email}</span> within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="border border-[#C5A059] text-[#C5A059] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A059] hover:text-black transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="text-xl font-serif">Compose a Note</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-neutral-300">
                        Full Name <span className="text-[#C5A059]">*</span>
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Elena Rostova"
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] p-3 text-sm text-white focus:outline-none focus:border-[#C5A059] rounded-sm transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-neutral-300">
                        Email Address <span className="text-[#C5A059]">*</span>
                      </label>
                      <input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@example.com"
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] p-3 text-sm text-white focus:outline-none focus:border-[#C5A059] rounded-sm transition-colors" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-neutral-300">
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+92 300 0000000"
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] p-3 text-sm text-white focus:outline-none focus:border-[#C5A059] rounded-sm transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-neutral-300">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] p-3 text-sm text-white focus:outline-none focus:border-[#C5A059] rounded-sm transition-colors"
                      >
                        <option value="General Fragrance Consultation">Fragrance Recommendation</option>
                        <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                        <option value="Bespoke Gifting & Corporate">Bespoke Gifting & Corporate</option>
                        <option value="Retail Atelier Appointment">Retail Atelier Appointment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest font-medium mb-2 text-neutral-300">
                      Message <span className="text-[#C5A059]">*</span>
                    </label>
                    <textarea 
                      required 
                      rows={5} 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your scent preferences, inquiries, or notes with our perfumers..."
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] p-3 text-sm text-white focus:outline-none focus:border-[#C5A059] rounded-sm transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#C5A059] text-black hover:bg-white px-6 py-4 font-bold uppercase tracking-[0.2em] text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Message</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Contact Details & Atelier Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-6">
              <h3 className="font-serif text-lg text-[#C5A059] uppercase tracking-wider pb-3 border-b border-[var(--color-border)]">
                Boutique Flagship
              </h3>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C5A059]/10 rounded-full text-[#C5A059] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Karachi Atelier</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Shop No. G-21, Ground Level, Millennium Mall<br />
                    Rashid Minhas Road, Karachi, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C5A059]/10 rounded-full text-[#C5A059] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Direct Telephony</h4>
                  <p className="text-xs text-neutral-400 space-y-1">
                    <span className="block">Boutique: <a href="tel:02138483000" className="text-white hover:text-[#C5A059] font-mono">021-38483000</a></span>
                    <span className="block">Concierge WhatsApp: <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] font-mono">+92 300 0000000</a></span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C5A059]/10 rounded-full text-[#C5A059] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Electronic Correspondence</h4>
                  <p className="text-xs text-neutral-400 space-y-1">
                    <span className="block">Support: <a href="mailto:support@zerotoone.com" className="text-white hover:text-[#C5A059]">support@zerotoone.com</a></span>
                    <span className="block">Corporate: <a href="mailto:concierge@zerotoone.com" className="text-white hover:text-[#C5A059]">concierge@zerotoone.com</a></span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C5A059]/10 rounded-full text-[#C5A059] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Atelier Hours</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Monday – Saturday: 11:00 AM – 10:00 PM<br />
                    Sunday: 02:00 PM – 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="p-6 bg-gradient-to-br from-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-sm">
              <h4 className="font-serif text-base mb-2 text-[#C5A059]">Immediate Order Tracking</h4>
              <p className="text-xs text-neutral-400 mb-4">
                Already hold a consignment number? Access real-time route milestones without waiting.
              </p>
              <Link 
                href="/track-order" 
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white hover:text-[#C5A059] transition-colors"
              >
                <span>Go to Consignment Tracker</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
