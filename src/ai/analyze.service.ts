import { buildAnalyzePrompt } from './prompt.builder';
import { getAnalyzeModel } from './gemini.client';
import { safeParseAI } from './ai.parser';
import { Recipe } from '@/types/recipe';

export async function analyzeRecipes(
  recipes: Recipe[],
  userIngredients: string[],
) {
  const model = getAnalyzeModel();

  const prompt = buildAnalyzePrompt(recipes, userIngredients);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return safeParseAI(text);
}
