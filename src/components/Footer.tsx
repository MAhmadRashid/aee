import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const footerSections = [
  {
    title: 'ABOUT',
    links: [
      { label: 'FAQs', url: '/faqs' },
      { label: 'Our Story', url: '/our-story' },
      { label: 'Media Page', url: '/media' },
      { label: 'Quiz', url: '/quiz' },
      { label: 'Careers / Jobs', url: '/careers' },
    ]
  },
  {
    title: 'SUPPORT',
    links: [
      { label: 'My Account', url: '/account' },
      { label: 'Return Policy', url: '/return-policy' },
      { label: 'Privacy Policy', url: '/privacy-policy' },
      { label: 'Shipping Policy', url: '/shipping-policy' },
      { label: 'Track Your Order', url: '/track-order' },
    ]
  },
  {
    title: 'QUICK LINKS',
    links: [
      { label: 'Ask For A Perfume', url: '/ask-perfume' },
      { label: 'Bulk / Corporate Orders', url: '/corporate-orders' },
      { label: 'Store Locator', url: '/store-locator' },
      { label: 'Blogs', url: '/blogs' },
    ]
  }
];

export function Footer() {
  return (
    <footer className="bg-[#040914] text-white pt-16 pb-8 border-t border-zinc-800">
      <div className="max-w-[1600px] mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 md:gap-8">
          
          {/* Dynamic Link Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.url} 
                      className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Address Section */}
          <div className="flex flex-col space-y-8">
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                GET IN TOUCH
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:02138483000" className="flex items-center text-zinc-400 hover:text-white transition-colors duration-200 text-sm">
                    <Phone className="w-4 h-4 mr-3" />
                    021-38483000
                  </a>
                </li>
                <li>
                  <a href="mailto:info@zerotoone.com" className="flex items-center text-zinc-400 hover:text-white transition-colors duration-200 text-sm">
                    <Mail className="w-4 h-4 mr-3" />
                    Email Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                ADDRESS
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-start text-zinc-400 hover:text-white transition-colors duration-200 text-sm">
                    <MapPin className="w-4 h-4 mr-3 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">Shop No. G-21 Ground Floor, Millennium Mall, Karachi</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="flex items-center text-zinc-400 hover:text-white transition-colors duration-200 text-sm">
                    <MessageCircle className="w-4 h-4 mr-3" />
                    WhatsApp: 03000000000
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex space-x-6 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto px-6 border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Zero To One. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
