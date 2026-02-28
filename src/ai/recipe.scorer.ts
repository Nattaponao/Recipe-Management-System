type RecipeLite = {
  id: string;
  name: string | null;
  ingredients: string[];
};

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function isMatch(userIng: string, recipeIng: string) {
  const u = normalize(userIng);
  const r = normalize(recipeIng);

  return r.includes(u) || u.includes(r);
}

export function scoreRecipesByIngredients(
  recipes: RecipeLite[],
  userIngredients: string[],
) {
  const normalizedUser = userIngredients.map(normalize);

  return recipes.map((recipe) => {
    const matched = recipe.ingredients.filter((ing) =>
      normalizedUser.some((u) => isMatch(u, ing)),
    );

    const score =
      recipe.ingredients.length === 0
        ? 0
        : Math.round((matched.length / recipe.ingredients.length) * 100);

    return {
      recipeId: recipe.id,
      recipeName: recipe.name ?? 'ไม่ทราบชื่อ',
      matchScore: score,
      missingIngredients: recipe.ingredients.filter(
        (ing) => !normalizedUser.some((u) => isMatch(u, ing)),
      ),
      reason: 'คำนวณจากวัตถุดิบในฐานข้อมูล',
    };
  });
}
