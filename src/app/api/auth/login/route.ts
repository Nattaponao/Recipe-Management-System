import { NextResponse } from 'next/server'
import { db } from '@/lib/pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export async function POST(req: Request){
  try{
    const {email, password} = await req.json()

    if (!email || !password){
      return NextResponse.json({message:'Missing Data'},{status:400})
    }
    const normalizedEmail = String(email).toLowerCase().trim()
    const user = db
      .prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?')
      .get(normalizedEmail)
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }
    const ok = await bcrypt.compare(String(password),user.password_hash)

    if (!ok) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { sub: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const res = NextResponse.json(
      { message: 'Login success', user: { id: user.id, name: user.name, email: user.email } },
      { status: 200 }
    )

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return res

  }catch (err){
    console.error(err)
  }
}