import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { perfumes as fallbackPerfumes } from '@/data/perfumes';

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
        let snapshot;
        try {
          snapshot = await query.orderBy('createdAt', 'desc').get();
        } catch {
          snapshot = await query.get();
        }
        snapshot.forEach((doc: any) => {
          products.push({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.warn("Firebase fetch skipped/failed, using fallback data:", err);
      }
    }
    
    // Graceful fallback to static catalogue if DB returned no products
    if (products.length === 0) {
      if (category && category !== 'All') {
        products = fallbackPerfumes.filter(p => p.category?.toLowerCase() === category.toLowerCase());
      } else {
        products = fallbackPerfumes;
      }
    }
    
    return NextResponse.json(
      { success: true, data: products },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );
  } catch (error: any) {
    console.error("Products route error:", error);
    return NextResponse.json(
      { success: false, data: fallbackPerfumes },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );
  }
}
