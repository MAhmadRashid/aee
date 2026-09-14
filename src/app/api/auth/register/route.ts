import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
    }

    // 1. Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-exists') errorMessage = 'User already exists';
      else if (error.code === 'auth/invalid-password') errorMessage = 'Password should be at least 6 characters';
      else errorMessage = error.message;
      
      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    // 2. Store user in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      phone: phone || '',
      role: 'user', // Default role
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      data: {
        id: userRecord.uid,
        name: name,
        email: email,
        role: 'user',
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}
