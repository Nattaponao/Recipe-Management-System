/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import RecipeOfWeek from '@/components/RecipeOfWeek';
import { isAdminByEmail } from '@/lib/admin';
import { cache } from 'react';
import { prisma } from '@/lib/prisma'; // ✅ แก้ไข import ให้ถูกต้องตามที่แก้ไปเมื่อกี้

const checkAdminStatus = cache(async (email: string) => {
  return await isAdminByEmail(email);
});

export default async function RecipeOfWeekServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

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

  // 🌟 1. ใช้ชื่อโมเดลที่ถูกต้อง: featuredCard
  const rawSlots = await prisma.featuredCard.findMany({
    include: {
      recipe: {
        include: {
          author: {
            select: { id: true, name: true, email: true, image: true }
          },
          // 🌟 2. ใช้ชื่อ Relation ให้ตรงกับ Schema: recipeLikes
          _count: {
            select: { recipeLikes: true } 
          }
        }
      }
    }
  });

  // จัดรูปแบบข้อมูลให้ตรงกับที่ Client Component (RecipeOfWeek) ต้องการ
  const initialSlots: any = {};
  rawSlots.forEach((slotData) => {
    initialSlots[slotData.slot] = {
      slot: slotData.slot,
      recipe: {
        ...slotData.recipe,
        likeCount: slotData.recipe._count?.recipeLikes || 0, // ส่งจำนวนไลก์ไปให้หน้าบ้าน
        isLiked: false // ค่าเริ่มต้นให้เป็น false ไปก่อน
      }
    };
  });

  // 🌟 กันเหนียว: ป้องกันกรณีฐานข้อมูลยังว่างเปล่า หรือมี Slot ไม่ครบ 4 ช่อง จะได้ไม่แครช
  for (let i = 1; i <= 4; i++) {
    if (!initialSlots[i]) {
      initialSlots[i] = { 
        slot: i, 
        recipe: { id: `[id]`, name: null, coverImage: null, category: null } 
      };
    }
  }

  return <RecipeOfWeek isAdmin={isAdmin} initialSlots={initialSlots} />;
}