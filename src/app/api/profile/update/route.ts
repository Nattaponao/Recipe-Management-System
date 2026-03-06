import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === 'token')?.value;
  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
    sub: number;
  };

  const body = await req.json();
  const { name, email, password, currentPassword, image } = body; // ✅ เพิ่ม currentPassword

  // เช็ค email ซ้ำ
  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: payload.sub } },
    });
    if (existing)
      return NextResponse.json(
        { message: 'Email นี้ถูกใช้แล้ว' },
        { status: 400 },
      );
  }

  const data: Record<string, unknown> = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (image) data.image = image;

  if (password) {
    if (!currentPassword)
      return NextResponse.json(
        { message: 'กรุณาใส่รหัสผ่านเก่า' },
        { status: 400 },
      );

    const userWithPass = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { passwordHashed: true },
    });
    const ok = await bcrypt.compare(
      currentPassword,
      userWithPass?.passwordHashed ?? '',
    );
    if (!ok)
      return NextResponse.json(
        { message: 'รหัสผ่านเก่าไม่ถูกต้อง' },
        { status: 400 },
      );

    data.password_hashed = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id: payload.sub },
    data,
    select: { id: true, name: true, email: true, image: true },
  });

  const newToken = jwt.sign(
    { sub: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  );

  const res = NextResponse.json({ message: 'Updated', user });
  res.cookies.set('token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
