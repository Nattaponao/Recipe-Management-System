import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { isAdminByEmail } from '@/lib/admin';
import NavbarAuthClient from '@/components/NavbarAuthClient';
import Footer from '@/components/footer';
import { cache } from 'react';

type JWTPayload = { email?: string };

export const dynamic = 'force-dynamic';
// เอา revalidate = 0 ออกได้เลย เพราะ force-dynamic ครอบคลุมแล้ว

export const metadata = {
  title: 'Khang Saeb | Dashboard',
};

// 🌟 สร้างฟังก์ชันจำผลลัพธ์ (Memoization) เพื่อไม่ให้ query ซ้ำซ้อน
export const checkAdmin = cache(async (email: string) => {
  return await isAdminByEmail(email);
});

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
    
    // เรียกใช้งานแบบมี Cache
    if (!(await checkAdmin(email))) redirect('/');
  } catch {
    redirect('/login?next=/admin');
  }

  return (
    <div className="min-h-screen bg-[#F9F7EB]">
      <NavbarAuthClient />
      {children}
      <Footer />
    </div>
  );
}