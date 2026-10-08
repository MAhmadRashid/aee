import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { perfumes as fallbackPerfumes } from '@/data/perfumes';
import { IProduct } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let products: any[] = [];
    
    // Check if db is initialized properly
    if (db && Object.keys(db).length > 0) {
      try {
        let query: any = db.collection('products');
        if (category && category !== 'All') {
          query = query.where('category', '==', category);
        }
        const snapshot = await query.orderBy('createdAt', 'desc').get();
        snapshot.forEach((doc: any) => {
          products.push({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.warn("Firebase fetch skipped/failed, using fallback data");
      }
    }
    
    // Removed fallback if Firebase returns nothing
    
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
