const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage() {
    const inputPath = 'C:/Users/DELL/.gemini/antigravity-ide/brain/6b56431a-6a40-4ad1-b382-2516b3168d68/.user_uploaded/media_1788521216683.jpg';
    
    if (!fs.existsSync(inputPath)) {
        console.error("Input file not found at", inputPath);
        return;
    }

    try {
        const metadata = await sharp(inputPath).metadata();
        const width = metadata.width;
        const height = metadata.height;

        const numBottles = 10;
        const sliceWidth = Math.floor(width / numBottles);
        
        // Target aspect ratio 4:5 to match ProductCard perfectly
        const targetWidth = Math.floor(height * (4/5));

        for (let i = 0; i < 7; i++) {
            const leftOffset = i * sliceWidth;
            
            // 1. Extract the sharp bottle
            const bottleSlice = await sharp(inputPath)
                .extract({ left: leftOffset, top: 0, width: sliceWidth, height: height })
                .toBuffer();
                
            // 2. Calculate background crop
            let bgLeft = Math.floor(leftOffset + sliceWidth/2 - targetWidth/2);
            if (bgLeft < 0) bgLeft = 0;
            if (bgLeft + targetWidth > width) bgLeft = width - targetWidth;
            
            // 3. Create blurred background
            const background = await sharp(inputPath)
                .extract({ left: bgLeft, top: 0, width: targetWidth, height: height })
                .blur(35) // Heavy blur
                .modulate({ brightness: 0.6 }) // Darken
                .toBuffer();
                
            // 4. Composite the sharp bottle onto the blurred background
            const bottleLeftOffset = Math.floor((targetWidth - sliceWidth) / 2);
            const outputPath = path.join(__dirname, 'public', 'images', `premium_perfume_${i+1}.jpg`);
            
            await sharp(background)
                .composite([{ input: bottleSlice, left: bottleLeftOffset, top: 0 }])
                .toFile(outputPath);
                
            console.log(`Created framed bottle: ${outputPath}`);
        }
        
        console.log("Image framing complete!");
    } catch (error) {
        console.error("Error processing image:", error);
    }
}

processImage();
