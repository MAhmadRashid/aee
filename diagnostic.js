const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

try {
  const arrayStart = tsContent.indexOf('[');
  const arrayEnd = tsContent.lastIndexOf(']');
  const arrayStr = tsContent.substring(arrayStart, arrayEnd + 1);
  const perfumesArray = (new Function(`return ${arrayStr}`))();
  
  let validCats = [
    'Perfumes', 'Perfume Wax / Attar', 'Tester Box', 
    'Sample Sets', 'Body Mist', 'Air Care', 'Gift Box', 'Oud'
  ];

  let catCount = {};
  let imageCount = {};
  let errors = [];
  
  for (const product of perfumesArray) {
    catCount[product.category] = (catCount[product.category] || 0) + 1;
    imageCount[product.image] = (imageCount[product.image] || 0) + 1;
    
    if (!validCats.includes(product.category)) {
      errors.push(`Invalid category: ${product.category}`);
    }
    
    if (product.stock_quantity < 20) {
      errors.push(`Low stock for ${product.id}`);
    }
  }

  console.log("=== FINAL CONSISTENCY REPORT ===");
  console.log("Total Products:", perfumesArray.length);
  console.log("\nCategory Breakdown:");
  for (const [cat, count] of Object.entries(catCount)) {
    console.log(`- ${cat}: ${count} products`);
  }
  
  const uniqueImages = Object.keys(imageCount).length;
  console.log(`\nImages:\n- ${uniqueImages} unique images used across ${perfumesArray.length} products.`);
  
  if (errors.length > 0) {
    console.error("\nErrors Found:");
    errors.forEach(e => console.error(e));
  } else {
    console.log("\nStatus: All categories valid. No low stock items.");
  }

} catch (e) {
  console.error("Error evaluating or writing array:", e);
}
