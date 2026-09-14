import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { perfumes } from './src/data/perfumes';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

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
