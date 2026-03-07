import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { isFrozen: true },
  });
  if (!recipe)
    return NextResponse.json({ message: 'Not found' }, { status: 404 });

  const updated = await prisma.recipe.update({
    where: { id },
    data: { isFrozen: !recipe.isFrozen },
  });

  return NextResponse.json({ isFrozen: updated.isFrozen });
}
