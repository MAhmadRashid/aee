import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

const VALID_THEMES = ['midnight-gold', 'obsidian-silver', 'amber-oud', 'rose-quartz', 'emerald-onyx', 'default'];

export async function GET() {
  try {
    if (db && Object.keys(db).length > 0) {
      try {
        const doc = await db.collection('settings').doc('theme').get();
        if (doc.exists) {
          const activeTheme = doc.data()?.activeTheme;
          if (activeTheme && VALID_THEMES.includes(activeTheme)) {
            return NextResponse.json({ theme: activeTheme });
          }
        }
      } catch (err) {
        console.warn('Firestore theme fetch warning:', err);
      }
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
    
    if (!theme || !VALID_THEMES.includes(theme)) {
      return NextResponse.json({ 
        error: `Invalid theme. Supported themes are: ${VALID_THEMES.join(', ')}` 
      }, { status: 400 });
    }

    if (db && Object.keys(db).length > 0) {
      try {
        await db.collection('settings').doc('theme').set({ 
          activeTheme: theme,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore theme update warning:', err);
      }
    }
    
    return NextResponse.json({ success: true, theme });
  } catch (error: any) {
    console.error('Failed to update theme', error);
    return NextResponse.json({ error: error.message || 'Failed to update theme' }, { status: 500 });
  }
}
