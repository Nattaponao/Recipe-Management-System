import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(String(password), 10)

    await prisma.user.create({
      data: {
        name: String(name),
        email: normalizedEmail,
        password_hashed:passwordHash,
      },
    })

    return NextResponse.json({ message: 'Register success' }, { status: 201 })
  } catch (err: any) {
    console.error('REGISTER ERROR:', err)
    return NextResponse.json(
      { message: err?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
