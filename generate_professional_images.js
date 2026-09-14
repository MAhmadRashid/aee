const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src/data/perfumes.ts');
let content = fs.readFileSync(dataFile, 'utf8');

const match = content.match(/export const perfumes = (\[[\s\S]*\]);/);
if (!match) process.exit(1);

let perfumes = new Function('return ' + match[1])();

let index = 1;

for (const p of perfumes) {
  // Clear the local image so it falls back to image_url
  p.image = null;
  
  let basePrompt = '';
  
  if (p.category === 'Oud') {
    basePrompt = 'dark smoky luxury oud arabian perfume bottle';
  } else if (p.category === 'Perfume Wax / Attar' || p.category === 'Attar') {
    basePrompt = 'small ornate concentrated perfume oil attar glass bottle';
  } else if (p.category === 'Premium Perfumes') {
    basePrompt = 'high-end luxury exclusive designer perfume bottle crystal';
  } else if (p.category === 'Classic Perfumes' || p.category === 'Simple') {
    basePrompt = 'simple minimalist elegant classic clear perfume bottle';
  } else if (p.category === 'Tester Box') {
    basePrompt = 'perfume tester vial discovery set collection minimalist';
  } else if (p.category === 'Gift Box') {
    basePrompt = 'luxurious perfume gift box presentation elegant packaging';
  } else if (p.category === 'Body Mist') {
    basePrompt = 'tall plastic body mist spray bottle fresh';
  } else {
    basePrompt = 'elegant perfume bottle';
  }

  // Include color and shape for extra distinctness
  const liquidColorStr = p.liquidColor ? ` with ${p.liquidColor.replace('#', '')} color liquid` : '';
  const capColorStr = p.capColor ? ` and ${p.capColor.replace('#', '')} colored cap` : '';
  const shapeStr = p.shapes?.bottle ? ` ${p.shapes.bottle} shape` : '';

  // Combine into a professional prompt
  const fullPrompt = `${basePrompt} ${shapeStr}${liquidColorStr}${capColorStr}, highly detailed professional studio product photography, clean background, 8k resolution, photorealistic`;

  // Use a completely distinct seed for every product to ensure no duplicates
  p.image_url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=800&height=1000&nologo=true&seed=${index * 1337}`;
  
  index++;
}

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync(dataFile, newContent, 'utf8');
console.log("Successfully generated unique professional AI URLs for all products!");
