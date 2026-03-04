import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { isAdminByEmail } from '@/lib/admin';

// GET - ดึงข้อมูล hero
export async function GET() {
  try {
    const settings = await prisma.hero_settings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
    return NextResponse.json(settings);
  } catch (err) {
    console.error('[hero GET]', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// PUT - admin อัปเดต
export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === 'token')?.value;
  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
    };
    if (!(await isAdminByEmail(payload.email)))
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title1, title2, tag1, tag2, read_time, cta_text, right_image_url } =
    body;

  const settings = await prisma.hero_settings.upsert({
    where: { id: 1 },
    update: {
      title1,
      title2,
      tag1,
      tag2,
      read_time,
      cta_text,
      right_image_url,
    },
    create: {
      id: 1,
      title1,
      title2,
      tag1,
      tag2,
      read_time,
      cta_text,
      right_image_url,
    },
  });

  return NextResponse.json(settings);
}
