import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeRecipes } from '@/ai/analyze.service';

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'ingredients is required' },
        { status: 400 },
      );
    }

    const recipes = await prisma.recipes.findMany({
      include: {
        recipe_ingredients: true,
        recipe_steps: true,
      },
      take: 50, // กัน token ระเบิด
    });

    const analyzed = await analyzeRecipes(recipes, ingredients);

    return NextResponse.json(analyzed);
  } catch (error) {
    console.error('AI recommend error:', error);

    return NextResponse.json(
      { error: 'Failed to analyze recipes', detail: String(error) },
      { status: 500 },
    );
  }
}
