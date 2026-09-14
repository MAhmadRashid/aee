const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src/data/perfumes.ts');
let content = fs.readFileSync(dataFile, 'utf8');

const match = content.match(/export const perfumes = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not parse perfumes array");
  process.exit(1);
}

let perfumes = new Function('return ' + match[1])();

let count = 0;
for (const p of perfumes) {
  // 1. Minimum price 5000
  if (p.price < 5000) {
    p.price = 5000;
  }
  if (p.originalPrice && p.originalPrice <= p.price) {
    p.originalPrice = p.price + Math.floor(p.price * 0.2); // 20% higher
  }

  // Also update size variants
  if (p.sizeVariants) {
    for (const v of p.sizeVariants) {
      if (v.price < 5000) {
        v.price = 5000;
      }
      if (v.originalPrice && v.originalPrice <= v.price) {
        v.originalPrice = v.price + Math.floor(v.price * 0.2);
      }
    }
  }

  // 2. Split "Perfumes" into "Premium Perfumes" and "Classic Perfumes"
  if (p.category === 'Perfumes' || p.category === 'Premium Perfumes' || p.category === 'Simple') {
    count++;
    if (count % 2 === 0) {
      p.category = 'Premium Perfumes';
    } else {
      p.category = 'Classic Perfumes'; // "Simple" but premium sounding
    }
  }
}

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync(dataFile, newContent, 'utf8');

console.log("Successfully updated prices and categories!");
