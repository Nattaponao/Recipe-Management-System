import { AIRecommendResult } from '@/types/ai';

export function validateRecommendResult(
  data: unknown,
): data is AIRecommendResult[] {
  if (!Array.isArray(data)) return false;

  return data.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const obj = item as Record<string, unknown>;

    const hasBasicFields =
      typeof obj.recipeName === 'string' &&
      typeof obj.cuisine === 'string' &&
      typeof obj.description === 'string' &&
      typeof obj.spiceLevel === 'string' &&
      typeof obj.healthNote === 'string' &&
      typeof obj.servings === 'string' &&
      typeof obj.prepTime === 'string' &&
      typeof obj.cookTime === 'string';

    const hasIngredients =
      Array.isArray(obj.ingredients) &&
      obj.ingredients.every(
        (i) =>
          typeof (i as Record<string, unknown>).name === 'string' &&
          typeof (i as Record<string, unknown>).amount === 'string',
      );

    const hasSteps =
      Array.isArray(obj.steps) &&
      obj.steps.every(
        (s) =>
          typeof (s as Record<string, unknown>).stepNumber === 'number' &&
          typeof (s as Record<string, unknown>).instruction === 'string',
      );

    return hasBasicFields && hasIngredients && hasSteps;
  });
}
