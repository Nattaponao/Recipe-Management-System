import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
]

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith("/_next")) return true
  if (pathname.startsWith("/public")) return true
  return false
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublicPath(pathname)) return NextResponse.next()

  const token = req.cookies.get("token")?.value

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname) 
    return NextResponse.redirect(url)
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("JWT_SECRET missing")
    jwt.verify(token, secret)
    return NextResponse.next()
  } catch {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    const res = NextResponse.redirect(url)
    res.cookies.set("token", "", { path: "/", maxAge: 0 })
    return res
  }
}


export const config = {
  matcher: ["/:path*"],
}