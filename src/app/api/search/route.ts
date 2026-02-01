import { NextResponse } from 'next/server';
import { mockRecipes } from '@/mock/recipes';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  const results = mockRecipes.filter((r) => r.name.toLowerCase().includes(q));

  return NextResponse.json(results);
}
