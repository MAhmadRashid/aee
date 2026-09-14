const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src/data/perfumes.ts');
let content = fs.readFileSync(dataFile, 'utf8');

// Extract the perfumes array
const match = content.match(/export const perfumes = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not parse perfumes array");
  process.exit(1);
}

let perfumes;
try {
  perfumes = new Function('return ' + match[1])();
} catch(e) {
  console.error("Error evaluating array:", e);
  process.exit(1);
}

const requiredCounts = {
  'Perfumes': 25,
  'Tester Box': 25,
  'Gift Box': 10
};

const currentCounts = {};
perfumes.forEach(p => {
  currentCounts[p.category] = (currentCounts[p.category] || 0) + 1;
});

const namesUsed = new Set(perfumes.map(p => p.name.toLowerCase()));
const notesUsed = new Set(perfumes.map(p => {
  return [
    ...(p.fragrance_notes?.top || []), 
    ...(p.fragrance_notes?.middle || []), 
    ...(p.fragrance_notes?.base || [])
  ].join('-').toLowerCase();
}));
const descUsed = new Set(perfumes.map(p => (p.short_description || '').toLowerCase()));

// Generators for unique names, notes, and descriptions
const adjectives = ['Velvet', 'Midnight', 'Imperial', 'Luminous', 'Golden', 'Mystic', 'Sapphire', 'Celestial', 'Silent', 'Whispering', 'Eternal', 'Sacred', 'Noble', 'Hidden', 'Twilight', 'Crimson', 'Azure', 'Radiant', 'Dark', 'Serene', 'Wild', 'Pure'];
const nouns = ['Petals', 'Woods', 'Elixir', 'Aura', 'Nectar', 'Eclipse', 'Breeze', 'Horizon', 'Essence', 'Tears', 'Symphony', 'Mirage', 'Spices', 'Saffron', 'Roots', 'Oasis', 'Amber', 'Musk', 'Night', 'Dawn'];

const topPool = ['Bergamot', 'Lemon', 'Mandarin', 'Pink Pepper', 'Pear', 'Apple', 'Saffron', 'Cardamom', 'Lavender', 'Mint', 'Ginger', 'Grapefruit', 'Neroli', 'Plum', 'Blackcurrant'];
const midPool = ['Jasmine', 'Rose', 'Lily', 'Geranium', 'Ylang-Ylang', 'Orchid', 'Orange Blossom', 'Cinnamon', 'Nutmeg', 'Clove', 'Iris', 'Violet', 'Freesia', 'Peony'];
const basePool = ['Vanilla', 'Musk', 'Sandalwood', 'Cedarwood', 'Patchouli', 'Amber', 'Tonka Bean', 'Vetiver', 'Leather', 'Oakmoss', 'Incense', 'Oud', 'Guaiac Wood'];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUniqueName() {
  let name = '';
  let attempts = 0;
  do {
    name = `${getRandom(adjectives)} ${getRandom(nouns)}`;
    attempts++;
    if (attempts > 50) name += ` ${attempts}`; // fallback
  } while (namesUsed.has(name.toLowerCase()));
  namesUsed.add(name.toLowerCase());
  return name;
}

function generateUniqueNotes() {
  let notes = {};
  let sig = '';
  let attempts = 0;
  do {
    const t = getRandom(topPool);
    const m = getRandom(midPool);
    const b = getRandom(basePool);
    notes = { top: [t], middle: [m], base: [b] };
    sig = `${t}-${m}-${b}`.toLowerCase();
    attempts++;
    if (attempts > 100) sig += `-${attempts}`; // fallback
  } while(notesUsed.has(sig));
  notesUsed.add(sig);
  return notes;
}

function generateUniqueDesc(name) {
  return `A mesmerizing formulation of ${name}, crafted for true connoisseurs to leave an everlasting impression.`;
}

let newIdCounter = Math.max(...perfumes.map(p => parseInt(p.id) || 0)) + 1;

for (const [cat, req] of Object.entries(requiredCounts)) {
  let curr = currentCounts[cat] || 0;
  let countToGen = req - curr;
  
  for(let i=0; i<countToGen; i++) {
    const name = generateUniqueName();
    const notes = generateUniqueNotes();
    const desc = generateUniqueDesc(name);
    
    const price = cat === 'Perfumes' ? Math.floor(Math.random() * (9000 - 3000) + 3000) 
                 : cat === 'Tester Box' ? Math.floor(Math.random() * (1500 - 500) + 500)
                 : Math.floor(Math.random() * (12000 - 3500) + 3500); // Gift Box
                 
    const newProduct = {
      id: newIdCounter.toString(),
      product_id: name.toLowerCase().replace(/ /g, '-'),
      name: name,
      category: cat,
      gender: getRandom(['Men', 'Women', 'Unisex']),
      scent_family: 'Mixed',
      fragrance_notes: notes,
      short_description: desc,
      description: desc + " Experience the unparalleled quality and longevity.",
      price: price,
      original_price: Math.floor(price * 1.3),
      size: cat === 'Tester Box' ? '5ml' : '100ml',
      stock_quantity: 100,
      image_url: cat === 'Gift Box' 
        ? '/images/gifting_perfume_box_1788340831147.jpg' 
        : (cat === 'Tester Box' ? '/images/elegant_attar_bottle_1788340819742.jpg' : 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'),
      brand: 'Anti-Gravity Elegance'
    };
    perfumes.push(newProduct);
    newIdCounter++;
  }
}

// 2. Perform 100% Deduplication Check
const seenNames = new Set();
const deduplicatedPerfumes = [];
for (const p of perfumes) {
  if (!seenNames.has(p.name.toLowerCase())) {
    seenNames.add(p.name.toLowerCase());
    deduplicatedPerfumes.push(p);
  }
}

// 3. Category Ordering logic
const categoryOrder = [
  'Perfumes', 
  'Oud', 
  'Perfume Wax / Attar', 
  'Tester Box', 
  'Sample Sets', 
  'Body Mist', 
  'Air Care', 
  'Gift Box'
];

deduplicatedPerfumes.sort((a, b) => {
  const idxA = categoryOrder.indexOf(a.category);
  const idxB = categoryOrder.indexOf(b.category);
  const finalIdxA = idxA === -1 ? 99 : idxA;
  const finalIdxB = idxB === -1 ? 99 : idxB;
  
  if (finalIdxA !== finalIdxB) return finalIdxA - finalIdxB;
  return a.name.localeCompare(b.name);
});

const newContent = `export const perfumes = ${JSON.stringify(deduplicatedPerfumes, null, 2)};\n`;
fs.writeFileSync(dataFile, newContent, 'utf8');

console.log("Successfully generated missing products, deduplicated, and sorted the dataset.");
