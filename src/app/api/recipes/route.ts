import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/recipes
export async function GET() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(recipes);
}

// POST /api/recipes
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      ingredients,
      steps,
      coverImage,
      category,
      country,
      tags,
      authorId,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        description: description || null,
        coverImage: coverImage || null,
        category: category || null,
        country: country || null,
        tags: tags || null,
        authorId: authorId ? Number(authorId) : null,

        // RecipeIngredient relation
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

        // RecipeStep relation
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

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('[POST /api/recipes]', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
