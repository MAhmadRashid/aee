import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function PUT(request: Request) {
  try {
    const { uid, name, email } = await request.json();

    if (!uid || !name || !email) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Update Firebase Auth if initialized
    if (auth && Object.keys(auth).length > 0) {
      try {
        await auth.updateUser(uid, {
          displayName: name,
          email: email,
        });
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-exists') {
          return NextResponse.json({ success: false, message: 'Email is already in use by another account' }, { status: 400 });
        }
        console.warn('Auth user update failed:', authErr);
      }
    }

    // 2. Update Firestore if initialized
    if (db && Object.keys(db).length > 0) {
      try {
        await db.collection('users').doc(uid).set({
          name,
          email,
          updatedAt: new Date()
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore user update failed:', dbErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
