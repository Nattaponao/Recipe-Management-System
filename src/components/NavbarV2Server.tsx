import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import NavbarV2 from "@/components/navV2"; // <- ปรับ path ให้ตรงชื่อไฟล์จริงของคุณ
import { isAdminEmail } from "@/lib/admin";

export default async function NavbarV2Server() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;

  let isAdmin = false;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = isAdminEmail(payload?.email);
    } catch {}
  }

  return <NavbarV2 isAdmin={isAdmin} />;
}
