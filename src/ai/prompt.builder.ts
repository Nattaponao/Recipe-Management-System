// import { Recipe } from '@/types/recipe';

/*
import { AIRecipeInput } from '@/types/ai';

export function buildAnalyzePrompt(
  recipes: AIRecipeInput[],
  userIngredients: string[],
) {
  return `
คุณคือผู้เชี่ยวชาญด้านอาหาร หน้าที่ของคุณคือวิเคราะห์สูตรอาหารจากฐานข้อมูลที่มีเปรียบเทียบกับวัตถุดิบของผู้ใช้

รายการสูตรอาหารในระบบ:
${JSON.stringify(recipes)}

วัตถุดิบที่ผู้ใช้มีในขณะนี้:
${userIngredients.join(', ')}

งานของคุณ:
1. อ่าน instructions ของแต่ละสูตรเพื่อหาวัตถุดิบที่จำเป็น
2. คำนวณ matchScore (0-100)
3. ระบุ missingIngredients
4. ให้ reason สั้นๆ

สำคัญ:
- ห้ามเดาส่วนผสมที่ไม่อยู่ใน instructions
- ถ้า instructions ไม่ชัด ให้ missingIngredients = ["ไม่ระบุ"]
`;
}
*/

import { AIRecipeInput } from '@/types/ai';
/*
import { AIRecipeInput } from '@/types/ai';

export function buildAnalyzePrompt(
  recipes: AIRecipeInput[],
  userIngredients: string[],
) {
  return `
คุณคือ Structured Recipe Analyzer
หน้าที่ของคุณคือเปรียบเทียบสูตรอาหารกับวัตถุดิบของผู้ใช้

ข้อมูลสูตรอาหาร:
${JSON.stringify(recipes, null, 2)}

วัตถุดิบที่ผู้ใช้มี:
${userIngredients.join(', ')}

==============================
กติกาการวิเคราะห์:

1. ถ้าสูตรมี field "ingredients" ให้ใช้ field นี้เป็นหลัก
2. ถ้าไม่มี ingredients ให้สกัดวัตถุดิบจาก instructions
3. ห้ามเดาวัตถุดิบที่ไม่ปรากฏในข้อมูล
4. คำนวณ matchScore:

   matchScore = (จำนวนวัตถุดิบที่ผู้ใช้มี / จำนวนวัตถุดิบทั้งหมดในสูตร) × 100
   - ปัดเป็นเลขจำนวนเต็ม

5. missingIngredients = วัตถุดิบที่สูตรต้องใช้แต่ผู้ใช้ไม่มี
6. ถ้าไม่มีข้อมูลวัตถุดิบเลย ให้:
   - matchScore = 0
   - missingIngredients = ["ไม่พบข้อมูลวัตถุดิบ"]
7.ตรวจสอบอีกครั้งก่อนตอบ:
ถ้าผลลัพธ์ของหลายสูตรเหมือนกัน ให้ประเมินใหม่

==============================
ตอบเป็น JSON เท่านั้น:

[
  {
    "recipeId": "string",
    "matchScore": number,
    "missingIngredients": ["string"],
    "reason": "string"
  }
]

สำหรับแต่ละสูตรในรายการ:
- วิเคราะห์แยกกันทีละ recipe
- ห้ามใช้ข้อมูลของ recipe อื่น
- ห้ามใช้ template กลาง
- ห้ามสร้างวัตถุดิบเหมือนกันทุกสูตร

ห้ามอธิบายเพิ่มเติม
`;
}
*/

export function buildAnalyzePrompt(
  recipes: AIRecipeInput[],
  userIngredients: string[],
) {
  return `
คุณคือผู้เชี่ยวชาญด้านอาหาร วิเคราะห์สูตรอาหารโดยเปรียบเทียบวัตถุดิบที่มีกับสิ่งที่สูตรต้องการ

รายการสูตรอาหารในระบบ: ${JSON.stringify(recipes)}
วัตถุดิบที่ผู้ใช้มีในขณะนี้: ${userIngredients.join(', ')}

งานของคุณ:
1. เปรียบเทียบวัตถุดิบของผู้ใช้กับรายการ 'ingredients' ของแต่ละสูตรอย่างละเอียด
2. ตรวจสอบใน 'steps' เพิ่มเติมว่ามีวัตถุดิบสำคัญที่ต้องใช้แต่ไม่อยู่ในลิสต์หรือไม่
3. "missingIngredients": ระบุรายชื่อวัตถุดิบที่มีในสูตรแต่ผู้ใช้ "ไม่มี" (ห้ามตอบว่า "ไม่ระบุ" หากในสูตรมีรายชื่อวัตถุดิบอยู่)
4. "matchScore": คำนวณเปอร์เซ็นต์ความเข้ากัน (0-100)
5. ห้ามใช้ข้อความทั่วไปซ้ำทุกเมนู ต้องอธิบายเฉพาะเจาะจงตามสูตรนั้นเท่านั้น
`;
}
