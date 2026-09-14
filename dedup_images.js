const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

try {
  const arrayStart = tsContent.indexOf('[');
  const arrayEnd = tsContent.lastIndexOf(']');
  const arrayStr = tsContent.substring(arrayStart, arrayEnd + 1);
  const perfumesArray = (new Function(`return ${arrayStr}`))();
  
  // Deduplicate by IMAGE to ensure every product looks visually unique
  const uniquePerfumes = [];
  const seenImages = new Set();
  
  let duplicatesRemoved = 0;

  for (const product of perfumesArray) {
    if (seenImages.has(product.image)) {
      duplicatesRemoved++;
      continue;
    }
    seenImages.add(product.image);
    uniquePerfumes.push(product);
  }

  console.log(`Found and removed ${duplicatesRemoved} visually duplicated products (shared images).`);

  const newTsContent = tsContent.substring(0, arrayStart) + JSON.stringify(uniquePerfumes, null, 2) + tsContent.substring(arrayEnd + 1);
  fs.writeFileSync(perfumesTsPath, newTsContent, 'utf8');
  console.log(`Successfully updated perfumes.ts. Total unique products remaining: ${uniquePerfumes.length}`);

} catch (e) {
  console.error("Error evaluating or writing array:", e);
}
