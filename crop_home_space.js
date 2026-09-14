const sharp = require('sharp');
const path = require('path');

async function processFragrances() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/16e71428-793d-4961-9b4b-7c44069b6bd0/.user_uploaded/media_1788530308698.jpg'; 
    
    try {
        const metadata = await sharp(inputPath).metadata();
        const cols = 3;
        const rows = 2;
        const sliceWidth = Math.floor(metadata.width / cols);
        const sliceHeight = Math.floor(metadata.height / rows);
        
        let count = 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const outPath = path.join(__dirname, 'public', 'images', `home_space_${count}.jpg`);
                await sharp(inputPath)
                    .extract({ left: c * sliceWidth, top: r * sliceHeight, width: sliceWidth, height: sliceHeight })
                    .jpeg()
                    .toFile(outPath);
                console.log(`Created image: ${outPath}`);
                count++;
            }
        }
        
        console.log("Slicing complete!");
    } catch (error) {
        console.error("Error processing images:", error);
    }
}

processFragrances();
