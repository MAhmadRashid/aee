const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

try {
  const arrayStart = tsContent.indexOf('[');
  const arrayEnd = tsContent.lastIndexOf(']');
  const arrayStr = tsContent.substring(arrayStart, arrayEnd + 1);
  const perfumesArray = (new Function(`return ${arrayStr}`))();

  const validCategories = [
    'Perfumes', 
    'Perfume Wax / Attar', 
    'Tester Box', 
    'Sample Sets', 
    'Body Mist', 
    'Air Care', 
    'Gift Box'
  ];

  for (const product of perfumesArray) {
    let cat = product.category;
    
    // Normalize aliases
    if (cat === 'Gifting') product.category = 'Gift Box';
    else if (cat === 'Perfume Wax' || cat === 'Attar') product.category = 'Perfume Wax / Attar';
    else if (cat === 'Sample Set') product.category = 'Sample Sets';
    else if (cat === 'Executive Range' || cat === 'Poetic Range') product.category = 'Perfumes'; // Default fallback
    
    if (!validCategories.includes(product.category)) {
      product.category = 'Perfumes'; // Ultimate fallback to prevent breakage
    }
  }

  const newTsContent = tsContent.substring(0, arrayStart) + JSON.stringify(perfumesArray, null, 2) + tsContent.substring(arrayEnd + 1);
  fs.writeFileSync(perfumesTsPath, newTsContent, 'utf8');
  console.log('Successfully normalized all product categories.');

} catch (e) {
  console.error("Error evaluating or writing array:", e);
}
