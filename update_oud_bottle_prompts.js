const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let content = fs.readFileSync(filePath, 'utf8');

const jsonStr = content.replace('export const perfumes = ', '').replace(/;\s*$/, '');
let perfumes = JSON.parse(jsonStr);

const prompts = [
  "A luxury Oud perfume bottle shaped like an ornate golden Arabic Khanjar dagger, intricate filigree detail, rich dark amber liquid, glowing smoky background, highly detailed, photorealistic 8k.",
  "Modern geometric Oud perfume bottle shaped like a sleek obsidian pyramid, golden accents, soft purple and gold Oud smoke wafting around it, luxury studio lighting, dark velvet backdrop.",
  "An opulent Oud perfume bottle designed like an antique royal crown, emerald green glass with carved wood and gold elements, mystical dark smoke swirls, dramatic lighting.",
  "Organic Oud perfume bottle crafted to look like a piece of raw, twisted Agarwood bark, polished dark wood finish, golden oil droplets, earthy and deep forest ambiance, photorealistic.",
  "Elegant Oud perfume bottle in the shape of a sleek Crescent Moon and Islamic arch, deep ruby red glass with gold calligraphy, soft golden mist and glowing embers in the background.",
  "Minimalist luxury Oud bottle made of black marble with raw wooden base, gold metallic cap, clean lines, subtle wisps of incense smoke, high-end commercial style.",
  "Vintage Arabian Oud oil bottle, handcrafted brass and carved amber glass, antique finish, resting on a bed of dried roses and spices, cinematic lighting.",
  "Liquid gold Oud perfume bottle designed in a fluid, abstract flame shape, warm amber light reflecting through the glass, soft smokey atmosphere.",
  "Royal blue glass Oud perfume bottle with a massive diamond-cut top, gold trim, glowing incense smoke rising around it, luxury dark background.",
  "Modern hexagonal dark glass Oud bottle, golden honeycomb patterns, thick golden Oud oil dripping down the side, warm moody lighting.",
  "Heavy tall Oud perfume bottle encased in intricately carved dark teak wood, Middle Eastern Arabesque motifs, rich smoke effect, moody studio shot.",
  "Futuristic spherical Oud perfume bottle, dark smoky glass with floating golden flakes inside, floating over a bed of glowing Oud wood embers, 8k render."
];

let oudIndex = 0;

perfumes = perfumes.map(p => {
  if (p.category === 'Oud' || p.category === 'oud') {
    if (oudIndex < prompts.length) {
      const prompt = prompts[oudIndex];
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 100000);
      const imgUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
      p.image = imgUrl;
      p.image_url = imgUrl;
      oudIndex++;
    }
  }
  return p;
});

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Successfully updated ${oudIndex} Oud products with unique bottle shape prompts!`);
