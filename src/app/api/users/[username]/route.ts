import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ username: string }> },
) {
  const { username } = await ctx.params;

  const user = await prisma.user.findFirst({
    where: { name: username },
    select: {
      id: true,
      name: true,
      image: true,
      recipes: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          coverImage: true,
          category: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const safe = JSON.parse(
    JSON.stringify(user, (_key, value) =>
      typeof value === 'bigint' ? Number(value) : value,
    ),
  );

  return NextResponse.json(safe);
}
