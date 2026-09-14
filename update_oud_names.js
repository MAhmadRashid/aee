const fs = require('fs');

let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');
content = content.replace('export const perfumes = ', 'module.exports = ');
fs.writeFileSync('temp.js', content);

const perfumes = require('./temp.js');

const oudNames = [
  "Oud Royal",
  "Oud Wood",
  "Creed Royal Oud",
  "Oud Assolu",
  "Maison Oud",
  "Mancera Aoud",
  "Montale Oud",
  "Oud Ispahan",
  "Atkinsons Oud",
  "Oud Palao Black",
  "Oud Palao White",
  "Oud Minerale"
];

let index = 0;
for (const p of perfumes) {
  const cat = p.category ? p.category.toLowerCase() : '';
  if (cat === 'oud') {
    if (index < oudNames.length) {
      p.name = oudNames[index];
      index++;
    }
  }
}

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync('src/data/perfumes.ts', newContent, 'utf8');
fs.unlinkSync('temp.js');
console.log('Successfully updated Oud product names!');
