import { prisma } from '@/lib/prisma';
import ManageRecipesClient from '@/components/admin/ManageRecipesClient';
import { Suspense } from 'react';

// 1. สร้าง Component สำหรับดึงข้อมูลโดยเฉพาะ
async function RecipeList() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      coverImage: true,
      category: true,
      country: true,
      createdAt: true,
      isFrozen: true,
    },
  });

  return <ManageRecipesClient initialRecipes={recipes} />;
}

// 2. หน้า Page หลักจะส่ง Skeleton ออกไปก่อนทันที
export default function AdminRecipesPage() {
  return (
    <div className="min-h-screen bg-[#F9F7EB]">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-10">
            <div className="h-12 w-64 bg-gray-300 animate-pulse rounded-xl mb-10" />
            <div className="h-20 w-full bg-white rounded-3xl animate-pulse mb-6" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-full bg-white rounded-2xl animate-pulse border border-gray-100"
                />
              ))}
            </div>
          </div>
        }
      >
        <RecipeList />
      </Suspense>
    </div>
  );
}
