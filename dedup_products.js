const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

// The file should export an array called perfumes.
// Since it's a TS file with `export const perfumes = [...]`, parsing it natively is tricky, 
// so we'll evaluate it by stripping the `export const perfumes = ` part.

try {
  // Extract the array string
  const arrayStart = tsContent.indexOf('[');
  const arrayEnd = tsContent.lastIndexOf(']');
  if (arrayStart === -1 || arrayEnd === -1) {
    console.log("Could not find array brackets.");
    process.exit(1);
  }

  const arrayStr = tsContent.substring(arrayStart, arrayEnd + 1);
  
  // Try to parse using a flexible parser or Function
  const perfumesArray = (new Function(`return ${arrayStr}`))();
  
  // Deduplicate by id and name
  const uniquePerfumes = [];
  const seenIds = new Set();
  const seenNames = new Set();
  
  let duplicatesRemoved = 0;

  for (const product of perfumesArray) {
    // Treat names in lowercase to prevent case-sensitive duplicates
    const normalizedName = product.name.trim().toLowerCase();
    const id = product.id;

    if (seenIds.has(id) || seenNames.has(normalizedName)) {
      duplicatesRemoved++;
      continue;
    }

    seenIds.add(id);
    seenNames.add(normalizedName);
    uniquePerfumes.push(product);
  }

  console.log(`Found and removed ${duplicatesRemoved} duplicates.`);

  // Write back to the file
  const newTsContent = tsContent.substring(0, arrayStart) + JSON.stringify(uniquePerfumes, null, 2) + tsContent.substring(arrayEnd + 1);
  fs.writeFileSync(perfumesTsPath, newTsContent, 'utf8');
  console.log('Successfully updated perfumes.ts with deduplicated products.');

} catch (e) {
  console.error("Error evaluating or writing array:", e);
}
