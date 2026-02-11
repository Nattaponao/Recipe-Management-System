import { INGREDIENT_SYNONYMS } from './synonyms';

function expand(word: string): string[] {
  return INGREDIENT_SYNONYMS[word] ?? [word];
}

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function buildReason(score: number, missing: string[]): string {
  if (score >= 70) return 'มีวัตถุดิบหลักครบ สามารถทำเมนูนี้ได้ทันที';
  if (score >= 40) return 'ขาดวัตถุดิบบางส่วน แต่ยังพอทำได้';
  if (score > 0)
    return `ต้องเพิ่ม ${missing.slice(0, 2).join(', ')} จึงจะทำได้`;
  return 'วัตถุดิบยังไม่เพียงพอสำหรับเมนูนี้';
}

type RecipeLite = {
  id: string;
  name: string;
  ingredients: string[];
};

export function scoreRecipesByIngredients(
  recipes: RecipeLite[],
  userIngredients: string[],
) {
  const normalizedUser = userIngredients.map(normalize);

  const expandedInputs = normalizedUser.flatMap(expand);

  return recipes.map((recipe) => {
    const recipeIngs = recipe.ingredients.map(normalize);

    const matched = recipeIngs.filter((ing) =>
      expandedInputs.some((w) => ing.includes(w)),
    );

    const score =
      recipeIngs.length === 0
        ? 0
        : Math.round((matched.length / recipeIngs.length) * 100);

    const missing = recipeIngs.filter(
      (ing) => !expandedInputs.some((w) => ing.includes(w)),
    );

    return {
      recipeId: recipe.id,
      recipeName: recipe.name || 'ไม่ทราบชื่อเมนู',
      matchScore: score,
      missingIngredients: missing,
      reason: buildReason(score, missing),
    };
  });
}
