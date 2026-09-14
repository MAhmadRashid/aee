const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let content = fs.readFileSync(filePath, 'utf8');

const jsonStr = content.replace('export const perfumes = ', '').replace(/;\s*$/, '');
let perfumes = JSON.parse(jsonStr);

const prompts = [
  "A hyper-realistic 8k luxury product shot of an elegant glass perfume bottle labeled 'Aeternum Glow' floating weightlessly against a deep dark minimalist background. The bottle emits a soft, faint inner gold glow. Cinematic studio rim lighting, photorealistic texture.",
  "An enigmatic luxury product photograph of a matte black perfume bottle labeled 'Dark Aura' suspended in zero gravity. Floating charcoal particles and dark smoke trails swirl slowly around it against a pitch-black backdrop. High-contrast commercial lighting.",
  "A rich luxury product photograph featuring a deep brown glass bottle labeled 'Eternal Woods' levitating seamlessly in mid-air. Multiple raw wooden oud chips and glowing golden amber specks orbit the bottle against a dark, moody background. Photorealistic 8k render.",
  "A dramatic luxury product shot of a dark blue glass perfume bottle labeled 'Midnight Tears' floating in zero gravity. Subtle, wispy light trails and glowing luminous particles drift weightlessly around the bottle. Minimalist dark studio backdrop, crisp reflections.",
  "A clean e-commerce luxury product shot of an elegant glass perfume bottle labeled 'Classic Edition 5' with silver accents, floating effortlessly against a dark slate background. Soft studio rim lighting, crisp focus on the text, high-resolution glass textures.",
  "An edge-to-edge luxury product shot of a minimalist perfume bottle labeled 'Classic Edition 6' floating in an anti-gravity chamber. Floating particles of dry incense and light gold dust swirl weightlessly. Pure black backdrop, high-contrast spotlighting.",
  "A sophisticated perfume commercial photograph showing a clear crystal glass bottle labeled 'Classic Edition 7' levitating in mid-air. Subtle levitating white floral petals and amber dust particles orbit the bottle against a dark minimalist background. Ultra-detailed, 8k.",
  "A minimalist luxury product photograph of a sleek perfume bottle labeled 'Classic Edition 8' suspended in zero gravity against a dark void. Level arrangement with small metallic fragments floating weightlessly in balance. Cinematic studio lighting, photorealistic.",
  "An elegant, anti-gravity commercial product shot of an elegant dark glass bottle labeled 'Classic Edition 9' floating in zero gravity. Subtle smoky trails and golden amber embers orbiting the bottle against a dark minimalist background. Ultra-detailed, 8k render."
];

let promptIndex = 0;

perfumes = perfumes.map(p => {
  const isClassic = p.category && ['classic perfumes', 'classic perfume'].includes(p.category.toLowerCase());
  
  if (isClassic) {
    if (promptIndex < prompts.length) {
      const prompt = prompts[promptIndex];
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 100000);
      const imgUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
      p.image = imgUrl;
      p.image_url = imgUrl;
      promptIndex++;
    }
  }
  return p;
});

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Successfully updated ${promptIndex} Classic Perfumes products with new specific prompts!`);
