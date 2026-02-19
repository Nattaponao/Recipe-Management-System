import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/recipes/:id
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  // ถ้า id ใน DB เป็น number ให้ใช้ Number(id)
  // ถ้า id เป็น UUID/string ให้ใช้ id ตรง ๆ
  const recipe = await prisma.recipe.findUnique({
    where: { id }, // <- ถ้า id เป็น Int: where: { id: Number(id) }
  });

  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}

// PUT /api/recipes/:id
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { name, description } = body;

  const recipe = await prisma.recipe.update({
    where: { id }, // <- ถ้า id เป็น Int: { id: Number(id) }
    data: { name, description },
  });

  return NextResponse.json(recipe);
}

// DELETE /api/recipes/:id
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  await prisma.recipe.delete({
    where: { id }, // <- ถ้า id เป็น Int: { id: Number(id) }
  });

  return NextResponse.json({ success: true });
}
