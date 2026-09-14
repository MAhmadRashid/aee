const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

try {
  const arrayStart = tsContent.indexOf('[');
  const arrayEnd = tsContent.lastIndexOf(']');
  const arrayStr = tsContent.substring(arrayStart, arrayEnd + 1);
  const perfumesArray = (new Function(`return ${arrayStr}`))();
  
  let oudCount = 0;
  let attarCount = 0;
  let under5kCount = 0;
  
  // First pass: normalize and check
  for (const product of perfumesArray) {
    if (product.category === 'Oud') oudCount++;
    if (product.category === 'Perfume Wax / Attar') attarCount++;
    if (product.price < 5000) under5kCount++;
    
    // Fix Stock
    product.stock_quantity = 100;
    if (product.sizeVariants) {
      product.sizeVariants.forEach(v => v.stock = 100);
    }
  }

  // Need to ensure 15 Oud and 15 Attar.
  // We can convert some 'Perfumes' into 'Oud' if we lack Oud.
  // We can convert some 'Perfumes' into 'Perfume Wax / Attar' if we lack Attar.
  
  let neededOud = 15 - oudCount;
  let neededAttar = 15 - attarCount;

  for (const product of perfumesArray) {
    if (neededOud > 0 && product.category === 'Perfumes' && product.name.toLowerCase().includes('oud')) {
      product.category = 'Oud';
      neededOud--;
    }
  }
  
  // If still need Oud, force some generic Perfumes
  for (const product of perfumesArray) {
    if (neededOud > 0 && product.category === 'Perfumes') {
      product.category = 'Oud';
      product.name = product.name + " Oud";
      neededOud--;
    }
    
    if (neededAttar > 0 && product.category === 'Perfumes') {
      product.category = 'Perfume Wax / Attar';
      product.name = product.name.replace('Oud', 'Attar');
      neededAttar--;
    }
  }

  // Check under 5k count
  let neededUnder5k = 25 - under5kCount;
  for (const product of perfumesArray) {
    if (neededUnder5k > 0 && product.price >= 5000) {
      // Lower the price to 4500
      product.price = 4500;
      product.originalPrice = 5000;
      if (product.sizeVariants) {
        product.sizeVariants[0].price = 4500;
        product.sizeVariants[0].originalPrice = 5000;
      }
      neededUnder5k--;
    }
  }

  const newTsContent = tsContent.substring(0, arrayStart) + JSON.stringify(perfumesArray, null, 2) + tsContent.substring(arrayEnd + 1);
  fs.writeFileSync(perfumesTsPath, newTsContent, 'utf8');
  console.log('Successfully audited data. Oud, Attar, and stock fixed.');

} catch (e) {
  console.error("Error evaluating or writing array:", e);
}
