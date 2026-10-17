import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { perfumes as fallbackPerfumes } from '@/data/perfumes';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    if (db && Object.keys(db).length > 0) {
      try {
        const docRef = db.collection('products').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
          return NextResponse.json({ _id: doc.id, id: doc.id, ...doc.data() });
        }
      } catch (err) {
        console.warn('Firestore single product fetch failed:', err);
      }
    }

    // Fallback to static catalogue
    const fallback = fallbackPerfumes.find(p => p.id === id || p.sku === id);
    if (fallback) {
      return NextResponse.json({
        ...fallback,
        _id: fallback.id,
        shortDescription: fallback.tagline || '',
        description: fallback.tagline || '',
        stock: 100
      });
    }

    return NextResponse.json({ error: 'Fragrance not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching product by id:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const body = await request.json();

    if (db && Object.keys(db).length > 0) {
      const docRef = db.collection('products').doc(id);
      const doc = await docRef.get();

      const updatePayload = {
        ...body,
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (!doc.exists) {
        updatePayload.createdAt = FieldValue.serverTimestamp();
        await docRef.set(updatePayload);
      } else {
        await docRef.update(updatePayload);
      }

      const updatedDoc = await docRef.get();
      return NextResponse.json({ _id: updatedDoc.id, id: updatedDoc.id, ...updatedDoc.data() });
    }

    // Local / In-memory fallback
    return NextResponse.json({
      _id: id,
      id,
      ...body,
      message: 'Product updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    if (db && Object.keys(db).length > 0) {
      const docRef = db.collection('products').doc(id);
      await docRef.delete();
    }

    return NextResponse.json({ success: true, message: 'Fragrance de-listed successfully', id });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
