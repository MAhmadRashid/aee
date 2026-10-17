import { initializeApp, getApps, cert, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App | undefined;

if (!getApps().length) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error("Missing Firebase Project ID");
    }
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.warn('Firebase Admin initialization skipped:', (error as Error).message);
  }
} else {
  app = getApp();
}

// Export null/undefined if app is not initialized so it can be handled gracefully
export const db: Firestore = getApps().length > 0 ? getFirestore(getApps()[0]) : ({} as any);
export const auth: Auth = getApps().length > 0 ? getAuth(getApps()[0]) : ({} as any);
