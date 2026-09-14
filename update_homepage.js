const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'src/app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// I will replace everything from {/* NEW ARRIVAL */} to the end of the sections right before {/* BLOG / HIGHLIGHT CARDS (ARCHES) */}
// with the new structured sections.

const startIndex = content.indexOf('{/* NEW ARRIVAL */}');
const endIndex = content.indexOf('{/* BLOG / HIGHLIGHT CARDS (ARCHES) */}');

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find section boundaries");
  process.exit(1);
}

const beforeSections = content.substring(0, startIndex);
const afterSections = content.substring(endIndex);

const buildSection = (id, title, subtitle, arrayName) => `
      <section id="${id}" className="w-full bg-[var(--color-surface)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                ${title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                ${subtitle}
              </motion.p>
            </div>
            <Link href="/shop" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {${arrayName}.length > 0 ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {${arrayName}.map((perfume: any) => (
                <div key={perfume.id} className="min-w-[75vw] sm:min-w-[45vw] md:min-w-0 snap-start">
                  <ProductCard perfume={perfume} />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 flex items-center justify-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-background)]/50">
              <p className="text-[var(--color-text-muted)] font-serif italic text-lg">Coming soon</p>
            </div>
          )}
        </div>
      </section>
`;

// Insert the category blocks manually since the user still wanted them (requirement: "Keep as is - the 6 categories")
// Wait, the plan says:
// 2. Category Grid: (Keep as is - the 6 categories)
// 3. Section 1: Premium Perfumes: Showcasing exactly 5 distinct, high-end Perfumes.
// 4. Section 2: The Oud Collection: Showcasing exactly 5 distinct Oud products.
// 5. Section 3: Traditional Attars: Showcasing exactly 5 distinct Attar/Perfume Wax products.
// 6. Section 4: Luxury Gift Boxes: Showcasing exactly 5 distinct Gift Box products.

const categoryGridJSX = `
      {/* CATEGORY BLOCK GRID (6 CARDS) */}
      <section id="category-blocks" className="max-w-[1600px] mx-auto py-24 px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          { 
            title: 'Perfume Wax', 
            slug: 'perfume-wax',
            img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop', 
            tags: 'Long-lasting • Alcohol-free • Travel-friendly'
          },
          { 
            title: 'Sample Set', 
            slug: 'sample-set',
            img: '/images/royal_leather_oud.jpg',
            tags: 'Try before you buy • Mini sizes • Perfect gift' 
          },
          { 
            title: 'Body Mist', 
            slug: 'body-mist',
            img: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=800&auto=format&fit=crop', 
            tags: 'Light & fresh • All-day wear • Skin-friendly'
          },
          { 
            title: 'Air Care', 
            slug: 'air-care',
            img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop', 
            tags: 'Long-lasting scent • Home fragrance • Easy refill'
          },
          { 
            title: 'Attar', 
            slug: 'attar',
            img: '/images/elegant_attar_bottle_1788340819742.jpg', 
            tags: 'ALCOHOL-FREE • TRADITIONAL • LONG-LASTING'
          },
          { 
            title: 'Oud', 
            slug: 'oud',
            img: '/images/luxury_oud_perfume_1788340783393.jpg', 
            tags: 'RICH • SMOKY • LUXURIOUS'
          }
        ].map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 30, rotateX: -5 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Tilt 
              tiltMaxAngleX={6} 
              tiltMaxAngleY={6} 
              glareEnable 
              glareMaxOpacity={0.3} 
              glareColor="#ffffff" 
              glarePosition="all" 
              scale={1.01}
              transitionSpeed={1000}
              className="h-64 sm:h-80 rounded-xl w-full"
            >
              <Link href={\`/category/\${cat.slug}\`} className="block w-full h-full relative group overflow-hidden rounded-xl bg-[var(--color-primary)]">
                <Image 
                  src={cat.img} 
                  alt={cat.title} 
                  fill 
                  className="object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center pointer-events-none z-10" style={{ transform: "translateZ(30px)" }}>
                   <h3 className="text-white text-3xl font-serif italic drop-shadow-lg mb-1">{cat.title}</h3>
                   <p className="text-gray-300 text-[10px] font-sans uppercase tracking-[0.2em] mb-4 opacity-90">{cat.tags}</p>
                   
                   <div className="flex items-center text-white text-[11px] uppercase font-bold tracking-widest relative overflow-hidden group/link pointer-events-auto">
                     <span className="relative z-10">Shop Now</span>
                     <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover/link:translate-x-1 transition-transform" />
                     <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-out" />
                   </div>
                </div>
              </Link>
            </Tilt>
          </motion.div>
        ))}
      </section>
`;

const section1 = buildSection('premium-perfumes', 'Premium Perfumes', 'The pinnacle of luxury', 'premiumPerfumes');
const section2 = buildSection('oud-collection', 'The Oud Collection', 'Deep, resonant and historic', 'oudCollection');
const section3 = buildSection('traditional-attars', 'Traditional Attars', 'Alcohol-free perfection', 'traditionalAttars');
const section4 = buildSection('luxury-gift-boxes', 'Luxury Gift Boxes', 'The perfect present for loved ones', 'luxuryGiftBoxes');

const newContent = beforeSections + categoryGridJSX + section1 + section2 + section3 + section4 + "\n      " + afterSections;

fs.writeFileSync(pageFile, newContent, 'utf8');

// Also remove "Free Shipping" banner from Header.tsx
const headerFile = path.join(__dirname, 'src/components/Header.tsx');
let headerContent = fs.readFileSync(headerFile, 'utf8');
headerContent = headerContent.replace(/<div className="text-center flex-1">Enjoy Free Shipping on Orders Above Rs\. 3500<\/div>/g, '<div className="text-center flex-1">Welcome to Anti-Gravity Elegance</div>');
fs.writeFileSync(headerFile, headerContent, 'utf8');

console.log("Updated page.tsx layout and removed free shipping banner.");
