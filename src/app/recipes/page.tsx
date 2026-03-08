/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 60; // แคชหน้าเว็บนี้ไว้ 60 วินาที
import { fredoka } from '@/lib/fonts';
import { prisma } from '@/lib/prisma';
import Footer from '@/components/footer';
import NavbarV2 from '@/components/navV2';
import SearchRecipeClient from '@/components/search'; // Import ตรงๆ
import { Suspense } from 'react';

import { getUserFromToken } from '@/lib/getUser';

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
  const [{ user, isAdmin }, recipes] = await Promise.all([
    getUserFromToken(),
    prisma.recipe.findMany({
      where: { isFrozen: false },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className={fredoka.className}>
      <Suspense fallback={<div className="h-20 bg-[#F9F7EB] animate-pulse" />}>
        <NavbarV2 isAdmin={isAdmin} user={user} />
      </Suspense>

      <SearchRecipeClient initialRecipes={recipes ?? []} isAdmin={isAdmin} />
      <Footer />
    </div>
  );
}
