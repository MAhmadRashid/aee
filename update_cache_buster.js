const fs = require('fs');

let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');
content = content.replace('export const perfumes = ', 'module.exports = ');
fs.writeFileSync('temp.js', content);

const perfumes = require('./temp.js');

for (const p of perfumes) {
  const cat = p.category ? p.category.toLowerCase() : '';
  if (cat === 'oud' || cat.includes('sample') || cat.includes('tester')) {
    if (p.image && p.image.includes('?v=')) {
      p.image = p.image.split('?v=')[0] + '?v=' + Date.now();
      p.image_url = p.image;
    } else if (p.image) {
      p.image = p.image + '?v=' + Date.now();
      p.image_url = p.image;
    }
  }
}

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync('src/data/perfumes.ts', newContent, 'utf8');
fs.unlinkSync('temp.js');
console.log('Successfully updated cache buster for Oud and Sample Sets images!');
