import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'new_48_products.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileData);

    const productsRef = db.collection('products');
    let inserted = 0;
    
    // Firestore allows batch operations of up to 500 writes
    const batch = db.batch();
    
    for (const p of products) {
      const docRef = productsRef.doc(p.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        batch.set(docRef, {
          ...p,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
        inserted++;
      }
    }
    
    if (inserted > 0) {
      await batch.commit();
    }

    return NextResponse.json({ success: true, inserted, total: products.length });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
