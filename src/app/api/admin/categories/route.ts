import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { db } from '../../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snapshot = await db.collection('categories').orderBy('name', 'asc').get();
    const categories: any[] = [];
    snapshot.forEach((doc: any) => {
      categories.push({ _id: doc.id, ...doc.data() });
    });

    return NextResponse.json(categories);
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
    body.createdAt = FieldValue.serverTimestamp();
    body.updatedAt = FieldValue.serverTimestamp();

    const docRef = db.collection('categories').doc();
    await docRef.set(body);

    const newDoc = await docRef.get();
    return NextResponse.json({ _id: newDoc.id, ...newDoc.data() }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
