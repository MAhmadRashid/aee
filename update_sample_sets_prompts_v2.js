const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let content = fs.readFileSync(filePath, 'utf8');

const jsonStr = content.replace('export const perfumes = ', '').replace(/;\s*$/, '');
let perfumes = JSON.parse(jsonStr);

const prompts = [
  "A luxury pastel pink magnetic box containing 15 miniature crystal perfume bottles with clear floral liquids, surrounded by fresh white jasmine and rose petals, soft bright studio lighting.",
  "Sleek matte orange and gold sample box displaying 15 sleek glass vials, golden amber and yellow liquids, fresh orange slices and cinnamon sticks scattered around, vibrant photorealistic shot.",
  "Transparent acrylic gift box floating over clear blue water, holding 15 aqua-blue tinted sample vials, water droplets on glass, bright sunlight, clean aquatic aesthetic.",
  "Deep burgundy velvet-lined box with 15 gold-capped mini perfume bottles, vanilla pods and dark red roses in the background, warm cinematic lighting.",
  "Pastel-toned packaging displaying 15 glass sample tubes filled with warm golden and caramel-colored liquids, roasted coffee beans and dark chocolate accents around.",
  "Ultra-minimalist black wooden box with 15 monochromatic clear glass bottles, sharp typography, clean shadows, modern high-fashion product photography.",
  "Tan leather travel case unrolled to present 15 glass sample vials with brass caps, vintage aesthetic, warm earthy tones, dramatic soft shadows.",
  "White Carrara marble tray holding 15 frosted glass perfume vials, subtle gold foil labels, minimal clean layout, luxury lifestyle render.",
  "Deep green forest-themed box with 15 green-tinted mini spray bottles, resting on a bed of fresh moss and pine needles, natural soft sunlight.",
  "15 mini perfume bottles placed on black silk, each topped with a polished crystal cap (quartz, emerald, amethyst), glossy liquid reflections, 8k detail.",
  "Midnight blue box with constellation star patterns in gold foil, containing 15 deep blue and gold accent perfume vials, glowing background effect.",
  "Soft lilac box opening to reveal 15 clear glass roll-ons, surrounded by cherry blossoms and lavender flowers, airy and bright commercial photo.",
  "Rose-gold metallic presentation box with 15 gradient glass sample tubes, modern geometric design, high-contrast studio lighting.",
  "Dark mahogany wooden tray with 15 brass-accented perfume vials, dried saffron, cardamom, and star anise arranged gracefully, warm golden tones.",
  "Pure white matte gift box with 15 crystal-clear sample bottles, resting on folded white cotton fabric, soft natural backlight, clean minimal look."
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
console.log(`Successfully updated ${promptIndex} Sample Sets / Tester Box products with new specific prompts!`);
