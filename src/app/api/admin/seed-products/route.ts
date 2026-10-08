import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { perfumes } from '@/data/perfumes';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json({ error: 'Firebase not connected' }, { status: 500 });
    }

    const batch = db.batch();
    const productsRef = db.collection('products');

    let count = 0;
    
    // Process only the first 50 to avoid massive batches if there are thousands
    // (A Firestore batch supports up to 500 operations)
    const itemsToSeed = perfumes.slice(0, 400);

    for (const p of itemsToSeed) {
      // Use existing ID or generate one
      const docId = p.id || p.sku || `ZTO-${Math.random().toString(36).substr(2, 9)}`;
      const docRef = productsRef.doc(docId);
      
      const payload = {
        ...p,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        // Map any missing structure if needed
        description: p.description || p.short_description || p.tagline || '',
        shortDescription: p.short_description || p.tagline || '',
        price: Number(p.price) || 0,
        originalPrice: Number(p.originalPrice || p.original_price) || 0,
      };

      batch.set(docRef, payload);
      count++;
    }

    await batch.commit();

    return NextResponse.json({ success: true, message: `Seeded ${count} products to Firebase!` });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
