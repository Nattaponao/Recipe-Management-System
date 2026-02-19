import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;

  if (!token) return { ok: false as const, status: 401, message: "Unauthorized" };

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const email = String(payload?.email ?? "");
    if (!isAdminEmail(email)) return { ok: false as const, status: 403, message: "Forbidden" };
    return { ok: true as const };
  } catch {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const { name, description, coverImage } = body as {
    name?: string;
    description?: string;
    coverImage?: string | null;
  };

  await prisma.recipe.update({
    where: { id },
    data: {
      name: name ?? undefined,
      description: description ?? undefined,
      coverImage: coverImage === undefined ? undefined : coverImage,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

  const { id } = await ctx.params;

  // ลบ recipe (ingredients/steps ตั้ง cascade ไว้แล้วใน schema ของคุณ)
  await prisma.recipe.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
