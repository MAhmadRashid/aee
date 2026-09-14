const fs = require('fs');

let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');

// Insert Classic Perfumes section after Premium Perfumes
if (!pageContent.includes('id="classic-perfumes"')) {
    const classicPerfumesHtml = `
      <section id="classic-perfumes" className="w-full bg-[var(--color-background)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                Classic Perfumes
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                Timeless elegance and charm
              </motion.p>
            </div>
            <Link href="/shop" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {classicPerfumes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {classicPerfumes.map((perfume: any) => (
                <div key={perfume.id} className="w-full">
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
    
    pageContent = pageContent.replace('</section>\n\n      <section id="oud-collection"', '</section>\n' + classicPerfumesHtml + '\n      <section id="oud-collection"');
}

if (!pageContent.includes('id="tester-boxes"')) {
    const testerBoxesHtml = `
      <section id="tester-boxes" className="w-full bg-[var(--color-surface)] py-24 px-8 border-y border-[var(--color-border)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-2xl md:text-3xl font-serif text-[var(--color-text)] uppercase tracking-widest"
              >
                Tester Boxes
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-[var(--color-text-muted)] italic font-serif mt-1"
              >
                Discover your signature scent
              </motion.p>
            </div>
            <Link href="/shop" className="group flex items-center text-[10px] font-bold text-[var(--color-text)] uppercase tracking-widest relative overflow-hidden">
              <span className="relative z-10">View all</span>
              <ArrowRight className="w-3 h-3 ml-1 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-text)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          {testerBoxes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {testerBoxes.map((perfume: any) => (
                <div key={perfume.id} className="w-full">
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

    pageContent = pageContent.replace('</section>\n\n      <Footer />', '</section>\n' + testerBoxesHtml + '\n      <Footer />');
}

fs.writeFileSync('src/app/page.tsx', pageContent);

// NOW FIX PRICES
const perfumesCode = fs.readFileSync('src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_perfumes.js', perfumesCode);
const perfumes = require('./temp_perfumes.js');

let under5000Count = 0;

for (let p of perfumes) {
    if (p.category === 'Body Mist' || p.category === 'Air Care' || p.category === 'Room Spray' || p.category === 'Attar' || p.category === 'Perfume Wax / Attar') {
        // Decrease prices to under 5000
        p.price = 2500 + Math.floor(Math.random() * 2400); // 2500 - 4900
        if (p.salePrice) p.salePrice = p.price - 500;
        under5000Count++;
    } else {
        // Increase prices
        if (p.category === 'Premium Perfumes') {
            p.price = 15000 + Math.floor(Math.random() * 10000); // 15k - 25k
        } else if (p.category === 'Classic Perfumes') {
            p.price = 8000 + Math.floor(Math.random() * 5000); // 8k - 13k
        } else if (p.category === 'Oud') {
            p.price = 12000 + Math.floor(Math.random() * 8000); // 12k - 20k
        } else if (p.category === 'Gift Box') {
            p.price = 10000 + Math.floor(Math.random() * 5000);
        } else {
            p.price = 6000 + Math.floor(Math.random() * 4000);
        }
        
        // Round to nearest 50
        p.price = Math.round(p.price / 50) * 50;
        if (p.salePrice) p.salePrice = p.price - 1000;
    }
}

fs.writeFileSync('src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(perfumes, null, 2) + ';\n');
fs.unlinkSync('temp_perfumes.js');
console.log("Prices fixed and sections injected!");
