/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { isAdminByEmail } from '@/lib/admin';

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return { user: null, isAdmin: false };

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const isAdmin = await isAdminByEmail(payload?.email);
    return {
      user: { name: payload?.name, image: payload?.image },
      isAdmin,
    };
  } catch {
    return { user: null, isAdmin: false };
  }
}
