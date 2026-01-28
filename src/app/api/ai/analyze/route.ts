import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  ResponseSchema,
  SchemaType,
} from '@google/generative-ai';

// เชื่อมต่อ Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userIngredients } = await req.json();

    // ดึงข้อมูลสูตรอาหารจาก Database
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        instructions: true,
      },
    });

    // กำหนด Response Schema
    const schema: ResponseSchema = {
      type: SchemaType.ARRAY,
      description: 'List of recommended recipes based on user ingredients',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          recipeId: { type: SchemaType.NUMBER },
          recipeName: { type: SchemaType.STRING },
          matchScore: { type: SchemaType.NUMBER },
          missingIngredients: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          reason: { type: SchemaType.STRING },
        },
        required: [
          'recipeId',
          'recipeName',
          'matchScore',
          'missingIngredients',
          'reason',
        ],
      },
    };

    // ตั้งค่า Model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const prompt = `
      คุณคือผู้เชี่ยวชาญด้านอาหาร หน้าที่ของคุณคือวิเคราะห์สูตรอาหารจากฐานข้อมูลที่มีเปรียบเทียบกับวัตถุดิบของผู้ใช้

      รายการสูตรอาหารในระบบ:
      ${JSON.stringify(recipes)}

      วัตถุดิบที่ผู้ใช้มีในขณะนี้:
      ${userIngredients.join(', ')}

      งานของคุณ:
      1. อ่าน instructions ของแต่ละสูตรเพื่อหาวัตถุดิบที่จำเป็น
      2. คำนวณ matchScore (0-100) ตามจำนวนวัตถุดิบที่มี
      3. ระบุวัตถุดิบที่ขาด (missingIngredients)
      4. ให้เหตุผลประกอบสั้นๆ (reason)
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // ส่งข้อมูลกลับไปที่ Frontend
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
