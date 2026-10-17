import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  storeName: 'Zero to One Haute Parfumerie',
  brandTagline: 'Haute Parfumerie & Artisanal Fragrances',
  supportPhone: '021-38483000',
  whatsappConcierge: '+92 300 0000000',
  supportEmail: 'support@zerotoone.com',
  atelierAddress: 'Shop No. G-21 Ground Floor, Millennium Mall, Karachi',
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  currency: 'PKR',
  updatedAt: new Date().toISOString()
};

export async function GET() {
  try {
    if (db && Object.keys(db).length > 0) {
      try {
        const doc = await db.collection('settings').doc('platform').get();
        if (doc.exists) {
          return NextResponse.json({ 
            success: true, 
            settings: { ...DEFAULT_SETTINGS, ...doc.data() } 
          });
        }
      } catch (err) {
        console.warn('Firestore settings fetch fallback:', err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      settings: DEFAULT_SETTINGS,
      fallback: true
    });
  } catch (error: any) {
    console.error('Failed to fetch platform settings:', error);
    return NextResponse.json({ 
      success: true, 
      settings: DEFAULT_SETTINGS,
      error: error.message 
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const updatedSettings = {
      storeName: body.storeName?.trim() || DEFAULT_SETTINGS.storeName,
      brandTagline: body.brandTagline?.trim() || DEFAULT_SETTINGS.brandTagline,
      supportPhone: body.supportPhone?.trim() || DEFAULT_SETTINGS.supportPhone,
      whatsappConcierge: body.whatsappConcierge?.trim() || DEFAULT_SETTINGS.whatsappConcierge,
      supportEmail: body.supportEmail?.trim() || DEFAULT_SETTINGS.supportEmail,
      atelierAddress: body.atelierAddress?.trim() || DEFAULT_SETTINGS.atelierAddress,
      freeShippingThreshold: Number(body.freeShippingThreshold) >= 0 ? Number(body.freeShippingThreshold) : 5000,
      standardShippingFee: Number(body.standardShippingFee) >= 0 ? Number(body.standardShippingFee) : 250,
      currency: 'PKR',
      updatedAt: new Date().toISOString()
    };

    if (db && Object.keys(db).length > 0) {
      try {
        await db.collection('settings').doc('platform').set(updatedSettings, { merge: true });
      } catch (err) {
        console.warn('Firestore settings update fallback:', err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Platform configuration synchronized successfully',
      settings: updatedSettings 
    });
  } catch (error: any) {
    console.error('Failed to update platform settings:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
