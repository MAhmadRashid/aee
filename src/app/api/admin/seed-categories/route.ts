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
      { name: "Classic Perfumes", description: "Timeless and elegant fragrances." },
      { name: "Premium Perfumes", description: "High-end luxury collection." },
      { name: "Oud", description: "Rich, deep, and traditional agarwood." },
      { name: "Attar", description: "Pure, non-alcoholic concentrated perfume oils." },
      { name: "Tester Box", description: "Sample collections to try before you buy." }
    ];

    const batch = db.batch();
    const categoriesRef = db.collection('categories');

    for (const cat of categoriesToSeed) {
      const docId = cat.name.toLowerCase().replace(/\s+/g, '-');
      const docRef = categoriesRef.doc(docId);
      
      batch.set(docRef, {
        name: cat.name,
        description: cat.description,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, message: `Seeded categories to Firebase!` });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
