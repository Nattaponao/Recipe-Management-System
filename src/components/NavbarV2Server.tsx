/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import NavbarV2 from '@/components/navV2';
import { isAdminByEmail } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export default async function NavbarV2Server() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let isAdmin = false;
  let user = null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = await isAdminByEmail(payload?.email);

      user = await prisma.user.findUnique({
        where: { email: payload?.email },
        select: { name: true, image: true },
      });
    } catch {}
  }

  return <NavbarV2 isAdmin={isAdmin} user={user} />;
}
