import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeRecipes } from '@/ai/analyze.service';
import { AIAnalyzeResult } from '@/types/ai';
import { scoreRecipesByIngredients } from '@/ai/recipe.scorer';

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'ingredients required' },
        { status: 400 },
      );
    }

    const key = ingredients
      .map((i: string) => i.trim().toLowerCase())
      .sort()
      .join(',');

    const cached = await prisma.ai_cache.findUnique({
      where: { ingredients_key: key },
    });

    if (cached) {
      console.log('⚡ use AI cache');
      return NextResponse.json(cached.result_json as AIAnalyzeResult[]);
    }

    const recipes = await prisma.recipes.findMany({
      include: {
        recipe_ingredients: true,
        recipe_steps: true,
      },
      take: 50,
    });

    const lite = recipes.map((r) => ({
      id: r.id,
      name: r.name ?? '',
      ingredients: r.recipe_ingredients
        .map((i) => i.name)
        .filter(Boolean) as string[],
    }));

    const scored = scoreRecipesByIngredients(lite, ingredients).sort(
      (a, b) => b.matchScore - a.matchScore,
    );

    if (scored.length > 0 && scored[0].matchScore >= 30) {
      console.log('⚡ use DB scoring (skip AI)');
      return NextResponse.json(scored.slice(0, 5));
    }

    const TOP_N = 10;

    const topRecipes = recipes.filter((r) =>
      scored.slice(0, TOP_N).some((s) => s.recipeId === r.id),
    );

    let analyzed: AIAnalyzeResult[];

    try {
      analyzed = await analyzeRecipes(topRecipes, ingredients);
    } catch (e) {
      console.warn('⚠️ AI unavailable → fallback to DB scoring');

      analyzed = scored.slice(0, 5).map((r) => ({
        recipeId: r.recipeId,
        recipeName: r.recipeName ?? 'ไม่ทราบชื่อเมนู',
        matchScore: r.matchScore,
        missingIngredients: r.missingIngredients,
        reason: 'แนะนำจากฐานข้อมูล (AI ไม่พร้อมใช้งาน)',
      }));
    }

    await prisma.ai_cache.create({
      data: {
        ingredients_key: key,
        result_json: analyzed,
      },
    });

    return NextResponse.json(analyzed);
  } catch (error) {
    console.error('AI recommend error:', error);

    return NextResponse.json(
      { error: 'Failed to analyze recipes' },
      { status: 500 },
    );
  }
}
