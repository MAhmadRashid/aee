const fs = require('fs');

let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');
content = content.replace('export const perfumes = ', 'module.exports = ');
fs.writeFileSync('temp.js', content);

const perfumes = require('./temp.js');

const sampleNames = [
  "Rose Petal",
  "Citrus Zest",
  "Ocean Mist",
  "Mint Leaf",
  "Cinnamon Stick",
  "Lavender",
  "Opalescent Pearl",
  "Rich Flare Gold",
  "Midnight Black",
  "Crimson Rose",
  "Moss Green",
  "Coffee Bean",
  "Sky Blue",
  "Magenta Crystal",
  "Pearlescent White"
];

let index = 0;
for (const p of perfumes) {
  const cat = p.category ? p.category.toLowerCase() : '';
  if (cat.includes('tester') || cat.includes('sample')) {
    if (index < sampleNames.length) {
      p.name = sampleNames[index];
      // Update the URL to ensure it maps to the correct cropped grid image if needed
      // Actually they are already sample_set_grid_1.jpg ... sample_set_grid_15.jpg
      index++;
    }
  }
}

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync('src/data/perfumes.ts', newContent, 'utf8');
fs.unlinkSync('temp.js');
console.log('Successfully updated Sample Set product names!');
