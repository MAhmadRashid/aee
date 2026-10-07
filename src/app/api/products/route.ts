import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { perfumes as fallbackPerfumes } from '@/data/perfumes';
import { IProduct } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let fallback = fallbackPerfumes;
    if (category && category !== 'All') {
      fallback = fallback.filter(p => p.category === category);
    }
    
    return NextResponse.json({ success: true, data: fallback }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
