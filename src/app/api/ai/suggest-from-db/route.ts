import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { userIngredients } = await req.json();

  // ดึงสูตรจาก DB
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      name: true,
      instructions: true,
    },
  });

  // สร้าง context ส่งให้ AI
  const context = recipes.map((r) => ({
    id: r.id,
    name: r.name,
    instructions: r.instructions,
  }));

  // Prompt สำหรับ schema
  const prompt = `
คุณคือผู้ช่วยแนะนำเมนูจากฐานข้อมูลสูตรอาหาร

ข้อมูลสูตรอาหารในระบบ:
${JSON.stringify(context, null, 2)}

วัตถุดิบที่ผู้ใช้มี:
${userIngredients.join(', ')}

จากข้อมูล instructions ให้:
1. วิเคราะห์เครื่องปรุง/วัตถุดิบของแต่ละเมนู
2. เปรียบเทียบกับวัตถุดิบที่ผู้ใช้มี
3. แนะนำเมนูที่ทำได้มากที่สุด

ตอบกลับเป็น JSON เท่านั้น ตาม schema:

[
  {
    "recipeId": number,
    "recipeName": string,
    "matchScore": number, // 0-100
    "missingIngredients": string[],
    "reason": string
  }
]

ห้ามตอบข้อความนอก JSON
`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  const result = completion.choices[0].message.content;

  return NextResponse.json({ result });
}
