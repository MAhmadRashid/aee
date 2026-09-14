const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

try {
  const arrayStart = tsContent.indexOf('[');
  const arrayEnd = tsContent.lastIndexOf(']');
  const arrayStr = tsContent.substring(arrayStart, arrayEnd + 1);
  const perfumesArray = (new Function(`return ${arrayStr}`))();
  
  const uniquePerfumes = [];
  const genericTerms = [
    "the journey of scent", 
    "the essence of oud", 
    "curated wellness", 
    "curated moments",
    "the perfect blend"
  ];

  let removedCount = 0;

  for (const product of perfumesArray) {
    const normalizedName = product.name.toLowerCase();
    
    // Check if it matches a generic term pattern
    const isGeneric = genericTerms.some(term => normalizedName.includes(term));

    if (isGeneric) {
      // It's a templated placeholder product, remove it
      removedCount++;
      continue;
    }

    // Remove "ZERO TO ONE" or "Zero To One" brand string
    if (product.brand && product.brand.toLowerCase() === 'zero to one') {
      product.brand = ''; // Set to empty or remove
    }

    uniquePerfumes.push(product);
  }

  console.log(`Cleaned up ${removedCount} generic/placeholder products.`);
  console.log(`Total remaining valid products: ${uniquePerfumes.length}`);

  const newTsContent = tsContent.substring(0, arrayStart) + JSON.stringify(uniquePerfumes, null, 2) + tsContent.substring(arrayEnd + 1);
  fs.writeFileSync(perfumesTsPath, newTsContent, 'utf8');
  console.log(`Successfully updated perfumes.ts.`);

} catch (e) {
  console.error("Error evaluating or writing array:", e);
}
