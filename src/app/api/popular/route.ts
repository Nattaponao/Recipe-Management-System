import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // 1) เอา override จาก popular_cards ก่อน
  const overrides = await prisma.popular_cards.findMany({
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
    orderBy: { slot: "asc" },
  });

  const bySlot = new Map<number, any>();
  const usedIds = new Set<string>();
  for (const r of overrides) {
    bySlot.set(r.slot, r.recipe);
    usedIds.add(r.recipe.id);
  }

  // 2) หา top liked มาเติม slot ที่ขาด (ตัดตัวที่ถูก override ไปแล้ว)
  const topLiked = await prisma.recipe.findMany({
    where: { id: { notIn: Array.from(usedIds) } },
    take: 20,
    orderBy: { recipe_likes: { _count: "desc" } },
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
  });

  let idx = 0;
  const out = [1, 2, 3, 4, 5].map((slot) => {
    const recipe = bySlot.get(slot) ?? topLiked[idx++] ?? null;
    return {
      slot,
      recipe: recipe
        ? {
            ...recipe,
            likesCount: recipe._count?.recipe_likes ?? 0,
          }
        : null,
    };
  });

  return NextResponse.json({ slots: out });
}
