import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isProfileRoute = pathname.startsWith('/profile');

  // 🌟 จุดสำคัญ: ถ้าไม่ใช่หน้าที่ต้องป้องกัน ให้ผ่านไปทันทีแบบไม่แตะ Header
  if (!isAdminRoute && !isProfileRoute) {
    return NextResponse.next();
  }

  // ส่วน Admin / Profile ค่อยมาเช็ค JWT
  const token = req.cookies.get('token')?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    const res = NextResponse.redirect(url);
    res.cookies.delete('token');
    return res;
  }
}

// 🌟 เน้น Matcher เฉพาะจุดที่ต้องการ Security จริงๆ
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/profile/:path*'],
};