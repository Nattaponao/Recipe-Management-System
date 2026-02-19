import { AIAnalyzeResult } from '@/types/ai';

export function validateAIResult(data: unknown): data is AIAnalyzeResult[] {
  if (!Array.isArray(data)) return false;

  return data.every((item) => {
    if (typeof item !== 'object' || item === null) return false;

    const obj = item as Record<string, unknown>;

    return (
      typeof obj.recipeId === 'number' &&
      typeof obj.recipeName === 'string' &&
      typeof obj.matchScore === 'number' &&
      Array.isArray(obj.missingIngredients) &&
      obj.missingIngredients.every((ing) => typeof ing === 'string') &&
      typeof obj.reason === 'string'
    );
  });
}
