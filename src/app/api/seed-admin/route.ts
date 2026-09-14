import { NextResponse } from 'next/server';
import { auth, db } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
  try {
    const adminEmail = 'admin@zerotoone.com';
    const adminPassword = 'password123';
    
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(adminEmail);
      // If found, update password to ensure it's correct
      await auth.updateUser(userRecord.uid, { password: adminPassword });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: 'Admin',
        });
      } else {
        throw error;
      }
    }
    
    // Set custom claims for admin role if we want, or just store in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name: 'Admin',
      email: adminEmail,
      role: 'admin',
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    return NextResponse.json({ message: 'Admin user is ready.', credentials: { email: adminEmail, password: adminPassword } });
  } catch (error: any) {
    console.error('Seed Admin error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
