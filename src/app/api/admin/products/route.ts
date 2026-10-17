import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import { perfumes as fallbackPerfumes } from '@/data/perfumes';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let products: any[] = [];

    if (db && Object.keys(db).length > 0) {
      try {
        let snapshot;
        try {
          snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        } catch {
          snapshot = await db.collection('products').get();
        }
        
        snapshot.forEach((doc: any) => {
          products.push({ _id: doc.id, id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.warn('Admin products fetch failed, using fallback:', err);
      }
    }

    if (products.length === 0) {
      products = fallbackPerfumes.map(p => ({
        ...p,
        _id: p.id,
        shortDescription: p.tagline || '',
        description: p.tagline || '',
        stock: 100
      }));
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch admin products:', error);
    return NextResponse.json(fallbackPerfumes.map(p => ({ ...p, _id: p.id })));
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.id) {
      body.id = (body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json({ _id: body.id, ...body }, { status: 201 });
    }

    body.createdAt = FieldValue.serverTimestamp();
    body.updatedAt = FieldValue.serverTimestamp();

    const docRef = db.collection('products').doc(body.id);
    await docRef.set(body);

    const newDoc = await docRef.get();
    return NextResponse.json({ _id: newDoc.id, ...newDoc.data() }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
