 /* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Navbar from '@/components/nav'; 
import { isAdminByEmail } from '@/lib/admin';
import { cache } from 'react'; // 🌟 เพิ่ม cache

// 🌟 ใช้ cache ครอบการเช็ค Admin เพื่อให้ใน 1 Request ทำงานแค่ครั้งเดียว
const checkAdminStatus = cache(async (email: string) => {
  return await isAdminByEmail(email);
});

export default async function NavbarServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; // ใช้ .get() แทน .find() จะเร็วกว่านิดหน่อยครับ

  let isAdmin = false;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (payload?.email) {
        isAdmin = await checkAdminStatus(payload.email);
      }
    } catch {
      isAdmin = false;
    }
  }

  return <Navbar isAdmin={isAdmin} />;
}