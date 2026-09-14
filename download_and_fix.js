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

// Target quotas: exactly 7 per category
const quotas = {
  'Perfumes': 7,
  'Oud': 7,
  'Perfume Wax / Attar': 7,
  'Tester Box': 7,
  'Sample Sets': 7,
  'Body Mist': 7,
  'Air Care': 7,
  'Gift Box': 7
};

// 2. Reduce products and adjust prices (Affordable + Premium mix)
let finalizedProducts = [];
for (const [category, quota] of Object.entries(quotas)) {
  if (byCategory[category]) {
    const items = byCategory[category].slice(0, quota);
    
    // Vary prices to include affordable options
    items.forEach((item, index) => {
      if (index % 3 === 0) {
        // Affordable
        item.price = 1500 + (Math.floor(Math.random() * 10) * 100);
        item.originalPrice = item.price + 500;
      } else if (index % 3 === 1) {
        // Mid-range
        item.price = 3500 + (Math.floor(Math.random() * 15) * 100);
        item.originalPrice = item.price + 1000;
      } else {
        // Premium
        item.price = 7000 + (Math.floor(Math.random() * 50) * 100);
        item.originalPrice = item.price + 2000;
      }
      
      // Update variants if they exist
      if (item.sizeVariants && item.sizeVariants.length > 0) {
        item.sizeVariants[0].price = item.price;
        item.sizeVariants[0].originalPrice = item.originalPrice;
      }
    });
    
    finalizedProducts.push(...items);
  }
}

// Sort by standard order
const categoryOrder = ['Perfumes', 'Oud', 'Perfume Wax / Attar', 'Tester Box', 'Sample Sets', 'Body Mist', 'Air Care', 'Gift Box'];
finalizedProducts.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));

// Helper to download image with retry and delay
const downloadImage = (url, filepath, retries = 3) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else if (res.statusCode === 429 && retries > 0) {
        console.log(`Rate limited (429). Retrying in 5 seconds... (${retries} left)`);
        setTimeout(() => {
          resolve(downloadImage(url, filepath, retries - 1));
        }, 5000);
      } else {
        console.error(`Failed to download: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(err);
      resolve(false);
    });
  });
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function processImages() {
  console.log(`Processing ${finalizedProducts.length} products... downloading images locally with rate-limit protection!`);
  
  const publicImagesDir = path.join(__dirname, 'public/images/products');
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  let seedIndex = 1;
  for (const p of finalizedProducts) {
    let prompt = 'luxury dark glass perfume bottle professional photography neutral background cinematic lighting';
    if (p.category === 'Oud') prompt = 'premium oud bottle dark wood background rich colors professional photography';
    if (p.category === 'Perfume Wax / Attar') prompt = 'elegant small glass attar oil vial gold accents professional photography';
    if (p.category === 'Tester Box') prompt = 'collection of small perfume tester vials elegant professional photography';
    if (p.category === 'Gift Box') prompt = 'luxury premium gift box tied with ribbon professional photography';
    if (p.category === 'Body Mist') prompt = 'elegant tall body mist spray bottle fresh background professional photography';
    if (p.category === 'Air Care') prompt = 'luxury home reed diffuser elegant bottle professional photography';
    if (p.category === 'Sample Sets') prompt = 'luxury perfume discovery set small bottles elegant box professional photography';
    
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seedIndex}&width=800&height=800`;
    
    const filename = `${p.id}_${seedIndex}.jpg`;
    const localPath = path.join(publicImagesDir, filename);
    const publicPath = `/images/products/${filename}`;
    
    // Only download if it doesn't already exist (to save time on re-runs)
    if (!fs.existsSync(localPath)) {
      console.log(`Downloading image for ${p.name}...`);
      const success = await downloadImage(imageUrl, localPath);
      
      if (success) {
        p.image = publicPath;
        p.image_url = publicPath;
      } else {
        console.log(`Failed to download for ${p.name}`);
      }
      
      // Delay to avoid 429 Too Many Requests
      await delay(2000);
    } else {
      console.log(`Image already exists for ${p.name}, skipping download.`);
      p.image = publicPath;
      p.image_url = publicPath;
    }
    
    seedIndex++;
  }

  // Save JSON
  const newContent = `export const perfumes = ${JSON.stringify(finalizedProducts, null, 2)};\n`;
  fs.writeFileSync(dataFile, newContent, 'utf8');
  console.log("Database updated and all images downloaded locally!");
}

processImages();
