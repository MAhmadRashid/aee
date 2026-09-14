const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let content = fs.readFileSync(filePath, 'utf8');

const jsonStr = content.replace('export const perfumes = ', '').replace(/;\s*$/, '');
let perfumes = JSON.parse(jsonStr);

const prompts = [
  "A hyper-realistic, 8k luxury product photograph of a gift box labeled 'Aurora Forest', floating weightlessly against a dark minimalist void. Suspended in zero gravity around the box are its contents: a 50ml glass perfume bottle, a 15ml attar vial, and a body mist. Floating raw wooden oud chips and luminous particle trails orbit the set. Cinematic studio rim lighting, photorealistic.",
  "An enigmatic luxury product photograph of a frosted clear gift box labeled 'Crystal Breeze' suspended mid-air. The complete set—50ml perfume, 15ml attar vial, and body mist—levitates seamlessly around it. Multiple translucent crystal fragments and fresh white rose petals drift weightlessly in zero gravity. Dark moody aesthetic, high-contrast studio spotlighting.",
  "A warm, luxurious fragrance gift bundle labeled 'Crystal Vanilla' floating effortslessly in zero gravity against a deep black backdrop. The box is slightly tilted, surrounded by floating contents: 50ml perfume, 15ml attar vial, and body mist. Levitating vanilla pods and golden amber specks orbit the set. High-contrast commercial lighting.",
  "A sophisticated, rich green gift box labeled 'Emerald Wood' levitating in zero gravity. Suspended weightlessly around it are the 50ml perfume, 15ml attar vial, and body mist. Floating deep emerald wood fragments and wisps of dark fragrance mist swirl weightlessly in the void. Ultra-detailed textures, 8k resolution.",
  "An edge, luxury product shot of an executive men's gift bundle labeled 'CEO Bundle - For Him' floating seamlessly against a dark slate background. Multiple sleek dark bottles (perfume, aftershave, shower gel) levitate in a structured zero-gravity arrangement. Cinematic spotlighting, ultra-sharp focus on metallic and matte black textures.",
  "A minimalist luxury product photograph featuring two elegant glass perfume bottles—the 'Floral Duo'—levitating in mid-air with an anti-gravity effect. Delicate white and pink floral petals drift upward around the bottles against a dark minimalist studio backdrop. Clean composition, crisp reflections, photorealistic 8k render.",
  "An aquatic luxury perfume duo, labeled 'Cool Breeze Duo', floating in zero gravity against a deep blue-black void. Floating clear water droplets, sea salt crystals, and soft luminescent particles orbit the bottles. Cinematic rim lighting, extremely detailed, photorealistic."
];

let promptIndex = 0;

perfumes = perfumes.map(p => {
  const isGiftBox = p.category && ['gift box', 'gift boxes', 'gift bundle', 'bundle'].includes(p.category.toLowerCase());
  
  if (isGiftBox) {
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
console.log(`Successfully updated ${promptIndex} Gift Box products with new specific prompts!`);
