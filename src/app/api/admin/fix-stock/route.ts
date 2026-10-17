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
      const updates: any = {};
      let needsUpdate = false;

      // Update both stock and stock_quantity
      if (!data.stock || data.stock < 10) {
        updates.stock = 100;
        needsUpdate = true;
      }
      if (!data.stock_quantity || data.stock_quantity < 10) {
        updates.stock_quantity = 100;
        needsUpdate = true;
      }

      // Check and update sizeVariants stock if present
      if (Array.isArray(data.sizeVariants) && data.sizeVariants.length > 0) {
        let variantsChanged = false;
        const updatedVariants = data.sizeVariants.map((v: any) => {
          if (!v.stock || v.stock < 10) {
            variantsChanged = true;
            return { ...v, stock: 100 };
          }
          return v;
        });

        if (variantsChanged) {
          updates.sizeVariants = updatedVariants;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        batch.update(doc.ref, updates);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedCount} products to have active inventory stock (100 units).` 
    });
  } catch (error: any) {
    console.error('Stock fix error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
