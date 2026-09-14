const fs = require('fs');

const p = fs.readFileSync('./src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_p.js', p);
let data = require('./temp_p.js');

const targetCategory = 'Perfume Wax / Attar';

// Remove existing items from this category
data = data.filter(x => x.category !== targetCategory && x.category !== 'Attar');

// Create 5 Wax items
for (let i = 0; i < 5; i++) {
    data.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `Perfume Wax Edition ${i + 1}`,
        description: 'Solid perfume wax for a lasting scent.',
        price: 2500,
        compareAtPrice: 3500,
        category: targetCategory,
        image_url: `/images/wax_grid_${i + 1}.jpg?v=${Date.now()}`,
        image: `/images/wax_grid_${i + 1}.jpg?v=${Date.now()}`,
        sizes: ['30g'],
        topNotes: ['Jasmine', 'Rose'],
        middleNotes: ['Sandalwood'],
        baseNotes: ['Amber'],
        rating: 5,
        reviews: 10
    });
}

// Create 6 Attar items
for (let i = 0; i < 6; i++) {
    data.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `Traditional Attar Edition ${i + 1}`,
        description: 'Alcohol-free concentrated attar.',
        price: 1500,
        compareAtPrice: 2000,
        category: targetCategory,
        image_url: `/images/attar_grid_${i + 1}.jpg?v=${Date.now()}`,
        image: `/images/attar_grid_${i + 1}.jpg?v=${Date.now()}`,
        sizes: ['6ml'],
        topNotes: ['Oud', 'Saffron'],
        middleNotes: ['Rose'],
        baseNotes: ['Musk'],
        rating: 4.8,
        reviews: 20
    });
}

fs.writeFileSync('./src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(data, null, 2) + ';\n');
fs.unlinkSync('temp_p.js');
console.log('Perfume Wax and Attar items added correctly!');
