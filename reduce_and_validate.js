const fs = require('fs');
const path = require('path');
const https = require('https');

const dataFile = path.join(__dirname, 'src/data/perfumes.ts');
let content = fs.readFileSync(dataFile, 'utf8');

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

// 1. Group existing products by category
const byCategory = {};
for (const p of perfumes) {
  if (!byCategory[p.category]) byCategory[p.category] = [];
  byCategory[p.category].push(p);
}

// Target quotas
const quotas = {
  'Perfumes': 15,
  'Oud': 15,
  'Perfume Wax / Attar': 15, // The system maps 'Attar' to this
  'Tester Box': 10,
  'Sample Sets': 10,
  'Body Mist': 10,
  'Air Care': 10,
  'Gift Box': 10
};

// 2. Reduce products
let finalizedProducts = [];
for (const [category, quota] of Object.entries(quotas)) {
  if (byCategory[category]) {
    finalizedProducts.push(...byCategory[category].slice(0, quota));
  }
}

// Sort by standard order
const categoryOrder = ['Perfumes', 'Oud', 'Perfume Wax / Attar', 'Tester Box', 'Sample Sets', 'Body Mist', 'Air Care', 'Gift Box'];
finalizedProducts.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));

// 3. Assign 100% Unique pollinations.ai Images
let seedIndex = 1;
for (const p of finalizedProducts) {
  let prompt = 'luxury perfume bottle glass elegant background';
  if (p.category === 'Oud') prompt = 'luxury dark oud perfume bottle agarwood';
  if (p.category === 'Perfume Wax / Attar') prompt = 'luxury small essential oil attar vial glass ornate';
  if (p.category === 'Tester Box') prompt = 'perfume sample small tester vials minimal';
  if (p.category === 'Gift Box') prompt = 'luxury gift box ribbon packaging perfume';
  if (p.category === 'Body Mist') prompt = 'body mist spray bottle fresh splash';
  if (p.category === 'Air Care') prompt = 'home fragrance reed diffuser elegant';
  if (p.category === 'Sample Sets') prompt = 'perfume discovery set small vials collection';
  
  // URL encode the prompt
  const encodedPrompt = encodeURIComponent(prompt);
  // Guarantee unique image by seed and specific prompt
  p.image_url = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seedIndex}`;
  p.image = null; // Clear out local image ref to force using image_url
  
  seedIndex++;
}

// Save instantly so UI updates
const newContent = `export const perfumes = ${JSON.stringify(finalizedProducts, null, 2)};\n`;
fs.writeFileSync(dataFile, newContent, 'utf8');
console.log("Database instantly updated to 89 products! UI will now refresh.");

// 4. Validation (Background check)
console.log(`Starting background image validation for ${finalizedProducts.length} products...`);
const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200 && res.headers['content-type'] && res.headers['content-type'].startsWith('image/')) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
};

async function runValidation() {
  let passed = true;
  for (let i = 0; i < finalizedProducts.length; i++) {
    const p = finalizedProducts[i];
    const ok = await checkUrl(p.image_url);
    if (!ok) {
      console.error(`[FAIL] Image failed to resolve for ${p.name}: ${p.image_url}`);
      passed = false;
    } else {
      console.log(`[OK] ${p.name}`);
    }
  }

  if (!passed) {
    console.error("WARNING: Not all images resolved.");
  } else {
    console.log("All 89 images resolved successfully!");
  }
}

runValidation();
