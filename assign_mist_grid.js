const fs = require('fs');

const perfumesCode = fs.readFileSync('src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_perfumes.js', perfumesCode);
const perfumes = require('./temp_perfumes.js');

let count = 0;

for (let p of perfumes) {
    if (p.category === 'Body Mist') {
        count++;
        if (count <= 9) {
            p.image_url = '/images/body_mist_grid_' + count + '.jpg?v=' + Date.now();
            p.image = p.image_url;
        }
    }
}

fs.writeFileSync('src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(perfumes, null, 2) + ';\n');
fs.unlinkSync('temp_perfumes.js');
console.log("Assigned grid images to 9 Body Mists!");
