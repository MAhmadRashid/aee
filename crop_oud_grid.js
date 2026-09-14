const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processOudGrid() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/6b56431a-6a40-4ad1-b382-2516b3168d68/.user_uploaded/media_1788522649786.png';
    
    if (!fs.existsSync(inputPath)) {
        console.error("Input file not found at", inputPath);
        return;
    }

    try {
        const cols = 4;
        const rows = 3;
        
        // The grid is not the full image. It's a central box.
        const gridLeft = 200;
        const gridTop = 50;
        const gridWidth = 624;
        const gridHeight = 450;

        const sliceWidth = Math.floor(gridWidth / cols);
        const sliceHeight = Math.floor(gridHeight / rows);
        
        let counter = 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const leftOffset = gridLeft + (c * sliceWidth);
                const topOffset = gridTop + (r * sliceHeight);
                
                const outputPath = path.join(__dirname, 'public', 'images', `oud_perfume_grid_${counter}.jpg`);
                
                await sharp(inputPath)
                    .extract({ left: leftOffset, top: topOffset, width: sliceWidth, height: sliceHeight })
                    .jpeg()
                    .toFile(outputPath);
                    
                console.log(`Created oud grid bottle: ${outputPath}`);
                counter++;
            }
        }
        
        console.log("Oud grid slicing complete with correct offsets!");
    } catch (error) {
        console.error("Error processing oud grid image:", error);
    }
}

processOudGrid();
