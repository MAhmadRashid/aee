import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!db || Object.keys(db).length === 0) {
      return NextResponse.json([]);
    }

    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders: any[] = [];
    snapshot.forEach((doc: any) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    if (orders.length === 0) {
      orders.push(
        {
          id: 'ORD-10492',
          customerDetails: { firstName: 'Zain', lastName: 'Ali', email: 'zain@example.com' },
          totalAmount: 24500,
          status: 'pending',
          createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 }
        },
        {
          id: 'ORD-10491',
          customerDetails: { firstName: 'Fatima', lastName: 'Noor', email: 'fatima@example.com' },
          totalAmount: 18000,
          status: 'processing',
          createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 }
        },
        {
          id: 'ORD-10490',
          customerDetails: { firstName: 'Omer', lastName: 'Farooq', email: 'omer@example.com' },
          totalAmount: 32000,
          status: 'completed',
          createdAt: { seconds: Math.floor(Date.now() / 1000) - 172800 }
        }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch admin orders', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
