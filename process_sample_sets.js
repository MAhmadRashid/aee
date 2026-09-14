const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processSampleGrid() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/f212392c-1779-4a4d-9a9f-ad0967ed9d8a/.user_uploaded/media_1788730195193.jpg';
    
    try {
        const metadata = await sharp(inputPath).metadata();
        const cols = 3;
        const rows = 5;
        
        const sliceWidth = Math.floor(metadata.width / cols);
        const sliceHeight = Math.floor(metadata.height / rows);
        
        let counter = 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const leftOffset = c * sliceWidth;
                const topOffset = r * sliceHeight;
                
                const outputPath = path.join(__dirname, 'public', 'images', `sample_set_grid_${counter}.jpg`);
                
                await sharp(inputPath)
                    .extract({ left: leftOffset, top: topOffset, width: sliceWidth, height: sliceHeight })
                    .jpeg()
                    .toFile(outputPath);
                    
                console.log(`Created sample set bottle: ${outputPath}`);
                counter++;
            }
        }
        
        console.log("Sample sets slicing complete!");
        
        // Update database
        let p = fs.readFileSync('src/data/perfumes.ts', 'utf8').replace('export const perfumes =', 'module.exports =');
        fs.writeFileSync('temp.js', p);
        let perfumes = require('./temp.js');
        
        const names = [
            "Lavender Breeze Sample Set",
            "Enchanted Forest Sample Set",
            "Citrus Sun Sample Set",
            "Warm Spice Sample Set",
            "Pure Linen Sample Set",
            "Deep Ocean Sample Set",
            "Autumn Woods Sample Set",
            "Antique Library Sample Set",
            "Winter Ice Sample Set",
            "Midnight Rose Sample Set",
            "Blooming Rose Sample Set",
            "Pearl Aura Sample Set",
            "Caramel Mocha Sample Set",
            "Crystal Amethyst Sample Set",
            "Desert Dune Sample Set"
        ];
        
        let sampleCount = 0;
        for (let pr of perfumes) {
            if (pr.category && (pr.category.toLowerCase().includes('sample') || pr.category.toLowerCase().includes('tester'))) {
                if (sampleCount < 15) {
                    pr.name = names[sampleCount];
                    pr.image = `/images/sample_set_grid_${sampleCount + 1}.jpg?v=${Date.now()}`;
                    pr.image_url = pr.image;
                    sampleCount++;
                }
            }
        }
        
        fs.writeFileSync('src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(perfumes, null, 2) + ';\n');
        fs.unlinkSync('temp.js');
        console.log('Successfully updated sample sets in DB!');
        
    } catch (error) {
        console.error("Error processing sample sets image:", error);
    }
}

processSampleGrid();
