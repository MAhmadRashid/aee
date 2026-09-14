'use client';
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setStatus('Thank you for your message. We will get back to you shortly.');
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1200px] mx-auto px-6 py-20 min-h-[70vh]">
        <h1 className="font-serif text-4xl mb-4 text-[var(--color-text)] text-center">Contact Us</h1>
        <p className="text-[var(--color-text-muted)] text-lg mb-16 text-center max-w-2xl mx-auto">
          Have a question? We're here to help. Send us a message and we'll get back to you shortly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-sm">
            <h2 className="text-2xl font-serif mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required type="text" className="w-full border p-3 rounded-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" className="w-full border p-3 rounded-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows={5} className="w-full border p-3 rounded-sm focus:outline-none focus:border-black"></textarea>
              </div>
              <button type="submit" className="w-full bg-black text-white px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition">
                Send Message
              </button>
              {status && <p className="text-green-600 mt-4 text-sm">{status}</p>}
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-12">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Our Store</h3>
                <p className="text-gray-600">Shop No. G-21 Ground Floor, Millennium Mall<br />Karachi, Pakistan</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Phone & WhatsApp</h3>
                <p className="text-gray-600">
                  Landline: <a href="tel:02138483000" className="hover:text-black transition">021-38483000</a><br />
                  Mobile: <a href="tel:03000000000" className="hover:text-black transition">0300 0000 000</a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-gray-600">
                  <a href="mailto:support@zerotoone.com" className="hover:text-black transition">support@zerotoone.com</a><br />
                  <a href="mailto:info@zerotoone.com" className="hover:text-black transition">info@zerotoone.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
