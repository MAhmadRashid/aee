const sharp = require('sharp');
const path = require('path');

async function processImages() {
    const waxPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/6b56431a-6a40-4ad1-b382-2516b3168d68/.user_uploaded/media_1788524388325.png'; // 1024x559
    const attarPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/6b56431a-6a40-4ad1-b382-2516b3168d68/.user_uploaded/media_1788524674518.jpg'; // 768x1024
    
    try {
        // Wax: 3 cols, 2 rows
        const wCols = 3, wRows = 2;
        const wWidth = Math.floor(1024 / wCols);
        const wHeight = Math.floor(559 / wRows);
        
        let wCount = 1;
        for (let r = 0; r < wRows; r++) {
            for (let c = 0; c < wCols; c++) {
                if (wCount > 5) break; // User only wants 5
                
                const outPath = path.join(__dirname, 'public', 'images', `wax_grid_${wCount}.jpg`);
                await sharp(waxPath)
                    .extract({ left: c * wWidth, top: r * wHeight, width: wWidth, height: wHeight })
                    .jpeg()
                    .toFile(outPath);
                console.log(`Created wax image: ${outPath}`);
                wCount++;
            }
        }
        
        // Attar: 3 cols, 2 rows
        const aCols = 3, aRows = 2;
        const aWidth = Math.floor(768 / aCols);
        const aHeight = Math.floor(1024 / aRows);
        
        let aCount = 1;
        for (let r = 0; r < aRows; r++) {
            for (let c = 0; c < aCols; c++) {
                if (aCount > 6) break;
                
                const outPath = path.join(__dirname, 'public', 'images', `attar_grid_${aCount}.jpg`);
                await sharp(attarPath)
                    .extract({ left: c * aWidth, top: r * aHeight, width: aWidth, height: aHeight })
                    .jpeg()
                    .toFile(outPath);
                console.log(`Created attar image: ${outPath}`);
                aCount++;
            }
        }
        
        console.log("Slicing complete!");
    } catch (error) {
        console.error("Error processing images:", error);
    }
}

processImages();
