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

export async function GET(
  _: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: recipeId } = await ctx.params;

  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === 'token')?.value;
  const userId = getUserIdFromToken(token);

  const saved = userId
    ? await prisma.recipeSave.findFirst({
        where: { recipeId: recipeId, userId: userId },
        select: { id: true },
      })
    : null;

  return NextResponse.json({ saved: Boolean(saved) });
}

export async function POST(
  _: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: recipeId } = await ctx.params;

  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === 'token')?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.recipeSave.findFirst({
    where: { recipeId: recipeId, userId: userId },
    select: { id: true },
  });

  if (existing) {
    await prisma.recipeSave.delete({ where: { id: existing.id } });
  } else {
    await prisma.recipeSave.create({
      data: { recipeId: recipeId, userId: userId },
    });
  }

  return NextResponse.json({ saved: !Boolean(existing) });
}
