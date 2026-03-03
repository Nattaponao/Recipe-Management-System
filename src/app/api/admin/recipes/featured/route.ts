import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  // TODO: เช็ค admin role ของมึงทีหลังได้
  const body = await req.json().catch(() => ({}));

  const slot = Number(body.slot);
  const recipeId = String(body.recipeId || "");
  const profile_name = body.profile_name ?? null;
  const profile_date = body.profile_date ?? null;
  const profile_avatar = body.profile_avatar ?? null;

  if (![1, 2, 3, 4].includes(slot)) {
    return NextResponse.json({ message: "Invalid slot" }, { status: 400 });
  }
  if (!recipeId) {
    return NextResponse.json({ message: "Missing recipeId" }, { status: 400 });
  }

  await prisma.featured_cards.upsert({
    where: { slot },
    create: { slot, recipe_id: recipeId, profile_name, profile_date, profile_avatar },
    update: { recipe_id: recipeId, profile_name, profile_date, profile_avatar },
  });

  return NextResponse.json({ ok: true });
}
