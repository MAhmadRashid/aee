const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputFile = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\f212392c-1779-4a4d-9a9f-ad0967ed9d8a\\.user_uploaded\\media_1788730195193.jpg';
const outputDir = path.join(__dirname, 'public', 'images');

async function processGrid() {
  if (!fs.existsSync(inputFile)) {
    console.error('Input file not found:', inputFile);
    return;
  }

  const metadata = await sharp(inputFile).metadata();
  const width = metadata.width;
  const height = metadata.height;
  
  // 3 columns, 5 rows
  const colWidth = Math.floor(width / 3);
  const rowHeight = Math.floor(height / 5);
  
  let count = 1;
  const newImages = [];
  
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      const left = col * colWidth;
      const top = row * rowHeight;
      const fileName = `sample_set_new_${count}.jpg`;
      const outputPath = path.join(outputDir, fileName);
      
      await sharp(inputFile)
        .extract({ left, top, width: colWidth, height: rowHeight })
        .toFile(outputPath);
        
      console.log(`Created ${fileName}`);
      newImages.push(`/images/${fileName}?v=${Date.now()}`);
      count++;
    }
  }

  // Update perfumes.ts
  const perfumesPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
  let data = fs.readFileSync(perfumesPath, 'utf8');
  
  // A bit hacky: read data into module
  const tempPath = path.join(__dirname, 'temp_perfumes.js');
  fs.writeFileSync(tempPath, data.replace('export const perfumes =', 'module.exports.perfumes ='));
  const { perfumes } = require('./temp_perfumes.js');
  fs.unlinkSync(tempPath);
  
  let imageIndex = 0;
  for (const p of perfumes) {
    if (p.category === 'Sample Sets' && imageIndex < newImages.length) {
      p.image = newImages[imageIndex];
      imageIndex++;
    }
  }
  
  fs.writeFileSync(perfumesPath, `export const perfumes = ${JSON.stringify(perfumes, null, 2)};`);
  console.log('Database updated.');
}

processGrid().catch(console.error);
