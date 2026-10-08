import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json({ error: 'Firebase not connected' }, { status: 500 });
    }

    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    const batch = db.batch();
    let updatedCount = 0;

    snapshot.forEach((doc: any) => {
      const data = doc.data();
      // If stock is 0 or undefined or low, set it to 100
      if (!data.stock_quantity || data.stock_quantity < 10) {
        batch.update(doc.ref, { stock_quantity: 100 });
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({ success: true, message: `Updated ${updatedCount} products to have 100 stock.` });
  } catch (error: any) {
    console.error('Stock fix error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
