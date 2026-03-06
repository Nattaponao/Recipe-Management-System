/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

function getUserIdFromToken(token?: string) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const id = Number(payload?.sub);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === 'token')?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const likes = await prisma.recipeLike.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      recipe: {
        select: {
          id: true,
          name: true,
          coverImage: true,
          category: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json({ recipes: likes.map((l) => l.recipe) });
}
