const fs = require('fs');

const dataPath = 'src/data/perfumes.ts';
let content = fs.readFileSync(dataPath, 'utf8');

// The file exports const perfumes = [ ... ]
// Let's parse the array, modify it, and write it back.
// Since it's a TS file with just an array export, we can evaluate it if we strip the export
const scriptContent = content.replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_perfumes.js', scriptContent);

const perfumes = require('./temp_perfumes.js');

let premiumCount = 0;
for (let i = 0; i < perfumes.length; i++) {
    if (perfumes[i].category === 'Premium Perfumes') {
        premiumCount++;
        if (premiumCount <= 7) {
            perfumes[i].image_url = `/images/premium_perfume_${premiumCount}.jpg`;
            perfumes[i].image = `/images/premium_perfume_${premiumCount}.jpg`;
        }
    }
}

// Convert back to string
const newContent = 'export const perfumes = ' + JSON.stringify(perfumes, null, 2) + ';\n';
fs.writeFileSync(dataPath, newContent);
fs.unlinkSync('temp_perfumes.js');
console.log("Updated perfumes.ts with premium images!");
