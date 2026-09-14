const fs = require('fs');

const perfumesCode = fs.readFileSync('src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_perfumes.js', perfumesCode);
const perfumes = require('./temp_perfumes.js');

let classicCount = 0;

for (let p of perfumes) {
    if (p.category === 'Classic Perfumes') {
        classicCount++;
        if (classicCount <= 9) {
            p.image_url = '/images/classic_perfume_grid_' + classicCount + '.jpg?v=' + Date.now();
            p.image = p.image_url;
        }
    }
}

fs.writeFileSync('src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(perfumes, null, 2) + ';\n');
fs.unlinkSync('temp_perfumes.js');
console.log("Assigned grid images to 9 Classic Perfumes!");
