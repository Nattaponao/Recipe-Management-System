import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.featured_cards.findMany({
    include: {
      recipe: {
        select: {
          id: true,
          name: true,
          coverImage: true,
          category: true,
          createdAt: true,
          author: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: { slot: "asc" },
  });

  const bySlot = new Map<number, any>();
  for (const r of rows) bySlot.set(r.slot, r);

  const fallback = (slot: number) => ({
    slot,
    recipe: {
      id: `fallback-${slot}`,
      name:
        slot === 1 ? "Green Sweet Curry" :
        slot === 2 ? "Noodle Chicken soup" :
        slot === 3 ? "Clear soup with bean curd and minced pork" :
        "Pad thai",
      coverImage:
        slot === 1 ? "/GreenSweet.jpeg" :
        slot === 2 ? "/tomyum.jpeg" :
        slot === 3 ? "/01.jpeg" :
        "/padthai.jpeg",
      category:
        slot === 1 ? "curry" :
        slot === 2 ? "Noodles" :
        slot === 3 ? "soup" :
        "Noodles",
      createdAt: null,
      author: null,
    },
  });

  const out = [1, 2, 3, 4].map((s) => {
    const r = bySlot.get(s);
    return r
      ? {
          slot: r.slot,
          recipe: r.recipe,
        }
      : fallback(s);
  });

  return NextResponse.json({ slots: out });
}
