import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { db } from '../../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
  try {
    // TEMPORARY BYPASS: allow local fetching without NextAuth session for testing
    // const session = await getServerSession(authOptions);
    // if (!session || (session.user as any)?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products: any[] = [];
    snapshot.forEach((doc: any) => {
      products.push({ _id: doc.id, ...doc.data() });
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
      body.id = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    body.createdAt = FieldValue.serverTimestamp();
    body.updatedAt = FieldValue.serverTimestamp();

    // Use body.id as the document ID if we want, or let Firestore auto-generate.
    // The previous Mongoose schema used `id` as unique, so we can use it as the document ID.
    const docRef = db.collection('products').doc(body.id);
    await docRef.set(body);

    const newDoc = await docRef.get();
    return NextResponse.json({ _id: newDoc.id, ...newDoc.data() }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
