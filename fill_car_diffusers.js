const fs = require('fs');

const p = fs.readFileSync('./src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_p.js', p);
let data = require('./temp_p.js');

const targetCategory = 'Car Diffusers / Car Perfumes';

// Remove existing items from this category if any
data = data.filter(x => x.category !== targetCategory && x.category !== 'Car Diffusers');

const names = ['Jasmine Car Diffuser', 'Oud Wood Diffuser', 'Ocean Breeze Diffuser', 'Citrus Blast Diffuser', 'Lavender Calm Diffuser'];

// Create 5 Car Diffusers
for (let i = 0; i < 5; i++) {
    data.push({
        id: Math.random().toString(36).substr(2, 9),
        name: names[i],
        description: 'Keep your car smelling fresh and luxurious.',
        price: 1200,
        compareAtPrice: 1500,
        category: targetCategory,
        image_url: `/images/car_diffuser.png?v=${Date.now()}`,
        image: `/images/car_diffuser.png?v=${Date.now()}`,
        sizes: ['8ml'],
        topNotes: [names[i].split(' ')[0]],
        middleNotes: ['Fresh'],
        baseNotes: ['Woody'],
        rating: 4.9,
        reviews: 45
    });
}

fs.writeFileSync('./src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(data, null, 2) + ';\n');
fs.unlinkSync('temp_p.js');
console.log('Car Diffusers items added correctly!');
