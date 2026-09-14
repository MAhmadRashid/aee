const { execSync } = require('child_process');
const fs = require('fs');

const scripts = [
  'assign_oud_grid.js',
  'assign_classic_grid.js',
  'assign_grid.js',
  'assign_mist_grid.js',
  'fill_sample_sets.js',
  'fill_wax_attar.js',
  'fill_car_diffusers.js',
  'fill_home_space.js'
];

for (const script of scripts) {
  try {
    console.log(`Running ${script}...`);
    execSync(`node ${script}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to run ${script}:`, e.message);
  }
}

// Now handle the remaining categories using the existing local images in assign_local_images
console.log("Running fallback assignment for Gift Boxes and others...");
const dataFile = './src/data/perfumes.ts';
let content = fs.readFileSync(dataFile, 'utf8').replace('export const perfumes =', 'module.exports =');
fs.writeFileSync('temp_p.js', content);
let perfumes = require('./temp_p.js');

const giftImages = [
  '/images/gifting_perfume_box_1788340831147.jpg',
  '/images/gift_blue_box_1788335469264.jpg',
  '/images/gift_green_box_1788335581533.jpg',
  '/images/gift_grey_box_1788335748290.jpg',
  '/images/gift_red_box_1788335521162.jpg',
  '/images/lux_perfume_gift_white_1788341306556.jpg',
  '/images/elegant_attar_bottle_1788340819742.jpg'
];

let giftIndex = 0;
for (const p of perfumes) {
  const isGift = p.category && p.category.toLowerCase().includes('gift');
  if (isGift) {
      p.image = giftImages[giftIndex % giftImages.length] + '?v=' + Date.now();
      p.image_url = p.image;
      giftIndex++;
  }
}

fs.writeFileSync('./src/data/perfumes.ts', 'export const perfumes = ' + JSON.stringify(perfumes, null, 2) + ';\n');
fs.unlinkSync('temp_p.js');
console.log("Restoration of all local images complete!");
