const fs = require('fs');
let c = fs.readFileSync('src/data/perfumes.ts', 'utf8');
const scriptContent = c.replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_perfumes.js', scriptContent);

const perfumes = require('./temp_perfumes.js');
let premiumCount = 0;
for (let p of perfumes) {
    if (p.category === 'Premium Perfumes') {
        premiumCount++;
        if (premiumCount <= 7) {
            p.image_url = '/images/premium_perfume_' + premiumCount + '.jpg?v=' + Date.now();
            p.image = p.image_url;
        }
    }
}

fs.writeFileSync('src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(perfumes, null, 2) + ';\n');
fs.unlinkSync('temp_perfumes.js');
console.log("Cache buster added!");
