export type AIAnalyzeResult = {
  recipeId: number;
  recipeName: string;
  matchScore: number;
  missingIngredients: string[];
  reason: string;
};
