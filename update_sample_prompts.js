const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let content = fs.readFileSync(filePath, 'utf8');

const jsonStr = content.replace('export const perfumes = ', '').replace(/;\s*$/, '');
let perfumes = JSON.parse(jsonStr);

const prompts = [
  "A ultra-luxury product photograph of an elegant clear glass elixir perfume bottle labeled 'Aethel Elixir' weightlessly floating in mid-air against a rich dark background. Levitation effect with glowing golden light trails and floating liquid droplets around the bottle. Cinematic studio rim lighting, 8k resolution, photorealistic.",
  "A royal luxury perfume advertisement featuring two sleek dark glass bottles labeled 'Aethel Sultan' floating seamlessly in zero gravity. Floating golden dust particles and subtle metallic ribbons orbit the bottles against a minimalist dark studio backdrop. High-contrast commercial lighting, 8k render.",
  "A high-end luxury product shot of a 5-piece perfume discovery set floating in zero gravity. Five sleek miniature glass fragrance bottles arranged in a balanced levitating arc against a dark minimalist background. Soft studio rim lighting, crisp glass reflections, ultra-detailed, photorealistic 8k.",
  "A luxury perfume advertisement featuring a clear crystal bottle labeled 'Emerald Petals' floating in mid-air. Levitating emerald-green floral petals and fine mist droplets float weightlessly around the bottle against a dark moody studio background. High-contrast lighting, 8k photorealistic render.",
  "An anti-gravity commercial product shot of an executive miniature fragrance collection. Multiple premium miniature perfume bottles floating in a structured zero-gravity layout against a dark slate backdrop. Cinematic spotlighting, ultra-detailed metallic accents, 8k resolution.",
  "A rich luxury product photograph of miniature oud perfume bottles suspended in zero gravity. Floating raw wooden oud chips, glowing golden embers, and light smoke trails surround the floating bottles against a deep dark background. High-end fragrance advertisement style.",
  "A sophisticated perfume shot of a clear glass bottle labeled 'Pearl Breeze' levitating in mid-air with an anti-gravity effect. Weightless floating pearl-like mist particles and soft luminescent light float around the bottle against a dark minimalist studio backdrop. 8k photorealistic.",
  "A minimalist luxury product photograph of a sample set box with miniature perfume bottles floating weightlessly out of the box in zero gravity. Dark aesthetic background, floating gold particle dust, cinematic rim lighting, 8k resolution.",
  "A modern high-end product shot of a luxury fragrance sample collection floating in an anti-gravity chamber. Sleek clear bottles with metallic caps levitating against a dark, subtle backdrop with soft reflections and ambient studio light. 8k photorealistic render.",
  "A commercial perfume advertisement showing a luxury discovery sample set floating seamlessly in mid-air. Subtle levitating white floral petals and amber dust particles orbit the set against a dark minimalist studio backdrop. Ultra-detailed, 8k.",
  "A hyper-realistic 8k product photograph of a sample set labeled 'Edition 11' floating weightlessly in zero gravity. Levitating liquid gold droplets and ambient light specks floating around the bottles against a rich dark background. Soft rim lighting.",
  "An elegant anti-gravity fragrance product shot showing miniature sample bottles floating in mid-air. Subtle smoky trails and golden particles swirling weightlessly around the bottles against a dark matte backdrop. High-contrast commercial lighting.",
  "A luxury fragrance sample set suspended in zero gravity with floating raw scent ingredients like citrus peels and rose petals drifting upward. Minimalist dark studio backdrop, crisp glass texture, dramatic spotlighting, 8k resolution.",
  "A high-end product shot of a minimalist perfume sample set levitating effortlessly in mid-air. Fine mist particles and glowing specks floating around the bottles against a deep black backdrop. Cinematic studio lighting, photorealistic.",
  "A ultra-luxurious 8k commercial photograph of a fragrance sample set floating in zero gravity. Elegant glass bottles with gold caps angled slightly, surrounded by weightless floating dust particles. Dark background, strong rim lighting, photorealistic."
];

let promptIndex = 0;

perfumes = perfumes.map(p => {
  const isSample = p.category && ['tester box', 'sample sets', 'sample set'].includes(p.category.toLowerCase());
  
  if (isSample) {
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
console.log(`Successfully updated ${promptIndex} Sample Sets / Tester Box products with new prompts!`);
