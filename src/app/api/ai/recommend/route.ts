import { NextRequest, NextResponse } from 'next/server';
import { recommendRecipes } from '@/ai/analyze.service';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const RequestSchema = z.object({
  userRequest: z.string().min(1, 'กรุณาระบุความต้องการ'),
  count: z.number().int().min(1).max(10).optional().default(5),
});

const CACHE_TTL_DAYS = 7;

function makeCacheKey(userRequest: string): string {
  return userRequest.trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid request';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { userRequest, count } = parsed.data;

    const cacheKey = makeCacheKey(userRequest);

    const cached = await prisma.aiCache.findUnique({
      where: { ingredientsKey: cacheKey },
    });

    const isExpired =
      cached &&
      Date.now() - new Date(cached.createdAt).getTime() >
        CACHE_TTL_DAYS * 86400000;

    if (cached && !isExpired) {
      console.log('⚡ cache hit');
      return NextResponse.json({ results: cached.resultJson });
    }

    const dbRecipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        coverImage: true,
        description: true,
      },
    });

    const results = await recommendRecipes({ userRequest, count }, dbRecipes);

    const enriched = results.map((item) => {
      const recipe = dbRecipes.find((r) => r.id === item.dbRecipeId);
      return {
        ...item,
        coverImage: recipe?.coverImage ?? null,
        dbDescription: recipe?.description ?? null,
      };
    });

    await prisma.aiCache.upsert({
      where: { ingredientsKey: cacheKey },
      update: { resultJson: enriched, createdAt: new Date() },
      create: { ingredientsKey: cacheKey, resultJson: enriched },
    });

    return NextResponse.json({ results: enriched });
  } catch (err) {
    console.error('[/api/ai/recommend]', err);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 },
    );
  }
}
