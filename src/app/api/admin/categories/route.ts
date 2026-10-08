import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json([]);
    }
    const snapshot = await db.collection('categories').orderBy('createdAt', 'desc').get();
    const categories: any[] = [];
    snapshot.forEach((doc: any) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json({ success: true, id: `mock-id` }, { status: 201 });
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
