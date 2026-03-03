import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slot = Number(body.slot);
  const recipeId = String(body.recipeId ?? "");

  if (![1, 2, 3, 4, 5].includes(slot)) {
    return NextResponse.json({ message: "invalid slot" }, { status: 400 });
  }
  if (!recipeId) {
    return NextResponse.json({ message: "missing recipeId" }, { status: 400 });
  }

  const row = await prisma.popular_cards.upsert({
    where: { slot },
    update: { recipe_id: recipeId },
    create: { slot, recipe_id: recipeId },
    include: {
      recipe: {
        select: {
          id: true,
          name: true,
          description: true,
          coverImage: true,
          category: true,
          createdAt: true,
          author: { select: { id: true, name: true, email: true } },
          _count: { select: { recipe_likes: true } },
        },
      },
    },
  });

  return NextResponse.json({
    slot,
    recipe: {
      ...row.recipe,
      likesCount: row.recipe._count?.recipe_likes ?? 0,
    },
  });
}
