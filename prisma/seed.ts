import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // ลบข้อมูลเดิม (ถ้ามี) แบบปลอด FK
  // ลำดับสำคัญ: likes/cards/ingredients/steps -> recipes -> posts -> users
  await prisma.recipe_likes.deleteMany();
  await prisma.featured_cards.deleteMany();
  await prisma.popular_cards.deleteMany();
  await prisma.recipe_ingredients.deleteMany();
  await prisma.recipe_steps.deleteMany();
  await prisma.ai_cache.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const now = new Date();
  const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);

  // --- Users ---
  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "Admin",
      role: "ADMIN",
      password_hashed: "seed_admin_password_hashed",
      lastSeen: minutesAgo(1), // online
    },
  });

  const users = await prisma.user.createMany({
    data: [
      {
        email: "user1@gmail.com",
        name: "Nok",
        role: "USER",
        password_hashed: "seed_user_password_hashed",
        lastSeen: minutesAgo(2), // online
      },
      {
        email: "user2@gmail.com",
        name: "Beam",
        role: "USER",
        password_hashed: "seed_user_password_hashed",
        lastSeen: minutesAgo(12), // offline
      },
      {
        email: "user3@gmail.com",
        name: "Ploy",
        role: "USER",
        password_hashed: "seed_user_password_hashed",
        lastSeen: minutesAgo(4), // online
      },
      {
        email: "user4@gmail.com",
        name: "James",
        role: "USER",
        password_hashed: "seed_user_password_hashed",
        lastSeen: minutesAgo(50), // offline
      },
      {
        email: "user5@gmail.com",
        name: "May",
        role: "USER",
        password_hashed: "seed_user_password_hashed",
        lastSeen: minutesAgo(3), // online
      },
    ],
  });

  const allUsers = await prisma.user.findMany();

  // --- Recipes dataset ---
  const categories = ["Thai", "Japanese", "Italian", "Dessert", "Healthy", "Street Food"];
  const countries = ["Thailand", "Japan", "Italy", "Korea", "Vietnam", "France"];
  const recipeNames = [
    "Pad Thai",
    "Green Curry",
    "Tom Yum",
    "Chicken Teriyaki",
    "Spaghetti Carbonara",
    "Tiramisu",
    "Mango Sticky Rice",
    "Kimchi Fried Rice",
    "Pho Bo",
    "Ratatouille",
  ];

  const recipeTemplates = recipeNames.map((name, i) => ({
    name,
    description: `สูตรตัวอย่าง: ${name} ทำง่าย อร่อย และเข้ากับธีมระบบ`,
    category: pick(categories),
    country: pick(countries),
    coverImage: `https://picsum.photos/seed/recipe-${i + 1}/800/600`,
    tags: "easy,homecook,seed",
  }));

  // สร้าง recipes (ให้มี author บ้าง)
  const createdRecipes = [];
  for (const t of recipeTemplates) {
    const author = pick(allUsers);
    const r = await prisma.recipe.create({
      data: {
        name: t.name,
        description: t.description,
        category: t.category,
        country: t.country,
        coverImage: t.coverImage,
        tags: t.tags,
        authorId: author.id,
      },
      select: { id: true, name: true },
    });
    createdRecipes.push(r);
  }

  // --- Ingredients + Steps ---
  const ingredientPool = [
    ["กระเทียม", "2", "กลีบ"],
    ["น้ำปลา", "1", "ช้อนโต๊ะ"],
    ["ซีอิ๊วขาว", "1", "ช้อนโต๊ะ"],
    ["น้ำตาล", "1", "ช้อนชา"],
    ["พริก", "1", "เม็ด"],
    ["ไข่", "1", "ฟอง"],
    ["ข้าว", "200", "กรัม"],
    ["เส้น", "200", "กรัม"],
    ["ไก่", "200", "กรัม"],
    ["กุ้ง", "200", "กรัม"],
  ] as const;

  for (const r of createdRecipes) {
    // ingredients 5 รายการ
    const used = new Set<number>();
    for (let i = 0; i < 5; i++) {
      let idx = Math.floor(Math.random() * ingredientPool.length);
      while (used.has(idx)) idx = Math.floor(Math.random() * ingredientPool.length);
      used.add(idx);

      const [name, amount, unit] = ingredientPool[idx];
      await prisma.recipe_ingredients.create({
        data: {
          recipeId: r.id,
          name,
          amount: amount ? Number(amount) : null,
          unit,
          sortOrder: BigInt(i + 1),
        },
      });
    }

    // steps 4 ขั้น
    const steps = [
      "เตรียมวัตถุดิบให้พร้อม",
      "ผสมเครื่องปรุงและตั้งไฟ",
      "ใส่วัตถุดิบหลักและปรุงรส",
      "จัดจานและเสิร์ฟ",
    ];
    for (let i = 0; i < steps.length; i++) {
      await prisma.recipe_steps.create({
        data: {
          recipeId: r.id,
          stepNo: BigInt(i + 1),
          text: steps[i],
        },
      });
    }
  }

  // --- Featured cards 1..4 ---
  for (let slot = 1; slot <= 4; slot++) {
    const rr = createdRecipes[slot - 1] ?? pick(createdRecipes);
    await prisma.featured_cards.create({
      data: {
        slot,
        recipe_id: rr.id,
        profile_name: `Chef ${slot}`,
        profile_date: `2026-02-${10 + slot}`,
        profile_avatar: `https://i.pravatar.cc/150?img=${10 + slot}`,
      },
    });
  }

  // --- Popular cards 1..5 ---
  for (let slot = 1; slot <= 5; slot++) {
    const rr = createdRecipes[slot + 2] ?? pick(createdRecipes);
    await prisma.popular_cards.create({
      data: {
        slot,
        recipe_id: rr.id,
      },
    });
  }

  // --- Likes (สุ่ม) ---
  for (const u of allUsers) {
    // ให้แต่ละคนกดไลค์ 2 สูตรแบบสุ่ม
    const set = new Set<string>();
    while (set.size < 2) set.add(pick(createdRecipes).id);
    for (const recipeId of set) {
      await prisma.recipe_likes.create({
        data: {
          user_id: u.id,
          recipe_id: recipeId,
        },
      });
    }
  }

  // --- AI cache ตัวอย่าง ---
  await prisma.ai_cache.create({
    data: {
      ingredients_key: "egg|garlic|fish_sauce",
      result_json: {
        hint: "ทำเมนูไข่เจียวกระเทียม",
        score: 0.92,
      },
    },
  });

  console.log("✅ Seed completed");
  console.log("Users:", await prisma.user.count());
  console.log("Recipes:", await prisma.recipe.count());
  console.log("Likes:", await prisma.recipe_likes.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
