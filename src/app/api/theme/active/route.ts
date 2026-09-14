import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const THEME_FILE = path.join(process.cwd(), 'src/data/theme.json');

export async function GET() {
  try {
    const data = await fs.readFile(THEME_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ theme: 'default' });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { theme } = body;
    
    if (!['default', 'winter', 'eid'].includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    await fs.writeFile(THEME_FILE, JSON.stringify({ theme }, null, 2));
    
    return NextResponse.json({ success: true, theme });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
