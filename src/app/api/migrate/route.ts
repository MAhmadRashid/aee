import { NextResponse } from 'next/server';
import { getDbData, saveDbData } from '@/lib/jsonDb';
import { perfumes } from '@/data/perfumes';

export async function POST() {
  try {
    const db = getDbData();
    
    // Clear existing data and insert all perfumes
    db.products = perfumes;
    saveDbData(db);
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully migrated ${perfumes.length} products to Local JSON Database (local-database.json)` 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
