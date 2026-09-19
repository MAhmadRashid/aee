import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { perfumes as fallbackPerfumes } from '@/data/perfumes';
import { IProduct } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let productsRef: any = db.collection('products');
    
    if (category && category !== 'All') {
      productsRef = productsRef.where('category', '==', category);
    }

    const snapshot = await productsRef.get();
    
    // If the database is empty, return the fallback data
    if (snapshot.empty) {
      console.log('Firestore products empty, using fallback perfumes');
      let fallback = fallbackPerfumes;
      if (category && category !== 'All') {
        fallback = fallback.filter(p => p.category === category);
      }
      return NextResponse.json({ success: true, data: fallback }, { status: 200 });
    }

    const products: IProduct[] = [];
    snapshot.forEach((doc: any) => {
      products.push({ _id: doc.id, ...doc.data() } as any);
    });

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error("Firestore Error:", error);
    // If DB fails, return fallback
    let fallback = fallbackPerfumes;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    if (category && category !== 'All') {
      fallback = fallback.filter(p => p.category === category);
    }
    return NextResponse.json({ success: true, data: fallback }, { status: 200 });
  }
}
