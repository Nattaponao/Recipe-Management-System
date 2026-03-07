import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

type Ctx = { params: Promise<{ id: string }> };

// GET /api/recipes/:id
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: { orderBy: { sortOrder: 'asc' } },
      steps: { orderBy: { stepNo: 'asc' } },
      author: { select: { id: true, name: true } },
    },
  });

  if (!recipe) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const safe = JSON.parse(
    JSON.stringify(recipe, (_key, value) =>
      typeof value === 'bigint' ? Number(value) : value,
    ),
  );

  return NextResponse.json(safe);
}

// PUT /api/recipes/:id
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const {
    name,
    description,
    category,
    country,
    coverImage,
    ingredients,
    steps,
  } = body;

  try {
    // ลบของเดิมแล้วสร้างใหม่
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
    await prisma.recipeStep.deleteMany({ where: { recipeId: id } });

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        name,
        description: description || null,
        category: category || null,
        country: country || null,
        coverImage: coverImage || null,
        ingredients: {
          create: (ingredients ?? []).map(
            (
              ing: {
                name: string;
                amount?: number;
                unit?: string;
                sortOrder?: number;
              },
              index: number,
            ) => ({
              name: ing.name,
              amount: ing.amount ?? null,
              unit: ing.unit ?? null,
              sortOrder: ing.sortOrder ?? index + 1,
            }),
          ),
        },
        steps: {
          create: (steps ?? []).map((text: string, index: number) => ({
            stepNo: index + 1,
            text,
          })),
        },
      },
      include: {
        ingredients: true,
        steps: true,
      },
    });
    const safe = JSON.parse(
      JSON.stringify(recipe, (_key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );

    return NextResponse.json(safe);
  } catch (error) {
    console.error('[PUT /api/recipes/:id]', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === 'token')?.value;
  if (!token)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
    sub: number;
  };
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!recipe)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (recipe.authorId !== payload.sub)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
