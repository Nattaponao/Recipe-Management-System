/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import RecipeOfWeek from '@/components/RecipeOfWeek';
import { isAdminByEmail } from '@/lib/admin';

export default async function RecipeOfWeekServer() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === 'token')?.value;

  let isAdmin = false;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = await isAdminByEmail(payload?.email);
    } catch {
      isAdmin = false;
    }
  }

  return <RecipeOfWeek isAdmin={isAdmin} />;
}
