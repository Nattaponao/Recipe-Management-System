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

    const cached = await prisma.aiCache.findUnique({
      where: { ingredientsKey: key },
    });

    const CACHE_TTL_DAYS = 7;
    const isExpired =
      cached &&
      Date.now() - new Date(cached.createdAt).getTime() >
        CACHE_TTL_DAYS * 86400000;

    if (cached && !isExpired) {
      return NextResponse.json(cached.resultJson);
    }

    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        ingredients: true,
        steps: true,
        description: true,
        coverImage: true,
      },
      take: 50,
    });

    const lite = recipes.map((r) => ({
      id: r.id,
      name: r.name ?? '',
      ingredients: (r.ingredients ?? [])
        .map((i) => i.name)
        .filter(Boolean) as string[],
    }));

    const scored = scoreRecipesByIngredients(lite, ingredients).sort(
      (a, b) => b.matchScore - a.matchScore,
    );

    const mergeImage = (list: AIAnalyzeResult[]) => {
      return list.map((item) => {
        const recipe = recipes.find((r) => r.id === item.recipeId);

        return {
          ...item,
          coverImage: recipe?.coverImage ?? null,
          description: recipe?.description ?? '',
        };
      });
    };

    if (scored.length > 0 && scored[0].matchScore >= 70) {
      console.log('⚡ use DB scoring (skip AI)');
      const top5 = scored.filter((r) => r.matchScore > 0).slice(0, 5);
      const result = mergeImage(top5);

      await prisma.aiCache.upsert({
        where: { ingredientsKey: key },
        update: { resultJson: result, createdAt: new Date() },
        create: { ingredientsKey: key, resultJson: result },
      });

      return NextResponse.json(result);
    }

    const TOP_N = 10;

    const topRecipes = recipes.filter((r) =>
      scored
        .filter((s) => s.matchScore > 0)
        .slice(0, TOP_N)
        .some((s) => s.recipeId === r.id),
    );

    if (topRecipes.length === 0) {
      return NextResponse.json([]);
    }

    let analyzed: AIAnalyzeResult[];

    try {
      analyzed = await analyzeRecipes(topRecipes, ingredients);
    } catch (e) {
      console.warn('⚠️ AI unavailable → fallback to DB scoring');

      analyzed = scored
        .filter((r) => r.matchScore > 0)
        .slice(0, 5)
        .map((r) => ({
          recipeId: r.recipeId,
          recipeName: r.recipeName ?? 'ไม่ทราบชื่อเมนู',
          matchScore: r.matchScore,
          missingIngredients: r.missingIngredients,
          reason: 'แนะนำจากฐานข้อมูล',
        }));
    }

    const finalResult = mergeImage(analyzed);

    await prisma.aiCache.upsert({
      where: { ingredientsKey: key },
      update: {
        resultJson: finalResult,
        createdAt: new Date(),
      },
      create: {
        ingredientsKey: key,
        resultJson: finalResult,
      },
    });

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error('AI recommend error:', error);

    return NextResponse.json(
      { error: 'Failed to analyze recipes' },
      { status: 500 },
    );
  }
}
