import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { perfumes } from '@/data/perfumes';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: Request) {
  try {
    const productsRef = db.collection('products');
    
    // Delete existing products (batch delete)
    const snapshot = await productsRef.get();
    const batch = db.batch();
    
    snapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    // Insert new products
    const insertBatch = db.batch();
    perfumes.forEach((perfume) => {
      const docRef = productsRef.doc(perfume.id);
      insertBatch.set(docRef, {
        ...perfume,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    });
    
    await insertBatch.commit();
    
    return NextResponse.json({ success: true, message: 'Database seeded successfully with ' + perfumes.length + ' products.' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
