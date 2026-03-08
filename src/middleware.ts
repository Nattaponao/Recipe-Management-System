import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log('middleware hit:', pathname);

  const isAdminRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  const isUserOnlyRoute =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/ai') ||
    pathname.startsWith('/recipes');

  const token = req.cookies.get('token')?.value;

  if (isUserOnlyRoute) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const role = (payload as { role?: string }).role;
      console.log('role:', role);
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    } catch (e) {
      console.log('jwt error:', e);
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const role = (payload as { role?: string }).role;
      if (role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      const res = NextResponse.redirect(url);
      res.cookies.delete('token');
      return res;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/profile',
    '/profile/:path*',
    '/recipes/:path*',
    '/ai',
    '/ai/:path*',
  ],
};
