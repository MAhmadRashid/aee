const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/6b56431a-6a40-4ad1-b382-2516b3168d68/.user_uploaded/media_1788521216683.jpg';
    
    // Check if input exists
    if (!fs.existsSync(inputPath)) {
        console.error("Input file not found at", inputPath);
        return;
    }

    try {
        const metadata = await sharp(inputPath).metadata();
        const width = metadata.width;
        const height = metadata.height;
        console.log(`Original image size: ${width}x${height}`);

        const numBottles = 10; // The image contains 10 distinct bottles
        const sliceWidth = Math.floor(width / numBottles);

        // We only need 7 for the 7 premium perfumes
        for (let i = 0; i < 7; i++) {
            const leftOffset = i * sliceWidth;
            const outputPath = path.join(__dirname, 'public', 'images', `premium_perfume_${i+1}.jpg`);
            
            // Extract the slice
            await sharp(inputPath)
                .extract({ left: leftOffset, top: 0, width: sliceWidth, height: height })
                .toFile(outputPath);
                
            console.log(`Created ${outputPath}`);
        }
        
        console.log("Image slicing complete!");
    } catch (error) {
        console.error("Error processing image:", error);
    }
}

processImage();
