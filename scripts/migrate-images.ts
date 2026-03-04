import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function uploadBase64ToStorage(
  base64: string,
  recipeId: string,
): Promise<string | null> {
  try {
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;

    const mimeType = matches[1];
    const data = matches[2];
    const ext = mimeType.split('/')[1] ?? 'jpg';
    const fileName = `recipes/${recipeId}.${ext}`;

    const buffer = Buffer.from(data, 'base64');

    const { error } = await supabase.storage
      .from('recipes')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.error(`❌ Upload failed for ${recipeId}:`, error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('recipes')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error(`❌ Error processing ${recipeId}:`, err);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image migration...');

  const recipes = await prisma.recipe.findMany({
    where: {
      coverImage: { startsWith: 'data:' },
    },
    select: { id: true, name: true, coverImage: true },
  });

  console.log(`📦 Found ${recipes.length} recipes with base64 images`);

  let success = 0;
  let failed = 0;

  for (const recipe of recipes) {
    process.stdout.write(`⏳ Processing: ${recipe.name} (${recipe.id})...`);

    const url = await uploadBase64ToStorage(recipe.coverImage!, recipe.id);

    if (url) {
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { coverImage: url },
      });
      console.log(` ✅`);
      success++;
    } else {
      console.log(` ❌`);
      failed++;
    }
  }

  // migrate user profile images
  console.log('\n👤 Migrating user profile images...');

  const users = await prisma.user.findMany({
    where: {
      image: { startsWith: 'data:' },
    },
    select: { id: true, name: true, image: true },
  });

  console.log(`📦 Found ${users.length} users with base64 images`);

  for (const user of users) {
    process.stdout.write(`⏳ Processing user: ${user.name} (${user.id})...`);

    const matches = user.image!.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      console.log(' ❌ invalid base64');
      failed++;
      continue;
    }

    const fileName = `users/${user.id}.jpg`;
    const buffer = Buffer.from(matches[2], 'base64');

    const { error } = await supabase.storage
      .from('recipes')
      .upload(fileName, buffer, {
        contentType: matches[1],
        upsert: true,
      });

    if (error) {
      console.log(` ❌ ${error.message}`);
      failed++;
      continue;
    }

    const { data: urlData } = supabase.storage
      .from('recipes')
      .getPublicUrl(fileName);

    await prisma.user.update({
      where: { id: user.id },
      data: { image: urlData.publicUrl },
    });

    console.log(` ✅`);
    success++;
  }

  console.log(`\n✅ Done! Success: ${success}, Failed: ${failed}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
