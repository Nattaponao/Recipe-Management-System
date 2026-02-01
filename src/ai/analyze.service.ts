import { buildAnalyzePrompt } from './prompt.builder';
import { getAnalyzeModel } from './gemini.client';
import { safeParseAI } from './ai.parser';
import { Recipe } from '@/types/recipe';
import { AIAnalyzeResult } from '@/types/ai';
import { validateAIResult } from '@/ai/ai.validator';

export async function analyzeRecipes(
  recipes: Recipe[],
  userIngredients: string[],
): Promise<AIAnalyzeResult[]> {
  const model = getAnalyzeModel();

  const prompt = buildAnalyzePrompt(recipes, userIngredients);

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = safeParseAI(text);

  if (!validateAIResult(parsed)) {
    throw new Error('AI output format is invalid');
  }

  return parsed;
}
