const sharp = require('sharp');
const path = require('path');

async function processSampleGrid() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/6b56431a-6a40-4ad1-b382-2516b3168d68/.user_uploaded/media_1788523388541.jpg';
    
    try {
        const cols = 5;
        const rows = 3;
        
        // Use full image dimensions
        const gridWidth = 1024;
        const gridHeight = 1024;
        
        // But add a slight crop to remove margins if needed, or just use full width
        // The bottles seem evenly spaced from edge to edge horizontally
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

processSampleGrid();
