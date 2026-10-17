import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const SAMPLE_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Boutique Administrator',
    email: 'admin@zerotoone.com',
    role: 'admin',
    status: 'active',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 30 }
  },
  {
    id: 'usr-cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: 'customer',
    status: 'active',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5 }
  },
  {
    id: 'usr-cust-2',
    name: 'Hamza Tariq',
    email: 'hamza@example.com',
    role: 'customer',
    status: 'active',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2 }
  }
];

export async function GET() {
  try {
    let users: any[] = [];

    if (db && Object.keys(db).length > 0) {
      try {
        const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
        snapshot.forEach((doc: any) => {
          users.push({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.warn('Users collection query failed, using sample list:', err);
      }
    }

    if (users.length === 0) {
      return NextResponse.json(SAMPLE_USERS);
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(SAMPLE_USERS);
  }
}
