import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing Data' }, { status: 400 })
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true, password_hashed: true },
    })

    if (!user?.password_hashed) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const ok = await bcrypt.compare(String(password), user.password_hashed)

    if (!ok) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }


    const secret = process.env.JWT_SECRET
    if (!secret) {
      return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 })
    }

    const token = jwt.sign(
      { sub: user.id, name: user.name, email: user.email },
      secret,
      { expiresIn: '7d' }
    )

    const res = NextResponse.json(
      {
        message: 'Login success',
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    )

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (err: any) {
    console.error("LOGIN_ERROR:", err?.message ?? err)
    console.error(err)
    return NextResponse.json(
      { message: err?.message ?? "Internal Server Error" },
      { status: 500 }
  )
  }
}
