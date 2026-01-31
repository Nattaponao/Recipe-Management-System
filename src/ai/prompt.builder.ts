import { Recipe } from '@/types/recipe';

export function buildAnalyzePrompt(
  recipes: Recipe[],
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
