/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import RecipeOfWeek from '@/components/RecipeOfWeek';
import { isAdminByEmail } from '@/lib/admin';
import { cache } from 'react';

// 🌟 1. ใช้ cache เผื่อในหน้าเดียวกันมี Navbar ที่เช็ค Admin ไปแล้ว จะได้ใช้ข้อมูลร่วมกันเลย ไม่ต้องถาม DB ซ้ำ
const checkAdminStatus = cache(async (email: string) => {
  return await isAdminByEmail(email);
});

export default async function RecipeOfWeekServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; // 🌟 2. เปลี่ยนมาใช้ .get() ตรงๆ จะเร็วกว่านิดหน่อย

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

  return <RecipeOfWeek isAdmin={isAdmin} />;
}