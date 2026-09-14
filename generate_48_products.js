const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const perfumes = [];
const categories = {
  'Perfumes': { count: 15, priceRange: [2500, 9000], sizes: ['30ml', '50ml', '100ml'] },
  'Perfume Wax / Attar': { count: 8, priceRange: [800, 3000], sizes: ['3ml', '6ml', '12ml'] },
  'Tester Box': { count: 5, priceRange: [500, 1500], sizes: ['5x3ml'] },
  'Sample Sets': { count: 5, priceRange: [600, 2000], sizes: ['3x5ml'] },
  'Body Mist': { count: 5, priceRange: [700, 1800], sizes: ['150ml', '200ml'] },
  'Air Care': { count: 4, priceRange: [500, 1200], sizes: ['100ml', '250ml'] },
  'Gift Box': { count: 6, priceRange: [3500, 12000], sizes: ['One Size'] }
};

const words = {
  prefixes: ['Royal', 'Midnight', 'Golden', 'Desert', 'Mystic', 'Velvet', 'Shahi', 'Amber', 'Noir', 'Pure', 'Oud', 'Santal', 'Fleur', 'Zeenat', 'Safa', 'Aethel', 'Aeternum', 'Aurora', 'Emerald', 'Ruby', 'Sapphire', 'Opal', 'Pearl', 'Crystal'],
  suffixes: ['Elixir', 'Oud', 'Musk', 'Rose', 'Wood', 'Breeze', 'Nights', 'Majesty', 'Sultan', 'Riyasat', 'Noor', 'Jasmine', 'Vanilla', 'Leather', 'Spice', 'Glow', 'Blossom', 'Forest', 'Ocean', 'Tears', 'Petals']
};

const notes = {
  top: ['Bergamot', 'Lemon', 'Mandarin', 'Pink Pepper', 'Cardamom', 'Saffron', 'Lavender', 'Green Apple', 'Peach', 'Orange', 'Grapefruit', 'Neroli', 'Mint', 'Marine Notes'],
  middle: ['Jasmine', 'Rose', 'Tuberose', 'Ylang-Ylang', 'Cedarwood', 'Patchouli', 'Geranium', 'Nutmeg', 'Cinnamon', 'Freesia', 'Peony', 'Water Lily', 'Orchid'],
  base: ['Musk', 'Amber', 'Oud', 'Sandalwood', 'Vanilla', 'Tonka Bean', 'Leather', 'Vetiver', 'Oakmoss', 'Praline', 'White Woods', 'Tobacco', 'Ambergris']
};

const images = [
  '/images/luxury_perfume_bottle_1_1788340749010.jpg',
  '/images/luxury_oud_perfume_1788340783393.jpg',
  '/images/elegant_attar_bottle_1788340819742.jpg',
  '/images/gifting_perfume_box_1788340831147.jpg',
  '/images/lux_perfume_gold_1788341015227.jpg',
  '/images/lux_perfume_rose_1788341034384.jpg',
  '/images/lux_perfume_blue_1788341047539.jpg',
  '/images/lux_perfume_green_1788341246573.jpg',
  '/images/lux_perfume_white_1788341260242.jpg',
  '/images/lux_perfume_black_1788341271304.jpg',
  '/images/lux_perfume_attar_silver_1788341282939.jpg',
  '/images/lux_perfume_wax_1788341295831.jpg',
  '/images/lux_perfume_gift_white_1788341306556.jpg'
];

let generatedNames = new Set();
let generatedNotes = new Set();

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniqueName() {
  let name = "";
  let attempts = 0;
  do {
    name = `${getRandom(words.prefixes)} ${getRandom(words.suffixes)}`;
    attempts++;
  } while (generatedNames.has(name) && attempts < 100);
  generatedNames.add(name);
  return name;
}

function generateUniqueNotes() {
  let noteCombo = "";
  let top, mid, base;
  let attempts = 0;
  do {
    top = [getRandom(notes.top), getRandom(notes.top)];
    if(top[0]===top[1]) top[1] = getRandom(notes.top);
    mid = [getRandom(notes.middle), getRandom(notes.middle)];
    if(mid[0]===mid[1]) mid[1] = getRandom(notes.middle);
    base = [getRandom(notes.base), getRandom(notes.base)];
    if(base[0]===base[1]) base[1] = getRandom(notes.base);
    
    noteCombo = `${top.join('-')}_${mid.join('-')}_${base.join('-')}`;
    attempts++;
  } while (generatedNotes.has(noteCombo) && attempts < 100);
  generatedNotes.add(noteCombo);
  return { top, middle: mid, base };
}

let skuCounter = 1000;

for (const [category, meta] of Object.entries(categories)) {
  for (let i = 0; i < meta.count; i++) {
    const name = generateUniqueName();
    const id = name.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substr(2, 5);
    const sku = 'ZTO-' + skuCounter++;
    const price = getRandomInt(meta.priceRange[0]/100, meta.priceRange[1]/100) * 100;
    const discount = Math.random() > 0.7 ? getRandomInt(10, 30) : 0;
    const originalPrice = discount > 0 ? Math.round(price / (1 - discount/100)) : price;
    const n = generateUniqueNotes();
    const gender = getRandom(['Men', 'Women', 'Unisex']);
    
    const product = {
      id: id,
      name: name,
      brand: 'Zero To One',
      category: category,
      type: gender,
      tagline: `A captivating ${category.toLowerCase()} perfect for any occasion.`,
      price: price,
      originalPrice: originalPrice,
      rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      reviews: getRandomInt(10, 500),
      baseColor: '#000000',
      liquidColor: '#e0c097',
      capColor: '#d4af37',
      shapes: { bottle: 'rectangular', cap: 'round' },
      qualities: {
        longevity: '8+ hours',
        sillage: 'Moderate',
        season: 'All Seasons'
      },
      scentNotes: n,
      sizeVariants: [
        {
          size: getRandom(meta.sizes),
          price: price,
          originalPrice: originalPrice,
          stock: getRandomInt(10, 100)
        }
      ],
      image: getRandom(images),
      sku: sku,
      tags: ['new-arrival', getRandom(['bestseller', 'long-lasting', 'oriental', 'floral'])],
      discount_percentage: discount,
      stock_quantity: getRandomInt(10, 100)
    };

    if (category === 'Gift Box') {
      product.bundle_contents = [`50ml ${name} Perfume`, `15ml Attar`, 'Body Mist'];
      product.packaging_description = 'Premium matte black box with ribbon and magnetic closure.';
      product.occasion_tags = ['Eid', 'Wedding', 'Anniversary'];
      product.tagline = `The perfect gift set featuring ${name}.`;
    }

    perfumes.push(product);
  }
}

fs.writeFileSync('new_48_products.json', JSON.stringify(perfumes, null, 2));
console.log('Successfully generated 48 unique products!');
