import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json({ error: 'Firebase not connected' }, { status: 500 });
    }

    const categoriesToSeed = [
      { name: "Premium Perfumes", description: "Exclusive high-end luxury fragrances." },
      { name: "Classic Perfumes", description: "Timeless and everyday elegant fragrances." },
      { name: "Oud", description: "Rich, deep, and traditional agarwood collection." },
      { name: "Perfume Wax / Attar", description: "Pure, non-alcoholic concentrated perfume oils." },
      { name: "Sample Sets", description: "Discovery sets to explore signature scents." },
      { name: "Tester Box", description: "Curated sample collections to try before you buy." },
      { name: "Body Mist", description: "Light and refreshing daily body fragrances." },
      { name: "Car Diffusers / Car Perfumes", description: "Luxury ambient scents for your journeys." },
      { name: "Home & Space Fragrances", description: "Room sprays and diffusers to elevate your home." },
      { name: "Gift Box", description: "Luxury gift sets and bespoke fragrance packaging." }
    ];

    const batch = db.batch();
    const categoriesRef = db.collection('categories');

    for (const cat of categoriesToSeed) {
      const docId = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const docRef = categoriesRef.doc(docId);
      
      batch.set(docRef, {
        name: cat.name,
        description: cat.description,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, message: `Seeded all 10 boutique categories to Firebase!` });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
