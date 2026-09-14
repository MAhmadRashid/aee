const fs = require('fs');

const perfumesCode = fs.readFileSync('src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_perfumes.js', perfumesCode);
const perfumes = require('./temp_perfumes.js');

let premiumCount = 0;

for (let p of perfumes) {
    if (p.category === 'Premium Perfumes') {
        premiumCount++;
        if (premiumCount <= 10) {
            p.image_url = '/images/premium_perfume_grid_' + premiumCount + '.jpg?v=' + Date.now();
            p.image = p.image_url;
        }
    }
}

fs.writeFileSync('src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(perfumes, null, 2) + ';\n');
fs.unlinkSync('temp_perfumes.js');
console.log("Assigned grid images to 10 Premium Perfumes!");
