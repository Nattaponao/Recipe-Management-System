import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import HeroSection3 from "@/components/HeroSection3";
import { isAdminEmail } from "@/lib/admin";

export default async function HeroSection3Server() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;

  let isAdmin = false;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = isAdminEmail(payload?.email);
    } catch {
      isAdmin = false;
    }
  }

  return <HeroSection3 isAdmin={isAdmin} />;
}
