/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 0; // แคชหน้าเว็บนี้ไว้ 60 วินาที
import { fredoka } from '@/lib/fonts';
import { prisma } from '@/lib/prisma';
import Footer from '@/components/footer';
import NavbarV2 from '@/components/navV2';
import SearchRecipeClient from '@/components/search'; // Import ตรงๆ
import { Suspense } from 'react';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { isAdminByEmail } from '@/lib/admin';

export const metadata = {
  title: 'Khang Saeb | Recipes',
  description:
    'ค้นหาสูตรอาหารไทยและนานาชาติ กว่า 100 เมนู พร้อมวิธีทำและวัตถุดิบครบครัน',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Khang Saeb | Recipes',
    description: 'ค้นหาสูตรอาหารไทยและนานาชาติ กว่า 100 เมนู',
    type: 'website',
  },
};

export default async function RecipesPage() {
  // 🌟 1. สั่งดึงข้อมูลสูตรอาหารทันที (สังเกตว่าเราเอาคำว่า await ออกก่อน เพื่อไม่ให้มันบล็อกโค้ดบรรทัดต่อไป)
  const recipesPromise = prisma.recipe.findMany({
    where: {
      isFrozen: false,
    },
    orderBy: { createdAt: 'desc' },
  });

  // 2. เช็ค Cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // 🌟 3. เตรียมคำสั่งเช็ค Admin (ถ้าไม่มี Token ก็ให้ข้ามไปเลย)
  let isAdminPromise = Promise.resolve(false);
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      // เอาคำว่า await ออกเช่นกัน
      isAdminPromise = isAdminByEmail(payload?.email);
    } catch {}
  }

  // 🌟 4. ไม้ตาย: สั่งรวบยอด! รอให้การทำงานทั้งสองอย่างเสร็จพร้อมกัน
  const [recipes, isAdmin] = await Promise.all([
    recipesPromise,
    isAdminPromise,
  ]);

  return (
    <div className={fredoka.className}>
      {/* 🌟 ถ้า Navbar หน้า Recipes สีเฉพาะตัว ให้ใส่สีหลอกไว้ใน fallback */}
      <Suspense fallback={<div className="h-20 bg-[#F9F7EB] animate-pulse" />}>
        <NavbarV2 isAdmin={isAdmin} />
      </Suspense>

      <SearchRecipeClient initialRecipes={recipes ?? []} isAdmin={isAdmin} />
      <Footer />
    </div>
  );
}
