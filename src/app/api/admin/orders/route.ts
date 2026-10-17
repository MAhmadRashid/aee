import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const SAMPLE_ORDERS = [
  {
    id: 'ord-10492',
    orderNumber: '#ZTO-10492',
    customer: { name: 'Zain Ali', email: 'zain@example.com', address: 'DHA Phase 5', city: 'Lahore' },
    items: [{ name: 'Aeternum Glow', quantity: 1, price: 7400 }],
    totalPrice: 7400,
    paymentMethod: 'cod',
    status: 'processing',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 }
  },
  {
    id: 'ord-10491',
    orderNumber: '#ZTO-10491',
    customer: { name: 'Fatima Noor', email: 'fatima@example.com', address: 'F-7/2', city: 'Islamabad' },
    items: [{ name: 'Velvet Rose Oud', quantity: 2, price: 9000 }],
    totalPrice: 18000,
    paymentMethod: 'online',
    status: 'shipped',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 }
  },
  {
    id: 'ord-10490',
    orderNumber: '#ZTO-10490',
    customer: { name: 'Omer Farooq', email: 'omer@example.com', address: 'Clifton Block 4', city: 'Karachi' },
    items: [{ name: 'Midnight Oud Royale', quantity: 2, price: 16000 }],
    totalPrice: 32000,
    paymentMethod: 'cod',
    status: 'completed',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 172800 }
  }
];

export async function GET() {
  try {
    let orders: any[] = [];

    if (db && Object.keys(db).length > 0) {
      try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        snapshot.forEach((doc: any) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.warn('Orders query failed, using sample orders:', err);
      }
    }

    if (orders.length === 0) {
      return NextResponse.json(SAMPLE_ORDERS);
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    return NextResponse.json(SAMPLE_ORDERS);
  }
}
