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
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Fragrance name is required' }, { status: 400 });
    }

    if (!body.id) {
      body.id = `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const productPayload = {
      ...body,
      _id: body.id,
      id: body.id,
      price: Number(body.price) || 0,
      originalPrice: Number(body.originalPrice) || Number(body.price) || 0,
      stock: Number(body.stock) || 50,
      stock_quantity: Number(body.stock) || 50,
      image: body.image || '/perfumes/1.webp',
      image_url: body.image || '/perfumes/1.webp',
      category: body.category || 'Classic Perfumes',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (db && Object.keys(db).length > 0) {
      const docRef = db.collection('products').doc(body.id);
      await docRef.set(productPayload);
      const newDoc = await docRef.get();
      return NextResponse.json({ _id: newDoc.id, id: newDoc.id, ...newDoc.data() }, { status: 201 });
    }

    return NextResponse.json(productPayload, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
