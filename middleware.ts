import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);

  const isAdminRoute =
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/api/admin');

  // ไม่ใช่ admin route → inject header แล้วผ่านได้เลย
  if (!isAdminRoute) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // admin route → เช็ค JWT เท่านั้น (ไม่แตะ DB)
  const token = req.cookies.get('token')?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret); // แค่เช็คว่า token valid
    // role ให้ AdminLayout เช็คจาก DB เอง
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', req.nextUrl.pathname);
    const res = NextResponse.redirect(url);
    res.cookies.set('token', '', { path: '/', maxAge: 0 });
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
