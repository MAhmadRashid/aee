import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { id: 'cat-premium', name: 'Premium Perfumes', description: 'Exclusive High-End Signature Fragrances' },
  { id: 'cat-classic', name: 'Classic Perfumes', description: 'Everyday elegance and refined scents' },
  { id: 'cat-oud', name: 'Oud', description: 'Rich, Smoky, and Luxurious Arabic Oud' },
  { id: 'cat-attar', name: 'Perfume Wax / Attar', description: 'Concentrated alcohol-free pure oils' },
  { id: 'cat-sample', name: 'Sample Sets', description: 'Discovery sets to explore signature scents' },
  { id: 'cat-tester', name: 'Tester Box', description: 'Curated sets to try before you buy' },
  { id: 'cat-mist', name: 'Body Mist', description: 'Refreshing all-day subtle indulgence' },
  { id: 'cat-home', name: 'Home & Space Fragrances', description: 'Room sprays, diffusers, and ambiance enhancers' },
  { id: 'cat-car', name: 'Car Diffusers / Car Perfumes', description: 'Luxury fragrances for your journeys' },
  { id: 'cat-gift', name: 'Gift Box', description: 'Exquisite gifting packaging for special moments' },
];

export async function GET() {
  try {
    let categories: any[] = [];

    if (db && Object.keys(db).length > 0) {
      try {
        const snapshot = await db.collection('categories').orderBy('createdAt', 'desc').get();
        snapshot.forEach((doc: any) => {
          categories.push({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.warn('Firestore categories query failed, using defaults:', err);
      }
    }

    if (categories.length === 0) {
      return NextResponse.json(DEFAULT_CATEGORIES, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800' }
      });
    }

    return NextResponse.json(categories, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' }
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(DEFAULT_CATEGORIES, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json({ success: true, id: `cat-${Date.now()}` }, { status: 201 });
    }
    
    const docRef = await db.collection('categories').add({
      name: body.name,
      description: body.description || '',
      createdAt: FieldValue.serverTimestamp(),
    });
    
    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
