import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function PUT(request: Request) {
  try {
    const { uid, name, email } = await request.json();

    if (!uid || !name || !email) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Update Firebase Auth
    await auth.updateUser(uid, {
      displayName: name,
      email: email,
    });

    // 2. Update Firestore
    await db.collection('users').doc(uid).set({
      name,
      email,
      updatedAt: new Date()
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error: any) {
    let errorMessage = 'Failed to update profile';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email is already in use by another account';
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
