export type AIAnalyzeResult = {
  recipeId: string;
  recipeName: string;
  matchScore: number;
  missingIngredients: string[];
  reason: string;
};

export type AIRecipeInput = {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
};
