import Navbar from '@/components/navV2';
import { fredoka } from '@/lib/fonts';
import { prisma } from '@/lib/prisma';

import SearchNoSSR from '@/components/SearchNoSSR';
import Footer from '@/components/footer';

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={fredoka.className}>
      <Navbar />
      <SearchNoSSR initialRecipes={recipes ?? []} />
      <Footer />
    </div>
  );
}
