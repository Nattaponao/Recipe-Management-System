type RecipeLite = {
  id: string;
  name: string | null;
  ingredients: string[];
};

export function scoreRecipesByIngredients(
  recipes: RecipeLite[],
  userIngredients: string[],
) {
  const normalizedUser = userIngredients.map((i) => i.trim().toLowerCase());

  return recipes.map((recipe) => {
    const matched = recipe.ingredients.filter((ing) =>
      normalizedUser.includes(ing.toLowerCase()),
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
        (ing) => !normalizedUser.includes(ing.toLowerCase()),
      ),
      reason: 'คำนวณจากวัตถุดิบในฐานข้อมูล',
    };
  });
}
