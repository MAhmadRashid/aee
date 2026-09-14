const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The file starts with: export const perfumes = [ ... ];
// We can use a regex to extract the JSON array, parse it, update it, and write it back.
const jsonStr = content.replace('export const perfumes = ', '').replace(/;\s*$/, '');
let perfumes = JSON.parse(jsonStr);

const oudImages = [
  '/images/luxury_oud_perfume_1788340783393.jpg',
  '/images/desert_night_oud.jpg',
  '/images/royal_leather_oud.jpg',
  '/images/spicy_agarwood.jpg',
  '/images/vanilla_oud.jpg',
  '/images/oud_rosewood.jpg',
  '/images/lux_perfume_black_1788341271304.jpg'
];

let oudIndex = 0;

perfumes = perfumes.map(p => {
  if (p.category === 'Oud') {
    const img = oudImages[oudIndex % oudImages.length];
    oudIndex++;
    return { ...p, image: img, image_url: img };
  }
  
  // For sample sets, if they don't have individual images, maybe we can use pollintions placeholder or we can use the grid images but we don't know if grid images are collages.
  // The user says "ya oud or sample set ma yahi problem araha ha ka pictures alag alg nhi show ho rhi ha"
  // This means sample_set_grid_1.jpg etc are also collages!
  // Let's use Pollinations AI images for sample sets since we don't have specific individual sample set images in the public/images folder (except maybe some others).
  // Actually, I can use pollinations for sample sets:
  if (p.category === 'Sample Sets' || p.category === 'Tester Box') {
    const img = `https://image.pollinations.ai/prompt/luxury%20perfume%20sample%20vial%20discovery%20set%20minimalist%20black%20background%20photorealistic?width=800&height=1000&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
    return { ...p, image: img, image_url: img };
  }
  
  return p;
});

const newContent = `export const perfumes = ${JSON.stringify(perfumes, null, 2)};\n`;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated Oud and Sample Set images!');
