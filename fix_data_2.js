const fs = require('fs');

const pool = [
  '/images/luxury_perfume_bottle_1_1788340749010.jpg',
  '/images/luxury_oud_perfume_1788340783393.jpg',
  '/images/elegant_attar_bottle_1788340819742.jpg',
  '/images/gifting_perfume_box_1788340831147.jpg',
  '/images/desert_night_oud.jpg',
  '/images/golden_vanilla.jpg',
  '/images/green_tea_splash.jpg',
  '/images/midnight_blue.jpg',
  '/images/oud_rosewood.jpg',
  '/images/spicy_agarwood.jpg',
  '/images/vanilla_oud.jpg',
  '/images/velvet_orchid.jpg',
  '/images/blush_peony.jpg',
  '/images/royal_leather_oud.jpg',
  '/images/gift_blue_box.jpg',
  '/images/gift_purple_box.jpg',
  '/images/gift_red_box.jpg',
  '/images/gift_green_box.jpg',
  '/images/gift_grey_box.jpg',
];

let content = fs.readFileSync('src/data/perfumes.ts', 'utf8');

// Replace ALL image strings with local luxury ones
let index = 0;
content = content.replace(/image: '([^']+)'/g, (match, p1) => {
  const newImage = pool[index % pool.length];
  index++;
  return `image: '${newImage}'`;
});

fs.writeFileSync('src/data/perfumes.ts', content);
console.log('Updated perfumes.ts entirely with elegant local images!');
