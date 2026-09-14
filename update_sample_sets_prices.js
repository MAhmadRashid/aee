const fs = require('fs');

let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');

// Find where perfumes array is exported
const exportStr = "export const perfumes = ";
const startIndex = content.indexOf(exportStr);

if (startIndex !== -1) {
    let jsonStr = content.substring(startIndex + exportStr.length);
    // Removing any trailing semicolon if exists at the end of the file
    jsonStr = jsonStr.trim();
    if(jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
    
    try {
        let data = eval(jsonStr);
        let updatedCount = 0;
        data.forEach(p => {
            if (p.category === 'Sample Sets' && p.price > 3000) {
                p.originalPrice = p.price; // Keep old price as original
                p.price = 2950; // Set to under 3000
                updatedCount++;
            }
        });
        
        let newContent = content.substring(0, startIndex + exportStr.length) + JSON.stringify(data, null, 2) + ';\n';
        fs.writeFileSync('src/data/perfumes.ts', newContent);
        console.log(`Successfully updated prices of ${updatedCount} Sample Sets to be under 3000.`);
    } catch(e) {
        console.log("Error parsing: " + e.message);
    }
} else {
    console.log("Could not find exported perfumes");
}
