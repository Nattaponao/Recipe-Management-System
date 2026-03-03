import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { analyzeRecipes } from '@/ai/analyze.service';

export async function POST(req: Request) {
  try {
    const { userIngredients } = await req.json();

    if (!Array.isArray(userIngredients) || userIngredients.length === 0) {
      return NextResponse.json(
        { error: 'userIngredients must be a non-empty array' },
        { status: 400 },
      );
    }

    const invalidItem = userIngredients.find((i) => typeof i !== 'string');
    if (invalidItem) {
      return NextResponse.json(
        { error: 'userIngredients must be an array of strings only' },
        { status: 400 },
      );
    }

    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: { select: { name: true } },
        steps: { select: { text: true } },
      },
    });

    const result = await analyzeRecipes(recipes, userIngredients);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
