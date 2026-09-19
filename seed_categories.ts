import * as dotenv from 'dotenv';
dotenv.config();

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

const categories = [
  { name: 'Premium Perfumes', slug: 'premium-perfumes', description: 'Exclusive premium fragrances.' },
  { name: 'Classic Perfumes', slug: 'classic-perfumes', description: 'Timeless classic fragrances.' },
  { name: 'Oud', slug: 'oud', description: 'Rich and woody Oud collection.' },
  { name: 'Body Mist', slug: 'body-mist', description: 'Light and refreshing body mists.' },
  { name: 'Attar', slug: 'attar', description: 'Traditional concentrated perfume oils.' },
  { name: 'Gift Boxes', slug: 'gift-boxes', description: 'Specially curated gifting packages.' },
  { name: 'Sample Sets', slug: 'sample-sets', description: 'Discovery sets to try our fragrances.' },
  { name: 'Car Diffuser', slug: 'car-diffuser', description: 'Luxury fragrances for your car.' },
  { name: 'Home & Space', slug: 'home-and-space', description: 'Elegant scents for your living spaces.' }
];

async function seedCategories() {
  console.log('Seeding categories...');
  const batch = db.batch();
  for (const cat of categories) {
    const docRef = db.collection('categories').doc();
    batch.set(docRef, {
      ...cat,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  await batch.commit();
  console.log('Categories seeded successfully!');
}

seedCategories().catch(console.error);
