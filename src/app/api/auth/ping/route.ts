import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();            // ✅ ต้อง await
  const token = cookieStore.get("token")?.value;  // ✅ แล้วค่อย get

  if (!token) {
    return Response.json({ ok: false, reason: "no-token" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const email = String(payload?.email ?? "");
    if (!email) {
      return Response.json({ ok: false, reason: "no-email" }, { status: 400 });
    }

    const r = await prisma.user.updateMany({
      where: { email },
      data: { lastSeen: new Date() },
    });

    return Response.json({ ok: true, email, updated: r.count });
  } catch {
    return Response.json({ ok: false, reason: "bad-token" }, { status: 401 });
  }
}
