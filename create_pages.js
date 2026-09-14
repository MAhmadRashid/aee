const fs = require('fs');
const path = require('path');

const pages = [
  { dir: 'faqs', title: 'FAQs' },
  { dir: 'our-story', title: 'Our Story' },
  { dir: 'media', title: 'Media Page' },
  { dir: 'quiz', title: 'Quiz' },
  { dir: 'careers', title: 'Careers' },
  { dir: 'return-policy', title: 'Return Policy' },
  { dir: 'privacy-policy', title: 'Privacy Policy' },
  { dir: 'shipping-policy', title: 'Shipping Policy' },
  { dir: 'track-order', title: 'Track Your Order' },
  { dir: 'ask-perfume', title: 'Ask For A Perfume' },
  { dir: 'corporate-orders', title: 'Bulk / Corporate Orders' },
  { dir: 'blogs', title: 'Blogs' }
];

const basePath = path.join(__dirname, 'src', 'app');

pages.forEach(page => {
  const dirPath = path.join(basePath, page.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const content = `import React from 'react';

export default function ${page.dir.replace(/-./g, x=>x[1].toUpperCase()).replace(/^./, x=>x.toUpperCase())}Page() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-text)] p-8 text-center">
      <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[#C5A059] mb-6 uppercase">
        ${page.title}
      </h1>
      <p className="text-[var(--color-text-muted)] max-w-2xl leading-relaxed text-sm md:text-base tracking-widest">
        This page is currently under construction. Please check back later for updates.
      </p>
    </main>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Pages created successfully.');
