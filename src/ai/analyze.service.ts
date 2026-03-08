import { buildRecommendPrompt, RecommendContext } from '@/ai/prompt.builder';
import { getRecommendModel } from '@/ai/gemini.client';
import { safeParseAI } from '@/ai/ai.parser';
import { validateRecommendResult } from '@/ai/ai.validator';
import { AIRecommendResult, AIRecommendWithMatch } from '@/types/ai';
import type { GenerativeModel } from '@google/generative-ai';

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

type RecipeLite = { id: string; name: string | null };

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, '');
}

function findMatchingRecipe(
  aiName: string,
  dbRecipes: RecipeLite[],
): RecipeLite | null {
  const ai = normalize(aiName);
  return (
    dbRecipes.find((r) => {
      if (!r.name) return false;
      const db = normalize(r.name);
      return db === ai || db.includes(ai) || ai.includes(db);
    }) ?? null
  );
}

export async function recommendRecipes(
  context: RecommendContext,
  dbRecipes: RecipeLite[],
): Promise<AIRecommendWithMatch[]> {
  const model = getRecommendModel();
  const prompt = buildRecommendPrompt(context);

  const text = await generateWithRetry(model, prompt);
  const parsed = safeParseAI(text);

  if (!validateRecommendResult(parsed)) {
    throw new Error('AI response did not match expected schema');
  }

  return parsed.map((item: AIRecommendResult) => {
    const match = findMatchingRecipe(item.recipeName, dbRecipes);
    return {
      ...item,
      dbRecipeId: match?.id ?? null,
      inLibrary: match !== null,
    };
  });
}
