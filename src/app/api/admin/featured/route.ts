import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));

  const slot = Number(body.slot);
  const recipeId = String(body.recipeId || "");

  if (![1, 2, 3, 4].includes(slot)) {
    return NextResponse.json({ message: "Invalid slot" }, { status: 400 });
  }
  if (!recipeId) {
    return NextResponse.json({ message: "Missing recipeId" }, { status: 400 });
  }

  await prisma.featured_cards.upsert({
    where: { slot },
    create: { slot, recipe_id: recipeId },
    update: { recipe_id: recipeId },
  });

  return NextResponse.json({ ok: true });
}
