import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '/src/constants/vietnamese-provinces.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const provinces = JSON.parse(jsonData);
    
    return NextResponse.json(provinces);
  } catch (error) {
    console.error('Error reading provinces data:', error);
    return NextResponse.json(
      { error: 'Failed to load provinces data' },
      { status: 500 }
    );
  }
} 