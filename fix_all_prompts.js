const fs = require('fs');

let code = fs.readFileSync('src/data/perfumes.ts', 'utf8');
code = code.replace('export const perfumes = ', 'module.exports = ');
fs.writeFileSync('temp.js', code);
let perfumes = require('./temp.js');

perfumes = perfumes.map(p => {
  const name = p.name;
  let prompt = "";
  
  if (p.category.toLowerCase().includes('oud')) {
    prompt = `A ultra-luxury perfume photograph of a dark glass bottle labeled '${name}' floating weightlessly in mid-air in zero gravity against a dark minimalist background. Floating gently around the bottle are levitating fresh floral petals and golden amber droplets. Cinematic studio rim lighting, 8k photorealistic render.`;
  } else if (p.category.toLowerCase().includes('sample') || p.category.toLowerCase().includes('tester')) {
    prompt = `A royal luxury perfume advertisement featuring sleek glass bottles labeled '${name}' floating seamlessly in zero gravity. Floating golden dust particles and subtle metallic ribbons orbit the bottles against a minimalist dark studio backdrop. High-contrast commercial lighting, 8k render.`;
  } else if (p.category.toLowerCase().includes('classic')) {
    prompt = `A hyper-realistic 8k luxury perfume photograph of an elegant glass perfume bottle labeled '${name}' floating weightlessly against a deep dark minimalist background. The bottle emits a soft, faint inner gold glow. Cinematic studio rim lighting, photorealistic texture.`;
  } else if (p.category.toLowerCase().includes('gift') || p.category.toLowerCase().includes('bundle')) {
    prompt = `A hyper-realistic, 8k luxury product photograph of a gift box labeled '${name}', floating weightlessly against a dark minimalist void. Suspended in zero gravity around the box are its contents. Floating raw wooden chips and luminous particle trails orbit the set. Cinematic studio rim lighting, photorealistic.`;
  } else {
    prompt = `A hyper-realistic 8k luxury perfume photograph of a beautiful glass bottle labeled '${name}' levitating against a dark aesthetic studio background. Glowing particles and soft smoke orbit the bottle. Professional lighting.`;
  }

  // Use a unique seed per product ID/Name to ensure caching consistency, avoiding purely random seeds
  // which might cause hydration issues or constant reloading
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);

  const encodedPrompt = encodeURIComponent(prompt);
  const imgUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
  
  p.image = imgUrl;
  p.image_url = imgUrl;
  
  return p;
});

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync('src/data/perfumes.ts', newContent, 'utf8');
console.log(`Fixed prompts for ${perfumes.length} products to ensure uniqueness and safe keywords.`);
