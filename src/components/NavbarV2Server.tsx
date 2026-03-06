/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import NavbarV2 from '@/components/navV2';
import { isAdminByEmail } from '@/lib/admin';

export default async function NavbarV2Server() {
  // 🌟 ลบ noStore() ออก เพื่อให้หน้าอื่นที่เรียกใช้ Navbar ทำ Cache ได้
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let isAdmin = false;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = await isAdminByEmail(payload?.email);
    } catch {}
  }

  return <NavbarV2 isAdmin={isAdmin} />;
}