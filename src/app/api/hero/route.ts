import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { isAdminByEmail } from '@/lib/admin';
import { revalidatePath } from 'next/cache'; // 🌟 1. Import ตัวนี้เพิ่มครับ

// GET - ดึงข้อมูล hero
export async function GET() {
  // ... โค้ดเดิมของคุณ ...
}

// PUT - admin อัปเดต
export async function PUT(req: Request) {
  // ... ส่วนเช็ค Token และ Admin (โค้ดเดิมของคุณ) ...

  const body = await req.json();
  const { title1, title2, tag1, tag2, read_time, cta_text, right_image_url } = body;

  const settings = await prisma.hero_settings.upsert({
    where: { id: 1 },
    update: {
      title1, title2, tag1, tag2, read_time, cta_text, right_image_url,
    },
    create: {
      id: 1, title1, title2, tag1, tag2, read_time, cta_text, right_image_url,
    },
  });

  // 🌟 2. เพิ่มบรรทัดนี้ก่อนบรรทัด return ครับ
  // มันจะสั่งให้ Next.js ลบแคชของหน้า Home (/) ทันที ข้อมูลใหม่จะโชว์ทันใจ
  revalidatePath('/'); 

  return NextResponse.json(settings);
}