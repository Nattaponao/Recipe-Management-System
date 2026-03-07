import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isProfileRoute = pathname.startsWith('/profile');
  const isUserOnlyRoute =
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/ai') ||
    isProfileRoute;

  if (!isAdminRoute && !isUserOnlyRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

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

    if (isUserOnlyRoute && role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    if (isUserOnlyRoute && role === 'ADMIN') {
      if (pathname.startsWith('/recipes')) {
        return NextResponse.redirect(new URL('/admin/recipes', req.url));
      }
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    const res = NextResponse.redirect(url);
    res.cookies.delete('token');
    return res;
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/profile/:path*',
    '/recipes/:path*',
    '/ai/:path*',
  ],
};
