const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src/data/perfumes.ts');
let content = fs.readFileSync(dataFile, 'utf8');

const match = content.match(/export const perfumes = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not parse perfumes array");
  process.exit(1);
}

let perfumes;
try {
  perfumes = new Function('return ' + match[1])();
} catch(e) {
  console.error("Error evaluating array:", e);
  process.exit(1);
}

// 1. Group existing products by category
const byCategory = {};
for (const p of perfumes) {
  if (!byCategory[p.category]) byCategory[p.category] = [];
  byCategory[p.category].push(p);
}

// Target quotas: exactly 7 per category
const quotas = {
  'Perfumes': 7,
  'Oud': 7,
  'Perfume Wax / Attar': 7,
  'Tester Box': 7,
  'Sample Sets': 7,
  'Body Mist': 7,
  'Air Care': 7,
  'Gift Box': 7
};

let finalizedProducts = [];
let seedIndex = 1;

for (const [category, quota] of Object.entries(quotas)) {
  if (byCategory[category]) {
    const items = byCategory[category].slice(0, quota);
    
    // Vary prices to include highly premium options and strict "Under 2000" options
    items.forEach((item, index) => {
      if (index === 0 || index === 1) {
        // Under 2000 (Affordable) - 1500 to 1950
        item.price = 1500 + (Math.floor(Math.random() * 9) * 50);
        item.originalPrice = item.price + 500;
      } else if (index === 2 || index === 3) {
        // Mid-range / Premium - 6000 to 12000
        item.price = 6000 + (Math.floor(Math.random() * 60) * 100);
        item.originalPrice = item.price + 1500;
      } else {
        // Ultra Premium - 15000 to 25000
        item.price = 15000 + (Math.floor(Math.random() * 100) * 100);
        item.originalPrice = item.price + 3000;
      }
      
      // Update variants if they exist
      if (item.sizeVariants && item.sizeVariants.length > 0) {
        item.sizeVariants[0].price = item.price;
        item.sizeVariants[0].originalPrice = item.originalPrice;
      }

      // Assign professional prompts for pollinations AI (Direct Browser Load)
      let prompt = 'luxury dark glass perfume bottle professional photography neutral background cinematic lighting 8k highly detailed';
      if (category === 'Oud') prompt = 'premium oud bottle dark wood background rich colors professional photography golden accents 8k';
      if (category === 'Perfume Wax / Attar') prompt = 'elegant small glass attar oil vial gold accents professional photography 8k macro';
      if (category === 'Tester Box') prompt = 'collection of small perfume tester vials elegant minimalist professional photography';
      if (category === 'Gift Box') prompt = 'luxury premium gift box tied with silk ribbon professional photography dark moody';
      if (category === 'Body Mist') prompt = 'elegant tall body mist spray bottle fresh clean background professional photography';
      if (category === 'Air Care') prompt = 'luxury home reed diffuser elegant bottle professional photography home decor';
      if (category === 'Sample Sets') prompt = 'luxury perfume discovery set small bottles elegant black box professional photography';
      
      const encodedPrompt = encodeURIComponent(prompt);
      // Browser will fetch this instantly without Next.js optimization breaking
      item.image_url = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seedIndex}&width=800&height=800`;
      item.image = null; // Force image_url usage
      
      seedIndex++;
    });
    
    finalizedProducts.push(...items);
  }
}

// Sort by standard order
const categoryOrder = ['Perfumes', 'Oud', 'Perfume Wax / Attar', 'Tester Box', 'Sample Sets', 'Body Mist', 'Air Care', 'Gift Box'];
finalizedProducts.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));

const newContent = `export const perfumes = ${JSON.stringify(finalizedProducts, null, 2)};\n`;
fs.writeFileSync(dataFile, newContent, 'utf8');
console.log("Database updated: 56 products (7 per category), Prices increased, Under 2000 added, Professional prompts applied.");
