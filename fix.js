const fs = require('fs');
let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');

// Replace all brands with 'Zero To One'
content = content.replace(/brand:\s*'[^']+'/g, "brand: 'Zero To One'");

let parts = content.split('id:');
for (let i = 1; i < parts.length; i++) {
  if (parts[i].trim().startsWith("'aff-")) {
    parts[i] = parts[i].replace(/price:\s*(\d+)/g, (match, p) => {
      let num = parseInt(p, 10);
      if (num >= 5000) {
        return 'price: ' + (3500 + Math.floor(Math.random() * 1400));
      }
      return match;
    });
    
    let currentPriceMatch = parts[i].match(/price:\s*(\d+)/);
    if (currentPriceMatch) {
      let currentPrice = parseInt(currentPriceMatch[1], 10);
      parts[i] = parts[i].replace(/originalPrice:\s*(\d+)/g, (match, p) => {
        let op = parseInt(p, 10);
        if (op <= currentPrice) {
           return 'originalPrice: ' + (currentPrice + 1000);
        }
        return match;
      });
    }
  }
}

content = parts.join('id:');
fs.writeFileSync('src/data/perfumes.ts', content);
console.log('Updated prices and brands');
