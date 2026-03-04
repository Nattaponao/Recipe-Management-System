import { prisma } from '@/lib/prisma';

export function isAdminEmail(email?: string | null) {
  if (!email) return false;

  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  return admins.includes(email.toLowerCase());
}

export async function isAdminByEmail(email?: string | null) {
  if (!email) return false;

  if (isAdminEmail(email)) return true;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  return user?.role === 'ADMIN';
}
