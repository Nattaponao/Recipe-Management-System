import type { ReactNode } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { isAdminByEmail } from '@/lib/admin';
import NavbarV2 from '@/components/navV2';
import Footer from '@/components/footer';

type JWTPayload = { email?: string };

export const metadata = {
  title: 'Khang Saeb | Dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login?next=/admin');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const email = String(payload?.email ?? '');
    if (!(await isAdminByEmail(email))) redirect('/');
  } catch {
    redirect('/login?next=/admin');
  }

  // const headersList = await headers();
  // const pathname = headersList.get('x-pathname') ?? '/admin';

  return (
    <div className="min-h-screen bg-[#F9F7EB]">
      <NavbarV2 isAdmin={true} />
      {children}
      <Footer />
    </div>
  );
}
