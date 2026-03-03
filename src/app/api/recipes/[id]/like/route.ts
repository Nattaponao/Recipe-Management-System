import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

function getUserIdFromToken(token?: string) {
  if (!token) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const liked = userId
    ? await prisma.recipe_likes.findFirst({
        where: { recipe_id: recipeId, user_id: userId },
        select: { id: true },
      })
    : null;

  const count = await prisma.recipe_likes.count({
    where: { recipe_id: recipeId },
  });

  return NextResponse.json({ liked: Boolean(liked), count });
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

  const existing = await prisma.recipe_likes.findFirst({
    where: { recipe_id: recipeId, user_id: userId },
    select: { id: true },
  });

  if (existing) {
    await prisma.recipe_likes.delete({ where: { id: existing.id } });
  } else {
    await prisma.recipe_likes.create({
      data: { recipe_id: recipeId, user_id: userId },
    });
  }

  const count = await prisma.recipe_likes.count({
    where: { recipe_id: recipeId },
  });

  return NextResponse.json({ liked: !Boolean(existing), count });
}
