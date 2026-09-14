const fs = require('fs');

let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');
content = content.replace('export const perfumes = ', 'module.exports = ');
fs.writeFileSync('temp.js', content);

const perfumes = require('./temp.js');

const prompts = {
  "Aurora Forest": "A luxury commercial photograph of an open gift box set floating weightlessly in mid-air. The gift box and bottles prominently feature the brand name 'Zero to One'. The contents (Aeternum Glow and Eternal Woods perfumes) levitate out of the box. Floating levitating elements: raw wooden oud chips, pine needles, and glowing golden dust. Pitch-black minimalist studio backdrop, strong rim lighting, photorealistic glass reflections, 8k resolution, cinematic commercial product photograph --ar 1:1",
  "Crystal Breeze": "A high-end luxury fragrance gift box advertisement. The gift box prominently displays the text 'Zero to One'. Featuring the open box and its floating 'Hidden Breeze' perfume and an attar vial in zero-gravity. Floating levitating elements: translucent crystal fragments, fresh white rose petals, and water droplets. Pitch-black minimalist studio backdrop, strong rim lighting, photorealistic glass reflections, 8k resolution --ar 1:1",
  "Crystal Vanilla": "A luxury commercial photograph of an open gift box set floating weightlessly in mid-air. The box and bottles explicitly say 'Zero to One'. Levitating around the box are 'Vanilla Dusk' and 'Amber Rose' fragrance bottles along with floating vanilla pods, golden amber resin specks, and warm light particles. Pitch-black minimalist studio backdrop, strong rim lighting, photorealistic glass textures, 8k resolution --ar 1:1",
  "Emerald Wood": "An anti-gravity luxury product shot of an open gift box set floating seamlessly in zero-gravity. The box is branded 'Zero to One'. The 'Dark Aura' and 'Emerald Vetiver' perfume bottles levitate alongside floating deep emerald wood chips, cedar bark, and subtle dark green fragrance mist wisps. Pitch-black minimalist backdrop, dramatic studio spotlighting, 8k resolution --ar 1:1",
  "CEO Bundle - For Him": "An edge-to-edge luxury product advertisement of a men's executive fragrance gift bundle floating in zero gravity. The premium dark box has 'Zero to One' printed in gold. The sleek dark bottles ('Executive Oud' and 'Midnight Tears') float in a structured levitating layout surrounded by floating dark leather strips and cardamom pods. Pitch-black studio background, crisp metallic textures, 8k render --ar 1:1",
  "Floral Duo": "A high-end commercial shot featuring two luxury perfume bottles ('Amber Rose' and 'Spring Blossom') floating side-by-side out of their gift box in zero gravity. The gift box clearly says 'Zero to One'. Delicate pink and white flower petals and soft fragrance mist particles drift weightlessly around them against a pitch-black minimalist studio backdrop, 8k resolution --ar 1:1",
  "Cool Breeze Duo": "An aquatic luxury fragrance duo floating effortlessly in zero gravity above an open gift box. Both the box and bottles feature the brand name 'Zero to One'. Floating levitating elements: clear sea salt crystals, water splashes, and luminous particles. Pitch-black minimalist studio background, high-contrast rim lighting, photorealistic 8k render --ar 1:1"
};

let count = 0;
for (const p of perfumes) {
  if (p.category === 'Gift Box' || p.category === 'Gifting') {
    let prompt = prompts[p.name];
    if (prompt) {
      let hash = 0;
      for (let i = 0; i < p.name.length; i++) {
        hash = p.name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const seed = Math.abs(hash);
      
      const encodedPrompt = encodeURIComponent(prompt);
      p.image = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
      p.image_url = p.image;
      count++;
    }
  }
}

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync('src/data/perfumes.ts', newContent, 'utf8');
fs.unlinkSync('temp.js');
console.log(`Updated images and bundles for ${count} Gift Box products with Zero to One branding.`);
