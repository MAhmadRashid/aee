import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'completed',
  'cancelled'
];

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    if (db && Object.keys(db).length > 0) {
      try {
        const docRef = db.collection('orders').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
          return NextResponse.json({ id: doc.id, _id: doc.id, ...doc.data() });
        }
      } catch (err) {
        console.warn('Firestore single order fetch error:', err);
      }
    }

    return NextResponse.json({ error: 'Consignment record not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching order by ID:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const body = await request.json();
    const newStatus = (body.status || '').toLowerCase().trim();

    if (body.status && !VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {
      ...body,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (newStatus) {
      updatePayload.status = newStatus;
    }

    if (db && Object.keys(db).length > 0) {
      const docRef = db.collection('orders').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        // Create new consignment record if mock or newly created
        updatePayload.createdAt = FieldValue.serverTimestamp();
        updatePayload.orderNumber = body.orderNumber || `#ZTO-${id.slice(0, 6).toUpperCase()}`;
        updatePayload.statusHistory = [
          {
            status: newStatus || 'processing',
            timestamp: new Date().toISOString(),
            note: 'Order initial entry'
          }
        ];
        await docRef.set(updatePayload);
      } else {
        const existingData = doc.data() || {};
        const prevHistory = Array.isArray(existingData.statusHistory) ? existingData.statusHistory : [];
        if (newStatus && newStatus !== existingData.status) {
          updatePayload.statusHistory = [
            ...prevHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: body.note || `Status changed from ${existingData.status || 'unknown'} to ${newStatus}`
            }
          ];
        }
        await docRef.update(updatePayload);
      }

      const updatedDoc = await docRef.get();
      return NextResponse.json({ 
        success: true, 
        id: updatedDoc.id, 
        _id: updatedDoc.id, 
        ...updatedDoc.data() 
      });
    }

    // Local / In-memory fallback
    return NextResponse.json({
      success: true,
      id,
      _id: id,
      ...body,
      status: newStatus || body.status || 'processing',
      updatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    if (db && Object.keys(db).length > 0) {
      const docRef = db.collection('orders').doc(id);
      await docRef.delete();
    }

    return NextResponse.json({ success: true, message: 'Consignment deleted successfully', id });
  } catch (error: any) {
    console.error('Delete order error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
