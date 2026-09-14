const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processSampleGrid() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/f212392c-1779-4a4d-9a9f-ad0967ed9d8a/.user_uploaded/media_1788728265728.jpg';
    
    try {
        const metadata = await sharp(inputPath).metadata();
        const cols = 5;
        const rows = 3;
        
        const gridWidth = metadata.width;
        const gridHeight = metadata.height;
        
        const sliceWidth = Math.floor(gridWidth / cols);
        const sliceHeight = Math.floor(gridHeight / rows);
        
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
    } catch (error) {
        console.error("Error processing sample sets image:", error);
    }
}

async function processOudGrid() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/f212392c-1779-4a4d-9a9f-ad0967ed9d8a/.user_uploaded/media_1788728451555.png';
    
    try {
        const metadata = await sharp(inputPath).metadata();
        const cols = 4;
        const rows = 3;
        
        // Let's assume the grid occupies the whole image evenly
        // Or if there is a margin, let's extract assuming even division
        const sliceWidth = Math.floor(metadata.width / cols);
        const sliceHeight = Math.floor(metadata.height / rows);
        
        let counter = 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const leftOffset = c * sliceWidth;
                const topOffset = r * sliceHeight;
                
                const outputPath = path.join(__dirname, 'public', 'images', `oud_perfume_grid_${counter}.jpg`);
                
                await sharp(inputPath)
                    .extract({ left: leftOffset, top: topOffset, width: sliceWidth, height: sliceHeight })
                    .jpeg()
                    .toFile(outputPath);
                    
                console.log(`Created oud bottle: ${outputPath}`);
                counter++;
            }
        }
        
        console.log("Oud slicing complete!");
    } catch (error) {
        console.error("Error processing oud image:", error);
    }
}

async function run() {
    await processSampleGrid();
    await processOudGrid();
}

run();
