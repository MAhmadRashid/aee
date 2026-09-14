const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processMistGrid() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/6b56431a-6a40-4ad1-b382-2516b3168d68/.user_uploaded/media_1788523220038.jpg';
    
    if (!fs.existsSync(inputPath)) {
        console.error("Input file not found at", inputPath);
        return;
    }

    try {
        const metadata = await sharp(inputPath).metadata();
        const width = metadata.width;
        const height = metadata.height;

        const cols = 3;
        const rows = 3;
        const sliceWidth = Math.floor(width / cols);
        const sliceHeight = Math.floor(height / rows);
        
        let counter = 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const leftOffset = c * sliceWidth;
                const topOffset = r * sliceHeight;
                
                const outputPath = path.join(__dirname, 'public', 'images', `body_mist_grid_${counter}.jpg`);
                
                await sharp(inputPath)
                    .extract({ left: leftOffset, top: topOffset, width: sliceWidth, height: sliceHeight })
                    .toFile(outputPath);
                    
                console.log(`Created body mist grid bottle: ${outputPath}`);
                counter++;
            }
        }
        
        console.log("Body Mist grid slicing complete!");
    } catch (error) {
        console.error("Error processing body mist grid image:", error);
    }
}

processMistGrid();
