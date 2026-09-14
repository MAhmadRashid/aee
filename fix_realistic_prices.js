const fs = require('fs');

let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');
content = content.replace('export const perfumes = ', 'module.exports = ');
fs.writeFileSync('temp.js', content);

const perfumes = require('./temp.js');

function getRandomPrice(min, max, step = 50) {
  const range = (max - min) / step;
  return min + Math.floor(Math.random() * range) * step;
}

perfumes.forEach(p => {
  const cat = p.category ? p.category.toLowerCase() : '';
  let min = 3000, max = 5000;
  
  if (cat.includes('oud')) {
    min = 8500; max = 18000;
  } else if (cat.includes('premium')) {
    min = 6000; max = 12000;
  } else if (cat.includes('classic')) {
    min = 3500; max = 5500;
  } else if (cat.includes('gift') || cat.includes('bundle')) {
    min = 10000; max = 25000;
  } else if (cat.includes('tester') || cat.includes('sample')) {
    min = 1500; max = 3500;
  } else if (cat.includes('attar') || cat.includes('wax')) {
    min = 1000; max = 2500;
  } else if (cat.includes('car')) {
    min = 800; max = 1500;
  } else if (cat.includes('home') || cat.includes('space')) {
    min = 1500; max = 3500;
  } else {
    min = 2500; max = 6500;
  }

  // Create deterministic pseudo-random price based on product ID/name so it's stable
  let hash = 0;
  for (let i = 0; i < p.name.length; i++) {
    hash = p.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const stableRandom = Math.abs(hash) / 2147483647; // 0 to 1
  
  const price = min + Math.floor(stableRandom * ((max - min) / 50)) * 50;
  
  p.price = price;
  
  // original price 10% to 25% higher
  const discountFactor = 1.1 + (stableRandom * 0.15); 
  p.originalPrice = Math.floor((price * discountFactor) / 50) * 50;

  // Also update size variants if they exist
  if (p.sizeVariants && p.sizeVariants.length > 0) {
    p.sizeVariants.forEach((v, index) => {
       const multiplier = (index + 1) * 0.8; 
       v.price = Math.floor((p.price * multiplier) / 50) * 50;
       v.originalPrice = Math.floor((p.originalPrice * multiplier) / 50) * 50;
    });
  }
});

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync('src/data/perfumes.ts', newContent, 'utf8');
fs.unlinkSync('temp.js');
console.log('Successfully assigned realistic and varied prices based on categories!');
