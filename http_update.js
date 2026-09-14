const images = [
  '/images/desert_night_oud.jpg',
  '/images/golden_vanilla.jpg',
  '/images/green_tea_splash.jpg',
  '/images/midnight_blue.jpg',
  '/images/oud_rosewood.jpg',
  '/images/spicy_agarwood.jpg',
  '/images/vanilla_oud.jpg',
  '/images/velvet_orchid.jpg',
  '/images/gift_blue_box.jpg',
  '/images/gift_purple_box.jpg'
];

async function updateProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/products');
    const data = await res.json();
    
    if (data.success && data.data) {
      const products = data.data;
      console.log(`Found ${products.length} products to update`);
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const newImage = images[i % images.length];
        
        const updateRes = await fetch(`http://localhost:3000/api/admin/products/${product._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: newImage })
        });
        
        if (updateRes.ok) {
          console.log(`Updated ${product.name} with ${newImage}`);
        } else {
          const text = await updateRes.text();
          console.error(`Failed to update ${product.name}: ${updateRes.status} ${text}`);
        }
      }
      console.log('All done!');
    }
  } catch (e) {
    console.error(e);
  }
}

updateProducts();
