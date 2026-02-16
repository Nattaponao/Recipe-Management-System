"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;
  if (!token) redirect("/login");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (!isAdminEmail(String(payload?.email ?? ""))) redirect("/");
  } catch {
    redirect("/login");
  }
}

export async function deleteUserAction(id: number) {
  await requireAdmin();
  if (!Number.isFinite(id)) return;

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function updateUserRoleAction(id: number, role: string) {
  await requireAdmin();
  if (!Number.isFinite(id)) return;
  if (role !== "USER" && role !== "ADMIN") return;

  await prisma.user.update({
    where: { id },
    data: { role },
  });

  revalidatePath("/admin/users");
}
