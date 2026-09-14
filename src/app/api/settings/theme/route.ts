import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const doc = await db.collection('settings').doc('theme').get();
    if (doc.exists) {
      return NextResponse.json({ theme: doc.data()?.activeTheme || 'midnight-gold' });
    }
    return NextResponse.json({ theme: 'midnight-gold' });
  } catch (error) {
    console.error('Failed to fetch theme', error);
    return NextResponse.json({ theme: 'midnight-gold' });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { theme } = body;
    
    if (!['midnight-gold', 'rose-quartz', 'emerald-onyx'].includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    await db.collection('settings').doc('theme').set({ activeTheme: theme }, { merge: true });
    
    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error('Failed to update theme', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
