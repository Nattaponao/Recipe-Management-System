import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { isAdminByEmail } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

// GET - ดึง hero settings
export async function GET() {
  try {
    const settings = await prisma.heroSetting.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error('[hero GET]', err);

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT - admin update hero
export async function PUT(req: Request) {
  try {
    // 1️⃣ check token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2️⃣ verify jwt
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3️⃣ check admin
    if (!isAdminByEmail(decoded.email)) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // 4️⃣ get body
    const body = await req.json();

    const {
      title1,
      title2,
      tag1,
      tag2,
      readTime,
      ctaText,
      rightImageUrl,
    } = body;

    // 5️⃣ upsert db
    const settings = await prisma.heroSetting.upsert({
      where: { id: 1 },
      update: {
        title1,
        title2,
        tag1,
        tag2,
        readTime,
        ctaText,
        rightImageUrl,
      },
      create: {
        id: 1,
        title1,
        title2,
        tag1,
        tag2,
        readTime,
        ctaText,
        rightImageUrl,
      },
    });

    // 6️⃣ revalidate homepage
    revalidatePath('/');

    return NextResponse.json(settings);
  } catch (err) {
    console.error('[hero PUT]', err);

    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}