const admin = require('firebase-admin');
const { perfumes } = require('./src/data/perfumes.ts');
const serviceAccount = require('./serviceAccountKey.json'); // assuming they have this if firebase-admin is setup

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function uploadData() {
  console.log(`Starting upload of ${perfumes.length} products to Firebase...`);
  const batch = db.batch();
  
  perfumes.forEach(product => {
    const docRef = db.collection('products').doc(product.id.toString());
    batch.set(docRef, product);
  });
  
  await batch.commit();
  console.log('Successfully uploaded all products to Firebase Firestore!');
}

uploadData().catch(console.error);
