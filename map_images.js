const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

try {
  const arrayStart = tsContent.indexOf('[');
  const arrayEnd = tsContent.lastIndexOf(']');
  const arrayStr = tsContent.substring(arrayStart, arrayEnd + 1);
  const perfumesArray = (new Function(`return ${arrayStr}`))();

  const imgPool = {
    'Gift Box': [
      '/images/gift_blue_box_1788335469264.jpg',
      '/images/gift_red_box_1788335521162.jpg',
      '/images/gift_green_box_1788335581533.jpg',
      '/images/gift_grey_box_1788335748290.jpg',
      '/images/gifting_perfume_box_1788340831147.jpg',
      '/images/lux_perfume_gift_white_1788341306556.jpg'
    ],
    'Perfume Wax / Attar': [
      '/images/elegant_attar_bottle_1788340819742.jpg',
      '/images/lux_perfume_attar_silver_1788341282939.jpg',
      '/images/lux_perfume_wax_1788341295831.jpg',
      '/images/media_1788337447965.jpg'
    ],
    'Oud': [
      '/images/luxury_oud_perfume_1788340783393.jpg',
      '/images/lux_perfume_gold_1788341015227.jpg',
      '/images/lux_perfume_black_1788341271304.jpg',
      '/images/media_1788337448047.jpg'
    ],
    'Perfumes': [
      '/images/luxury_perfume_bottle_1_1788340749010.jpg',
      '/images/lux_perfume_rose_1788341034384.jpg',
      '/images/lux_perfume_blue_1788341047539.jpg',
      '/images/lux_perfume_green_1788341246573.jpg',
      '/images/lux_perfume_white_1788341260242.jpg',
      '/images/media_1788334939951.jpg',
      '/images/media_1788334993119.jpg',
      '/images/media_1788335157913.jpg',
      '/images/media_1788335186091.jpg',
      '/images/media_1788335294355.jpg'
    ]
  };

  // Fallbacks for everything else
  const fallbackImages = imgPool['Perfumes'];

  let imageIndex = 0;

  for (const product of perfumesArray) {
    let pool = imgPool[product.category] || fallbackImages;
    // Map sequentially to maximize uniqueness
    product.image = pool[imageIndex % pool.length];
    imageIndex++;
  }

  const newTsContent = tsContent.substring(0, arrayStart) + JSON.stringify(perfumesArray, null, 2) + tsContent.substring(arrayEnd + 1);
  fs.writeFileSync(perfumesTsPath, newTsContent, 'utf8');
  console.log('Successfully assigned category-matched images.');

} catch (e) {
  console.error("Error evaluating or writing array:", e);
}
