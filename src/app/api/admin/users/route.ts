import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json([]);
    }

    // Usually users are stored in 'users' collection in Firestore
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users: any[] = [];
    
    snapshot.forEach((doc: any) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    // No dummy users; we only show actual users from the database.
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
