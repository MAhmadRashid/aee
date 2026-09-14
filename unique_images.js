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

// 1. Assign unique images based on category keyword, color, and shape
let index = 1;
for (const p of perfumes) {
  let keyword = 'perfume,luxury';
  if (p.category === 'Oud') keyword = 'oud,perfume,dark';
  if (p.category === 'Perfume Wax / Attar') keyword = 'essential-oil,glass,bottle';
  if (p.category === 'Tester Box') keyword = 'perfume,sample,small';
  if (p.category === 'Gift Box') keyword = 'giftbox,luxury,present';
  if (p.category === 'Body Mist') keyword = 'bodymist,spray,bottle';
  if (p.category === 'Air Care') keyword = 'diffuser,fragrance,home';
  if (p.category === 'Sample Sets') keyword = 'perfume,vials,set';
  
  // Convert hex color to text representation if possible, or just use it directly in prompt
  const liquidColorStr = p.liquidColor ? ` with ${p.liquidColor.replace('#', '')} liquid` : '';
  const capColorStr = p.capColor ? ` and ${p.capColor.replace('#', '')} cap` : '';
  const shapeStr = p.shapes?.bottle ? ` in a ${p.shapes.bottle} bottle` : '';
  
  const prompt = `${keyword} ${shapeStr}${liquidColorStr}${capColorStr} product shot studio lighting high quality minimalist`;
  
  // Assign a completely unique URL to every single product
  p.image_url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=${index}`;
  index++;
}

// 2. Add validation check for duplicate images
const seenImages = new Set();
for (const p of perfumes) {
  if (seenImages.has(p.image_url)) {
    console.error(`VALIDATION FAILED: Duplicate image found! ${p.image_url} on product ${p.name}`);
    process.exit(1);
  }
  seenImages.add(p.image_url);
}
console.log("Validation Passed: 0 duplicate images found.");

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync(dataFile, newContent, 'utf8');

console.log("Successfully enforced 100% unique images across all products.");
