/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildAnalyzePrompt } from './prompt.builder';
import { getAnalyzeModel } from './gemini.client';
import { safeParseAI } from './ai.parser';
import { AIAnalyzeResult } from '@/types/ai';
import { Prisma } from '@prisma/client';
import type { GenerativeModel } from '@google/generative-ai';

type RecipeForAnalyze = Prisma.RecipeGetPayload<{
  select: {
    id: true;
    name: true;
    ingredients: { select: { name: true } };
    steps: { select: { text: true } };
  };
}>;

async function generateWithRetry(
  model: GenerativeModel,
  prompt: string,
  retries = 3,
  delay = 1000,
): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: unknown) {
    const e = err as { status?: number; response?: { status?: number } };
    const status = e?.status || e?.response?.status;

    if (retries > 0 && status === 429) {
      console.warn(`⚠️ Gemini rate limit. Retry in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      return generateWithRetry(model, prompt, retries - 1, delay * 2);
    }

    throw err;
  }
}

function normalizeAIResult(data: any[]): AIAnalyzeResult[] {
  return data.map((item) => ({
    recipeId: String(item.recipeId ?? ''),
    recipeName: String(item.recipeName ?? ''),
    matchScore: Math.max(0, Math.min(100, Number(item.matchScore ?? 0))),
    missingIngredients: Array.isArray(item.missingIngredients)
      ? item.missingIngredients.map((i: any) => String(i))
      : [],
    reason: String(item.reason ?? ''),
  }));
}

export async function analyzeRecipes(
  recipes: RecipeForAnalyze[],
  userIngredients: string[],
): Promise<AIAnalyzeResult[]> {
  const model = getAnalyzeModel();

  const formattedRecipes = recipes.map((r) => ({
    id: r.id,
    name: r.name ?? '',
    ingredients: r.ingredients.map((i) => i.name ?? '').filter(Boolean),
    steps: r.steps.map((s) => s.text ?? '').filter(Boolean),
  }));

  const prompt = buildAnalyzePrompt(formattedRecipes, userIngredients);

  const text = await generateWithRetry(model, prompt);

  const parsed = safeParseAI(text);

  if (!Array.isArray(parsed)) {
    throw new Error('AI did not return array');
  }

  const normalized = normalizeAIResult(parsed);

  return formattedRecipes.map((recipe) => {
    const aiMatch = normalized.find((r) => r.recipeId === recipe.id);

    return (
      aiMatch ?? {
        recipeId: recipe.id,
        recipeName: recipe.name,
        matchScore: 0,
        missingIngredients: [],
        reason: 'ไม่สามารถวิเคราะห์ได้',
      }
    );
  });
}
