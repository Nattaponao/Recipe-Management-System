export type AIIngredient = {
  name: string;
  amount: string;
};

export type AIStep = {
  stepNumber: number;
  instruction: string;
};

export type AIRecommendResult = {
  recipeName: string;
  originalName?: string;
  cuisine: string;
  description: string;
  spiceLevel: 'mild' | 'medium' | 'hot' | 'very_hot';
  healthNote: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  ingredients: AIIngredient[];
  steps: AIStep[];
};

export type AIRecommendWithMatch = AIRecommendResult & {
  dbRecipeId: string | null;
  inLibrary: boolean;
};
