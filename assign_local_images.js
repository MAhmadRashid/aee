const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src/data/perfumes.ts');
let content = fs.readFileSync(dataFile, 'utf8');

const match = content.match(/export const perfumes = (\[[\s\S]*\]);/);
if (!match) process.exit(1);

let perfumes = new Function('return ' + match[1])();

const allImages = [
  '/images/blush_peony.jpg',
  '/images/desert_night_oud.jpg',
  '/images/elegant_attar_bottle_1788340819742.jpg',
  '/images/gifting_perfume_box_1788340831147.jpg',
  '/images/gift_blue_box_1788335469264.jpg',
  '/images/gift_green_box_1788335581533.jpg',
  '/images/gift_grey_box_1788335748290.jpg',
  '/images/gift_red_box_1788335521162.jpg',
  '/images/golden_vanilla.jpg',
  '/images/green_tea_splash.jpg',
  '/images/luxury_oud_perfume_1788340783393.jpg',
  '/images/luxury_perfume_bottle_1_1788340749010.jpg',
  '/images/lux_perfume_attar_silver_1788341282939.jpg',
  '/images/lux_perfume_black_1788341271304.jpg',
  '/images/lux_perfume_blue_1788341047539.jpg',
  '/images/lux_perfume_gift_white_1788341306556.jpg',
  '/images/lux_perfume_gold_1788341015227.jpg',
  '/images/lux_perfume_green_1788341246573.jpg',
  '/images/lux_perfume_rose_1788341034384.jpg',
  '/images/lux_perfume_wax_1788341295831.jpg',
  '/images/lux_perfume_white_1788341260242.jpg',
  '/images/midnight_blue.jpg',
  '/images/oud_rosewood.jpg',
  '/images/royal_leather_oud.jpg',
  '/images/spicy_agarwood.jpg',
  '/images/vanilla_oud.jpg',
  '/images/velvet_orchid.jpg'
];

// Helper to pick image deterministically based on name
function getSeededImage(name, pool) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return pool[Math.abs(hash) % pool.length];
}

for (const p of perfumes) {
  let pool = allImages;
  
  if (p.category === 'Oud') {
    pool = allImages.filter(img => img.includes('oud') || img.includes('black') || img.includes('midnight'));
  } else if (p.category === 'Gift Box' || p.category === 'Gifting') {
    pool = allImages.filter(img => img.includes('gift'));
  } else if (p.category === 'Perfume Wax / Attar' || p.category === 'Attar') {
    pool = allImages.filter(img => img.includes('attar') || img.includes('wax'));
  } else {
    pool = allImages.filter(img => !img.includes('gift') && !img.includes('attar') && !img.includes('wax') && !img.includes('oud'));
  }
  
  if (pool.length === 0) pool = allImages;
  
  p.image = getSeededImage(p.name, pool);
}

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync(dataFile, newContent, 'utf8');
console.log("Successfully assigned local images!");
