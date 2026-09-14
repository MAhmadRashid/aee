const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let content = fs.readFileSync(filePath, 'utf8');

const jsonStr = content.replace('export const perfumes = ', '').replace(/;\s*$/, '');
let perfumes = JSON.parse(jsonStr);

let count = 0;

perfumes = perfumes.map(p => {
  if (p.category === 'Classic Perfumes' || p.category === 'classic perfumes') {
    const prompt = `A modern high-end luxury perfume advertisement of a glass bottle labeled '${p.name}' levitating in mid-air. Glowing amber and dark moody background, floating golden dust particles, cinematic studio lighting, 8k photorealistic.`;
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 100000);
    const imgUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
    p.image = imgUrl;
    p.image_url = imgUrl;
    count++;
  }
  return p;
});

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Successfully updated ${count} Classic Perfumes with luxury dark theme prompts!`);
