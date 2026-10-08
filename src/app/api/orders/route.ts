import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!db || Object.keys(db).length === 0) {
      // If DB is not available (e.g. testing mode)
      return NextResponse.json({ success: true, orderId: `MOCK-${Date.now()}` }, { status: 201 });
    }

    const orderData = {
      orderNumber: body.orderNumber || `#ZTO-${Math.floor(Math.random() * 100000)}`,
      customer: {
        name: body.shippingDetails.fullName,
        email: body.shippingDetails.email,
        address: body.shippingDetails.address,
        city: body.shippingDetails.city,
        zip: body.shippingDetails.zip,
      },
      items: body.cartItems,
      subtotal: body.subtotal,
      shippingCost: body.shippingCost,
      giftWrapCost: body.giftWrapCost,
      totalPrice: body.total,
      paymentMethod: body.paymentMethod,
      gifting: body.gifting,
      status: 'processing',
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('orders').add(orderData);
    
    return NextResponse.json({ success: true, orderId: docRef.id, orderNumber: orderData.orderNumber }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
