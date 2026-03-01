import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as unknown as { sub: number };

    const recipes = await prisma.recipe.findMany({
      where: { authorId: payload.sub },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        coverImage: true,
        category: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ recipes });
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
