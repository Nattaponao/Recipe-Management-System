import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Navbar from "@/components/nav"; // <-- ปรับชื่อไฟล์ให้ตรงของคุณ
import { isAdminEmail } from "@/lib/admin";

export default async function NavbarServer() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;

  let isAdmin = false;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = isAdminEmail(payload?.email);
    } catch {}
  }

  return <Navbar isAdmin={isAdmin} />;
}
