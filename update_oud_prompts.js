const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let content = fs.readFileSync(filePath, 'utf8');

const jsonStr = content.replace('export const perfumes = ', '').replace(/;\s*$/, '');
let perfumes = JSON.parse(jsonStr);

const prompts = [
  "A luxury perfume photograph of a rich amber glass bottle labeled 'Amber Blossom Oud' floating weightlessly in zero gravity against a dark minimalist background. Floating gently around the bottle are levitating fresh floral petals and translucent golden amber droplets. Soft studio rim lighting, cinematic 8k photorealistic render.",
  "An edge, luxury product shot of a sleek matte black bottle labeled 'Catch 22 Oud' suspended in mid-air in an anti-gravity chamber. Subtle smoke trails and floating silver metallic dust swirl weightlessly around the bottle. Dark mood lighting, hyper-realistic glass textures, 8k resolution.",
  "A ultra-luxurious product photograph of a clear crystal perfume bottle labeled 'Crystal Forest Oud' floating seamlessly in mid-air. Levitating weightlessly around the bottle are pine needles, green apple slices, and raw oud wood. Dark forest aesthetic, cinematic studio spotlighting, photorealistic.",
  "A high-end perfume advertisement featuring a deep emerald-tinted glass bottle labeled 'Emerald Jasmine Oud' levitating in zero gravity. Floating white jasmine flowers and golden mist particles frame the bottle. Dark elegant background, high contrast lighting, ultra-detailed render.",
  "A royal luxury perfume bottle labeled 'Iqbal Oud' with intricate gold detailing, floating effortlessly in an anti-gravity environment. Floating golden dust particles and raw wooden oud chips levitate around it. Rich dark backdrop, dramatic commercial studio lighting, 8k resolution.",
  "A mysterious product shot of a midnight-blue perfume bottle labeled 'Midnight Noor Oud' floating in mid-air. A faint, glowing moonlight aura and levitating luminous specks surround the bottle against a pitch-black background. High-end luxury fragrance advertising style.",
  "A regal black matte perfume bottle labeled 'Noir Majesty Oud' suspended weightlessly in dark zero-gravity space. Floating golden crown-like particles and dark rose petals swirl slowly around it. Premium luxury lighting, strong rim light, photorealistic.",
  "A modern minimalist rectangular perfume bottle labeled 'Oud Edition 8' with a metallic cap floating in zero gravity against a dark slate backdrop. Floating droplets of liquid gold and fine mist levitate in the air. Clean luxury product design, 8k resolution.",
  "A luxurious glass perfume bottle labeled 'Oud Edition 9' floating mid-air with an anti-gravity effect. Levitating raw spices, cinnamon bark, and golden amber specks surround the bottle against a dark reflective studio backdrop. High-contrast commercial lighting.",
  "A premium white rectangular perfume bottle labeled 'Oud Edition 10' floating weightlessly in mid-air. Subtle levitating white floral petals and glowing particle dust drift upward around the bottle. Dark luxury backdrop, ultra-photorealistic studio render.",
  "A luxury 8k product photograph of a white rectangular perfume bottle labeled 'Oud Edition 11' with a gold cap, floating weightlessly against a rich dark background. Levitation effect with subtle floating amber particles. Soft rim lighting, high-end fragrance style.",
  "An anti-gravity commercial product shot of an elegant dark glass bottle labeled 'Oud Edition 12' suspended in zero gravity. Floating smoky oud wood particles and glowing golden embers orbit the bottle against a dark minimalist background. Ultra-detailed, 8k."
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
console.log(`Successfully updated ${oudIndex} Oud products with new prompts!`);
