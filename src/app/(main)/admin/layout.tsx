import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { isAdminEmail } from "@/lib/admin";

type JWTPayload = { email?: string };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // ต้องล็อกอินก่อน
  if (!token) redirect("/login?next=/admin");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const email = String(payload?.email ?? "");

    // ต้องเป็นแอดมินเท่านั้น
    if (!isAdminEmail(email)) redirect("/");
  } catch {
    // token พัง/หมดอายุ -> ให้ไป login ใหม่
    redirect("/login?next=/admin");
  }

  // ✅ ผ่านแล้วค่อย render
  return (
    <div className="min-h-screen bg-[#F9F7EB]">
      {children}
    </div>
  );
}
