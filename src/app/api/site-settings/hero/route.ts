import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

function isAdminEmail(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "hero_bg" } });
  return NextResponse.json({ url: setting?.value ?? "" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const url = String(body?.url ?? "");

  // ตรวจ token จาก cookie
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.split(";").map(s=>s.trim()).find(s=>s.startsWith("token="))?.slice(6);

  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const secret = process.env.JWT_SECRET!;
  let payload: any;
  try {
    payload = jwt.verify(token, secret);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminEmail(payload?.email)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.siteSetting.upsert({
    where: { key: "hero_bg" },
    update: { value: url },
    create: { key: "hero_bg", value: url },
  });

  return NextResponse.json({ message: "Updated", url });
}
