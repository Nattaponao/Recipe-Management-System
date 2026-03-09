/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { isAdminByEmail } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return { user: null, isAdmin: false };

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const isAdmin = await isAdminByEmail(payload?.email);

    const dbUser = await prisma.user.findUnique({
      where: { email: payload?.email },
      select: { name: true, image: true },
    });

    return {
      user: dbUser ?? { name: payload?.name, image: null },
      isAdmin,
    };
  } catch {
    return { user: null, isAdmin: false };
  }
}
