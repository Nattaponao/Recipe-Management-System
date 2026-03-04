type RecipeLite = {
  id: string;
  name: string | null;
  ingredients: string[];
};

function normalize(text: string) {
  return text.trim().toLowerCase();
}

const BASIC_SEASONINGS = [
  'เกลือ',
  'น้ำตาล',
  'น้ำมัน',
  'พริกไทย',
  'ผงชูรส',
  'น้ำปลา',
  'ซีอิ๊ว',
  'น้ำ',
];

function isBasicSeasoning(ing: string) {
  return BASIC_SEASONINGS.some((s) => ing.includes(s));
}

const SYNONYMS: Record<string, string[]> = {
  กุ้ง: ['กุ้งแม่น้ำ', 'กุ้งทะเล'],
  หมู: ['หมูสับ', 'หมูบด', 'เนื้อหมู'],
  ไก่: ['อกไก่', 'น่องไก่', 'เนื้อไก่'],
  ปลาหมึก: ['หมึก', 'หมึกกล้วย', 'หมึกสาย'],
  พริก: ['พริกแดง', 'พริกเขียว', 'พริกขี้หนู', 'พริกสด'],
  กระเทียม: ['กระเทียมจีน', 'กระเทียมไทย'],
  มะนาว: ['เลมอน'],
};

function resolveWord(word: string): string {
  const w = normalize(word);
  for (const [canonical, aliases] of Object.entries(SYNONYMS)) {
    if (normalize(canonical) === w || aliases.map(normalize).includes(w)) {
      return canonical;
    }
  }
  return w;
}

function isMatch(userIng: string, recipeIng: string) {
  const u = resolveWord(userIng);
  const r = resolveWord(recipeIng);

  if (u.length < 2 || r.length < 2) return false;

  return u === r || r.includes(u) || u.includes(r);
}

export function scoreRecipesByIngredients(
  recipes: RecipeLite[],
  userIngredients: string[],
) {
  const normalizedUser = userIngredients.map(normalize);

  return recipes.map((recipe) => {
    const significant = recipe.ingredients.filter(
      (ing) => !isBasicSeasoning(normalize(ing)),
    );

    const matched = significant.filter((ing) =>
      normalizedUser.some((u) => isMatch(u, ing)),
    );

    const score =
      significant.length === 0
        ? 0
        : Math.round((matched.length / significant.length) * 100);

    return {
      recipeId: recipe.id,
      recipeName: recipe.name ?? 'ไม่ทราบชื่อ',
      matchScore: score,
      missingIngredients: significant.filter(
        (ing) => !normalizedUser.some((u) => isMatch(u, ing)),
      ),
      reason: 'คำนวณจากวัตถุดิบในฐานข้อมูล',
    };
  });
}
