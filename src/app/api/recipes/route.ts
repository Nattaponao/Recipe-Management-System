import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get('q')?.trim() ?? '';
  const category = searchParams.get('category') ?? '';
  const country = searchParams.get('country') ?? '';

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        ...(q && {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        }),
        ...(category && { category }),
        ...(country && { country }),
      },

      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,
        name: true,
        description: true,
        coverImage: true,
        category: true,
        country: true,
      },
    });

    return NextResponse.json(recipes);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
