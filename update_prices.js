const fs = require('fs');

let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');
const regex = /price:\s*(\d+)/g;
const origRegex = /originalPrice:\s*(\d+)/g;

content = content.replace(regex, (m, p1) => `price: ${Math.round(parseInt(p1) * 1.15)}`);
content = content.replace(origRegex, (m, p1) => `originalPrice: ${Math.round(parseInt(p1) * 1.15)}`);

fs.writeFileSync('src/data/perfumes.ts', content);
console.log('Prices updated by 15%');
