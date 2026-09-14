const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
const newProductsPath = path.join(__dirname, 'new_48_products.json');

const newProducts = JSON.parse(fs.readFileSync(newProductsPath, 'utf8'));

let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

// The file exports `export const perfumes = [...]`
// We need to insert our new products into this array.
// Find the last closing bracket of the array `];`

const insertionIndex = tsContent.lastIndexOf('];');

if (insertionIndex !== -1) {
  // Convert new products to a string, remove the outer array brackets
  let newProductsStr = JSON.stringify(newProducts, null, 2);
  newProductsStr = newProductsStr.substring(1, newProductsStr.length - 1); // remove [ and ]
  
  // Also fix keys to not have quotes if we want valid TS, but JSON is valid TS.
  // We'll just insert a comma and the items before the `];`
  
  let newTsContent = tsContent.substring(0, insertionIndex);
  // Ensure there's a comma before adding new items
  if (!newTsContent.trim().endsWith(',')) {
    newTsContent += ',\n';
  }
  newTsContent += newProductsStr + '\n];';
  
  fs.writeFileSync(perfumesTsPath, newTsContent);
  console.log('Appended 48 products to src/data/perfumes.ts successfully');
} else {
  console.log('Could not find the end of the perfumes array');
}
