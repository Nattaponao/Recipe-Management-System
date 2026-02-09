import { buildAnalyzePrompt } from './prompt.builder';
import { getAnalyzeModel } from './gemini.client';
import { safeParseAI } from './ai.parser';
import { AIAnalyzeResult } from '@/types/ai';
import { validateAIResult } from '@/ai/ai.validator';
import { Prisma } from '@prisma/client';
import type { GenerativeModel } from '@google/generative-ai';

type RecipeWithRelations = Prisma.recipesGetPayload<{
  include: {
    recipe_ingredients: true;
    recipe_steps: true;
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

export async function analyzeRecipes(
  recipes: RecipeWithRelations[],
  userIngredients: string[],
): Promise<AIAnalyzeResult[]> {
  const model = getAnalyzeModel();

  const formattedRecipes = recipes.map((r) => ({
    id: r.id,
    name: r.name ?? '',

    ingredients: r.recipe_ingredients.map((i) => i.name ?? '').filter(Boolean),

    steps: r.recipe_steps.map((s) => s.text ?? '').filter(Boolean),
  }));

  const prompt = buildAnalyzePrompt(formattedRecipes, userIngredients);

  const text = await generateWithRetry(model, prompt);

  const parsed = safeParseAI(text);

  if (!validateAIResult(parsed)) {
    throw new Error('AI output format is invalid');
  }

  return parsed;
}
