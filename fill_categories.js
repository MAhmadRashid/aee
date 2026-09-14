const fs = require('fs');

const p = fs.readFileSync('./src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_p.js', p);
let data = require('./temp_p.js');

function fillCategory(categoryName, targetCount, imagePrefix) {
    let items = data.filter(x => x.category === categoryName);
    let currentCount = items.length;
    
    // Fill if missing
    while (currentCount < targetCount) {
        let baseItem = items[currentCount % items.length];
        let newItem = JSON.parse(JSON.stringify(baseItem));
        newItem.id = Math.random().toString(36).substr(2, 9);
        newItem.name = `${categoryName.replace(' Perfumes', '')} Edition ${currentCount + 1}`;
        data.push(newItem);
        items.push(newItem);
        currentCount++;
    }
    
    // Assign images to the first `targetCount` items
    let updatedItems = data.filter(x => x.category === categoryName);
    for (let i = 0; i < targetCount; i++) {
        updatedItems[i].image_url = `/images/${imagePrefix}_${i + 1}.jpg?v=${Date.now()}`;
        updatedItems[i].image = updatedItems[i].image_url;
    }
}

fillCategory('Premium Perfumes', 10, 'premium_perfume_grid');
fillCategory('Classic Perfumes', 9, 'classic_perfume_grid');
fillCategory('Oud', 12, 'oud_perfume_grid');
fillCategory('Body Mist', 9, 'body_mist_grid');

fs.writeFileSync('./src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(data, null, 2) + ';\n');
fs.unlinkSync('temp_p.js');
console.log('Categories filled and images assigned correctly!');
