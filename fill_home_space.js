const fs = require('fs');

const p = fs.readFileSync('./src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_p.js', p);
let data = require('./temp_p.js');

const targetCategory = 'Home & Space Fragrances';

// Remove existing Air Care / Room Spray items
data = data.filter(x => x.category !== 'Air Care' && x.category !== 'Room Spray' && x.category !== targetCategory);

const names = ['Citrus & Bergamot', 'Lavender Fields', 'Sandalwood & Amber', 'Eucalyptus & Mint', 'Ocean Breeze'];

// Create 5 Home & Space items
for (let i = 0; i < 5; i++) {
    data.push({
        id: Math.random().toString(36).substr(2, 9),
        name: names[i],
        description: 'Elevate your space with this premium room spray.',
        price: 3000,
        compareAtPrice: 4000,
        category: targetCategory,
        image_url: `/images/home_space_${i + 1}.jpg?v=${Date.now()}`,
        image: `/images/home_space_${i + 1}.jpg?v=${Date.now()}`,
        sizes: ['250ml'],
        topNotes: [names[i].split(' & ')[0]],
        middleNotes: [names[i].split(' & ')[1] || 'Floral'],
        baseNotes: ['Musk'],
        rating: 5,
        reviews: 25
    });
}

fs.writeFileSync('./src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(data, null, 2) + ';\n');
fs.unlinkSync('temp_p.js');
console.log('Home & Space Fragrances items added correctly!');
