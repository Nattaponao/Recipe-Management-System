import fs from 'fs';
import path from 'path';
import { prisma } from './src/lib/prisma';

type ThaiFood = {
  name: string;
  text: string;
};

async function main() {
  const filePath = path.join(process.cwd(), 'thai_food.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: ThaiFood[] = JSON.parse(raw);

  let count = 0;

  for (const item of data) {
    await prisma.recipe.create({
      data: {
        name: item.name,
        description: item.text,

      },
    });
    count++;
  }

  console.log(`✅ Imported ${count} recipes into Postgres!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Import failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
