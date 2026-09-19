const admin = require('firebase-admin');
const serviceAccount = require('./admin/serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function updateAllStock() {
  const snapshot = await db.collection('products').get();
  let count = 0;
  
  const batch = db.batch();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    let needsUpdate = false;
    let updateData = {};
    
    // Update main stock if it's low or 0
    if (data.stock == null || data.stock < 100) {
      updateData.stock = 500; // Set a generous amount of stock
      needsUpdate = true;
    }
    
    // Update sizeVariants stock if they exist
    if (data.sizeVariants && Array.isArray(data.sizeVariants)) {
      let variantsUpdated = false;
      const newVariants = data.sizeVariants.map(variant => {
        if (variant.stock == null || variant.stock < 100) {
          variantsUpdated = true;
          return { ...variant, stock: 500 };
        }
        return variant;
      });
      
      if (variantsUpdated) {
        updateData.sizeVariants = newVariants;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      batch.update(doc.ref, updateData);
      count++;
    }
  });
  
  if (count > 0) {
    await batch.commit();
    console.log("Updated stock for " + count + " products.");
  } else {
    console.log("All products already have sufficient stock.");
  }
}

updateAllStock().catch(console.error);
