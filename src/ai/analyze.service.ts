import { buildAnalyzePrompt } from './prompt.builder';
import { getAnalyzeModel } from './gemini.client';
import { safeParseAI } from './ai.parser';
import { AIAnalyzeResult } from '@/types/ai';
import { validateAIResult } from '@/ai/ai.validator';
import { Prisma } from '@prisma/client';

type RecipeWithRelations = Prisma.recipesGetPayload<{
  include: {
    recipe_ingredients: true;
    recipe_steps: true;
  };
}>;

export async function analyzeRecipes(
  recipes: RecipeWithRelations[],
  userIngredients: string[],
): Promise<AIAnalyzeResult[]> {
  const model = getAnalyzeModel();

  const formattedRecipes = recipes
    .map((r) => {
      if (!r.name) return null;

      return {
        id: r.id,
        name: r.name,
        ingredients: r.recipe_ingredients
          .map((i) => i.name)
          .filter((n): n is string => Boolean(n)),
        steps: r.recipe_steps
          .map((s) => s.text)
          .filter((t): t is string => Boolean(t)),
      };
    })
    .filter(
      (
        r,
      ): r is {
        id: string;
        name: string;
        ingredients: string[];
        steps: string[];
      } => r !== null,
    );

  const prompt = buildAnalyzePrompt(formattedRecipes, userIngredients);

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = safeParseAI(text);

  if (!validateAIResult(parsed)) {
    throw new Error('AI output format is invalid');
  }

  return parsed;
}
