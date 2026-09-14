const fs = require('fs');
const path = require('path');

const perfumesTsPath = path.join(__dirname, 'src', 'data', 'perfumes.ts');
let tsContent = fs.readFileSync(perfumesTsPath, 'utf8');

try {
  const arrayStart = tsContent.indexOf('[');
  const arrayEnd = tsContent.lastIndexOf(']');
  const arrayStr = tsContent.substring(arrayStart, arrayEnd + 1);
  const perfumesArray = (new Function(`return ${arrayStr}`))();

  const specificImages = {
    'Body Mist': [
      'https://images.unsplash.com/photo-1594913366159-1832aa6bf944?q=80&w=600&auto=format&fit=crop', // Mist 1
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=600&auto=format&fit=crop', // Mist 2
      'https://images.unsplash.com/photo-1615286591238-d621b162de81?q=80&w=600&auto=format&fit=crop', // Mist 3
      'https://images.unsplash.com/photo-1594824364112-a7d187212ebc?q=80&w=600&auto=format&fit=crop'  // Mist 4
    ],
    'Air Care': [
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600&auto=format&fit=crop', // Room spray/diffuser
      'https://images.unsplash.com/photo-1595425983794-5264b971a815?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608528577891-e40398f6d787?q=80&w=600&auto=format&fit=crop'
    ],
    'Sample Sets': [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop', // small vials
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589133887011-e630cc9dfba5?q=80&w=600&auto=format&fit=crop'
    ],
    'Tester Box': [
      'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop', // basic box/bottle
      'https://images.unsplash.com/photo-1593006497217-1f92e92fae38?q=80&w=600&auto=format&fit=crop'
    ]
  };

  let counters = {
    'Body Mist': 0,
    'Air Care': 0,
    'Sample Sets': 0,
    'Tester Box': 0
  };

  for (const product of perfumesArray) {
    if (specificImages[product.category]) {
      const pool = specificImages[product.category];
      product.image = pool[counters[product.category] % pool.length];
      counters[product.category]++;
    }
  }

  const newTsContent = tsContent.substring(0, arrayStart) + JSON.stringify(perfumesArray, null, 2) + tsContent.substring(arrayEnd + 1);
  fs.writeFileSync(perfumesTsPath, newTsContent, 'utf8');
  console.log('Successfully re-assigned missing category images using Unsplash.');

} catch (e) {
  console.error("Error evaluating or writing array:", e);
}
